# Skill Kit 开发计划

## 第一阶段：项目基础建设

### 1. 上传/发布 npm 包
- [ ] 配置 package.json
  - 添加 `bin` 字段定义 CLI 命令（如 `skill-kit`）
  - 添加 `files` 字段指定发布的文件（bin/, lib/, skills/）
  - 设置 `exports` 或 `main` 字段
  - 更新 `version` 为 1.0.0
  - 移除 `private: true`
  - 添加 `keywords`, `description`, `repository`, `homepage`, `bugs`, `author`, `license`
- [ ] 创建 CLI 入口文件
  - `bin/skill-kit.js` - CLI 命令入口
  - 添加 shebang (`#!/usr/bin/env node`)
  - 实现基本的命令解析（init, list, generate 等）
- [ ] 实现核心功能
  - `lib/cli.js` - CLI 交互逻辑
  - `lib/generator.js` - 文件生成逻辑
  - `lib/parser.js` - skill.md 解析逻辑
  - `lib/template.js` - agents.md 模板生成逻辑
- [ ] 添加依赖
  - `inquirer` 或 `prompts` - 交互式选择
  - `commander` 或 `yargs` - 命令行参数解析
  - `chalk` - 终端颜色输出
  - `ora` - 加载动画
- [ ] 编写 README.md
  - 安装说明
  - 使用示例
  - 命令文档
- [ ] 发布到 npm
  - 注册 npm 账号
  - `npm login`
  - `npm publish`

### 2. 第三方使用下载
- [ ] 用户安装命令
  - `npm install -g skill-kit`
  - 或 `npx skill-kit init`
- [ ] 验证安装
  - `skill-kit --version`
  - `skill-kit --help`

### 3. 选择器，选择需要的 skill
- [ ] 实现技能列表扫描
  - 读取 `skills/` 目录
  - 解析每个 `skill.md` 的元数据
  - 提取 name, description, version, license 等信息
- [ ] 实现交互式选择器
  - 使用 inquirer/prompts 实现多选
  - 显示 skill 名称和描述
  - 支持全选/取消全选
  - 支持搜索/过滤（可选）
- [ ] 实现目标目录输入
  - 询问用户目标目录
  - 验证目录权限
  - 创建目录（如不存在）

### 4. 在目标目录生成对应的 skill 目录和文件
- [ ] 实现目录复制
  - 复制选中的 skill 目录
  - 保持目录结构
  - 处理文件权限
- [ ] 生成 agents.md
  - 根据选中的 skills 动态生成
  - 从 skill.md 提取元数据
  - 生成关键词映射
  - 生成使用场景说明
- [ ] 生成其他必要文件（可选）
  - `.gitignore`
  - `README.md`（模板）
  - `package.json`（如需要）

## 第二阶段：功能增强

### 5. 添加 skill 管理功能
- [ ] `skill-kit list` - 列出所有可用 skills
- [ ] `skill-kit info <skill-name>` - 查看 skill 详细信息
- [ ] `skill-kit search <keyword>` - 搜索 skills
- [ ] `skill-kit update` - 更新已安装的 skills

### 6. 添加模板自定义功能
- [ ] 支持自定义 agents.md 模板
- [ ] 支持自定义生成目录结构
- [ ] 支持配置文件（`.skill-kitrc`）

### 7. 添加验证和测试
- [ ] 验证 skill.md 格式
- [ ] 验证 references 目录结构
- [ ] 添加单元测试
- [ ] 添加集成测试

## 第三阶段：文档和社区

### 8. 完善项目文档
- [ ] 创建 CONTRIBUTING.md - 贡献指南
- [ ] 创建 SKILL_GUIDE.md - 添加新 skill 指南
- [ ] 创建 AGENTS_GUIDE.md - agents.md 生成指南
- [ ] 创建 CHANGELOG.md - 版本更新日志

### 9. 添加示例和教程
- [ ] 创建 examples/ 目录
- [ ] 添加使用示例
- [ ] 添加视频教程（可选）

### 10. 社区建设
- [ ] 添加 Issue 模板
- [ ] 添加 PR 模板
- [ ] 添加 Code of Conduct
- [ ] 建立贡献者指南

## 优先级

### 高优先级（必须完成）
1. 配置 package.json
2. 创建 CLI 入口
3. 实现核心功能（cli, generator, parser, template）
4. 实现技能列表扫描和选择器
5. 实现目录复制和 agents.md 生成
6. 发布到 npm

### 中优先级（重要功能）
7. 添加 skill 管理功能（list, info, search, update）
8. 完善项目文档
9. 添加验证和测试

### 低优先级（增强功能）
10. 添加模板自定义功能
11. 添加示例和教程
12. 社区建设
