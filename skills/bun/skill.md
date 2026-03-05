---
name: bun
title: Bun Runtime
description: Fast, modern JavaScript runtime and toolkit
icon: 🥟
tags: [javascript, runtime, bun, performance]
---

# Bun Runtime

Bun is a fast JavaScript runtime, package manager, bundler, and test runner, all in one. It's designed to be a drop-in replacement for Node.js with significantly better performance.

## Quick Start

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Or using npm
npm install -g bun

# Run a file
bun run index.ts

# Install dependencies
bun install

# Run tests
bun test
```

## Key Features

- **Fast**: 3x faster than Node.js for startup and execution
- **Native TypeScript**: Runs TypeScript files directly without compilation
- **Built-in Tools**: Package manager, bundler, test runner included
- **Node.js Compatible**: Drop-in replacement for most Node.js apps
- **Web APIs**: Built-in fetch, WebSocket, and other web standards
- **SQLite**: Built-in database support

## CLI Tools

- Build CLI tools with Bun → See [cli-tools](reference/cli-tools.md)

## Basic Usage

```ts
// index.ts
console.log('Hello from Bun!')

const response = await fetch('https://api.example.com/data')
const data = await response.json()
console.log(data)
```

```bash
bun run index.ts
```

## Common Patterns

### Running TypeScript

```ts
// app.ts
interface User {
  id: number
  name: string
}

const user: User = { id: 1, name: 'John' }
console.log(user)
```

```bash
bun run app.ts
```

### HTTP Server

```ts
Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response('Hello World!')
  }
})
```

### File Operations

```ts
const file = Bun.file('data.txt')
const text = await file.text()

await Bun.write('output.txt', 'Hello Bun!')
```

## Best Practices

1. **Use TypeScript**: Leverage native TypeScript support
2. **Use bun install**: Faster than npm/yarn
3. **Use built-in tools**: No need for external dependencies
4. **Test with bun test**: Fast and simple testing
5. **Use Bun APIs**: Native APIs are faster

## Resources

- [Official Documentation](https://bun.sh/docs)
- [GitHub Repository](https://github.com/oven-sh/bun)
- [Bun vs Node.js](https://bun.sh/docs/runtime/bun-vs-node)
