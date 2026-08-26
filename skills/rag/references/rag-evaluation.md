---
name: rag-evaluation
description: RAG 评估与迭代（管线"出口"，通用可迁移）：意图特定评估标准（iKnow 论文 Table IV）、LLM-as-judge、成对 win-tie-loss 比较、错误归因驱动的改进循环。
version: "2.0.0"
license: MIT
metadata:
  author: Sectrend (distilled from iKnow paper §V)
  tags: [rag, evaluation, llm-as-judge, testing, typescript]
  parent: rag
---

# rag-evaluation：评估与迭代

## 通用原则（不限语言/框架）

没有评估就没有迭代——RAG 系统上线前至少要回答三个问题：**检索准不准、回答对不对、改完有没有变好**。

- **评估维度分两层**：
  - 检索质量：命中位置 / 召回率（相关文档是否进 top-N）；
  - 生成质量：正确性（是否满足用户信息需求）+ 忠实度（是否只依据上下文，无幻觉）；
- **LLM-as-judge**：用 LLM 按**预先写死的结构化标准**判分（非主观印象分）。铁律：judge 的 temperature = 0（消除随机性，结果可复现），且必须抽样与人工标注对照（Pearson 相关，论文基线 r = 0.713 属"substantial agreement"可接受）；
- **意图特定标准**（论文 Table IV，可迁移到任何领域 QA）：不同问题类型定义不同的"正确回答"标准与失败症状——泛泛的"好不好"不可判，**每类问题要有可判定的标准**；
- **成对比较优于绝对打分**：同一问题给新旧两个系统答案，让 judge 判胜/平/负（win-tie-loss），沿**覆盖度（coverage，是否答全所有相关方面）**与**具体性（specificity，是否给出精确可操作细节）**两个维度分别统计——比单点打分更能暴露差距；
- **错误归因驱动迭代**：判错的答案必须归类到根因（查询/检索/知识缺失/生成/裁判误标），按占比排序逐个修，而不是盲目调 prompt。

## 意图特定评估标准（论文 Table IV，通用版）

| 意图 | 正确回答要求 | 失败症状（命中任一即判错） |
| --- | --- | --- |
| 症状分析 | 诊断问题、定位根因、给可操作建议，且**有依据** | 幻觉（编造来源没有的原因/措施）· 意图冲突（认错问题）· 过于笼统（无具体诊断/步骤）· 缺失（误导/不完整分析） |
| 多角度总结 | 聚合相关方面、全面概述、突出关键视角 | 幻觉（编造不支持的方面）· 意图冲突（总结了别的概念）· 笼统（无具体内容的概述）· 缺失（漏关键维度） |
| 术语解释 | 给目标术语清晰准确的定义 + 相关细节 | 幻觉（编造定义）· 意图冲突（解释了无关概念）· 笼统（含糊/过短）· 缺失（错误/不完整定义） |
| 事实验证 | 明确确认或否定 + 依据 | 幻觉（无依据事实）· 意图冲突（不正面回答）· 笼统（解释含糊）· 缺失（错误/不完整） |
| 操作指导 | 完整分步指引、可执行、细节到位 | 幻觉（未验证/错误步骤）· 意图冲突（无步骤/做错任务）· 笼统（缺具体操作）· 缺失（漏关键步骤） |

四类失败症状通用可判：**幻觉 / 意图冲突 / 过于笼统 / 信息缺失**。

## 落地建议（通用做法）

### 1. 评估集（golden set）

- 从真实用户问题采样，20~30 条起步（有条件可更多），按 5 类意图分布取样；
- 每条含：原始问题 + 人工标注的期望回答要点（或"知识库是否有答案"标注——用于测降级回答是否合理）；
- 作为回归集随代码提交。

### 2. LLM-as-judge 骨架（对应论文 §V-A）

```ts
// 骨架（参考命名：service/agent/evaluate.ts，路径随项目分层调整）
import { z } from 'zod'

const verdictSchema = z.object({
  correct: z.boolean(),
  symptom: z.enum(['hallucination', 'intent_conflicting', 'overly_generic', 'deficiency']).optional(),
  reason: z.string()
})

interface StructuredLLM {
  withStructuredOutput(schema: typeof verdictSchema): {
    invoke(input: string): Promise<z.infer<typeof verdictSchema>>
  }
}

/** 按意图特定标准判单个回答（temperature 0 是硬约束） */
export async function judgeAnswer(
  query: string,
  answer: string,
  intent: string,            // rag-query 的 5 类意图之一
  criteria: string,          // 对应上表"正确回答要求"文本
  llm: StructuredLLM
) {
  return llm.withStructuredOutput(verdictSchema).invoke(
    `你是 QA 系统评估员。意图：${intent}
     正确回答标准：${criteria}
     失败症状判定：幻觉 / 意图冲突 / 过于笼统 / 信息缺失（命中任一即 incorrect）
     问题：${query}
     回答：${answer}
     输出 JSON：{ correct, symptom?, reason }`
  )
}
```

- **与人工一致性验证**：judge 对黄金集判分 vs 人工标注 → 计算 Pearson 相关；r < 0.7 时**不能信 judge**，需先修标准/prompt（论文 r = 0.713 为可接受基线）；
- **指标**：LLM-judged accuracy（正确数/总数）；成对比较时报告 coverage / specificity 两维的 win 率——只需追踪相对提升，不追论文的绝对值。

### 3. 错误归因与迭代（对应论文 §V-A Error Analysis）

判错的回答按五类归因并统计占比：**意图检测错（改写带偏）→ 检索错（相关文档没进 top-N）→ 知识缺失（库内确实没有，属预期降级）→ 生成错 → 裁判误标**。

- 知识缺失占比高 → 补文档/扩充知识源，或确认降级回答质量；
- 意图/检索错占比高 → 修查询改写规则或双通道参数（RRF_K / top-K / keyword 关键词抽取）；
- 裁判误标占比高 → 改进评估标准描述，必要时人工复核关键样本。

### 4. 与评估-改写循环的衔接（未来增强）

当"首轮命中率偏低（如 score < 7 占比 > 30%）"时，启用 `retrieve → generate → evaluate → rewrite` 循环：judge 给分 < 7 且 attempt < 3 → 注入 `missingPoints` 改写问题回到检索。**评估集与 judge 骨架现在就要建好**——它们是未来启用该循环的前提。

## 验证方式（通用）

- 黄金集跑通：`judgeAnswer` 对标注样本输出 accuracy，且与人工标注 Pearson ≥ 0.7；
- 回归：改检索/生成代码后重跑黄金集，accuracy 不得下降（下降即回归）。

## 项目绑定（若有）

- ANZAI 项目黄金集落地（20~30 条 / 5 意图分布 / `scripts/` 或 `src/service/agent/__tests__/`）、`evaluate.ts` 与 docs 6.3 衔接见 `.agents/rules/rag-anzai.md` §4.6。