import { copyFileSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'fs'
import { join, dirname } from 'path'

export function copyDir(src: string, dest: string): void {
  if (!existsSync(src)) {
    throw new Error(`Source directory does not exist: ${src}`)
  }
  
  mkdirSync(dest, { recursive: true })
  
  const entries = readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

export function copyFile(src: string, dest: string): void {
  const destDir = dirname(dest)
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }
  copyFileSync(src, dest)
}

export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

export function fileExists(path: string): boolean {
  return existsSync(path)
}

export function readJsonFile<T>(path: string): T {
  const content = readFileSync(path, 'utf-8')
  return JSON.parse(content)
}

export function writeJsonFile(path: string, data: unknown): void {
  const content = JSON.stringify(data, null, 2)
  writeFileSync(path, content, 'utf-8')
}

export function removeDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
  }
}

export function isDirectory(path: string): boolean {
  try {
    return existsSync(path) && require('fs').statSync(path).isDirectory()
  } catch {
    return false
  }
}
