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
  bun - Bun runtime and toolkit
  nextjs - Next.js React framework
  pinia - Vue state management
  react - React library
  vue-best-practices - Vue.js best practices
  vue-router-best-practices - Vue Router best practices
  vue-testing-best-practices - Vue testing best practices
  zustand - Zustand state management
  unocss - UnoCSS atomic CSS engine
  ...

Total: 15 skills
```

### Add Skills (Interactive)

Add skills to current directory via interactive selection:

```bash
skill-kit add
```

You'll see a multi-select interface:

```
Select skills to add:

  bun
  nextjs
  pinia
  react
  vue-best-practices
  vue-router-best-practices
  vue-testing-best-practices
  zustand
  unocss

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

This collection contains skills for various modern web development tech stacks:

| Skill                                                                  | Description                                             | Reference Files |
| ---------------------------------------------------------------------- | ------------------------------------------------------- | --------------- |
| [bun](skills/bun/skill.md)                                             | Bun runtime and toolkit                                 | 6               |
| [nextjs](skills/nextjs/skill.md)                                       | Next.js React framework                                 | 8               |
| [pinia](skills/pinia/skill.md)                                         | Vue state management                                    | 25              |
| [react](skills/react/skill.md)                                         | React library                                           | 3               |
| [vue](skills/vue/skill.md)                                             | Vue.js core                                             | 3               |
| [vue-best-practices](skills/vue-best-practices/skill.md)               | Vue 3 + TypeScript best practices                       | 100+            |
| [vue-router-best-practices](skills/vue-router-best-practices/skill.md) | Vue Router best practices                               | 7               |
| [zustand](skills/zustand/skill.md)                                     | Zustand state management                                | 5               |
| [unocss](skills/unocss/skill.md)                                       | UnoCSS atomic CSS engine                                | 3               |
| [react-best-practices](skills/react-best-practices/skill.md)           | React best practices                                    | 60+             |
| [belos-street](skills/belos-street/skill.md)                           | Belos Street coding conventions                         | 4               |
| [frontend-design](skills/frontend-design/skill.md)                     | Frontend design principles and best practices           | 6               |
| [ui-templates](skills/ui-templates/skill.md)                           | Collection of distinctive UI design templates           | 5               |
| [ant-design-vue](skills/ant-design-vue/skill.md)                       | Ant Design Vue component library                        | 15              |
| [golang-best-practices](skills/golang-best-practices/skill.md)         | Go best practices and patterns                          | 37              |
| [langchain](skills/langchain/skill.md)                                 | LangChain framework for AI agents                       | 12              |
| [rag](skills/rag/SKILL.md)                                             | General RAG methodology (9 modules, iKnow-based)        | 10              |
| [vibe-flow](skills/vibe-flow/skill.md)                                 | Independent developer Vibe Coding full-process workflow | 14              |
| [fastify-best-practices](skills/fastify-best-practices/SKILL.md)       | Fastify Node.js backend best practices                  | 19              |
| [nestjs-best-practices](skills/nestjs-best-practices/SKILL.md)         | NestJS architecture and best practices                  | 40              |
| [react-native-skills](skills/react-native-skills/SKILL.md)             | React Native & Expo mobile development best practices   | 38              |
| [grill-me](skills/grill-me/SKILL.md)                                   | Layered requirement clarification for vague requirements | 2               |

### Skill Categories

**Vue Ecosystem**

- [vue](skills/vue/skill.md) - Vue.js core
- [pinia](skills/pinia/skill.md) - State management
- [vue-best-practices](skills/vue-best-practices/skill.md) - Best practices
- [vue-router-best-practices](skills/vue-router-best-practices/skill.md) - Router best practices
- [vue-testing-best-practices](skills/vue-testing-best-practices/skill.md) - Testing best practices

**React Ecosystem**

- [react](skills/react/skill.md) - React library
- [react-best-practices](skills/react-best-practices/skill.md) - Best practices
- [nextjs](skills/nextjs/skill.md) - Next.js framework
- [zustand](skills/zustand/skill.md) - Zustand state management

**Mobile Development**

- [react-native-skills](skills/react-native-skills/SKILL.md) - React Native & Expo mobile development best practices

**Tooling**

- [bun](skills/bun/skill.md) - Bun runtime
- [unocss](skills/unocss/skill.md) - Atomic CSS engine

**Design & UI**

- [frontend-design](skills/frontend-design/skill.md) - Frontend design principles and best practices
- [ui-templates](skills/ui-templates/skill.md) - Collection of distinctive UI design templates
- [ant-design-vue](skills/ant-design-vue/skill.md) - Ant Design Vue component library

**Coding Conventions**

- [belos-street](skills/belos-street/skill.md) - Belos Street coding conventions (includes LLM coding guidelines)

**AI & LLM**

- [langchain](skills/langchain/skill.md) - LangChain framework for building AI agents
- [rag](skills/rag/SKILL.md) - General RAG methodology (loading/ingestion/query/retrieval/rerank/generation/multi-turn/GraphRAG/evaluation, based on iKnow ASE 2025)

**Workflow & Process**

- [vibe-flow](skills/vibe-flow/skill.md) - Independent developer Vibe Coding full-process workflow
- [grill-me](skills/grill-me/SKILL.md) - Layered requirement clarification for vague requirements

**Languages & Runtimes**

- [golang-best-practices](skills/golang-best-practices/skill.md) - Go best practices and WebAssembly

**Backend Frameworks**

- [fastify-best-practices](skills/fastify-best-practices/SKILL.md) - Fastify Node.js backend best practices
- [nestjs-best-practices](skills/nestjs-best-practices/SKILL.md) - NestJS architecture and best practices

**Superpowers (AI-Assisted Development Workflows)**

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
│   └── reference/            # Reference documents
│       ├── basics.md
│       ├── advanced.md
│       └── ...
```

### skill.md Format

The `skill.md` file contains metadata and documentation:

````yaml
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
├── skills/                 # Built-in skills
│   ├── superpowers/        # Integrated from obra/superpowers
│   │   ├── brainstorming/
│   │   ├── writing-plans/
│   │   ├── executing-plans/
│   │   └── ... (14 skills total)
│   ├── bun/
│   ├── nextjs/
│   ├── pinia/
│   ├── react/
│   └── ... (20+ other skills)
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

**Note:** These skills are stored in a subdirectory and are not automatically scanned by the `skill-kit` CLI. They are intended for direct reference and integration into your AI agent's workflow.

## Acknowledgments

- Inspired by [antfu/skills](https://github.com/antfu/skills)
- Superpowers skills integrated from [obra/superpowers](https://github.com/obra/superpowers)

