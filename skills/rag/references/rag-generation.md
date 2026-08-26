---
name: rag-generation
description: 意图引导生成 + 防幻觉（RAG 问答层，通用可迁移）：prompt 三段注入（原始问题+改写问题+上下文）、缺失知识检测与降级回答、来源溯源、流式输出。对应 iKnow 论文第二大根因「知识缺失 27% → 幻觉」的对策。
version: "2.0.0"
license: MIT
metadata:
  author: Sectrend (distilled from iKnow paper)
  tags: [rag, generation, hallucination, prompt, sse, typescript]
  parent: rag
---

# rag-generation：意图引导生成 + 防幻觉

## 通用原则（不限语言/框架）

生成是 RAG 的"出口"，**忠实度（只依据上下文）优先于流畅度**：

- **prompt 三段注入**：上下文（带来源标注）+ 用户原始问题 + 检索改写问题（仅作语义参考），缺一不可；
- **知识不足要"明示"而非"硬编"**：检索结果不足以回答时，让 LLM 判定并降级回答（明示知识库缺失 + 建议换问法）——这是防幻觉的第一道闸，比事后纠错便宜得多；
- **回答必须附来源**：引用文档路径/章节，既提升信任也便于用户核对（论文部署反馈：用户明显更信任带引用的回答）；
- **temperature = 0**：生产问答与评估都用 0（确定性、可复现），随机性留给评测对比实验即可。

## 论文依据（为什么必须做）

- 知识缺失占失败 **27%**，是第二大根因：所需内容不在知识库时，LLM 会用内在知识"编"出貌似合理的答案（幻觉），在运维/内部知识场景会误导决策；
- 论文对策：检索后由 LLM 判定"上下文是否足以回答"，**不足则降级回答**（明示知识不足 + 建议换个问法），该检测精度 94.3% / 召回 83.3% / F1 88.5%，是防幻觉的关键模块；
- 论文还强调：回答注入"原始问题 + 改写问题 + 上下文"三段信息，且**附来源引用**显著提升信任（部署后用户反馈良好）。

## 一、生成 Prompt 结构（三段注入，缺一不可）

```
[系统指令] 你是内部知识库问答助手。只能依据给定上下文回答；上下文不足时明示，不得编造。
[上下文]   每条前标 [来源: path] 与 [章节: titles.join(' > ')]，内容为 chunk.content
[问题]     用户原始问题：{original}
           检索改写问题：{rewritten}   ← 仅作检索语义参考，回答贴合原问题
[要求]     - 回答附来源（path + 章节）
           - 被问及步骤/定义时给具体细节（命令、参数、API 示例），不给空泛概述
```

要点（对应论文意图特定要求）：

- **操作指导**类：给分步操作，含命令/参数/示例；缺失步骤明确说"文档未覆盖"；
- **术语解释**类：给定义 + 功能 + 适用场景，不编造定义；
- **事实验证**类：直接"支持/不支持 + 依据"，不绕弯；
- **多角度总结**类：覆盖标题树多个维度（titles 已提供结构线索）。

## 二、缺失知识检测 + 降级回答（防幻觉核心）

```ts
// 骨架（参考命名：service/agent/missing-knowledge.ts，路径随项目分层调整）
import { z } from 'zod'
import type { RetrievedChunk } from './retrieval-service-types.js'

const verdictSchema = z.object({
  sufficient: z.boolean(),
  reason: z.string().optional()
})
export interface KnowledgeVerdict { sufficient: boolean; reason?: string }

interface StructuredLLM {
  withStructuredOutput(schema: typeof verdictSchema): {
    invoke(input: string): Promise<KnowledgeVerdict>
  }
}

/** 判断检索到的上下文是否足以回答改写后的问题（论文对应模块，目标 F1 ≈ 88%） */
export async function detectMissingKnowledge(
  query: string,
  chunks: RetrievedChunk[],
  llm: StructuredLLM
): Promise<KnowledgeVerdict> {
  const context = chunks
    .map((c, i) => `[${i + 1}] ${c.titles.join(' > ')}\n${c.content.slice(0, 800)}`)
    .join('\n\n')
  return llm.withStructuredOutput(verdictSchema).invoke(
    `根据给定上下文判断：能否充分回答用户问题？
    用户问题：${query}
    --- 上下文 ---
    ${context || '（无检索结果）'}
    判断标准：上下文包含回答问题所需的关键事实；若仅有相关但无直接答案，判 insufficient。`
  )
}

/** 降级回答模板（论文：明示知识不足 + 建议替代问法，保持透明） */
export function degradedResponse(original: string, reason?: string): string {
  return [
    '当前知识库中未找到足以回答该问题的资料。',
    reason ? `（依据：${reason}）` : '',
    '建议换个问法，例如补充产品名、报错全文或具体版本；或联系文档维护者补充资料。',
    `原问题：${original}`
  ].filter(Boolean).join('\n')
}
```

**决策规则**：`insufficient` 或检索结果为空 → 走 `degradedResponse`，**不调用生成 LLM**（省一次调用且杜绝幻觉）；`sufficient` → 正常生成。

## 三、来源溯源（sources）

回答必须携带 `sources: { path, titles }[]`（来自 `RetrievedChunk`），UI 层渲染为可点击引用。数据模型应为"来源零回查"设计（chunk 自带 path 与标题路径）：

```ts
// 返回给入口层（如 SSE 流式 / HTTP 接口）的结构
interface AnswerResult {
  answer: string
  sources: { path: string; titles: string[] }[]   // 即检索命中的 chunks
  degraded: boolean                                // 是否为降级回答
}
```

## 四、问答链路骨架（Runnable pipeline，无状态编排）

```ts
// 骨架（参考命名：service/agent/qa-pipeline.ts）
export async function answer(original: string) {
  const llm = /* 项目接入的 LLM（temperature 0） */
  // 1) 查询理解（rag-query）：意图 → 改写（失败兜底原问题）
  const intent = await detectIntent(original, llm)
  const rewritten = await rewriteQuery(original, intent, llm)

  // 2) 混合检索（rag-retrieval）
  const chunks = await hybridTopK(rewritten)

  // 3) 缺失知识检测（本 skill 第二节）
  const verdict = await detectMissingKnowledge(rewritten, chunks, llm)
  if (!verdict.sufficient) {
    return { answer: degradedResponse(original, verdict.reason), sources: [], degraded: true }
  }

  // 4) 意图引导生成（本 skill 第一节 prompt 结构）
  const answerText = String((await llm.invoke(buildPrompt({ original, rewritten, chunks, intent }))).content)
  return {
    answer: answerText,
    sources: chunks.map((c) => ({ path: c.path, titles: c.titles })),
    degraded: false
  }
}
```

- **流式**：入口层用流式 SSE（如 Hono 等支持 SSE 的框架的 `streamSSE`），把第 4 步改为 `llm.stream(prompt)` 逐块下发；**查询理解/检索/检测阶段不流式**（论文实测这些环节只占总延迟 ~19%）；
- temperature=0（论文同款，消除随机性，LLM-as-judge 评估才可复现）。

## 五、未来增强（按需启用，留档）

- **评估-改写循环**：首轮回答后 LLM 打分（score < 7 且 attempt < 3）→ 注入缺失点改写问题 → 重新检索（可引入 LangGraph 编排，需运行时 ≥ Node 22）；
- 评估方法：LLM-as-judge 按意图特定标准判正确性（见 `iknow-paper-notes.md` / `rag-evaluation.md`），与人工标注做 Pearson 相关性验证（论文 r=0.713 为可接受基线）。