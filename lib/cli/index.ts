import { Command } from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'
import { getAllSkills, getSkillByName } from '../skill/index'
import { logger } from '../logger/index'
import { addSkills } from '../generator/index'
import { generateAgentsMd } from '../template/index'
import { cwd } from 'process'

export class CLI {
  private program: Command

  constructor() {
    this.program = new Command()
    this.setup()
  }

  private setup() {
    this.program
      .name('skill-kit')
      .description('CLI tool for managing skill documentation')
      .version('1.0.0')

    this.program
      .command('list')
      .description('List all available skills')
      .action(async () => {
        const skills = await getAllSkills()

        if (skills.length === 0) {
          logger.warn('No skills found')
          return
        }

        logger.info('Available skills:')
        for (const skill of skills) {
          const desc = skill.description ? ` - ${skill.description}` : ''
          console.log('  ' + chalk.blue(skill.name), chalk.dim(desc))
        }

        logger.dim(`\nTotal: ${skills.length} skills`)
      })

    this.program
      .command('add')
      .description('Add skills to current directory (interactive selection)')
      .action(async () => {
        const skills = await getAllSkills()

        if (skills.length === 0) {
          logger.warn('No skills found')
          return
        }

        logger.info('Select skills to add:\n')

        const response = await prompts({
          type: 'multiselect',
          name: 'skills',
          message: 'Choose skills:',
          choices: skills.map((skill) => ({
            title: skill.name,
            value: skill.name,
            selected: false
          })),
          hint: '- Space to select, Enter to confirm'
        })

        if (!response.skills || response.skills.length === 0) {
          logger.warn('No skills selected')
          return
        }

        const currentDir = cwd()

        logger.info('\nCopying skills...\n')

        const results = await addSkills({
          skills: response.skills,
          targetDir: currentDir
        })

        let successCount = 0
        let skipCount = 0

        for (const result of results) {
          if (result.status === 'added') {
            logger.success(`  ${result.skillName}: added`)
            successCount++
          } else if (result.status === 'skipped') {
            logger.warn(`  ${result.skillName}: already exists, skipped`)
            skipCount++
          } else {
            logger.error(`  ${result.skillName}: failed - ${result.error}`)
          }
        }

        console.log()
        logger.success(`Done! ${successCount} added, ${skipCount} skipped`)

        if (successCount > 0) {
          logger.info('\nGenerating agents.md...')
          const addedSkills = results
            .filter((r) => r.status === 'added')
            .map((r) => r.skillName)

          const addedSkillObjects = await Promise.all(
            addedSkills.map((name) => getSkillByName(name))
          )

          await generateAgentsMd({
            skills: addedSkillObjects.filter(Boolean) as any,
            targetDir: currentDir
          })

          logger.success('agents.md generated!')
        }
      })

    this.program
      .command('info <skill>')
      .description('Show detailed information about a skill')
      .action(async (skillName: string) => {
        const skill = await getSkillByName(skillName)

        if (!skill) {
          logger.error(`Skill "${skillName}" not found`)
          return
        }

        console.log(`\n${chalk.bold.cyan(skill.name)}\n`)

        if (skill.description) {
          console.log(chalk.dim('Description:'), skill.description)
        }

        console.log(chalk.dim('Path:'), skill.path)
        console.log(chalk.dim('References:'), skill.referenceCount, 'files')

        if (skill.frontmatter && Object.keys(skill.frontmatter).length > 0) {
          console.log(chalk.dim('\n--- Frontmatter ---'))
          for (const [key, value] of Object.entries(skill.frontmatter)) {
            console.log(chalk.dim(`  ${key}:`), value)
          }
        }

        console.log()
      })
  }

  public run(args: string[] = process.argv) {
    this.program.parse(args)
  }
}
