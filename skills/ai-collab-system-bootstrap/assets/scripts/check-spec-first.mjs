#!/usr/bin/env node
/**
 * spec-first 机器校验（闸门硬化）
 *
 * 触发条件：本次提交改动的「代码文件」（排除文档/文案/测试/构建配置等低风险文件后）>= 3，
 * 且提交信息不含 change-id（change/<YYYYMMDD-主题> 或 change-id: <YYYYMMDD-主题>）→ 拦截。
 *
 * 逃生舱：确认改动简单后，可用 git commit --no-verify 跳过（知情选择，非默认路径）。
 * 完整规则见 .agents/rules/spec-first.md。
 *
 * 安装：复制到项目 scripts/ 目录，由 .husky/commit-msg 调用：
 *   node scripts/check-spec-first.mjs "$1"
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const commitMsgFile = process.argv[2]
if (!commitMsgFile) process.exit(0)

const message = readFileSync(commitMsgFile, 'utf8')

// 豁免：merge / revert 提交
if (/^merge |^revert /i.test(message)) process.exit(0)

// 放行：提交信息含 change-id（change/20260811-xxx 或 change-id: 20260811-xxx）
if (/change(?:[-_ ]?id)?[\s:=/-]*\d{8}-[a-z0-9-]+/i.test(message)) process.exit(0)

// 收集暂存区改动文件（本次提交内容）
const files = execSync('git diff --cached --name-only --diff-filter=ACM', {
    encoding: 'utf8'
})
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

// 排除低风险文件，控制误报：按目标项目实际情况调整本列表
const EXCLUDE = [
    /^doc\//, // 项目文档
    /\.md$/, // 所有 md
    /^{{LOCALE_DIR}}\//, // 文案目录，如 src/locale/（bootstrap 时替换占位符）
    /\.test\.[jt]s$/, // 测试
    /\.spec\.[jt]s$/,
    /^(pnpm-lock\.yaml|package-lock\.json|yarn\.lock|Cargo\.lock|go\.sum)$/,
    /^package\.json$/,
    /^\.github\//, // CI 配置
    /^\.agents\// // AI 协作资产，非产品代码
]
const effective = files.filter((f) => !EXCLUDE.some((re) => re.test(f)))

if (effective.length >= 3) {
    console.error(
        `\n[spec-first 闸门] 本次提交改动 ${effective.length} 个代码文件（已排除文档/文案/测试），触发规范先行：`
    )
    console.error(
        '  复杂变更须先在 doc/changes/<change-id>/ 产出 proposal/design/tasks 三层文档并等确认。'
    )
    console.error(
        '  提交信息需含 change-id，例如：feat(<scope>): xxx (change/20260811-xxx)'
    )
    console.error(
        '  若确属简单改动，请核对改动范围；确需跳过请在知情后使用 git commit --no-verify。'
    )
    process.exit(1)
}
