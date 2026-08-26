---
name: rag-loader
description: 多格式文档加载（通用可迁移）：PDF / HTML / Office / 图片表格等格式的解析与抽取要点，loader 归一化输出「标题路径 + 正文段落」，是 rag-ingestion 的前置环节。
version: "2.0.0"
license: MIT
metadata:
  author: Sectrend (general RAG practice)
  tags: [rag, loader, parsing, pdf, html, ocr, typescript]
  parent: rag
---

# rag-loader：多格式文档加载

## 通用原则（不限语言/框架）

加载环节决定"进库的内容质量"——格式解析不到位，后面分块/向量化再好也白搭。

- **PDF**：文本型 PDF 直接抽文本；扫描件需 OCR（Tesseract / 云 OCR）；**表格/多栏排版是重灾区**——优先"按阅读顺序"抽取（保留栏位顺序），表格可转 Markdown 表格或逐行文本，避免单元格错位；
- **HTML/网页**：剥离脚本/样式/导航，只留正文；保留标题层级（h1~h3）供分块用——**与 rag-ingestion 的标题感知分块直接衔接**；注意正文/注释区块的区分；
- **Office（docx/xlsx/pptx）**：docx 按段落+标题样式抽取（样式即结构）；xlsx 按 sheet 转表格文本；pptx 按页抽取演讲者备注与文本层；
- **图片**：一般不做通用 OCR 进 RAG（成本高、收益低），除非文档本身以图为主（架构图/截图说明）；可考虑"图片 + 周边文字"整体作为一个 chunk 单元；
- **统一出口**：无论什么格式，loader 的产出应**归一化为「标题路径 + 正文段落」的结构**（与 rag-ingestion 的 chunker 输入对齐），这样下游分块逻辑与格式解耦；
- **文档源管理**：明确"哪些目录/后缀属于知识库"，用白名单（如环境变量配置的文档源根目录 + 允许的后缀清单）管理，格式扩展必须走评审，避免把无关文件灌进库。

## 落地建议（参考结构，项目无关）

- **统一出口接口**：建议 loader 产出形状如 `Doc { path: string; titles: string[]; text: string }`（示例），新增格式只需新增一个实现该接口的 loader，**不动分块/入库逻辑**——格式与链路解耦的边界就在"归一化接口"处；
- **未启用新格式前勿提前加解析分支**：等真实格式需求再实现对应 loader（YAGNI）；
- **验证**：为每种格式建 fixture 样本（含表格/多栏/乱码），断言归一化输出与 md 的结构一致（titles + text 可被 chunker 直接消费）；覆盖路径解析 / 内容读取 / 非法文件跳过。