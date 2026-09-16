---
name: project_rules
description: 项目代码规则总纲，声明 AI 生成代码必须遵循的规范来源
alwaysApply: true
---

# Overview

本规则用于约束 AI 生成代码的规范，所有由 AI 生成的项目代码需严格遵循以下参考规则：

1. 基础代码规范：AI 生成的代码需完全参考 <代码规范总纲 skill 路径>（如 `.agents/skills/<skill>/skill.md`）中定义的代码规范及规则，以及其中 LLM coding 行为准则部分;
2. <技术相关规范>：若 AI 生成的代码涉及 <技术点，如 UnoCSS 类名 / 特定 UI 库 / 特定框架>，需在遵循上述基础规则的前提下，额外参考 <对应 skill 路径> 中的规范及规则;
3. 一致性约束：本入口文档（`AGENTS.md`）中声明的 agent 技能，必须在项目根目录 `.agents/skills/` 下存在对应的 skill 文件，且该文件中必须包含该技能的详细描述。
