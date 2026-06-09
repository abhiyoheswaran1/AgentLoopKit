import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

describe('create-task command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('accumulates repeated non-interactive list options', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Repeated flags',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/repeated-flags.md',
        '--constraint',
        'Keep the current CLI shape',
        '--constraint',
        'Do not add dependencies',
        '--non-goal',
        'No prompt redesign',
        '--non-goal',
        'No task database',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--likely-file',
        'tests/create-task.test.ts',
        '--forbidden-file',
        'package.json',
        '--forbidden-file',
        'pnpm-lock.yaml',
        '--acceptance',
        'First criterion is preserved',
        '--acceptance',
        'Second criterion is preserved',
        '--verify-command',
        'pnpm test',
        '--verify-command',
        'pnpm build',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(path.join(dir, '.agentloop/tasks/repeated-flags.md'), 'utf8');
    expect(markdown).toContain('- Keep the current CLI shape');
    expect(markdown).toContain('- Do not add dependencies');
    expect(markdown).toContain('- No prompt redesign');
    expect(markdown).toContain('- No task database');
    expect(markdown).toContain('- src/cli/commands/create-task.ts');
    expect(markdown).toContain('- tests/create-task.test.ts');
    expect(markdown).toContain('- package.json');
    expect(markdown).toContain('- pnpm-lock.yaml');
    expect(markdown).toContain('- First criterion is preserved');
    expect(markdown).toContain('- Second criterion is preserved');
    expect(markdown).toContain('- pnpm test');
    expect(markdown).toContain('- pnpm build');
  });

  test('accepts task-contract field aliases in non-interactive mode', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Document npm OTP publish blocker',
        '--type',
        'docs',
        '--out',
        '.agentloop/tasks/npm-otp-blocker.md',
        '--problem-statement',
        'Local npm publish passed checks but stopped at EOTP authentication.',
        '--desired-outcome',
        'Release docs explain the safe publish paths.',
        '--assumption',
        'No OTP is available to the CLI session.',
        '--verification',
        'git diff --check',
        '--verification',
        'pnpm test',
        '--rollback',
        'Revert the docs-only update.',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(path.join(dir, '.agentloop/tasks/npm-otp-blocker.md'), 'utf8');
    expect(markdown).toContain(
      'Local npm publish passed checks but stopped at EOTP authentication.',
    );
    expect(markdown).toContain('Release docs explain the safe publish paths.');
    expect(markdown).toContain('- No OTP is available to the CLI session.');
    expect(markdown).toContain('- git diff --check');
    expect(markdown).toContain('- pnpm test');
    expect(markdown).toContain('Revert the docs-only update.');
  });

  test('prints created task details as JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    const resolvedDir = await realpath(dir);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'JSON output',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/json-output.md',
        '--acceptance',
        'JSON includes the created path',
        '--json',
      ],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      task: {
        path: path.join(resolvedDir, '.agentloop/tasks/json-output.md'),
        markdown: expect.stringContaining('# JSON output'),
      },
    });
    expect(result.stdout).not.toContain('Task contract created:');
  });
});
