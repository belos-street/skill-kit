# 变更记录（doc/changes/）

> 「当次变更层」：每个功能 / Bug 修复一个 `change-id` 目录，随代码提交、可追溯。

## 与 doc/api 的关系

- `doc/api` = **接口事实层**：按版本归档、长期权威；
- `doc/changes` = **当次变更层**：按 change 归档、随需求走；
- **接口变更时：先在 `doc/api` 更新事实，再在 `doc/changes` 记录本次影响面。**

## 约定

- change-id：`YYYYMMDD-<kebab-case 主题>`，如 `20260807-task-list-column`；
- 每个变更目录包含三层文档：`proposal.md`（为什么做）/ `design.md`（怎么做）/ `tasks.md`（拆着做），模板见 `doc/templates/change/`；
- 文档与代码一起提交，保持可追溯；验收通过后保留归档，不删除。
