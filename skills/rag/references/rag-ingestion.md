---
name: rag-ingestion
description: 文档摄取与索引（RAG 管线第一环，通用可迁移）：加载 → 分块 → 去重 → 批量嵌入 → 入库，沉淀通用分块策略、默认参数与常见陷阱。
version: "2.0.0"
license: MIT
metadata:
  author: Sectrend (experience distilled from iKnow paper)
  tags: [rag, ingestion, chunking, embedding, typescript]
  parent: rag
---

# rag-ingestion：文档摄取与索引

## 通用原则（不限语言/框架）

RAG 的地基在摄取——**检索和生成的质量上限由分块与索引决定**（"垃圾进、垃圾出"）：

- **分块以语义完整优先**：优先按标题/章节切分（标题感知分块），让每个 chunk 是自洽的语义单元；超长段再按 token 数兜底切分。chunk 太小 → 上下文碎片化、召回后信息不完整；chunk 太大 → 无关内容稀释相关度、增加 LLM 成本。overlap（重叠）用于防"切裂语义"（如一句话被截断到两个 chunk）。
- **元数据注入**：每个 chunk 携带来源路径 + 标题路径（chunk enrichment，论文同款"标题前缀"）。检索后可**零回查**组装上下文，且直接用于回答溯源。
- **内容指纹去重**：chunk 文本算 hash（如 sha256），同一轮摄取内相同内容只嵌入一次向量，省 embedding 调用、防重复 upsert。
- **批量嵌入**：按 batch（如 100~200 条）批量调用 embedding 服务，远优于逐条请求；并发度按推理端实测调优（CPU 推理通常并发=1 反而最快，见下）。
- **入库顺序与幂等**：元数据库与向量库的一致性靠"固定顺序 + 全量重跑兜底"保证；操作须幂等，失败可安全重跑。

## 落地建议（参考默认值与陷阱，按项目实测调整）

```ts
// 建议参数（起步参考，按项目数据量与推理端实测调整）
export const CHUNK_SIZE = 800        // 标题感知分段为主，单段超长时按此兜底切分
export const CHUNK_OVERLAP = 80      // 防"切裂语义"
export const EMBED_BATCH_SIZE = 128  // 批量嵌入条数（常见 100~200）
export const EMBED_CONCURRENCY = 1   // 并发起步值：CPU 推理端并行常无增益（实测为准），GPU 端再调大
```

- **标题感知分段实现提示**：部分文本分割库已移除标题感知分割器（如 `@langchain/textsplitters` v1 移除了 `MarkdownHeaderTextSplitter`），需自研标题栈（维护标题层级，产出 `{ titles, text }`）或用其他库替代；
- **入库顺序**：元数据库（如 PG）事务先行 → 向量库 upsert 后写（`wait: true`）；任一步失败按文件回滚，由全量重跑兜底（幂等）；
- **通用陷阱**：向量缺失需显式抛错（去重 map 覆盖不全时防 undefined 静默传库）；换 embedding 模型必须同步更新向量维度并重建索引/集合；Qdrant 等向量库的 point id 常要求标准 UUID；
- 常见练习：文本段去重用 `contentHash = sha256(content)`，token 数粗估 `ceil(len / 1.5)` 仅供统计展示。

## 验证方式（通用）

- 单测覆盖：标题感知分段 / 超长兜底 / 去重 / 批量嵌入；
- 冒烟：入库后元数据行数 == 向量库点数。