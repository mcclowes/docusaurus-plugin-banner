import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const repository = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(readFileSync(join(repository, 'package.json'), 'utf8')) as {
  scripts: Record<string, string>
}
const commands = ['start', 'build', 'serve', 'clear']
const scenarios = commands.flatMap((command) => [
  { command, arguments: [] as string[], name: 'default arguments' },
  {
    command,
    arguments: ['--port', '4100', '--out-dir', 'output with spaces'],
    name: 'forwarded flags and spaces',
  },
])

describe('example helpers', () => {
  it.each(scenarios)(
    '$command preserves $name through both npm layers',
    ({ command, arguments: args }) => {
      const directory = realpathSync(mkdtempSync(join(tmpdir(), 'banner example ')))
      try {
        const example = join(directory, 'examples/docusaurus-v3')
        const record = join(directory, 'record.json')
        mkdirSync(example, { recursive: true })
        writeFileSync(
          join(directory, 'package.json'),
          JSON.stringify({
            scripts: { [`example:${command}`]: manifest.scripts[`example:${command}`] },
          })
        )
        writeFileSync(
          join(example, 'package.json'),
          JSON.stringify({ scripts: { [command]: 'node record.mjs' } })
        )
        writeFileSync(
          join(example, 'record.mjs'),
          `import { writeFileSync } from 'node:fs';
writeFileSync(${JSON.stringify(record)}, JSON.stringify({ cwd: process.cwd(), args: process.argv.slice(2) }));`
        )
        execFileSync('npm', ['run', `example:${command}`, '--', ...args], {
          cwd: directory,
          timeout: 15_000,
          stdio: 'pipe',
        })

        expect(JSON.parse(readFileSync(record, 'utf8'))).toEqual({ cwd: example, args })
      } finally {
        rmSync(directory, { recursive: true, force: true })
      }
    }
  )
})
