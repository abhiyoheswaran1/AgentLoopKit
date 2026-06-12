import path from 'node:path';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { CLI_PROCESS_TIMEOUT_MS, makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createTaskArchiveFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  return { dir };
}

async function writeTask(dir: string, fileName: string, title: string, status: string) {
  const taskPath = path.join(dir, '.agentloop/tasks', fileName);
  await writeFile(taskPath, `# ${title}\n\n- Status: ${status}\n`);
  return taskPath;
}

describe('task archive command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('dry-runs bulk archive by status without moving task contracts', async () => {
    const { dir } = await createTaskArchiveFixture();
    await writeTask(dir, '2026-06-12-first.md', 'First done task', 'done');
    await writeTask(dir, '2026-06-12-second.md', 'Second done task', 'done');
    await writeTask(dir, '2026-06-12-active.md', 'Active task', 'in-progress');

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '--status', 'done', '--dry-run', '--json'],
      { cwd: dir, timeout: CLI_PROCESS_TIMEOUT_MS },
    );

    const output = JSON.parse(result.stdout);
    expect(output.taskArchive).toMatchObject({
      mode: 'bulk',
      status: 'done',
      dryRun: true,
      count: 2,
    });
    expect(output.taskArchive.tasks.map((task: { title: string }) => task.title)).toEqual([
      'First done task',
      'Second done task',
    ]);
    expect(output.taskArchive.tasks.map((task: { path: string }) => task.path)).toEqual([
      '.agentloop/tasks/archive/2026-06-12-first.md',
      '.agentloop/tasks/archive/2026-06-12-second.md',
    ]);
    await expect(stat(path.join(dir, '.agentloop/tasks/2026-06-12-first.md'))).resolves.toBeTruthy();
    await expect(stat(path.join(dir, '.agentloop/tasks/2026-06-12-second.md'))).resolves.toBeTruthy();
    await expect(stat(path.join(dir, '.agentloop/tasks/archive/2026-06-12-first.md'))).rejects.toThrow();
  });

  test('bulk archives task contracts by status and leaves other statuses active', async () => {
    const { dir } = await createTaskArchiveFixture();
    await writeTask(dir, '2026-06-12-first.md', 'First done task', 'done');
    await writeTask(dir, '2026-06-12-second.md', 'Second done task', 'done');
    await writeTask(dir, '2026-06-12-deferred.md', 'Deferred task', 'deferred');
    await writeTask(dir, '2026-06-12-active.md', 'Active task', 'in-progress');

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '--status', 'done', '--json'],
      { cwd: dir, timeout: CLI_PROCESS_TIMEOUT_MS },
    );

    const output = JSON.parse(result.stdout);
    expect(output.taskArchive).toMatchObject({
      mode: 'bulk',
      status: 'done',
      dryRun: false,
      count: 2,
    });
    await expect(stat(path.join(dir, '.agentloop/tasks/2026-06-12-first.md'))).rejects.toThrow();
    await expect(stat(path.join(dir, '.agentloop/tasks/2026-06-12-second.md'))).rejects.toThrow();
    await expect(
      readFile(path.join(dir, '.agentloop/tasks/archive/2026-06-12-first.md'), 'utf8'),
    ).resolves.toBe('# First done task\n\n- Status: done\n');
    await expect(
      readFile(path.join(dir, '.agentloop/tasks/archive/2026-06-12-second.md'), 'utf8'),
    ).resolves.toBe('# Second done task\n\n- Status: done\n');
    await expect(stat(path.join(dir, '.agentloop/tasks/2026-06-12-deferred.md'))).resolves.toBeTruthy();
    await expect(stat(path.join(dir, '.agentloop/tasks/2026-06-12-active.md'))).resolves.toBeTruthy();
  });

  test('requires either a task path or a bulk status', async () => {
    const { dir } = await createTaskArchiveFixture();

    const result = await execa(tsxPath, [cliPath, 'task', 'archive', '--json'], {
      cwd: dir,
      reject: false,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'TASK_ARCHIVE_TARGET_REQUIRED',
      },
    });
  });

  test('rejects unsupported or parked bulk archive statuses', async () => {
    const { dir } = await createTaskArchiveFixture();

    const unsupported = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '--status', 'waiting', '--json'],
      { cwd: dir, reject: false, timeout: CLI_PROCESS_TIMEOUT_MS },
    );
    expect(unsupported.exitCode).toBe(1);
    expect(JSON.parse(unsupported.stdout)).toMatchObject({
      error: {
        code: 'UNSUPPORTED_TASK_STATUS',
        requestedStatus: 'waiting',
      },
    });

    const deferred = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '--status', 'deferred', '--json'],
      { cwd: dir, reject: false, timeout: CLI_PROCESS_TIMEOUT_MS },
    );
    expect(deferred.exitCode).toBe(1);
    expect(JSON.parse(deferred.stdout)).toMatchObject({
      error: {
        code: 'TASK_ARCHIVE_STATUS_NOT_TERMINAL',
        requestedStatus: 'deferred',
      },
    });
  });
});
