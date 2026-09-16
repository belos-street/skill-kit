# @belos-street/skill-kit

> CLI tool for managing AI Agent skill documentation - generate agents and skill directories

## About

`skill-kit` is a CLI tool that helps you manage and organize AI Agent skill documentation. It provides an interactive interface to browse, select, and install skills into your project, automatically generating necessary configuration files.

## Features

- Interactive multi-select skill selection
- Auto-generate `agents.md` configuration file
- List and view detailed skill information
- Built with Bun for fast TypeScript execution
- Duplicate detection and smart conflict resolution
- Colorful terminal output for better UX

## Installation

### Global Installation

```bash
npm install -g @belos-street/skill-kit

or

pnpm add -g @belos-street/skill-kit
```

### Using npx

```bash
npx @belos-street/skill-kit

or

pnpx @belos-street/skill-kit 
```

## Usage

### List Available Skills

View all available skills with descriptions:

```bash
skill-kit list
```

Output example:

```
Available skills:
  ant-design-vue - Ant Design Vue component library
  belos-street - Belos Street coding conventions
  bun - Bun runtime and toolkit
  fastify-best-practices - Fastify Node.js backend best practices
  nextjs - Next.js React framework
  rag - General RAG methodology
  react - React library
  superpowers - AI-assisted development workflows
  vue-best-practices - Vue 3 + TypeScript best practices
  ...

Total: 24 skills
```

### Add Skills (Interactive)

Add skills to current directory via interactive selection:

```bash
skill-kit add
```

You'll see a multi-select interface:

```
Select skills to add:

  ant-design-vue
  belos-street
  bun
  rag
  react
  superpowers
  vue-best-practices
  ...

Hint: Space to select, Enter to confirm
```

After selection, the tool will:

1. Generate selected skills to `./skills/` directory
2. Generate `agents.md` configuration file
3. Show add/skip summary

Output example:

```
Copying skills...

  bun: added
  nextjs: added
  pinia: added

Done! 3 added, 0 skipped

Generating agents.md...
agents.md generated!
```

### View Skill Info

Get detailed information about a specific skill:

```bash
skill-kit info <skill-name>

Example:
skill-kit info nextjs

Output:
nextjs

Description: Next.js React framework
Path: /path/to/skills/nextjs
References: 8 files

--- Frontmatter ---
  name: nextjs
  title: Next.js
  tags: react, framework, ssr
```

## Available Skills

### Built-in Skills

This collection contains 24 skills covering web frontend/backend, mobile, AI, and AI-assisted development workflows:

| Skill                                                                  | Description                                                  | Docs        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ | ----------- |
| [ant-design-vue](skills/ant-design-vue/skill.md)                       | Ant Design Vue component library                             | 17          |
| [ai-collab-system-bootstrap](skills/ai-collab-system-bootstrap/skill.md) | Bootstrap AI collaboration system: AGENTS.md + .agents rules/workflows + doc layers + machine-gated verification | 4           |
| [belos-street](skills/belos-street/skill.md)                           | Personal coding conventions, code review & project evaluation | 12          |
| [bun](skills/bun/skill.md)                                             | Bun runtime and toolkit                                      | 6           |
| [fastify-best-practices](skills/fastify-best-practices/SKILL.md)       | Fastify Node.js backend best practices                       | 19          |
| [frontend-design](skills/frontend-design/skill.md)                     | Frontend design principles and best practices                | 6           |
| [golang-best-practices](skills/golang-best-practices/skill.md)         | Go best practices and patterns                               | 37          |
| [grill-me](skills/grill-me/SKILL.md)                                   | Layered requirement clarification for vague requirements     | 2           |
| [langchain](skills/langchain/skill.md)                                 | LangChain framework for AI agents                            | 12          |
| [nestjs-best-practices](skills/nestjs-best-practices/SKILL.md)         | NestJS architecture and best practices                       | 42          |
| [nextjs](skills/nextjs/skill.md)                                       | Next.js React framework                                      | 9           |
| [pinia](skills/pinia/skill.md)                                         | Vue state management                                         | 33          |
| [rag](skills/rag/skill.md)                                             | General RAG methodology (9 modules, based on iKnow ASE 2025) | 10          |
| [react](skills/react/skill.md)                                         | React library                                                | 3           |
| [react-best-practices](skills/react-best-practices/skill.md)           | React best practices                                         | 62          |
| [react-native-skills](skills/react-native-skills/SKILL.md)             | React Native & Expo mobile development best practices        | 38          |
| [superpowers](skills/superpowers/skill.md)                             | AI-assisted development workflows (collection of 14 sub-skills) | 14 sub-skills |
| [ui-templates](skills/ui-templates/skill.md)                           | Collection of distinctive UI design templates                | 30          |
| [unocss](skills/unocss/skill.md)                                       | UnoCSS atomic CSS engine                                     | 3           |
| [vibe-flow](skills/vibe-flow/skill.md)                                 | Independent developer Vibe Coding full-process workflow      | 14          |
| [vue](skills/vue/skill.md)                                             | Vue.js core                                                  | 3           |
| [vue-best-practices](skills/vue-best-practices/skill.md)               | Vue 3 + TypeScript best practices                            | 180         |
| [vue-router-best-practices](skills/vue-router-best-practices/skill.md) | Vue Router best practices                                    | 8           |
| [zustand](skills/zustand/skill.md)                                     | Zustand state management                                     | 5           |

### Skill Categories

**Vue Ecosystem**

- [vue](skills/vue/skill.md) - Vue.js core
- [pinia](skills/pinia/skill.md) - State management
- [vue-best-practices](skills/vue-best-practices/skill.md) - Best practices
- [vue-router-best-practices](skills/vue-router-best-practices/skill.md) - Router best practices
- [ant-design-vue](skills/ant-design-vue/skill.md) - Ant Design Vue component library

**React Ecosystem**

- [react](skills/react/skill.md) - React library
- [react-best-practices](skills/react-best-practices/skill.md) - Best practices
- [nextjs](skills/nextjs/skill.md) - Next.js framework
- [zustand](skills/zustand/skill.md) - Zustand state management

**Mobile Development**

- [react-native-skills](skills/react-native-skills/SKILL.md) - React Native & Expo mobile development best practices

**Backend Frameworks**

- [fastify-best-practices](skills/fastify-best-practices/SKILL.md) - Fastify Node.js backend best practices
- [nestjs-best-practices](skills/nestjs-best-practices/SKILL.md) - NestJS architecture and best practices

**Languages & Runtimes**

- [golang-best-practices](skills/golang-best-practices/skill.md) - Go best practices and WebAssembly
- [bun](skills/bun/skill.md) - Bun runtime

**Tooling**

- [unocss](skills/unocss/skill.md) - Atomic CSS engine

**Design & UI**

- [frontend-design](skills/frontend-design/skill.md) - Frontend design principles and best practices
- [ui-templates](skills/ui-templates/skill.md) - Collection of distinctive UI design templates

**Coding Conventions & Review**

- [belos-street](skills/belos-street/skill.md) - Personal coding conventions, including LLM coding guidelines, multi-dimensional code review, and project evaluation

**AI & LLM**

- [langchain](skills/langchain/skill.md) - LangChain framework for building AI agents
- [rag](skills/rag/skill.md) - General RAG methodology (loading/ingestion/query/retrieval/rerank/generation/multi-turn/GraphRAG/evaluation, based on iKnow ASE 2025)

**Workflow & Process**

- [ai-collab-system-bootstrap](skills/ai-collab-system-bootstrap/skill.md) - Bootstrap AI collaboration system: AGENTS.md + .agents rules/workflows + doc layers + machine-gated verification
- [vibe-flow](skills/vibe-flow/skill.md) - Independent developer Vibe Coding full-process workflow
- [grill-me](skills/grill-me/SKILL.md) - Layered requirement clarification for vague requirements

**Superpowers (AI-Assisted Development Workflows)**

- [superpowers](skills/superpowers/skill.md) - Collection overview
- [brainstorming](skills/superpowers/brainstorming/SKILL.md) - Design exploration before implementation
- [writing-plans](skills/superpowers/writing-plans/SKILL.md) - Implementation plan creation
- [executing-plans](skills/superpowers/executing-plans/SKILL.md) - Execute plans with review checkpoints
- [dispatching-parallel-agents](skills/superpowers/dispatching-parallel-agents/SKILL.md) - Parallel task execution
- [subagent-driven-development](skills/superpowers/subagent-driven-development/SKILL.md) - Subagent-based development
- [systematic-debugging](skills/superpowers/systematic-debugging/SKILL.md) - Systematic debugging approach
- [test-driven-development](skills/superpowers/test-driven-development/SKILL.md) - TDD methodology
- [receiving-code-review](skills/superpowers/receiving-code-review/SKILL.md) - Handling code review feedback
- [requesting-code-review](skills/superpowers/requesting-code-review/SKILL.md) - Requesting code reviews
- [finishing-a-development-branch](skills/superpowers/finishing-a-development-branch/SKILL.md) - Branch completion workflow
- [verification-before-completion](skills/superpowers/verification-before-completion/SKILL.md) - Pre-completion verification
- [using-superpowers](skills/superpowers/using-superpowers/SKILL.md) - Skill discovery and usage
- [using-git-worktrees](skills/superpowers/using-git-worktrees/SKILL.md) - Git worktree management
- [writing-skills](skills/superpowers/writing-skills/SKILL.md) - Skill creation and editing

## Skill Structure

Each skill follows this structure:

```
skills/
├── <skill-name>/
│   ├── skill.md              # Main skill file with metadata
│   └── reference/            # Reference documents (naming varies: reference/ | references/ | rules/)
│       ├── basics.md
│       ├── advanced.md
│       └── ...
```

### skill.md Format

The `skill.md` file contains metadata and documentation:

````markdown
---
name: skill-name
title: Skill Title
description: Brief description of what this skill covers
tags: tag1, tag2, tag3
---

# Skill Title

Detailed documentation and best practices...

## Core Concepts

- Concept 1
- Concept 2

## Usage Examples

```typescript
// Example code
```
````

## Project Structure

```
skill-kit/
├── lib/
│   ├── cli/                 # Command line interface
│   │   └── index.ts        # CLI commands (list, add, info)
│   ├── fs/                 # File system utilities
│   │   └── index.ts        # Copy, read, write operations
│   ├── generator/          # Skill generator
│   │   └── index.ts        # Add skills to directory
│   ├── logger/             # Logging utilities
│   │   └── index.ts        # Colorful console output
│   ├── skill/              # Skill management
│   │   └── index.ts        # Read and parse skills
│   └── template/           # Template generator
│       └── index.ts        # Generate agents.md
├── scripts/
│   └── publish.ts          # Publish script
├── skills/                 # Built-in skills (23 top-level skills)
│   ├── superpowers/        # Integrated from obra/superpowers (14 sub-skills)
│   ├── bun/
│   ├── nextjs/
│   ├── pinia/
│   ├── react/
│   └── ... (23 other skills)
├── index.ts                # Entry point
├── package.json
└── README.md
```

### Project Commands

```bash
# List all skills
bun run ./index.ts list

# Interactive add skills
bun run ./index.ts add

# View skill info
bun run ./index.ts info <skill-name>
```

**Note:** The CLI scans top-level directories under `skills/` and reads each lowercase `skill.md`. The 14 sub-skills inside `superpowers/` are managed as part of the `superpowers` collection and are not listed individually by the CLI.

## Acknowledgments

- Inspired by [antfu/skills](https://github.com/antfu/skills)
- Superpowers skills integrated from [obra/superpowers](https://github.com/obra/superpowers)
