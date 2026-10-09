---
name: git-commit-message
description: 提交信息规范，约束 LLM 生成符合 Conventional Commits 的中文提交信息并携带 change-id
alwaysApply: true
scene: git_message
---

1. 在生成 git commit 信息时, 遵循 Conventional Commits 规范（参考根目录下 `commitlint.config.cjs` 配置信息），简洁准确描述代码变更。
2. commits 除必要的术语外，需使用中文描述。
3. 复杂变更（改动 ≥3 个代码文件）的提交信息必须带 change-id：`change/<YYYYMMDD-主题>`，供 `commit-msg` 钩子机器校验。
