import { spawnSync } from 'node:child_process'

const databaseUrl = process.env.DATABASE_URL ?? ''
const useAccelerate = databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+')

const cliArgs = ['prisma', 'generate']
if (useAccelerate) {
  cliArgs.push('--no-engine')
}

const packageManager = detectPackageRunner()

const result = spawnSync(packageManager, cliArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

function detectPackageRunner() {
  const execPath = process.env.npm_execpath ?? ''
  if (execPath.includes('bun')) {
    return 'bunx'
  }
  if (execPath.includes('pnpm')) {
    return 'pnpm'
  }
  if (execPath.includes('yarn')) {
    return 'yarn'
  }
  return 'npx'
}
