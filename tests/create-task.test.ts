import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');

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
      'npx',
      [
        'tsx',
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
    expect(markdown).toContain('- First criterion is preserved');
    expect(markdown).toContain('- Second criterion is preserved');
    expect(markdown).toContain('- pnpm test');
    expect(markdown).toContain('- pnpm build');
  });
});
