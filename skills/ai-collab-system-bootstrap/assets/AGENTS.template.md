# AGENTS.md

> 本文件为**人工维护**的项目总入口文档，用于帮助 LLM / AI 编码助手快速理解项目。
> 规则：只放导航 + 红线，长内容一律外链到 `doc/`；新增内容时**手动同步**下方对应索引表。

---

## 一、项目介绍

`{{PROJECT_NAME}}` 是 **{{PROJECT_DESC}}**。

主要业务模块（对应 `{{SRC_DIR}}`，目录即路由）：{{DOMAIN_LIST}}。

---

## 二、技术栈

- **框架**：{{STACK}}
- **UI / 渲染**：<按项目填写>
- **网络 / 数据**：<按项目填写>
- **测试**：{{TEST_CMD}}
- **规范工具链**：{{LINT_CMD}} + 提交规范（见 `.agents/rules/git-commit-message.md`）
- **包管理**：{{PKG_MANAGER}}；**路径别名**：<按项目填写>
- **入口文件**：<按项目填写>

---

## 三、常用命令

```bash
{{INSTALL_CMD}}        # 安装依赖
{{DEV_CMD}}            # 启动开发
{{BUILD_CMD}}          # 构建
{{TYPE_CHECK_CMD}}     # 类型检查
{{LINT_CMD}}           # Lint 并修复
{{TEST_CMD}}           # 测试
```

> 提交代码会触发 git 钩子：`pre-commit` 跑 lint-staged，`commit-msg` 跑 commitlint + spec-first 机器校验（见第八节 ②）。

---

## 四、目录结构（速览）

| 目录 | 说明 |
| --- | --- |
| `.agents/` | AI 协作体系：rules（alwaysApply）/ workflows / skills / memory（决策记录） |
| `doc/` | 项目文档：api + business + architecture + design + plan + templates + changes |
| `{{SRC_DIR}}` | 业务代码 |
| `<其它>` | <按项目填写> |

> 完整目录树与组织约定 → [project-structure](doc/architecture/project-structure.md)（待创建）

---

## 五、代码风格规范

> 完整规范见 <代码规范总纲 skill / 文档路径>，生成代码时必须遵循。要点速查：

**命名**：<按项目填写>

**编码约定**

- <按项目填写，如：统一使用 X 写法；样式优先 Y；文案必须走 i18n>
- 单一职责：一个文件一个关注点；工具函数按模块拆分目录；测试就近命名。
- 国际化统一 `t('模块.键')`，多语言文件镜像维护。（无 i18n 则删除本条）

**提交规范**

- 遵循 Conventional Commits；除必要术语外使用**中文**描述。
- 复杂变更（改动 ≥3 个代码文件）的提交信息必须带 change-id：`change/<YYYYMMDD-主题>`，供 `commit-msg` 钩子机器校验。

---

## 六、技能导航（.agents/skills/）

| 技能 | 何时使用 |
| --- | --- |
| <skill 名> | <何时使用> |

> 边界：skills 只放**可跨项目复用的通用能力**（含第三方开源 skill）；**本项目专属约定**放 `.agents/rules/`。

---

## 七、规则（.agents/rules/）

| 规则 | 说明 |
| --- | --- |
| `project_rules.md` | 全局代码规则：必须遵循 <规范总纲> |
| `spec-first.md` | 规范先行闸门：复杂需求必须先产出 `doc/changes` 三层文档并等确认，未经确认禁止改 `{{SRC_DIR}}` |
| `workflow-guide.md` | 意图→工作流决策表：新功能→feature-development / 报障→bug-fix / 线上紧急→hotfix / 重构→refactor |
| `verification.md` | 完工前自检规则：交付前须验证；含单元测试豁免条款 |
| `memory.md` | 决策记录自动沉淀：达成重要决策时追加到 `.agents/memory/decisions.md`，承接任务前先读 |
| `git-commit-message.md` | Conventional Commits + 中文提交信息 |
| `api-convention.md` | API 层约定（有独立 API 层时保留，否则删除） |
| `i18n.md` | 国际化约定（双语项目保留，否则删除） |

---

## 八、AI 协作标准流程（承接需求时）

> 所有业务需求按此流程执行。本表是**入口索引**，步骤细节由 rules / workflows 定义。

### ① 意图路由（workflow 决策表）

| 请求类型 | 工作流 | 关键闸门 |
| --- | --- | --- |
| 新功能 / 新页面 / 新列表 | [feature-development](.agents/workflows/feature-development.md) | 复杂需求先出三层文档等确认 |
| 报障 / 缺陷 / 行为不符 | [bug-fix](.agents/workflows/bug-fix.md) | 先复现再修复；最小改动 |
| 线上紧急 / 阻断性故障 | [hotfix](.agents/workflows/hotfix.md) | 最小止血；事后补记录不豁免 |
| 重构 / 迁移 / 技术债 | [refactor](.agents/workflows/refactor.md) | 必走三层文档；行为不变 |

### ② 规范先行闸门（spec-first）

- 预计改 **3+ 文件** / 跨模块 / 涉枚举状态机 / 需求含糊 → 在 `doc/changes/<change-id>/` 产出 `proposal/design/tasks` 三层文档并**停下等确认**，未经确认禁止改 `{{SRC_DIR}}`；
- 简单改动（1~2 文件、无分支）豁免；
- **机器校验兜底**：`commit-msg` 钩子校验「改动 ≥3 个代码文件且提交信息无 change-id」→ 拦截（`scripts/check-spec-first.mjs`）；`--no-verify` 为知情逃生舱。

### ③ 动手前必读（按需）

| 想了解 | 读哪 |
| --- | --- |
| 既有决策 / 约定 | `.agents/memory/decisions.md` |
| 某业务域实现（组件地图 / 枚举 / API 落点 / 已知坑） | `doc/business/<域>.md` |
| 接口定义 | `doc/api/<当前版本>/` |
| 新建列表 / 表单模块怎么做 | `doc/architecture/module-guide.md` |
| 代码骨架 | `doc/templates/code/README.md` |

### ④ 实现与变更记录

- 套用 `doc/templates/code/` 骨架实现；
- 接口变更：先在 `doc/api` 更新事实，再在 `doc/changes` 记录本次影响面；
- 完工必跑 `{{TYPE_CHECK_CMD}} && {{LINT_CMD}}` → 改动范围核对 → 对 diff 执行 code-review → `verification.md` 自检（**交付说明附命令输出摘要**）→ 复盘沉淀（memory 三问）；提交遵循 Conventional Commits（中文）。

---

## 九、项目文档索引（doc/）

> `doc/` 是项目文档的**唯一存放处**，供真人与 LLM 共读，**请勿移入 `.agents/`**。
>
> 索引约定：本节的每个条目**要么指向真实存在的文件、要么显式标注（待创建）**；创建后立即去掉标记。**禁止出现未标注的死链。**

### 架构与开发指南（doc/architecture/）

| 文档 | 内容 | 何时阅读 |
| --- | --- | --- |
| <文档> | <内容> | <何时阅读> |

### 业务域知识（doc/business/）

| 域 | 文档 | 覆盖 |
| --- | --- | --- |
| <域> | [<域>.md](doc/business/<域>.md) | <覆盖内容> |

### 计划与设计（doc/plan/ + doc/design/）

| 文档 | 内容 |
| --- | --- |
| [计划索引](doc/plan/README.md) | 改造与升级计划清单、状态跟踪、明确不做清单 |
| [设计思路文档库](doc/design/README.md)（待创建） | 新版本设计稿的设计思路文档（按版本归档） |

### 变更记录与模板（doc/templates/ + doc/changes/）

| 文档 | 内容 |
| --- | --- |
| [change 模板](doc/templates/change/) | 三层变更文档模板（proposal/design/tasks） |
| [code 模板](doc/templates/code/README.md) | 代码生成骨架（骨架本体由本项目按技术栈补齐，清单见其中） |
| [变更记录](doc/changes/README.md) | 当次变更层：按 change-id 归档、随代码提交可追溯 |

### 版本化接口 / 需求文档（doc/api/）

| 版本 | 主要内容 |
| --- | --- |
| `<vX.Y.Z>/` | <主要内容> |

> 开发新功能前，先到当前版本目录下查找是否有对应接口/需求文档，以文档作为对接依据。

---

## 十、决策记录（.agents/memory/）

> 记录已敲定、需长期遵守的技术与流程决策，供真人与 LLM 共读；LLM 承接任务前应阅读、做出新决策时追加。

| 文档 | 内容 |
| --- | --- |
| [decisions.md](.agents/memory/decisions.md) | 决策记录：目录约定、工具链选型、架构约定、流程规范等 |
