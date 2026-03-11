import chalk from 'chalk'

export const logger = {
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message)
  },
  
  success(message: string): void {
    console.log(chalk.green('✓'), message)
  },
  
  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message)
  },
  
  error(message: string): void {
    console.log(chalk.red('✗'), message)
  },
  
  dim(message: string): void {
    console.log(chalk.dim(message))
  },
}

export function formatList(items: string[]): string {
  return items.map(item => `  - ${item}`).join('\n')
}

export function formatKeyValue(key: string, value: string): string {
  return `${chalk.dim(key)}: ${value}`
}
