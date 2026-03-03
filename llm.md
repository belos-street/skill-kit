# Skill Kit 项目文档

> 本文档用于指导大模型理解项目结构、skill 规范以及如何添加新 skill

## 项目概述

Skill Kit 是一个可扩展的 AI 技能库，包含前端框架的最佳实践和参考文档。用户可以通过 CLI 工具选择需要的 skills，并生成对应的目录结构和 agents.md 文件。

## 项目结构

```
skill-kit/
├── bin/                    # CLI 命令入口（待实现）
│   └── skill-kit.js
├── lib/                    # 核心功能模块（待实现）
│   ├── cli.js             # CLI 交互逻辑
│   ├── generator.js       # 文件生成逻辑
│   ├── parser.js          # skill.md 解析逻辑
│   └── template.js        # agents.md 模板生成逻辑
├── skills/                 # 所有 skills
│   ├── react/             # React skill
│   │   ├── skill.md       # Skill 主文件（必需）
│   │   ├── references/    # 参考文档目录（必需）
│   │   │   ├── hooks.md
│   │   │   └── components-patterns.md
│   │   └── LICENSE.md     # License 文件（可选）
│   ├── react-best-practices/
│   │   ├── skill.md
│   │   ├── reference/     # 注意：这里是 reference（单数）
│   │   │   └── hooks-state-update-batching.md
│   │   └── LICENSE.md
│   ├── vue/
│   │   ├── skill.md
│   │   ├── references/
│   │   │   └── ...
│   │   └── LICENSE.md
│   ├── vue-best-practices/
│   │   ├── skill.md
│   │   ├── reference/
│   │   │   └── ...
│   │   └── LICENSE.md
│   └── vue-router-best-practices/
│       ├── skill.md
│       ├── reference/
│       │   └── ...
│       └── LICENSE.md
├── scripts/
│   └── todo.md            # 开发计划
├── AGENTS.md              # 项目级 agents 指南（本文件）
├── package.json
├── README.md
└── index.ts
```

## Skill 目录结构规范

每个 skill 必须遵循以下目录结构：

### 标准结构

```
skill-name/
├── skill.md              # 必需：Skill 主文件
├── references/           # 必需：参考文档目录
│   ├── topic-1.md
│   ├── topic-2.md
│   └── ...
└── LICENSE.md            # 可选：License 文件
```

### 重要说明

1. **skill.md** 是必需的，位于 skill 根目录
2. **references/** 或 **reference/** 目录是必需的，包含所有参考文档
   - 注意：现有项目中有些使用 `references`（复数），有些使用 `reference`（单数）
   - 新 skill 建议统一使用 `references`（复数）
3. **LICENSE.md** 是可选的，但推荐添加

## skill.md 文件格式规范

### Frontmatter（必需）

每个 skill.md 必须以 YAML frontmatter 开头，包含以下字段：

```yaml
---
name: skill-name                    # 必需：skill 名称（与目录名一致）
description: 简短描述                # 必需：skill 描述
version: "1.0.0"                    # 可选：版本号
license: MIT                        # 可选：许可证类型
metadata:                           # 可选：元数据
  author: github.com/username
  tags: [tag1, tag2]
---
```

### 内容结构

skill.md 的内容应包含以下部分：

```markdown
# Skill Name

> 简短的介绍说明

## Preferences

- 偏好设置 1
- 偏好设置 2

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| 主题 1 | 描述 | [reference](references/topic-1.md) |
| 主题 2 | 描述 | [reference](references/topic-2.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| 特性 1 | 描述 | [reference](references/feature-1.md) |

## Quick Reference

### 示例代码

```tsx
// 代码示例
```

### Key Imports

```ts
// 导入示例
```
```

### 最佳实践

1. **name 字段**：必须与目录名一致，使用 kebab-case（如 `react-best-practices`）
2. **description 字段**：简洁明了，说明 skill 的用途和适用场景
3. **表格引用**：使用相对路径引用 references 目录下的文件
4. **代码示例**：提供实用的代码示例，使用正确的语法高亮
5. **链接格式**：使用 `[text](path/to/file.md)` 格式

## references 目录规范

### 文件命名

- 使用 kebab-case（如 `hooks-state-update-batching.md`）
- 名称应清晰描述文件内容
- 避免使用特殊字符

### 文件格式

每个 reference 文件应包含：

```markdown
---
name: topic-name                 # 必需：主题名称
description: 简短描述            # 必需：主题描述
---

# Topic Name

> 简短介绍

## 问题/场景

描述问题或使用场景

## 解决方案

提供解决方案

## 代码示例

```tsx
// 代码示例
```

## 关键要点

- 要点 1
- 要点 2
```

### 内容要求

1. **frontmatter**：每个 reference 文件必须有 frontmatter
2. **问题导向**：描述常见问题、陷阱或最佳实践
3. **代码示例**：提供正确和错误的代码示例
4. **关键要点**：总结重要知识点

## 添加新 Skill 流程

### 步骤 1：创建目录结构

```bash
cd skills/
mkdir new-skill-name
cd new-skill-name
mkdir references
```

### 步骤 2：创建 skill.md

创建 `skill.md` 文件，包含：

1. **Frontmatter**：填写 name, description 等元数据
2. **内容**：按照标准结构编写内容
3. **引用**：确保 references 目录下的文件被正确引用

### 步骤 3：创建 reference 文件

在 `references/` 目录下创建参考文档：

1. 每个文件必须有 frontmatter
2. 文件名使用 kebab-case
3. 内容包含问题、解决方案、代码示例、关键要点

### 步骤 4：添加 LICENSE.md（可选）

```bash
# 复制现有 LICENSE.md 或创建新的
cp ../react/LICENSE.md .
```

### 步骤 5：验证

检查清单：

- [ ] 目录结构正确（skill.md + references/）
- [ ] skill.md 包含完整的 frontmatter
- [ ] skill.md 的 name 字段与目录名一致
- [ ] 所有 references 文件都有 frontmatter
- [ ] 所有引用链接正确
- [ ] 代码示例语法正确
- [ ] 文件命名使用 kebab-case

### 步骤 6：更新模板（重要）

当添加新 skill 后，需要更新以下内容：

#### 6.1 更新 lib/parser.js（待实现）

确保新 skill 能被正确解析：

```javascript
// lib/parser.js
export function parseSkill(skillPath) {
  const skillMD = readFileSync(join(skillPath, 'skill.md'), 'utf-8');
  const frontmatter = extractFrontmatter(skillMD);
  
  return {
    name: frontmatter.name,
    description: frontmatter.description,
    version: frontmatter.version,
    license: frontmatter.license,
    path: skillPath,
    references: getReferences(skillPath)
  };
}
```

#### 6.2 更新 lib/template.js（待实现）

确保新 skill 能被包含在 agents.md 模板中：

```javascript
// lib/template.js
export function generateAgentsMD(selectedSkills, skillsData) {
  // 自动处理所有选中的 skills
  selectedSkills.forEach(skillName => {
    const skill = skillsData[skillName];
    // 生成对应的内容
  });
}
```

#### 6.3 更新 CLI（待实现）

确保新 skill 能在选择器中显示：

```javascript
// lib/cli.js
export async function showSkillSelector() {
  const skills = getAllSkills();
  // 自动扫描 skills/ 目录
  // 显示所有可用 skills
}
```

### 步骤 7：测试

```bash
# 测试 CLI 是否能识别新 skill
skill-kit list

# 测试生成 agents.md
skill-kit init
# 选择新 skill
# 验证生成的 agents.md 包含新 skill
```

## 更新现有 Skill 流程

### 修改 skill.md

1. 更新 frontmatter（如版本号、描述）
2. 更新内容
3. 添加/更新引用
4. 验证所有链接

### 添加/修改 reference 文件

1. 在 references/ 目录下创建新文件
2. 或修改现有文件
3. 更新 skill.md 中的引用
4. 验证 frontmatter 格式

### 更新版本号

在 skill.md 的 frontmatter 中更新 version：

```yaml
---
name: skill-name
version: "2.0.0"  # 更新版本号
---
```

## 常见问题

### Q1: references 目录应该用复数还是单数？

**A**: 现有项目中两种都有：
- `references/`（复数）：react, vue
- `reference/`（单数）：react-best-practices, vue-best-practices, vue-router-best-practices

**建议**：新 skill 统一使用 `references/`（复数），但解析器需要兼容两种格式。

### Q2: skill.md 的 name 字段必须与目录名一致吗？

**A**: 是的，必须一致。这是 CLI 工具识别 skill 的关键。

### Q3: 如何确保 agents.md 正确生成？

**A**: 确保以下几点：
1. skill.md 的 frontmatter 完整
2. references 目录存在且包含文件
3. 所有 reference 文件都有 frontmatter
4. CLI 工具能正确解析 skill.md

### Q4: 添加新 skill 后需要做什么？

**A**: 
1. 验证目录结构和文件格式
2. 更新 lib/parser.js（如果需要）
3. 更新 lib/template.js（如果需要）
4. 测试 CLI 工具
5. 更新文档

## 验证检查清单

### Skill 目录结构

- [ ] skill.md 存在于根目录
- [ ] references/ 或 reference/ 目录存在
- [ ] LICENSE.md 存在（可选但推荐）

### skill.md 文件

- [ ] 包含 YAML frontmatter
- [ ] name 字段与目录名一致
- [ ] description 字段存在
- [ ] 引用链接使用相对路径
- [ ] 代码示例语法正确

### references 文件

- [ ] 所有文件都有 frontmatter
- [ ] 文件名使用 kebab-case
- [ ] 包含问题、解决方案、代码示例
- [ ] 关键要点清晰

### CLI 工具（待实现）

- [ ] 能正确扫描 skills/ 目录
- [ ] 能正确解析 skill.md
- [ ] 能正确生成 agents.md
- [ ] 能正确复制文件

## 技术栈

- **运行时**: Node.js / Bun
- **CLI 工具**: inquirer / prompts
- **命令行解析**: commander / yargs
- **文件操作**: fs (Node.js built-in)
- **模板引擎**: 自定义模板（待实现）

## 开发流程

1. **添加新 skill**：按照"添加新 Skill 流程"操作
2. **更新模板**：确保 CLI 工具能识别新 skill
3. **测试**：运行 CLI 工具测试生成功能
4. **发布**：更新版本号，发布到 npm