import path from 'node:path';
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
});
