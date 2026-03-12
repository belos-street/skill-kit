# @belos-street/skill-kit

> 用于管理 AI Agent 技能文档的 CLI 工具 - 生成 agents 和 skill 目录

## 关于

`skill-kit` 是一个 CLI 工具，旨在帮助你管理和组织 AI Agent 的技能文档。它提供交互式界面来浏览、选择和安装技能到你的项目中，并自动生成必要的配置文件。

## 特性

- 支持多选的交互式技能选择
- 自动生成 `agents.md` 配置文件
- 列出并查看可用技能的详细信息
- 基于 Bun 构建，实现快速的 TypeScript 执行
- 重复检测和智能冲突解决
- 彩色终端输出，提供更好的用户体验

## 安装

### 全局安装

```bash
npm install -g @belos-street/skill-kit

or

pnpm add -g @belos-street/skill-kit
```

### 使用 npx

```bash
npx @belos-street/skill-kit

or

pnpx @belos-street/skill-kit 
```

## 使用方法

### 列出可用技能

查看所有可用技能及其描述：

```bash
skill-kit list
```

输出示例：
```
可用技能：
  bun - Bun 运行时和工具链
  nextjs - Next.js React 框架
  pinia - Vue 状态管理
  react - React 库
  vue-best-practices - Vue.js 最佳实践
  vue-router-best-practices - Vue Router 最佳实践
  vue-testing-best-practices - Vue 测试最佳实践
  zustand - Zustand 状态管理
  unocss - UnoCSS 原子 CSS 引擎
  ...

总计：15 个技能
```

### 添加技能（交互式）

通过交互式选择将技能添加到当前目录：

```bash
skill-kit add
```

你将看到多选界面：
```
选择要添加的技能：

  bun
  nextjs
  pinia
  react
  vue-best-practices
  vue-router-best-practices
  vue-testing-best-practices
  zustand
  unocss

提示：空格选择，回车确认
```

选择后，工具将：
1. 将选中的技能生成到 `./skills/` 目录
2. 生成 `agents.md` 配置文件
3. 显示添加/跳过的技能摘要

输出示例：
```
正在复制技能...

  bun: 已添加
  nextjs: 已添加
  pinia: 已添加

完成！3 个已添加，0 个已跳过

正在生成 agents.md...
agents.md 已生成！
```

### 查看技能信息

获取特定技能的详细信息：

```bash
skill-kit info <技能名称>
```

示例：
```bash
skill-kit info nextjs
```

输出：
```
nextjs

描述：Next.js React 框架
路径：/path/to/skills/nextjs
参考文件：8 个

--- 前置数据 ---
  name: nextjs
  title: Next.js
  tags: react, framework, ssr
```

## 可用技能

### 内置技能

此集合包含各种现代 Web 开发技术栈的技能：

| 技能 | 描述 | 参考文件数 |
|--------|-------------|-----------------|
| bun | Bun 运行时和工具链 | 6 |
| nextjs | Next.js React 框架 | 8 |
| pinia | Vue 状态管理 | 25 |
| react | React 库 | 3 |
| vue | Vue.js 核心 | 3 |
| vue-best-practices | Vue 3 + TypeScript 最佳实践 | 100+ |
| vue-router-best-practices | Vue Router 最佳实践 | 7 |
| vue-testing-best-practices | Vue 测试最佳实践 | 5 |
| zustand | Zustand 状态管理 | 5 |
| unocss | UnoCSS 原子 CSS 引擎 | 3 |
| react-best-practices | React 最佳实践 | 60+ |
| belos-street | Belos Street 项目约定 | 4 |

### 技能分类

**Vue 生态系统**
- vue - Vue.js 核心
- pinia - 状态管理
- vue-best-practices - 最佳实践
- vue-router-best-practices - Router 最佳实践
- vue-testing-best-practices - 测试最佳实践

**React 生态系统**
- react - React 库
- react-best-practices - 最佳实践
- nextjs - Next.js 框架
- zustand - Zustand 状态管理

**工具链**
- bun - Bun 运行时
- unocss - 原子 CSS 引擎

## 技能结构

每个技能遵循以下结构：

```
skills/
├── <技能名称>/
│   ├── skill.md              # 包含元数据的主技能文件
│   └── reference/            # 参考文档
│       ├── basics.md
│       ├── advanced.md
│       └── ...
```

### skill.md 格式

`skill.md` 文件包含元数据和文档：

```yaml
---
name: 技能名称
title: 技能标题
description: 此技能涵盖内容的简要描述
tags: 标签1, 标签2, 标签3
---

# 技能标题

详细文档和最佳实践...

## 核心概念

- 概念 1
- 概念 2

## 使用示例

```typescript
// 示例代码
```

## 最佳实践

1. 最佳实践 1
2. 最佳实践 2


### 前置数据字段

- `name` - 技能的唯一标识符
- `title` - 显示标题
- `description` - 简要描述
- `tags` - 用于分类的逗号分隔标签

## 生成的文件

### agents.md

当你添加技能时，`skill-kit` 会自动生成 `agents.md` 文件：

```markdown
# Agents 配置

> 此文件由 skill-kit 自动生成

## 可用技能

### nextjs

> Next.js React 框架

**文件：**
- `skills/nextjs/skill.md` - 主技能文件
- `skills/nextjs/reference/` - 8 个参考文件

**元数据：**
- name: nextjs
- title: Next.js
- tags: react, framework, ssr

### pinia

> Vue 状态管理库

**文件：**
- `skills/pinia/skill.md` - 主技能文件
- `skills/pinia/reference/` - 25 个参考文件

---
*由 skill-kit 生成*
```

此文件作为配置文件，让 AI Agent 了解项目中可用的技能。

## 项目结构

```
skill-kit/
├── bin/
│   └── skill-kit          # CLI 可执行文件
├── lib/
│   ├── cli/               # 命令行界面
│   │   └── index.ts      # CLI 命令（list, add, info）
│   ├── fs/                # 文件系统工具
│   │   └── index.ts      # 复制、读取、写入操作
│   ├── generator/          # 技能生成器
│   │   └── index.ts      # 添加技能到目录
│   ├── logger/            # 日志工具
│   │   └── index.ts      # 彩色控制台输出
│   ├── skill/             # 技能管理
│   │   └── index.ts      # 读取和解析技能
│   └── template/          # 模板生成器
│       └── index.ts      # 生成 agents.md
├── scripts/
│   └── publish.ts         # 发布脚本
├── skills/               # 内置技能
│   ├── bun/
│   ├── nextjs/
│   ├── pinia/
│   ├── react/
│   └── ...
├── index.ts              # 入口文件
├── package.json
└── README.md
```

### 项目命令

```bash
# 列出所有技能
bun run ./index.ts list

# 交互式添加技能
bun run ./index.ts add

# 查看技能信息
bun run ./index.ts info <技能名称>
```

## 致谢

- 受 [antfu/skills](https://github.com/antfu/skills) 启发

