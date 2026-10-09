# Workflow: feature-development（新功能开发）

> 适用：新功能 / 新页面 / 新列表 / 新增能力。由 `workflow-guide.md` 决策表路由。

## 步骤

1. **需求澄清** → 含糊先走需求澄清能力；明确目标与非目标。
2. **复杂度判断（spec-first 闸门）** → 预计 3+ 文件 / 跨模块 / 涉枚举状态机 → 产出 `doc/changes/<change-id>/` 三层文档（模板 `doc/templates/change/`）并**停下等确认**；简单改动直接进入下一步。
3. **读项目事实** → `.agents/memory/decisions.md` + `doc/business/` 对应域文档 + `doc/api` 对应版本接口文档。
4. **模板化实现** → 按 `doc/templates/code/` 骨架产出（列表页 / API 层 / 状态管理 / 动态下拉 hook / i18n），对齐 `doc/architecture/module-guide.md`；**该目录的骨架由本项目按自身技术栈维护**（bootstrap 只建目录与 README 索引，待补清单见其中）。
5. **文案补词条** → 各语言文案文件镜像新增，模块注册同步（有 i18n 时）。
6. **质量验证** → `{{TYPE_CHECK_CMD}} && {{LINT_CMD}}` 保持绿；涉及交互用浏览器自动化工具冒烟。
7. **范围核对（收敛）** → 对照设计文档/影响面清单核对实际改动，剔除无关变更（不顺手重构、不改无关样式）。
8. **code-review** → 对 diff 执行代码审查（安全相关场景用安全审查）；发现的问题回到步骤 4/6 修复后复验。
9. **完工自检** → `verification.md` 逐条核对；接口变更先更新 `doc/api`；提交遵循项目提交规范。
10. **复盘沉淀** → 按 `memory.md` 复盘三问落回文档（`doc/business/` 已知坑 / `doc/architecture/` 指南 / 新决策 D-n）。

## 关键闸门

- 步骤 2 未确认 → 禁止改 `{{SRC_DIR}}`（spec-first 禁令）；
- 步骤 6 未通过 → 不得提交。
