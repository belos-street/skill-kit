import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export interface Skill {
  name: string
  description: string
  path: string
  referenceCount: number
  frontmatter: Record<string, string>
}

function parseFrontmatter(content: string): Record<string, string> {
  const frontmatter: Record<string, string> = {}

  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match || !match[1]) return frontmatter

  const lines = match[1].split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()

    if (key && value) {
      frontmatter[key] = value
    }
  }

  return frontmatter
}

export async function getSkillsDir(): Promise<string> {
  const currentDir = import.meta.dir
  return join(currentDir, '..', '..', 'skills')
}

export async function getAllSkills(): Promise<Skill[]> {
  const skillsDir = await getSkillsDir()

  try {
    const entries = await readdir(skillsDir, { withFileTypes: true })
    const skills: Skill[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const skillPath = join(skillsDir, entry.name)
      const skillMdPath = join(skillPath, 'skill.md')

      let description = ''
      let frontmatter: Record<string, string> = {}
      try {
        const content = await readFile(skillMdPath, 'utf-8')
        const match = content.match(/description:\s*(.+)/)
        description = match?.[1] || ''
        frontmatter = parseFrontmatter(content)
      } catch {
        description = ''
        frontmatter = {}
      }

      let referenceCount = 0
      try {
        const referenceDir = join(skillPath, 'reference')
        const refEntries = await readdir(referenceDir)
        referenceCount = refEntries.filter((f) => f.endsWith('.md')).length
      } catch {
        referenceCount = 0
      }

      skills.push({
        name: entry.name,
        description,
        path: skillPath,
        referenceCount,
        frontmatter
      })
    }

    return skills.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error reading skills directory:', error)
    return []
  }
}

export async function getSkillByName(name: string): Promise<Skill | null> {
  const skills = await getAllSkills()
  return skills.find((s) => s.name === name) || null
}

export function getSkillNames(skills: Skill[]): string[] {
  return skills.map((s) => s.name)
}
