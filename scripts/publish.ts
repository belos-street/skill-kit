#!/usr/bin/env bun

import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const token = readFileSync('./.env', 'utf-8')
  .split('\n')
  .find((line) => line.startsWith('npm_token='))
  ?.split('=')[1]
  ?.trim()

if (!token) {
  console.error('❌ npm_token not found in .env')
  process.exit(1)
}

console.log('🔑 Setting npm token...')
execSync(`npm config set //registry.npmjs.org/:_authToken=${token}`, {
  stdio: 'pipe'
})

console.log('📦 Publishing to npm...')
execSync('npm publish --access public', { stdio: 'inherit' })
