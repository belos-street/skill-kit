---
name: rag-query
description: 查询理解与改写（RAG 检索前预处理，通用可迁移）：意图分类 + 按意图定制改写，解决 iKnow 论文第一大失败根因「查询不完整（32%）」。
version: "2.0.0"
license: MIT
metadata:
  author: Sectrend (distilled from iKnow paper)
  tags: [rag, query-rewrite, intent-classification, llm, typescript]
  parent: rag
---

# rag-query：查询理解与改写

## 通用原则（不限语言/框架）

真实用户的提问普遍不完整——检索前理解查询是 RAG 管线**性价比最高**的一环（论文实测 32% 的失败由此修复）：

- **通用模式**：`意图分类 → 按意图改写 → 检索`。意图分类实现方式可按资源选（规则 / 小模型 / LLM 结构化输出），**不必训练专用模型**；
- **改写只补全、不编造**：改写是补足"是什么/为什么/怎么办"的表达，绝不添加原问题没有的信息；
- **改写失败必须兜底**：LLM 超时/报错/返回空时退回原问题，查询不能在链路中丢失；
- 改写后的问题仅用于检索；生成阶段应同时注入「原始问题 + 改写问题」，保证回答贴合用户原意。

## 论文依据（为什么必须做）

iKnow 论文对 2000 条真实云运维查询的实证结论：

- **51% 的失败源于查询侧**，其中「查询不完整」占 32%——用户只输入一个名词/报错串（如 `ESN?`、`Snapshot Residue`），没有 "what / why / how" 提示词，检索和生成都无从下手；
- 根因与意图强相关：**术语解释类查询 58.8% 的失败源于不完整**；
- 对策有效性：意图引导改写后 99% 的查询被判定"更完整且不改原意"，是准确率 65.8% → 81.3% 的最大贡献模块之一。

**结论**：检索前必须对用户问题做「意图分类 → 按意图改写」，这是任何 RAG 系统的第一道关卡，**不做 = 放弃 32% 的修复空间**。

## 一、意图分类（5 类，取自论文且适用于内部知识库）

| 意图 | 判定特征 | 示例 |
| --- | --- | --- |
| 症状分析 | 描述可观察的异常行为 / 报错 / 告警 | "scan 报 Xid 74 错误" |
| 操作指导 | how-to / 动词-名词短语 | "如何配置白名单？" |
| 多角度总结 | 综合 / 概述 / 指南类 | "命令行使用总结" |
| 事实验证 | 是非题 / 是否支持 / 可不可以 | "支持 Windows 吗？" |
| 术语解释 | 单个术语 / 缩写，无其他上下文 | "ESN?" / "什么是 BOM？" |

分类实现建议：**不训练模型**（论文用原型网络，成本高），用 LLM 结构化输出 + zod 校验：

```ts
// 骨架（参考命名：service/retrieval/query-intent.ts，路径随项目分层调整）
import { z } from 'zod'

export const INTENTS = ['symptom_analysis', 'operational_guidance',
  'multi_facet_summary', 'fact_verification', 'terminology'] as const
export type QueryIntent = (typeof INTENTS)[number]

const intentSchema = z.object({ intent: z.enum(INTENTS) })

/** LLM：任意支持 withStructuredOutput 的模型（如 @langchain/openai 的 ChatOpenAI，temperature 0），由项目 DI 注入 */
interface StructuredLLM {
  withStructuredOutput(schema: typeof intentSchema): {
    invoke(input: string): Promise<{ intent: QueryIntent }>
  }
}

export async function detectIntent(query: string, llm: StructuredLLM): Promise<QueryIntent> {
  const out = await llm.withStructuredOutput(intentSchema).invoke(
    `对以下用户问题做意图分类（回答 JSON）：
    - symptom_analysis：描述异常/报错/告警，要诊断
    - operational_guidance：要分步操作步骤
    - multi_facet_summary：要全面概述
    - fact_verification：是非/是否类确认
    - terminology：单个术语/缩写求解释
    问题：${query}`
  )
  return out.intent
}
```

## 二、按意图改写（核心环节）

**铁律：改写必须按意图定制 prompt，禁止统一模板**——论文明确"统一改写风格会改变原意"。

| 意图 | 改写目标 | 示例（论文原文） |
| --- | --- | --- |
| terminology | 转成"定义 + 属性/用途"的 what 问题 | `ESN?` → `What are the definition and use scenarios of an ESN?` |
| operational_guidance | 补"如何 + 详细步骤" | `A-Manager upgrade?` → `How to perform A-Manager upgrade operation? Please provide detailed steps.` |
| symptom_analysis | 补"为什么/如何解决 + 触发条件" | `BlockA reserved block < threshold alarm?` → `Why and how to solve the BlockA reserved block count falling below a threshold that triggers an alarm?` |
| multi_facet_summary | 补"要覆盖哪些方面 + 常见工具/指标" | `High-level performance troubleshooting guide?` → `How to conduct a comprehensive performance troubleshooting? What key indicators and steps should be included? What are the common diagnostic tools?` |
| fact_verification | 明确主语 + 对象 + 补充"如何配置" | `Is it possible to configure available partitions to be partially visible?` → `Can available partitions be configured to be visible only to certain users? How can such a configuration be performed?` |

```ts
// 骨架（参考命名：service/retrieval/query-rewrite.ts）
const REWRITE_RULES: Record<QueryIntent, string> = {
  terminology: '把术语/缩写改写为询问其定义、功能与适用场景的完整问题，保持术语原词',
  operational_guidance: '改写为"如何执行 X？请给出详细步骤"形式的完整问题',
  symptom_analysis: '补充"为什么出现、如何解决、触发条件是什么"，形成完整诊断问题',
  multi_facet_summary: '补充"需覆盖哪些方面、包含哪些关键指标/步骤/工具"',
  fact_verification: '明确主语与对象，并补充"如何实现/配置"',
}

interface TextLLM { invoke(input: string): Promise<{ content: unknown }> }

export async function rewriteQuery(
  query: string,
  intent: QueryIntent,
  llm: TextLLM
): Promise<string> {
  const out = await llm.invoke(
    `你是知识库查询改写器。改写规则：${REWRITE_RULES[intent]}
    要求：只改写表达，不改变原意，不编造不存在的信息，输出仅一行改写后的问题。
    原问题：${query}`
  )
  const rewritten = String(out.content).trim()
  return rewritten === '' ? query : rewritten // 改写失败兜底：退回原问题
}
```

## 三、边界与衔接

- **初期只改写一次**：可先不引入评估-改写循环（检索质量稳定后再考虑迭代改写）；
- 改写失败/超时**必须兜底退回原问题**，不能让查询在链路中丢失；
- 改写后的查询仅用于**检索**；生成阶段同时注入「原始问题 + 改写问题」，保证用户看到的回答贴合其原意；
- 意图分类命中 `fact_verification` 且问题明显超出知识库范围时，直接短路到降级回答，不浪费检索。

## 四、单测建议

- 每个意图至少 1 条"分类正确"用例（用 mock LLM 返回固定 JSON）；
- 改写兜底：LLM 抛错/返回空串时 `rewriteQuery` 返回原问题；
- 中文/其他语言查询改写：断言改写结果包含原问题的核心名词（防止改飞）。