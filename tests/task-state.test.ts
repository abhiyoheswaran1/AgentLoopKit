import path from 'node:path';
import { lstat, mkdir, readFile, stat, symlink, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { inlineCode } from '../src/core/markdown-format.js';
import {
  archiveTask,
  clearActiveTask,
  getActiveTaskPath,
  listTasks,
  readTaskContract,
  setActiveTask,
  updateTaskStatus,
} from '../src/core/task-state.js';
import { CLI_PROCESS_TIMEOUT_MS, makeTempDir, removeTempDir, writeJson } from './helpers.js';

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

  test('lists task contracts with active task first', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    const secondTask = path.join(dir, '.agentloop/tasks/2026-06-09-second.md');
    const readme = path.join(dir, '.agentloop/tasks/README.md');
    await writeFile(secondTask, '# Second task\n\n- Status: in progress\n');
    await writeFile(readme, '# Task contracts\n');
    await setActiveTask({ cwd: dir, config, taskPath });

    const tasks = await listTasks({ cwd: dir, config });

    expect(tasks).toHaveLength(2);
    expect(tasks[0]).toMatchObject({
      path: '.agentloop/tasks/2026-06-09-demo.md',
      title: 'Demo task',
      status: 'proposed',
      active: true,
    });
    expect(tasks[1]).toMatchObject({
      path: '.agentloop/tasks/2026-06-09-second.md',
      title: 'Second task',
      status: 'in progress',
      active: false,
    });
    expect(tasks[0]?.modifiedAt).toMatch(/T/);
  });

  test('reads task contract content with metadata', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();

    const task = await readTaskContract({ cwd: dir, config, taskPath });

    expect(task).toMatchObject({
      path: '.agentloop/tasks/2026-06-09-demo.md',
      title: 'Demo task',
      status: 'proposed',
    });
    expect(task.content).toBe('# Demo task\n\n- Status: proposed\n');
  });

  test('updates only the status line in a task contract', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    await writeFile(
      taskPath,
      '# Demo task\n\n- Status: proposed\n\n## Notes\nKeep this body intact.\n',
    );

    const task = await updateTaskStatus({
      cwd: dir,
      config,
      taskPath,
      status: 'in-progress',
    });

    expect(task).toMatchObject({
      path: '.agentloop/tasks/2026-06-09-demo.md',
      title: 'Demo task',
      status: 'in-progress',
    });
    expect(await readFile(taskPath, 'utf8')).toBe(
      '# Demo task\n\n- Status: in-progress\n\n## Notes\nKeep this body intact.\n',
    );
  });

  test('accepts deferred as a parked task status', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();

    const task = await updateTaskStatus({
      cwd: dir,
      config,
      taskPath,
      status: 'deferred',
    });

    expect(task).toMatchObject({
      path: '.agentloop/tasks/2026-06-09-demo.md',
      title: 'Demo task',
      status: 'deferred',
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: deferred\n');
  });

  test('archives a task contract and clears active state when it was active', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    await setActiveTask({ cwd: dir, config, taskPath });

    const archived = await archiveTask({ cwd: dir, config, taskPath });

    expect(archived).toEqual({
      previousPath: '.agentloop/tasks/2026-06-09-demo.md',
      path: '.agentloop/tasks/archive/2026-06-09-demo.md',
      title: 'Demo task',
      status: 'proposed',
    });
    await expect(stat(taskPath)).rejects.toThrow();
    expect(
      await readFile(path.join(dir, '.agentloop/tasks/archive/2026-06-09-demo.md'), 'utf8'),
    ).toBe('# Demo task\n\n- Status: proposed\n');
    expect(await listTasks({ cwd: dir, config })).toEqual([]);
    expect(await getActiveTaskPath({ cwd: dir, config })).toBeUndefined();
  });

  test('refuses to overwrite an archived task contract', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    const archivePath = path.join(dir, '.agentloop/tasks/archive/2026-06-09-demo.md');
    await mkdir(path.dirname(archivePath), { recursive: true });
    await writeFile(archivePath, '# Existing archive\n');

    await expect(archiveTask({ cwd: dir, config, taskPath })).rejects.toThrow(
      'Archived task already exists',
    );
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: proposed\n');
    expect(await readFile(archivePath, 'utf8')).toBe('# Existing archive\n');
  });

  test('rejects archive destinations that resolve outside the repo', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/archive'), 'dir');

    await expect(archiveTask({ cwd: dir, config, taskPath })).rejects.toThrow(
      'Task archive output path must stay inside .agentloop/tasks/archive',
    );

    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: proposed\n');
    await expect(stat(path.join(outsideDir, '2026-06-09-demo.md'))).rejects.toThrow();
  });

  test('rejects unsupported task statuses', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();

    await expect(
      updateTaskStatus({
        cwd: dir,
        config,
        taskPath,
        status: 'waiting',
      }),
    ).rejects.toThrow('Unsupported task status');
  });

  test('rejects task contract reads outside the configured task directory', async () => {
    const { dir, config } = await createTaskStateFixture();
    const outsideTask = path.join(dir, 'notes.md');
    await writeFile(outsideTask, '# Notes\n');

    await expect(readTaskContract({ cwd: dir, config, taskPath: outsideTask })).rejects.toThrow(
      'inside .agentloop/tasks',
    );
  });

  test('rejects task lifecycle paths that traverse a symlinked task subdirectory', async () => {
    const { dir, config } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    const outsideTask = path.join(outsideDir, 'outside-task.md');
    const symlinkTask = '.agentloop/tasks/outside-link/outside-task.md';
    await writeFile(outsideTask, '# Outside task\n\n- Status: proposed\n');
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/outside-link'), 'dir');

    await expect(readTaskContract({ cwd: dir, config, taskPath: symlinkTask })).rejects.toThrow(
      'inside .agentloop/tasks',
    );
    await expect(setActiveTask({ cwd: dir, config, taskPath: symlinkTask })).rejects.toThrow(
      'inside .agentloop/tasks',
    );
    await expect(
      updateTaskStatus({ cwd: dir, config, taskPath: symlinkTask, status: 'done' }),
    ).rejects.toThrow('inside .agentloop/tasks');
    await expect(archiveTask({ cwd: dir, config, taskPath: symlinkTask })).rejects.toThrow(
      'inside .agentloop/tasks',
    );

    expect(await readFile(outsideTask, 'utf8')).toBe('# Outside task\n\n- Status: proposed\n');
    await expect(stat(path.join(dir, '.agentloop/tasks/archive/outside-task.md'))).rejects.toThrow();
    await expect(stat(path.join(dir, '.agentloop/state.json'))).rejects.toThrow();
  });

  test('ignores active task state that points through a symlinked task subdirectory', async () => {
    const { dir, config } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await writeFile(path.join(outsideDir, 'outside-task.md'), '# Outside task\n\n- Status: proposed\n');
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/outside-link'), 'dir');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/outside-link/outside-task.md',
    });

    expect(await getActiveTaskPath({ cwd: dir, config })).toBeUndefined();
  });

  test('rejects active task state writes when the state directory resolves outside the repo', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    const escapedConfig = {
      ...config,
      paths: { ...config.paths, agentloopDir: '.agentloop-state' },
    };
    await symlink(outsideDir, path.join(dir, '.agentloop-state'), 'dir');

    await expect(setActiveTask({ cwd: dir, config: escapedConfig, taskPath })).rejects.toThrow(
      'Task state output path must stay inside .agentloop-state',
    );
    await expect(stat(path.join(outsideDir, 'state.json'))).rejects.toThrow();
  });

  test('ignores active task state when state.json resolves outside the repo', async () => {
    const { dir, config } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    const outsideState = path.join(outsideDir, 'state.json');
    await writeJson(outsideState, {
      version: 1,
      activeTaskPath: '.agentloop/tasks/2026-06-09-demo.md',
    });
    await symlink(outsideState, path.join(dir, '.agentloop/state.json'), 'file');

    expect(await getActiveTaskPath({ cwd: dir, config })).toBeUndefined();
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

  test('lists task contracts from the CLI without writing state', async () => {
    const { dir } = await createTaskStateFixture();
    const demoTask = path.join(dir, '.agentloop/tasks/2026-06-09-demo.md');
    const secondTask = path.join(dir, '.agentloop/tasks/2026-06-09-second.md');
    await writeFile(secondTask, '# Second task\n\n- Status: in progress\n');
    await utimes(demoTask, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(secondTask, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'task', 'list', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.tasks).toHaveLength(2);
    expect(output.tasks.map((task: { title: string }) => task.title)).toEqual([
      'Second task',
      'Demo task',
    ]);
    expect(output.tasks.every((task: { active: boolean }) => task.active === false)).toBe(true);
    await expect(stat(path.join(dir, '.agentloop/state.json'))).rejects.toThrow();
  });

  test('prints task lifecycle human output with Markdown-safe inline values', async () => {
    const { dir } = await createTaskStateFixture();
    const taskPath = '.agentloop/tasks/2026-06-09-active`task.md';
    await writeFile(
      path.join(dir, taskPath),
      '# Active `task`\n\n- Status: review`ready\n',
    );

    const setResult = await execa(tsxPath, [cliPath, 'task', 'set', taskPath], { cwd: dir });
    expect(setResult.stdout).toContain(
      `Active task: ${inlineCode('Active `task`')} (${inlineCode('review`ready')})`,
    );
    expect(setResult.stdout).toContain(inlineCode(taskPath));

    const listResult = await execa(tsxPath, [cliPath, 'task', 'list'], { cwd: dir });
    expect(listResult.stdout).toContain(
      `* ${inlineCode('Active `task`')} (${inlineCode('review`ready')}) active`,
    );
    expect(listResult.stdout).toContain(`  ${inlineCode(taskPath)}`);

    const statusResult = await execa(
      tsxPath,
      [cliPath, 'task', 'status', taskPath, 'review'],
      { cwd: dir },
    );
    expect(statusResult.stdout).toContain(
      `Updated task status: ${inlineCode('Active `task`')} (${inlineCode('review')})`,
    );
    expect(statusResult.stdout).toContain(inlineCode(taskPath));

    const archiveResult = await execa(tsxPath, [cliPath, 'task', 'archive', taskPath], {
      cwd: dir,
    });
    expect(archiveResult.stdout).toContain(
      `Archived task: ${inlineCode('Active `task`')} (${inlineCode('review')})`,
    );
    expect(archiveResult.stdout).toContain(
      `${inlineCode(taskPath)} -> ${inlineCode('.agentloop/tasks/archive/2026-06-09-active`task.md')}`,
    );
  });

  test('reports task folder hygiene diagnostics from the CLI without writing state', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-done.md'),
      '# Done\n\n- Status: done\n',
    );
    await writeFile(path.join(dir, '.agentloop/tasks/2026-06-09-missing.md'), '# Missing\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-completed.md'),
      '# Completed\n\n- Status: completed\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-verified.md'),
      '# Verified\n\n- Status: verified\n',
    );
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-09-archived.md'),
      '# Archived\n\n- Status: done\n',
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.taskDoctor).toMatchObject({
      overallStatus: 'warn',
      counts: {
        checked: 5,
        diagnostics: 4,
        terminalTasks: 3,
        missingStatuses: 1,
        unsupportedStatuses: 2,
      },
    });
    expect(output.taskDoctor.diagnostics.map((item: { id: string }) => item.id)).toEqual([
      'legacy-task-status',
      'legacy-task-status',
      'missing-task-status',
      'terminal-task-in-active-folder',
    ]);
    expect(output.taskDoctor.diagnostics).toContainEqual(
      expect.objectContaining({
        id: 'terminal-task-in-active-folder',
        severity: 'warn',
        path: '.agentloop/tasks/2026-06-09-done.md',
        status: 'done',
        recommendation:
          'Run `agentloop task archive .agentloop/tasks/2026-06-09-done.md` after verification and handoff.',
      }),
    );
    expect(output.taskDoctor.diagnostics).toContainEqual(
      expect.objectContaining({
        id: 'missing-task-status',
        path: '.agentloop/tasks/2026-06-09-missing.md',
        status: 'unknown',
      }),
    );
    await expect(stat(path.join(dir, '.agentloop/state.json'))).rejects.toThrow();
  });

  test('prints a concise human task doctor report from the CLI', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-done.md'),
      '# Done\n\n- Status: done\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-completed.md'),
      '# Completed\n\n- Status: completed\n',
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'doctor'], { cwd: dir });

    expect(result.stdout).toContain('# AgentLoopKit Task Doctor');
    expect(result.stdout).toContain('Status: `warn`');
    expect(result.stdout).toContain('`terminal-task-in-active-folder`');
    expect(result.stdout).toContain('`legacy-task-status`');
    expect(result.stdout).toContain(
      'Run `agentloop task archive .agentloop/tasks/2026-06-09-done.md`',
    );
  });

  test('prints task doctor diagnostics with Markdown-safe inline values', async () => {
    const { dir } = await createTaskStateFixture();
    const legacyTaskPath = '.agentloop/tasks/2026-06-09-legacy`task.md';
    await writeFile(
      path.join(dir, legacyTaskPath),
      '# Legacy `task`\n\n- Status: review`ready\n',
    );

    const markdownResult = await execa(tsxPath, [cliPath, 'task', 'doctor'], { cwd: dir });
    expect(markdownResult.stdout).toContain(`Status: ${inlineCode('warn')}`);
    expect(markdownResult.stdout).toContain(
      `- [${inlineCode('warn')}] ${inlineCode('unsupported-task-status')}: ${inlineCode(
        'Legacy `task`',
      )}`,
    );
    expect(markdownResult.stdout).toContain(`  Path: ${inlineCode(legacyTaskPath)}`);
    expect(markdownResult.stdout).toContain(`  Status: ${inlineCode('review`ready')}`);
    expect(markdownResult.stdout).toContain(
      `  ${inlineCode('Task contract uses unsupported status "review`ready".')}`,
    );
    expect(markdownResult.stdout).toContain(
      `  Recommendation: ${inlineCode(
        `Run \`agentloop task status ${legacyTaskPath} proposed\` or another supported status.`,
      )}`,
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json'], { cwd: dir });
    expect(JSON.parse(jsonResult.stdout).taskDoctor.diagnostics).toContainEqual(
      expect.objectContaining({
        id: 'unsupported-task-status',
        path: legacyTaskPath,
        status: 'review`ready',
        message: 'Task contract uses unsupported status "review`ready".',
      }),
    );
  });

  test('passes task doctor when active task files use supported non-terminal statuses', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-review.md'),
      '# Review\n\n- Status: review\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-deferred.md'),
      '# Deferred\n\n- Status: deferred\n',
    );
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-09-archived.md'),
      '# Archived\n\n- Status: done\n',
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json'], { cwd: dir });

    expect(JSON.parse(result.stdout)).toEqual({
      taskDoctor: {
        overallStatus: 'pass',
        counts: {
          checked: 3,
          diagnostics: 0,
          terminalTasks: 0,
          missingStatuses: 0,
          unsupportedStatuses: 0,
        },
        diagnostics: [],
      },
    });
  });

  test(
    'prints invalid config errors as JSON for task subcommands without mutating task state',
    async () => {
      const { dir, taskPath } = await createTaskStateFixture();
      await writeJson(path.join(dir, '.agentloop/state.json'), {
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-09-demo.md',
      });
      await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

      const commands = [
        ['task', 'list', '--json'],
        ['task', 'show', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
        ['task', 'set', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
        ['task', 'status', '.agentloop/tasks/2026-06-09-demo.md', 'review', '--json'],
        ['task', 'archive', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
        ['task', 'doctor', '--json'],
        ['task', 'current', '--json'],
        ['task', 'clear', '--json'],
      ];

      for (const args of commands) {
        const result = await execa(tsxPath, [cliPath, ...args], {
          cwd: dir,
          reject: false,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        });

        expect(result.exitCode).toBe(1);
        expect(result.stderr).toBe('');
        expect(JSON.parse(result.stdout)).toMatchObject({
          error: {
            code: 'CONFIG_ERROR',
            message: expect.stringContaining('Invalid AgentLoopKit config'),
          },
        });
      }

      expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: proposed\n');
      expect(JSON.parse(await readFile(path.join(dir, '.agentloop/state.json'), 'utf8'))).toEqual({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-09-demo.md',
      });
      await expect(
        stat(path.join(dir, '.agentloop/tasks/archive/2026-06-09-demo.md')),
      ).rejects.toThrow();
    },
    CLI_PROCESS_TIMEOUT_MS * 8 + 5_000,
  );

  test('shows task contract content from the CLI without writing state', async () => {
    const { dir } = await createTaskStateFixture();

    const markdownResult = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/2026-06-09-demo.md'],
      { cwd: dir },
    );

    expect(markdownResult.stdout).toBe('# Demo task\n\n- Status: proposed');

    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
      { cwd: dir },
    );

    expect(JSON.parse(jsonResult.stdout)).toEqual({
      task: {
        path: '.agentloop/tasks/2026-06-09-demo.md',
        title: 'Demo task',
        status: 'proposed',
        content: '# Demo task\n\n- Status: proposed\n',
      },
    });
    await expect(stat(path.join(dir, '.agentloop/state.json'))).rejects.toThrow();
  });

  test('prints missing task path errors as JSON when requested', async () => {
    const { dir } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/missing.md', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_CONTRACT_NOT_FOUND',
        message: 'Task contract not found: .agentloop/tasks/missing.md',
        requestedTask: '.agentloop/tasks/missing.md',
        tasksDir: '.agentloop/tasks',
        reason: 'not-found',
      },
    });
  });

  test('prints outside task path errors as JSON when requested', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(path.join(dir, 'notes.md'), '# Notes\n');

    const result = await execa(tsxPath, [cliPath, 'task', 'set', 'notes.md', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_PATH_OUTSIDE_TASKS_DIR',
        message: 'Active task must be inside .agentloop/tasks.',
        requestedTask: 'notes.md',
        tasksDir: '.agentloop/tasks',
        reason: 'outside-tasks-dir',
      },
    });
  });

  test('prints symlink-escaped task path errors as JSON when requested', async () => {
    const { dir } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await writeFile(path.join(outsideDir, 'outside-task.md'), '# Outside task\n\n- Status: proposed\n');
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/outside-link'), 'dir');
    const requestedTask = '.agentloop/tasks/outside-link/outside-task.md';

    const result = await execa(tsxPath, [cliPath, 'task', 'set', requestedTask, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_PATH_OUTSIDE_TASKS_DIR',
        message: 'Active task must be inside .agentloop/tasks.',
        requestedTask,
        tasksDir: '.agentloop/tasks',
        reason: 'outside-tasks-dir',
      },
    });
    await expect(stat(path.join(dir, '.agentloop/state.json'))).rejects.toThrow();
  });

  test('prints unsafe task state write errors as JSON when requested', async () => {
    const { dir } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    const outsideState = path.join(outsideDir, 'state.json');
    await writeFile(outsideState, '{"version":1}\n');
    await symlink(outsideState, path.join(dir, '.agentloop/state.json'), 'file');

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'set', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        artifactType: 'task-state',
        requestedPath: '.agentloop/state.json',
        expectedDir: '.agentloop',
        expectedExtension: '.json',
        reason: 'outside-directory',
      },
    });
    expect(await readFile(outsideState, 'utf8')).toBe('{"version":1}\n');
  });

  test('prints unsafe task state clear errors as JSON without removing the symlink', async () => {
    const { dir } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    const outsideState = path.join(outsideDir, 'state.json');
    const stateLink = path.join(dir, '.agentloop/state.json');
    await writeFile(outsideState, '{"version":1}\n');
    await symlink(outsideState, stateLink, 'file');

    const result = await execa(tsxPath, [cliPath, 'task', 'clear', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        artifactType: 'task-state',
        requestedPath: '.agentloop/state.json',
        expectedDir: '.agentloop',
        expectedExtension: '.json',
        reason: 'outside-directory',
      },
    });
    expect((await lstat(stateLink)).isSymbolicLink()).toBe(true);
    expect(await readFile(outsideState, 'utf8')).toBe('{"version":1}\n');
  });

  test('prints non-Markdown task path errors as JSON when requested', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(path.join(dir, '.agentloop/tasks/not-markdown.txt'), 'not markdown\n');

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '.agentloop/tasks/not-markdown.txt', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_PATH_NOT_MARKDOWN',
        message: 'Active task must be a Markdown file.',
        requestedTask: '.agentloop/tasks/not-markdown.txt',
        tasksDir: '.agentloop/tasks',
        reason: 'not-markdown',
      },
    });
  });

  test('prints unsafe archive destination errors as JSON without moving the task', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/archive'), 'dir');

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        artifactType: 'task-archive',
        requestedPath: '.agentloop/tasks/archive/2026-06-09-demo.md',
        expectedDir: '.agentloop/tasks/archive',
        expectedExtension: '.md',
        reason: 'outside-directory',
      },
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: proposed\n');
    await expect(stat(path.join(outsideDir, '2026-06-09-demo.md'))).rejects.toThrow();
  });

  test('keeps missing task path errors human-readable by default', async () => {
    const { dir } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/missing.md'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Task contract not found: .agentloop/tasks/missing.md');
  });

  test('updates task status from the CLI', async () => {
    const { dir, taskPath } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'status', '.agentloop/tasks/2026-06-09-demo.md', 'review', '--json'],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      task: {
        path: '.agentloop/tasks/2026-06-09-demo.md',
        title: 'Demo task',
        status: 'review',
      },
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: review\n');
  });

  test('marks the active task done from the CLI without a path', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    await execa(tsxPath, [cliPath, 'task', 'set', '.agentloop/tasks/2026-06-09-demo.md'], {
      cwd: dir,
    });

    const result = await execa(tsxPath, [cliPath, 'task', 'done', '--json'], { cwd: dir });

    expect(JSON.parse(result.stdout)).toEqual({
      task: {
        path: '.agentloop/tasks/2026-06-09-demo.md',
        title: 'Demo task',
        status: 'done',
      },
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: done\n');
  });

  test('marks an explicit task done from the CLI', async () => {
    const { dir, taskPath } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'done', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      task: {
        path: '.agentloop/tasks/2026-06-09-demo.md',
        title: 'Demo task',
        status: 'done',
      },
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: done\n');
  });

  test('prints active task errors as JSON when task done has no active task', async () => {
    const { dir, taskPath } = await createTaskStateFixture();

    const result = await execa(tsxPath, [cliPath, 'task', 'done', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'ACTIVE_TASK_NOT_SET',
        message: 'No active task set. Run `agentloop task set <path>` or pass a task path.',
      },
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: proposed\n');
  });

  test('updates task status to deferred from the CLI', async () => {
    const { dir, taskPath } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'status', '.agentloop/tasks/2026-06-09-demo.md', 'deferred', '--json'],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      task: {
        path: '.agentloop/tasks/2026-06-09-demo.md',
        title: 'Demo task',
        status: 'deferred',
      },
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: deferred\n');
  });

  test('prints unsupported task status errors as JSON when requested', async () => {
    const { dir, taskPath } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'status', '.agentloop/tasks/2026-06-09-demo.md', 'waiting', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'UNSUPPORTED_TASK_STATUS',
        message: 'Unsupported task status "waiting".',
        requestedStatus: 'waiting',
        supportedStatuses: ['proposed', 'in-progress', 'blocked', 'deferred', 'review', 'done'],
      },
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: proposed\n');
  });

  test('keeps unsupported task status errors human-readable by default', async () => {
    const { dir, taskPath } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'status', '.agentloop/tasks/2026-06-09-demo.md', 'waiting'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Unsupported task status "waiting".');
    expect(result.stderr).toContain('Use one of: proposed, in-progress, blocked, deferred, review, done.');
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: proposed\n');
  });

  test('archives a task contract from the CLI', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    await execa(tsxPath, [cliPath, 'task', 'set', '.agentloop/tasks/2026-06-09-demo.md'], {
      cwd: dir,
    });

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      task: {
        previousPath: '.agentloop/tasks/2026-06-09-demo.md',
        path: '.agentloop/tasks/archive/2026-06-09-demo.md',
        title: 'Demo task',
        status: 'proposed',
      },
    });
    await expect(stat(taskPath)).rejects.toThrow();
    const listResult = await execa(tsxPath, [cliPath, 'task', 'list', '--json'], { cwd: dir });
    expect(JSON.parse(listResult.stdout)).toEqual({ tasks: [] });
    const currentResult = await execa(tsxPath, [cliPath, 'task', 'current', '--json'], {
      cwd: dir,
    });
    expect(JSON.parse(currentResult.stdout)).toEqual({ activeTask: null });
  });
});
