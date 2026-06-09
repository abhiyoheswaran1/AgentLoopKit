import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { initializeAgentLoop } from '../src/core/init.js';
import { runDoctor } from '../src/core/doctor.js';

let tempDirs: string[] = [];

describe('doctor', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('reports healthy initialized setup', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });

    const result = await runDoctor({ cwd: dir });

    expect(result.serious).toHaveLength(0);
    expect(result.checks.some((check) => check.name === 'AGENTLOOP.md')).toBe(true);
    expect(result.markdown).toContain('AgentLoopKit Doctor');
  });

  test('flags invalid config as serious', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await import('node:fs/promises').then(({ writeFile }) =>
      writeFile(path.join(dir, 'agentloop.config.json'), '{"version": 2}'),
    );

    const result = await runDoctor({ cwd: dir });

    expect(result.serious.some((check) => check.name === 'agentloop.config.json')).toBe(true);
  });

  test('warns when common monorepo markers are present', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
    await writeFile(path.join(dir, 'turbo.json'), '{}');

    const result = await runDoctor({ cwd: dir });
    const monorepoCheck = result.checks.find((check) => check.name === 'Monorepo');
    const expectedMessage =
      'workspace markers detected: pnpm-workspace.yaml, turbo.json. Root checks may not cover every package; add package-specific verification commands to the task contract, such as pnpm --filter <package> test, npm --workspace <package> test, or cd packages/<name> && npm test. AgentLoopKit does not run workspace commands automatically.';

    expect(result.serious).toHaveLength(0);
    expect(monorepoCheck).toEqual({
      name: 'Monorepo',
      status: 'warn',
      message: expectedMessage,
    });
    expect(result.markdown).toContain(`[warn] Monorepo: ${expectedMessage}`);
  });
});
