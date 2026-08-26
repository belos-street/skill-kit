---
name: rag-retrieval
description: 混合检索（RAG 检索层，通用可迁移）：dense + keyword 双通道 → RRF 融合扩召回精排序，对应 iKnow 论文「检索召回宽、重排精」经验；无独立 reranker 资源时的等价替代方案。
version: "2.0.0"
license: MIT
metadata:
  author: Sectrend (distilled from iKnow paper)
  tags: [rag, retrieval, rrf, hybrid-search, typescript]
  parent: rag
---

# rag-retrieval：混合检索

## 通用原则（不限语言/框架）

单一检索通道不可靠（论文实测检索侧失败占 38%）：

- **双通道互补**：dense 通道（embedding 相似度）管"换个说法"的语义问题；keyword 通道（全文/BM25/词法）管**专有名词精确命中**（API 名 / 命令 / 参数 / 编号）——后者是纯向量检索的盲区；
- **扩召回、精排序**：检索应"先宽后精"（论文两阶段思想）：各通道先取较宽的候选集，再经融合/重排收敛到 top-N，避免相关文档因排名略低被截断；
- **融合方式**：RRF（Reciprocal Rank Fusion，只看排名不看分，`rrf_k` 常见 60）或加权分数融合，二选一保持简单；有独立 reranker 资源时再叠加交叉编码器重排；
- **来源零回查**：候选结果自带 `path / titles / content`，检索后直接组装 LLM 上下文，不回查数据库。

## 论文依据（为什么必须做）

iKnow 论文实证：检索侧失败合计 **38%**（知识缺失 27% + 检索不准确 11%）。其中「检索不准确」指**相关文档存在但没进 top-k**，论文的对策是两阶段检索（向量召回宽集 → 重排序取精集）。

无独立 reranker 资源时，可用**双通道混合检索 + RRF 融合**等价替代：dense 通道管语义相似，keyword 通道管专有名词精确命中（API 名 / 命令 / 参数名），两者用 RRF 融合。**dense + keyword 本身就是"扩召回"，RRF 排序即"精取 top-N"**。

## 一、检索设计（通用示意）

```
用户问题（已由查询理解模块改写）
  ├─ dense 通道：向量相似度检索（Qdrant / Milvus / pgvector 等）top-k
  └─ keyword 通道：全文/词法检索（PG pg_trgm / Elasticsearch / BM25 等）top-k
        → RRF 融合（rrf_k = 60）→ 取 top-N 作为 LLM 上下文
```

- **为什么两条通道都要**：纯 dense 对专有名词（如 `tool scan --format` 这类 CLI 参数/API 名）容易语义漂移；纯 keyword 对"换个说法"的问题（"怎么扫描代码安全"）召回为 0；
- **来源路径零回查**：两通道结果都应自带 `path / titles / content`，融合后**直接组装上下文，无需 join 回查**。

## 二、代码骨架（RRF 部分通用，通道按项目实现）

```ts
// 骨架（参考命名：service/retrieval/retrieval-service.ts，路径随项目分层调整）
export const RRF_K = 60
export const RRF_TOP_N = 5
const DENSE_TOP_K = 10   // 双通道各自先召回宽集
const KEYWORD_TOP_K = 10

export interface RetrievedChunk {
  id: string
  path: string          // 来源文档路径
  titles: string[]      // 标题路径
  content: string
  score: number
}

/** 混合检索：dense + keyword → RRF 融合 → top-N（来源即路径，零回查） */
export async function hybridTopK(
  query: string,
  denseSearch: (q: string, topK: number) => Promise<RetrievedChunk[]>,
  keywordSearch: (q: string, topK: number) => Promise<RetrievedChunk[]>,
  topK = RRF_TOP_N
): Promise<RetrievedChunk[]> {
  const [denseHits, keywordHits] = await Promise.all([
    denseSearch(query, DENSE_TOP_K),
    keywordSearch(query, KEYWORD_TOP_K)
  ])
  return fuse([denseHits, keywordHits]).slice(0, topK)
}

/** RRF（Reciprocal Rank Fusion）：score = Σ 1/(k + rank)，k = RRF_K */
function fuse(lists: RetrievedChunk[][]): RetrievedChunk[] {
  const byId = new Map<string, RetrievedChunk & { rrf: number }>()
  for (const list of lists) {
    list.forEach((item, rank) => {
      const existing = byId.get(item.id)
      if (existing) {
        existing.rrf += 1 / (RRF_K + rank + 1)
      } else {
        byId.set(item.id, { ...item, rrf: 1 / (RRF_K + rank + 1) })
      }
    })
  }
  return [...byId.values()].sort((a, b) => b.rrf - a.rrf)
    .map(({ rrf, ...rest }) => ({ ...rest, score: rrf }))
}
```

> denseSearch / keywordSearch 由项目按所选向量库/文本库实现，返回统一 `RetrievedChunk` 即可。

## 三、已知陷阱（通用）

- **结果自带来源信息**：两通道都带上 `path / titles / content`（或等价字段），避免检索后再回查数据库；
- **keyword 通道对 CJK/短词**：2 字符词（如 `ILIKE '%词%'`）可能不走索引退化为全表扫描，数据规模小可接受、大库需分词策略；
- **keyword 查询词**：直接用改写后的完整问题做匹配大概率召回为 0——应对改写结果做**关键名词抽取**（去疑问词/虚词），或拆词多次 OR 匹配；具体策略按实测效果调优；
- **阈值**：dense 通道论文用相似度阈值 0.8 过滤，可先不设阈值靠 RRF 排序兜底（避免误杀），是否引入以评估数据为准；
- 双通道用 `Promise.all` 并发，串行会白白增加 ~1 个 RTT 延迟。

## 四、未来增强（按需启用，留档）

- 论文两阶段检索的"重排"阶段 → 引入 bge-reranker / bce-reranker（本地可跑）对 top-N 候选二次排序（详见 `rag-rerank.md`）；
- 检索质量评估（召回率/命中位置）→ 参考 `iknow-paper-notes.md` 的 LLM-as-judge 方法（详见 `rag-evaluation.md`）。

## 项目绑定（若有）

- ANZAI 项目落地为 Qdrant dense + PG pg_trgm → RRF（docs/README.md 6.2 权威），`src/service/retrieval/` 的检索设计、骨架与陷阱见 `.agents/rules/rag-anzai.md` §4.4。