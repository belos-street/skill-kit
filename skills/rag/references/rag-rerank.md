---
name: rag-rerank
description: 重排序（RAG 检索后精排，通用可迁移）：cross-encoder 重排的原理、适用时机与常见模型选型，与 RRF 融合的分工。按需启用。
version: "2.0.0"
license: MIT
metadata:
  author: Sectrend (distilled from iKnow paper two-stage retrieval)
  tags: [rag, rerank, cross-encoder, retrieval, typescript]
  parent: rag
---

# rag-rerank：重排序

## 通用原则（不限语言/框架）

重排是检索链路的**精排阶段**：向量检索/词法检索先"宽召回"候选集，重排器再对"查询 × 候选"逐对打分，取最优 top-N 进 LLM 上下文。

- **为什么需要**：向量召回（bi-encoder）在召回阶段为速度牺牲了精度——query 和 doc 各自独立编码、互不感知；cross-encoder 把两者拼在一起过模型，能建模细粒度交互，精度显著更高，但**逐对推理、成本高**，所以只对 top-N 候选（如 10~50）重排，不用于全库扫描；
- **何时该用**：①候选集大（>20）且靠前文档含较多无关项；②领域专有名词多、向量相似度区分度差；③论文同款场景——两阶段检索（召回 top-10 → 重排 top-3）是准确率大幅提升的组件之一；
- **模型选型**：bge-reranker 系列（开源、多语言、CPU 可跑但慢）、bce-reranker-base_v1（论文同款）、Cohere Rerank（商用 API）；部分 embedding 模型（如 bge-m3）本身也带 rerank 能力但通常单独用 rerank 模型；
- **与 RRF 的分工**：RRF 是**多路召回结果融合**（不看分数只看排名）；重排是**融合后的一次精排**。正确顺序：多路召回 → RRF/加权融合 →（可选）重排 → top-N 进上下文。勿把 RRF 当重排用；
- **收益度量**：重排是否有效，对比"重排前后 top-N 命中率/端到端准确率"（见 `rag-evaluation.md`），无提升就别上——重排是纯延迟成本。

## 落地建议（按需启用）

- **默认不引入**：双通道 + RRF 融合（`rag-retrieval.md`）通常已足够；无评估数据证明差距前，不要引入独立 reranker；
- **启用条件**（满足其一再考虑）：检索质量评估显示"相关文档在 top-K 中部徘徊、进不了 top-N"；或文档量/查询量增长后混合检索区分度不足；
- **启用方式**（届时）：在融合后、取 top-N 前插入 rerank 步骤——候选集取 top-10~20，逐对打分后取 top-N；
- ⚠️ 未启用前**不要在检索链路里加假重排**（如用 LLM 给候选打分替代 reranker）——那是新的延迟成本，先用评估数据证明必要性。

## 验证方式（通用）

- 用黄金集做 A/B：同一查询集，对比「融合后直接取 top-N」vs「融合后重排取 top-N」的端到端准确率与延迟（方法见 `rag-evaluation.md`）；
- 论文基准：重排组件显著拉高术语解释类准确率（整体 65.8% → 81.3% 的贡献之一），可作为期望方向参考。

## 项目绑定（若有）

- ANZAI 项目当前用双通道+RRF 替代重排（暂不启用），停用理由、启用条件与启用方式见 `.agents/rules/rag-anzai.md` §4.7。