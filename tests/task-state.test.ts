import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import {
  clearActiveTask,
  getActiveTaskPath,
  setActiveTask,
} from '../src/core/task-state.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createTaskStateFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-09-demo.md');
  await writeFile(taskPath, '# Demo task\n\n- Status: proposed\n');
  return { dir, config, taskPath };
}

describe('task state', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('sets, reads, and clears an active task path', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();

    const active = await setActiveTask({ cwd: dir, config, taskPath });

    expect(active.path).toBe('.agentloop/tasks/2026-06-09-demo.md');
    expect(await getActiveTaskPath({ cwd: dir, config })).toBe(taskPath);
    const state = JSON.parse(await readFile(path.join(dir, '.agentloop/state.json'), 'utf8'));
    expect(state).toEqual({
      version: 1,
      activeTaskPath: '.agentloop/tasks/2026-06-09-demo.md',
    });

    await clearActiveTask({ cwd: dir, config });

    expect(await getActiveTaskPath({ cwd: dir, config })).toBeUndefined();
  });

  test('rejects active task paths outside the configured task directory', async () => {
    const { dir, config } = await createTaskStateFixture();
    const outsideTask = path.join(dir, 'notes.md');
    await writeFile(outsideTask, '# Notes\n');

    await expect(setActiveTask({ cwd: dir, config, taskPath: outsideTask })).rejects.toThrow(
      'inside .agentloop/tasks',
    );
  });
});

describe('task command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('sets, prints, and clears the active task from the CLI', async () => {
    const { dir } = await createTaskStateFixture();

    const setResult = await execa(
      tsxPath,
      [cliPath, 'task', 'set', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
      { cwd: dir },
    );
    expect(JSON.parse(setResult.stdout)).toMatchObject({
      activeTask: {
        path: '.agentloop/tasks/2026-06-09-demo.md',
        title: 'Demo task',
        status: 'proposed',
      },
    });

    const currentResult = await execa(tsxPath, [cliPath, 'task', 'current', '--json'], {
      cwd: dir,
    });
    expect(JSON.parse(currentResult.stdout)).toMatchObject({
      activeTask: {
        path: '.agentloop/tasks/2026-06-09-demo.md',
        title: 'Demo task',
      },
    });

    const clearResult = await execa(tsxPath, [cliPath, 'task', 'clear', '--json'], { cwd: dir });
    expect(JSON.parse(clearResult.stdout)).toEqual({ activeTask: null });

    const emptyResult = await execa(tsxPath, [cliPath, 'task', 'current', '--json'], {
      cwd: dir,
    });
    expect(JSON.parse(emptyResult.stdout)).toEqual({ activeTask: null });
  });
});
