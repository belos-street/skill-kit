import { getSkillByName } from '../skill/index'
import { copyDir, fileExists, ensureDir } from '../fs/index'
import { join } from 'path'

export interface AddOptions {
  skills: string[]
  targetDir: string
}

export interface AddResult {
  skillName: string
  status: 'added' | 'skipped' | 'failed'
  error?: string
}

export async function addSkills(options: AddOptions): Promise<AddResult[]> {
  const { skills: skillNames, targetDir } = options
  const results: AddResult[] = []

  for (const skillName of skillNames) {
    const skill = await getSkillByName(skillName)

    if (!skill) {
      results.push({
        skillName,
        status: 'failed',
        error: 'Skill not found'
      })
      continue
    }

    const destPath = join(targetDir, 'skills', skill.name)

    if (fileExists(destPath)) {
      results.push({
        skillName: skill.name,
        status: 'skipped'
      })
      continue
    }

    try {
      ensureDir(join(targetDir, 'skills'))
      copyDir(skill.path, destPath)
      results.push({
        skillName: skill.name,
        status: 'added'
      })
    } catch (error) {
      results.push({
        skillName: skill.name,
        status: 'failed',
        error: String(error)
      })
    }
  }

  return results
}

export async function addSkill(
  skillName: string,
  targetDir: string
): Promise<AddResult> {
  const results = await addSkills({
    skills: [skillName],
    targetDir
  })
  return (
    results[0] ?? {
      skillName,
      status: 'failed' as const,
      error: 'Unknown error'
    }
  )
}
