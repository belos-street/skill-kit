---
name: workflow-guide
description: 意图→工作流决策表，根据用户请求类型路由到对应 workflow（feature-development / bug-fix / hotfix / refactor），保证不同场景走不同步骤
alwaysApply: true
---

# 工作流决策表（Workflow Guide）

根据用户请求的**意图类型**路由到对应工作流，一致性由决策表保证而非 AI 自觉。命中后先读对应 `.agents/workflows/<workflow>.md` 再动手。

## 一、意图 → 工作流

| 用户意图 / 场景 | 工作流 | 关键闸门 |
| --- | --- | --- |
| 新功能 / 新页面 / 新列表 / 新增能力 | [feature-development](../workflows/feature-development.md) | 复杂需求先出三层文档等确认（spec-first）；模板化实现 |
| 报障 / 缺陷 / 行为不符 / 测试提 bug | [bug-fix](../workflows/bug-fix.md) | 先复现再修复；最小改动；事后复盘沉淀 |
| 线上紧急问题 / 阻断性故障 / 立即上线 | [hotfix](../workflows/hotfix.md) | 最小修复优先，豁免非必要流程但事后补记录 |
| 结构调整 / 重构 / 目录迁移 / 技术债清理 | [refactor](../workflows/refactor.md) | 必走三层文档（影响面大）；行为不变；分步迁移 |

## 二、判定规则

1. **无法确定意图** → 先用需求澄清能力（澄清技能 / brainstorming）把需求问清楚，再路由；
2. **混合意图**（如「重构顺便加个功能」）→ 按最重的工作流执行，并在文档中显式拆分「重构项」与「功能项」；
3. **简单改动**（1~2 文件、无分支、需求明确）→ 豁免 spec-first 闸门，但其余步骤（读业务文档、质量验证、verification 自检）不豁免；
4. **与既有工作流冲突** → 以 `spec-first.md` 的禁令为准（未确认禁止改 `{{SRC_DIR}}`）。

## 三、所有工作流的公共红线

- 复杂需求未确认前禁止改 `{{SRC_DIR}}`（spec-first）；
- 动手前先读：`.agents/memory/decisions.md` + `doc/business/` 对应域文档 + `doc/api` 对应版本；
- 完成前必跑：`{{TYPE_CHECK_CMD}} && {{LINT_CMD}}` + `verification.md` 自检；
- 接口变更：先在 `doc/api` 更新事实，再在 `doc/changes` 记录影响面；
- 提交信息遵循 Conventional Commits（中文描述）。
