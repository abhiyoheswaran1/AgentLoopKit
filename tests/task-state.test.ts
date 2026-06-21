import path from 'node:path';
import { lstat, mkdir, readFile, stat, symlink, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { inlineCode, singleLineInlineCode } from '../src/core/markdown-format.js';
import {
  archiveTask,
  clearActiveTask,
  getActiveTaskPath,
  inspectTaskDirectory,
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

function agentFlightPlaceholderMarkdown(title: string, status = 'deferred') {
  return `# ${title}

- Created date: 2026-06-16
- Task type: feature
- Status: ${status}

## Problem Statement
AgentFlight session task: ${title}

## Desired Outcome
Task is implemented with local verification evidence.
`;
}

function fullAgentFlightPlaceholderMarkdown(title: string, status = 'proposed') {
  return `# ${title}

- Created date: 2026-06-16
- Task type: feature
- Status: ${status}

## Problem Statement
AgentFlight session task: ${title}

## Desired Outcome
Task is implemented with local verification evidence.

## Constraints
- Keep changes scoped and do not claim completion without proof.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Add acceptance criteria before implementation starts.

## Verification Commands
- No verification command recorded.

## Rollback Notes
Document how to revert or disable this change.
`;
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

  test('filters task list status in core inventory while preserving active ordering', async () => {
    const { dir, config } = await createTaskStateFixture();
    const deferredTask = path.join(dir, '.agentloop/tasks/2026-06-09-deferred.md');
    const doneTask = path.join(dir, '.agentloop/tasks/2026-06-09-done.md');
    await writeFile(deferredTask, '# Deferred task\n\n- Status: deferred\n');
    await writeFile(doneTask, '# Done task\n\n- Status: done\n');
    await setActiveTask({ cwd: dir, config, taskPath: deferredTask });

    const tasks = await listTasks({ cwd: dir, config, status: 'deferred' });

    expect(tasks).toEqual([
      expect.objectContaining({
        path: '.agentloop/tasks/2026-06-09-deferred.md',
        title: 'Deferred task',
        status: 'deferred',
        active: true,
      }),
    ]);
    expect(tasks).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ title: 'Demo task' })]),
    );
    expect(tasks).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ title: 'Done task' })]),
    );
  });

  test('classifies exact AgentFlight placeholder task contracts in task inventory', async () => {
    const { dir, config } = await createTaskStateFixture();
    const title = 'Separate AgentFlight placeholders from roadmap task counts';
    await writeFile(
      path.join(
        dir,
        '.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md',
      ),
      agentFlightPlaceholderMarkdown(title),
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-custom-deferred.md'),
      '# Custom deferred\n\n- Status: deferred\n\n## Problem Statement\nKeep this as real backlog.\n',
    );

    const tasks = await listTasks({ cwd: dir, config });
    const placeholder = tasks.find((task) => task.title === title) as Record<string, unknown>;
    const customDeferred = tasks.find((task) => task.title === 'Custom deferred') as Record<
      string,
      unknown
    >;

    expect(placeholder).toMatchObject({
      path: '.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md',
      title,
      status: 'deferred',
      source: 'agentflight-placeholder',
    });
    expect(customDeferred).toMatchObject({
      path: '.agentloop/tasks/2026-06-16-custom-deferred.md',
      title: 'Custom deferred',
      status: 'deferred',
    });
    expect(customDeferred).not.toHaveProperty('source');
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
    await expect(
      stat(path.join(dir, '.agentloop/tasks/archive/outside-task.md')),
    ).rejects.toThrow();
    await expect(stat(path.join(dir, '.agentloop/state.json'))).rejects.toThrow();
  });

  test('ignores active task state that points through a symlinked task subdirectory', async () => {
    const { dir, config } = await createTaskStateFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await writeFile(
      path.join(outsideDir, 'outside-task.md'),
      '# Outside task\n\n- Status: proposed\n',
    );
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

  test('task doctor warns when active state points to a missing task', async () => {
    const { dir, config } = await createTaskStateFixture();
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/missing.md',
    });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.overallStatus).toBe('warn');
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-missing',
          severity: 'warn',
          path: '.agentloop/tasks/missing.md',
        }),
      ]),
    );
  });

  test('task doctor warns when active state points to an archived task', async () => {
    const { dir, config } = await createTaskStateFixture();
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-16-old.md'),
      '# Old Task\n\n- Status: done\n',
    );
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/archive/2026-06-16-old.md',
    });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-archived',
          severity: 'warn',
          path: '.agentloop/tasks/archive/2026-06-16-old.md',
        }),
      ]),
    );
  });

  test('task doctor warns when active state points to a terminal task', async () => {
    const { dir, config } = await createTaskStateFixture();
    await writeFile(path.join(dir, '.agentloop/tasks/done.md'), '# Done\n\n- Status: done\n');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/done.md',
    });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-terminal',
          severity: 'warn',
          path: '.agentloop/tasks/done.md',
        }),
      ]),
    );
  });

  test('task doctor warns when active state points to a deferred task', async () => {
    const { dir, config } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/parked.md'),
      '# Parked\n\n- Status: deferred\n',
    );
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/parked.md',
    });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-deferred',
          severity: 'warn',
          path: '.agentloop/tasks/parked.md',
        }),
      ]),
    );
  });

  test('task doctor warns when active task is an AgentFlight placeholder', async () => {
    const { dir, config } = await createTaskStateFixture();
    const title = 'Ignore active AgentFlight placeholder tasks';
    const taskPath = path.join(
      dir,
      '.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md',
    );
    await writeFile(taskPath, agentFlightPlaceholderMarkdown(title, 'proposed'));
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath:
        '.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md',
    });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-agentflight-placeholder',
          severity: 'warn',
          path: '.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md',
          title,
          message:
            'Active task pointer points to an AgentFlight placeholder task preserved as session evidence.',
          recommendation:
            'Run `agentloop task clear`, then set an existing real task or create a current task contract before continuing. Do not edit or delete the AgentFlight placeholder as the default recovery.',
          commands: expect.arrayContaining([
            'agentloop task clear',
            'agentloop task set <path>',
            'agentloop create-task',
          ]),
        }),
      ]),
    );
  });

  test('task doctor skips placeholder-section warnings for AgentFlight placeholders', async () => {
    const { dir, config } = await createTaskStateFixture();
    const title = 'Skip AgentFlight placeholder section warnings';
    await writeFile(
      path.join(
        dir,
        '.agentloop/tasks/2026-06-16-skip-agentflight-placeholder-section-warnings-2.md',
      ),
      fullAgentFlightPlaceholderMarkdown(title, 'proposed'),
    );

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).not.toContainEqual(
      expect.objectContaining({
        id: 'placeholder-task-section',
        path: '.agentloop/tasks/2026-06-16-skip-agentflight-placeholder-section-warnings-2.md',
      }),
    );
  });

  test('task doctor warns when active task is older than recent run evidence', async () => {
    const { dir, config } = await createTaskStateFixture();
    const taskPath = path.join(dir, '.agentloop/tasks/old.md');
    const runMetadataPath = path.join(dir, '.agentloop/runs/2026-06-16-20-00-verify/metadata.json');
    await writeFile(taskPath, '# Old\n\n- Status: in-progress\n');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/old.md',
    });
    await mkdir(path.dirname(runMetadataPath), { recursive: true });
    await writeJson(runMetadataPath, {
      id: '2026-06-16-20-00-verify',
      command: 'verify',
      createdAt: '2026-06-16-20-00',
      task: null,
      changedFileCount: 0,
    });
    await utimes(taskPath, new Date('2026-06-16T18:00:00Z'), new Date('2026-06-16T18:00:00Z'));
    await utimes(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      new Date('2026-06-16T17:00:00Z'),
      new Date('2026-06-16T17:00:00Z'),
    );
    await utimes(
      path.join(dir, '.agentloop/state.json'),
      new Date('2026-06-16T18:30:00Z'),
      new Date('2026-06-16T18:30:00Z'),
    );
    await utimes(
      runMetadataPath,
      new Date('2026-06-16T20:00:00Z'),
      new Date('2026-06-16T20:00:00Z'),
    );

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-older-than-runs',
          severity: 'warn',
          path: '.agentloop/tasks/old.md',
          evidence: expect.arrayContaining([
            '.agentloop/runs/2026-06-16-20-00-verify/metadata.json',
          ]),
        }),
      ]),
    );
  });

  test('task doctor warns when recent evidence exists without an active task', async () => {
    const { dir, config } = await createTaskStateFixture();
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-16-20-30-verification-report.md');
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, '# Verification Report\n\nOverall status: pass\n');

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'recent-evidence-without-active-task',
          severity: 'warn',
          path: '.agentloop/state.json',
          evidence: expect.arrayContaining([
            '.agentloop/reports/2026-06-16-20-30-verification-report.md',
          ]),
        }),
      ]),
    );
  });

  test('task doctor accepts latest run evidence for an archived terminal task when no task is active', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    await setActiveTask({ cwd: dir, config, taskPath });
    await updateTaskStatus({ cwd: dir, config, taskPath, status: 'done' });
    const archived = await archiveTask({ cwd: dir, config, taskPath });
    const runMetadataPath = path.join(
      dir,
      '.agentloop/runs/2026-06-16-20-45-handoff/metadata.json',
    );
    await mkdir(path.dirname(runMetadataPath), { recursive: true });
    await writeJson(runMetadataPath, {
      id: '2026-06-16-20-45-handoff',
      command: 'handoff',
      createdAt: '2026-06-16-20-45',
      task: {
        path: archived.path,
        title: archived.title,
        status: archived.status,
      },
      changedFileCount: 1,
    });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'recent-evidence-without-active-task',
        }),
      ]),
    );
  });

  test('task doctor accepts pre-archive run metadata as archived task evidence', async () => {
    const { dir, config, taskPath } = await createTaskStateFixture();
    const task = await setActiveTask({ cwd: dir, config, taskPath });
    await updateTaskStatus({ cwd: dir, config, taskPath, status: 'done' });
    const runMetadataPath = path.join(
      dir,
      '.agentloop/runs/2026-06-16-20-45-handoff/metadata.json',
    );
    await mkdir(path.dirname(runMetadataPath), { recursive: true });
    await writeJson(runMetadataPath, {
      id: '2026-06-16-20-45-handoff',
      command: 'handoff',
      createdAt: '2026-06-16-20-45',
      task: {
        path: task.path,
        title: task.title,
        status: 'done',
      },
      changedFileCount: 1,
    });
    await archiveTask({ cwd: dir, config, taskPath });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'recent-evidence-without-active-task',
        }),
      ]),
    );
  });

  test('task doctor still warns when an open task exists without an active task', async () => {
    const { dir, config } = await createTaskStateFixture();
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-16-done.md'),
      '# Done task\n\n- Status: done\n',
    );
    const runMetadataPath = path.join(
      dir,
      '.agentloop/runs/2026-06-16-20-45-handoff/metadata.json',
    );
    await mkdir(path.dirname(runMetadataPath), { recursive: true });
    await writeJson(runMetadataPath, {
      id: '2026-06-16-20-45-handoff',
      command: 'handoff',
      createdAt: '2026-06-16-20-45',
      task: {
        path: '.agentloop/tasks/archive/2026-06-16-done.md',
        title: 'Done task',
        status: 'done',
      },
      changedFileCount: 1,
    });

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'recent-evidence-without-active-task',
          severity: 'warn',
          path: '.agentloop/state.json',
          evidence: expect.arrayContaining([
            '.agentloop/runs/2026-06-16-20-45-handoff/metadata.json',
          ]),
        }),
      ]),
    );
  });

  test('task doctor caps stale-state evidence references', async () => {
    const { dir, config } = await createTaskStateFixture();
    const taskPath = path.join(dir, '.agentloop/tasks/old.md');
    await writeFile(taskPath, '# Old\n\n- Status: in-progress\n');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/old.md',
    });
    await utimes(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      new Date('2026-06-16T09:00:00Z'),
      new Date('2026-06-16T09:00:00Z'),
    );
    await utimes(taskPath, new Date('2026-06-16T10:00:00Z'), new Date('2026-06-16T10:00:00Z'));
    await utimes(
      path.join(dir, '.agentloop/state.json'),
      new Date('2026-06-16T10:30:00Z'),
      new Date('2026-06-16T10:30:00Z'),
    );
    for (let index = 0; index < 12; index += 1) {
      const hour = String(index + 11).padStart(2, '0');
      const runMetadataPath = path.join(
        dir,
        `.agentloop/runs/2026-06-16-${hour}-00-verify/metadata.json`,
      );
      await mkdir(path.dirname(runMetadataPath), { recursive: true });
      await writeJson(runMetadataPath, {
        id: `2026-06-16-${hour}-00-verify`,
        command: 'verify',
        createdAt: `2026-06-16-${hour}-00`,
        task: null,
        changedFileCount: 0,
      });
    }

    const result = await inspectTaskDirectory({ cwd: dir, config });
    const diagnostic = result.diagnostics.find((item) => item.id === 'active-task-older-than-runs');

    expect(diagnostic?.evidence).toHaveLength(10);
    expect(diagnostic?.evidence).not.toContain(
      '.agentloop/runs/2026-06-16-11-00-verify/metadata.json',
    );
    expect(diagnostic?.evidence).not.toContain(
      '.agentloop/runs/2026-06-16-12-00-verify/metadata.json',
    );
  });

  test('task doctor does not warn when newer run evidence references the active task', async () => {
    const { dir, config } = await createTaskStateFixture();
    const taskPath = path.join(dir, '.agentloop/tasks/current.md');
    const runMetadataPath = path.join(dir, '.agentloop/runs/2026-06-16-20-00-verify/metadata.json');
    await writeFile(taskPath, '# Current\n\n- Status: in-progress\n');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/current.md',
    });
    await mkdir(path.dirname(runMetadataPath), { recursive: true });
    await writeJson(runMetadataPath, {
      id: '2026-06-16-20-00-verify',
      command: 'verify',
      createdAt: '2026-06-16-20-00',
      task: {
        path: '.agentloop/tasks/current.md',
        title: 'Current',
        status: 'in-progress',
      },
      changedFileCount: 0,
    });
    await utimes(taskPath, new Date('2026-06-16T18:00:00Z'), new Date('2026-06-16T18:00:00Z'));
    await utimes(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      new Date('2026-06-16T17:00:00Z'),
      new Date('2026-06-16T17:00:00Z'),
    );
    await utimes(
      path.join(dir, '.agentloop/state.json'),
      new Date('2026-06-16T18:30:00Z'),
      new Date('2026-06-16T18:30:00Z'),
    );
    await utimes(
      runMetadataPath,
      new Date('2026-06-16T20:00:00Z'),
      new Date('2026-06-16T20:00:00Z'),
    );

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-older-than-runs',
        }),
      ]),
    );
  });

  test('task doctor does not warn when active pointer is newer than unrelated run evidence', async () => {
    const { dir, config } = await createTaskStateFixture();
    const taskPath = path.join(dir, '.agentloop/tasks/current.md');
    const runMetadataPath = path.join(
      dir,
      '.agentloop/runs/2026-06-16-17-31-handoff/metadata.json',
    );
    await writeFile(taskPath, '# Current\n\n- Status: in-progress\n');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/current.md',
    });
    await mkdir(path.dirname(runMetadataPath), { recursive: true });
    await writeJson(runMetadataPath, {
      id: '2026-06-16-17-31-handoff',
      command: 'handoff',
      createdAt: '2026-06-16-17-31',
      task: {
        path: '.agentloop/tasks/older.md',
        title: 'Older task',
        status: 'done',
      },
      changedFileCount: 0,
    });
    await utimes(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      new Date('2026-06-16T14:00:00Z'),
      new Date('2026-06-16T14:00:00Z'),
    );
    await utimes(taskPath, new Date('2026-06-16T15:00:00Z'), new Date('2026-06-16T15:00:00Z'));
    await utimes(
      runMetadataPath,
      new Date('2026-06-16T17:31:00Z'),
      new Date('2026-06-16T17:31:00Z'),
    );
    await utimes(
      path.join(dir, '.agentloop/state.json'),
      new Date('2026-06-16T18:00:00Z'),
      new Date('2026-06-16T18:00:00Z'),
    );

    const result = await inspectTaskDirectory({ cwd: dir, config });

    expect(result.diagnostics).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'active-task-older-than-runs',
        }),
      ]),
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
    expect(JSON.parse(clearResult.stdout)).toEqual({
      activeTask: null,
      cleared: true,
      activeTaskPath: '.agentloop/tasks/2026-06-09-demo.md',
    });

    const emptyResult = await execa(tsxPath, [cliPath, 'task', 'current', '--json'], {
      cwd: dir,
    });
    expect(JSON.parse(emptyResult.stdout)).toEqual({ activeTask: null });
  });

  test('clear reports when it clears an ignored AgentFlight placeholder pointer', async () => {
    const { dir } = await createTaskStateFixture();
    const title = 'Recover ignored AgentFlight pointer';
    const placeholderPath = '.agentloop/tasks/2026-06-16-recover-ignored-agentflight-pointer.md';
    await writeFile(path.join(dir, placeholderPath), agentFlightPlaceholderMarkdown(title, 'proposed'));
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: placeholderPath,
    });

    const humanResult = await execa(tsxPath, [cliPath, 'task', 'clear'], { cwd: dir });

    expect(humanResult.stdout).toContain('Cleared active task pointer.');
    expect(humanResult.stdout).toContain(placeholderPath);
    await expect(readFile(path.join(dir, '.agentloop/state.json'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(dir, placeholderPath), 'utf8')).resolves.toContain(title);

    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: placeholderPath,
    });

    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'clear', '--json'], { cwd: dir });

    expect(JSON.parse(jsonResult.stdout)).toEqual({
      activeTask: null,
      cleared: true,
      activeTaskPath: placeholderPath,
    });
  });

  test('clear reports no-op when no active task state exists', async () => {
    const { dir } = await createTaskStateFixture();

    const humanResult = await execa(tsxPath, [cliPath, 'task', 'clear'], { cwd: dir });
    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'clear', '--json'], { cwd: dir });

    expect(humanResult.stdout).toContain('No active task set.');
    expect(JSON.parse(jsonResult.stdout)).toEqual({ activeTask: null, cleared: false });
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
    await writeFile(path.join(dir, taskPath), '# Active `task`\n\n- Status: review`ready\n');

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

    const statusResult = await execa(tsxPath, [cliPath, 'task', 'status', taskPath, 'review'], {
      cwd: dir,
    });
    expect(statusResult.stdout).toContain(
      `Updated task status: ${inlineCode('Active `task`')} (${inlineCode('review')})`,
    );
    expect(statusResult.stdout).toContain(inlineCode(taskPath));

    const doneResult = await execa(tsxPath, [cliPath, 'task', 'done', taskPath], { cwd: dir });
    expect(doneResult.stdout).toContain(
      `Updated task status: ${inlineCode('Active `task`')} (${inlineCode('done')})`,
    );
    expect(doneResult.stdout).toContain(
      'Next step: run `agentloop status --redact-paths`; if it asks for handoff, run `agentloop handoff --write-run`, then archive the task.',
    );

    const archiveResult = await execa(tsxPath, [cliPath, 'task', 'archive', taskPath], {
      cwd: dir,
    });
    expect(archiveResult.stdout).toContain(
      `Archived task: ${inlineCode('Active `task`')} (${inlineCode('done')})`,
    );
    expect(archiveResult.stdout).toContain(
      `${inlineCode(taskPath)} -> ${inlineCode('.agentloop/tasks/archive/2026-06-09-active`task.md')}`,
    );
    expect(archiveResult.stdout).toContain(
      'Next step: run `agentloop status --redact-paths`; if it asks for handoff, run `agentloop handoff --write-run`.',
    );
  });

  test('prints task lifecycle paths with line breaks on one markdown line', async () => {
    const { dir } = await createTaskStateFixture();
    const taskPath = '.agentloop/tasks/2026-06-09-active\ntask.md';
    await writeFile(path.join(dir, taskPath), '# Active task\n\n- Status: review\n');

    const setResult = await execa(tsxPath, [cliPath, 'task', 'set', taskPath], { cwd: dir });
    expect(setResult.stdout).toContain(singleLineInlineCode(taskPath));
    expect(setResult.stdout).not.toContain('.agentloop/tasks/2026-06-09-active\ntask.md');

    const listResult = await execa(tsxPath, [cliPath, 'task', 'list'], { cwd: dir });
    expect(listResult.stdout).toContain(`  ${singleLineInlineCode(taskPath)}`);
    expect(listResult.stdout).not.toContain('.agentloop/tasks/2026-06-09-active\ntask.md');

    const doneResult = await execa(tsxPath, [cliPath, 'task', 'done', taskPath], { cwd: dir });
    expect(doneResult.stdout).toContain(singleLineInlineCode(taskPath));
    expect(doneResult.stdout).not.toContain('.agentloop/tasks/2026-06-09-active\ntask.md');

    const archiveResult = await execa(tsxPath, [cliPath, 'task', 'archive', taskPath], {
      cwd: dir,
    });
    expect(archiveResult.stdout).toContain(
      `${singleLineInlineCode(taskPath)} -> ${singleLineInlineCode(
        '.agentloop/tasks/archive/2026-06-09-active\ntask.md',
      )}`,
    );
    expect(archiveResult.stdout).not.toContain(
      '.agentloop/tasks/archive/2026-06-09-active\ntask.md',
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

  test('accepts redact-paths on task doctor without changing diagnostics shape', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-done.md'),
      '# Done\n\n- Status: done\n',
    );

    const human = await execa(tsxPath, [cliPath, 'task', 'doctor', '--redact-paths'], {
      cwd: dir,
    });
    const json = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json', '--redact-paths'], {
      cwd: dir,
    });
    const help = await execa(tsxPath, [cliPath, 'task', 'doctor', '--help'], { cwd: dir });

    expect(human.stdout).toContain('# AgentLoopKit Task Doctor');
    expect(human.stdout).toContain('Status: `warn`');
    expect(human.stdout).toContain('`terminal-task-in-active-folder`');
    expect(JSON.parse(json.stdout)).toMatchObject({
      taskDoctor: {
        overallStatus: 'warn',
        diagnostics: [
          expect.objectContaining({
            id: 'terminal-task-in-active-folder',
            path: '.agentloop/tasks/2026-06-09-done.md',
          }),
        ],
      },
    });
    expect(help.stdout).toContain('--redact-paths');
  });

  test('prints task doctor stale-state recovery commands and evidence refs', async () => {
    const { dir } = await createTaskStateFixture();
    const taskPath = path.join(dir, '.agentloop/tasks/old.md');
    const runMetadataPath = path.join(dir, '.agentloop/runs/2026-06-16-20-00-verify/metadata.json');
    await writeFile(taskPath, '# Old\n\n- Status: in-progress\n');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/old.md',
    });
    await mkdir(path.dirname(runMetadataPath), { recursive: true });
    await writeJson(runMetadataPath, {
      id: '2026-06-16-20-00-verify',
      command: 'verify',
      createdAt: '2026-06-16-20-00',
      task: null,
      changedFileCount: 0,
    });
    await utimes(taskPath, new Date('2026-06-16T18:00:00Z'), new Date('2026-06-16T18:00:00Z'));
    await utimes(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      new Date('2026-06-16T17:00:00Z'),
      new Date('2026-06-16T17:00:00Z'),
    );
    await utimes(
      path.join(dir, '.agentloop/state.json'),
      new Date('2026-06-16T18:30:00Z'),
      new Date('2026-06-16T18:30:00Z'),
    );
    await utimes(
      runMetadataPath,
      new Date('2026-06-16T20:00:00Z'),
      new Date('2026-06-16T20:00:00Z'),
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'doctor'], { cwd: dir });

    expect(result.stdout).toContain(inlineCode('active-task-older-than-runs'));
    expect(result.stdout).toContain(`  Commands: ${inlineCode('agentloop task doctor')}`);
    expect(result.stdout).toContain(
      `  Evidence: ${inlineCode('.agentloop/runs/2026-06-16-20-00-verify/metadata.json')}`,
    );
  });

  test('reports post-verification gates recorded as verification commands', async () => {
    const { dir } = await createTaskStateFixture();
    const taskPath = '.agentloop/tasks/2026-06-09-gate-mismatch.md';
    await writeFile(
      path.join(dir, taskPath),
      [
        '# Gate mismatch',
        '',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        '- npm test',
        '- npm run dogfood:strict',
        '- node dist/cli/index.js check-gates --strict',
        '- agentloop ship',
        '- npx --no-install agentloop prepare-pr --github-comment',
        '',
        '## Post-Verification Gates',
        '- No post-verification gate recorded.',
        '',
      ].join('\n'),
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json'], { cwd: dir });
    const output = JSON.parse(jsonResult.stdout);
    expect(output.taskDoctor).toMatchObject({
      overallStatus: 'warn',
      counts: {
        checked: 2,
        diagnostics: 1,
        terminalTasks: 0,
        missingStatuses: 0,
        unsupportedStatuses: 0,
      },
    });
    expect(output.taskDoctor.diagnostics).toContainEqual(
      expect.objectContaining({
        id: 'post-verification-gate-in-verification-commands',
        severity: 'warn',
        path: taskPath,
        status: 'in-progress',
        commands: [
          'npm run dogfood:strict',
          'node dist/cli/index.js check-gates --strict',
          'agentloop ship',
          'npx --no-install agentloop prepare-pr --github-comment',
        ],
        recommendation:
          'Move the listed command(s) from Verification Commands to Post-Verification Gates.',
      }),
    );

    const humanResult = await execa(tsxPath, [cliPath, 'task', 'doctor'], { cwd: dir });
    expect(humanResult.stdout).toContain(
      inlineCode('post-verification-gate-in-verification-commands'),
    );
    expect(humanResult.stdout).toContain(inlineCode('npm run dogfood:strict'));
    expect(humanResult.stdout).toContain(inlineCode('node dist/cli/index.js check-gates --strict'));
    expect(humanResult.stdout).toContain(inlineCode('agentloop ship'));
    expect(humanResult.stdout).toContain(
      inlineCode('npx --no-install agentloop prepare-pr --github-comment'),
    );
    expect(humanResult.stdout).toContain('Move the listed command(s) from Verification Commands');
  });

  test('reports active task contracts that still contain review-critical placeholders', async () => {
    const { dir } = await createTaskStateFixture();
    const taskPath = '.agentloop/tasks/2026-06-09-placeholder.md';
    const content = [
      '# Placeholder task',
      '',
      '- Type: feature',
      '- Status: in-progress',
      '',
      '## Problem Statement',
      'Describe the problem this task should solve.',
      '',
      '## Desired Outcome',
      'Describe the concrete result expected from this task.',
      '',
      '## Likely Files or Areas',
      '- None recorded yet.',
      '',
      '## Acceptance Criteria',
      '- Add acceptance criteria before implementation starts.',
      '',
      '## Verification Commands',
      '- No verification command recorded.',
      '',
      '## Rollback Notes',
      'Document how to revert or disable this change.',
      '',
    ].join('\n');
    await writeFile(path.join(dir, taskPath), content);

    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json'], { cwd: dir });
    const output = JSON.parse(jsonResult.stdout);

    expect(output.taskDoctor).toMatchObject({
      overallStatus: 'warn',
      counts: {
        checked: 2,
        diagnostics: 1,
        terminalTasks: 0,
        missingStatuses: 0,
        unsupportedStatuses: 0,
      },
    });
    expect(output.taskDoctor.diagnostics).toContainEqual(
      expect.objectContaining({
        id: 'placeholder-task-section',
        severity: 'warn',
        path: taskPath,
        status: 'in-progress',
        sections: [
          'Problem Statement',
          'Desired Outcome',
          'Likely Files or Areas',
          'Acceptance Criteria',
          'Verification Commands',
          'Rollback Notes',
        ],
        recommendation:
          'Replace placeholder section(s) with task-specific scope, acceptance, verification, and rollback evidence before implementation continues.',
      }),
    );

    const humanResult = await execa(tsxPath, [cliPath, 'task', 'doctor'], { cwd: dir });
    expect(humanResult.stdout).toContain(inlineCode('placeholder-task-section'));
    expect(humanResult.stdout).toContain('Sections:');
    expect(humanResult.stdout).toContain(inlineCode('Acceptance Criteria'));
    expect(await readFile(path.join(dir, taskPath), 'utf8')).toBe(content);
  });

  test('does not report placeholder diagnostics for deferred backlog tasks', async () => {
    const { dir } = await createTaskStateFixture();
    const taskPath = '.agentloop/tasks/2026-06-09-deferred-placeholder.md';
    await writeFile(
      path.join(dir, taskPath),
      [
        '# Deferred placeholder task',
        '',
        '- Status: deferred',
        '',
        '## Problem Statement',
        'Describe the problem this task should solve.',
        '',
        '## Acceptance Criteria',
        '- Add acceptance criteria before implementation starts.',
        '',
        '## Verification Commands',
        '- No verification command recorded.',
        '',
        '## Rollback Notes',
        'Document how to revert or disable this change.',
        '',
      ].join('\n'),
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json'], { cwd: dir });

    expect(JSON.parse(result.stdout)).toEqual({
      taskDoctor: {
        overallStatus: 'pass',
        counts: {
          checked: 2,
          diagnostics: 0,
          terminalTasks: 0,
          missingStatuses: 0,
          unsupportedStatuses: 0,
        },
        diagnostics: [],
      },
    });
  });

  test('prints task doctor diagnostics with Markdown-safe inline values', async () => {
    const { dir } = await createTaskStateFixture();
    const legacyTaskPath = '.agentloop/tasks/2026-06-09-legacy`task.md';
    await writeFile(path.join(dir, legacyTaskPath), '# Legacy `task`\n\n- Status: review`ready\n');

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

  test('prints task doctor diagnostics with line-break paths on one markdown line', async () => {
    const { dir } = await createTaskStateFixture();
    const legacyTaskPath = '.agentloop/tasks/2026-06-09-legacy\ntask.md';
    await writeFile(path.join(dir, legacyTaskPath), '# Legacy task\n\n- Status: review`ready\n');

    const markdownResult = await execa(tsxPath, [cliPath, 'task', 'doctor'], { cwd: dir });

    expect(markdownResult.stdout).toContain(`  Path: ${singleLineInlineCode(legacyTaskPath)}`);
    expect(markdownResult.stdout).toContain(
      `  Recommendation: ${singleLineInlineCode(
        `Run \`agentloop task status ${legacyTaskPath} proposed\` or another supported status.`,
      )}`,
    );
    expect(markdownResult.stdout).not.toContain('.agentloop/tasks/2026-06-09-legacy\ntask.md');

    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'doctor', '--json'], { cwd: dir });
    expect(JSON.parse(jsonResult.stdout).taskDoctor.diagnostics).toContainEqual(
      expect.objectContaining({
        path: legacyTaskPath,
        status: 'review`ready',
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

  test('redacts local roots from task show output only when requested', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    const absoluteReportPath = path.join(dir, '.agentloop/reports/local-report.md');
    await writeFile(
      taskPath,
      [
        '# Demo task',
        '',
        '- Status: proposed',
        '',
        '## Evidence',
        `Local report: ${absoluteReportPath}`,
        '',
      ].join('\n'),
    );

    const rawMarkdownResult = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/2026-06-09-demo.md'],
      { cwd: dir },
    );
    expect(rawMarkdownResult.stdout).toContain(absoluteReportPath);

    const rawJsonResult = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/2026-06-09-demo.md', '--json'],
      { cwd: dir },
    );
    expect(JSON.parse(rawJsonResult.stdout).task.content).toContain(absoluteReportPath);

    const redactedMarkdownResult = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/2026-06-09-demo.md', '--redact-paths'],
      { cwd: dir },
    );
    expect(redactedMarkdownResult.stdout).toContain(
      '[git-root]/.agentloop/reports/local-report.md',
    );
    expect(redactedMarkdownResult.stdout).not.toContain(dir);

    const redactedJsonResult = await execa(
      tsxPath,
      [cliPath, 'task', 'show', '.agentloop/tasks/2026-06-09-demo.md', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const redactedJson = JSON.parse(redactedJsonResult.stdout);
    expect(redactedJson.task.content).toContain('[git-root]/.agentloop/reports/local-report.md');
    expect(JSON.stringify(redactedJson)).not.toContain(dir);

    const helpResult = await execa(tsxPath, [cliPath, 'task', 'show', '--help'], { cwd: dir });
    expect(helpResult.stdout).toContain('--redact-paths');
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
    await writeFile(
      path.join(outsideDir, 'outside-task.md'),
      '# Outside task\n\n- Status: proposed\n',
    );
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

    const result = await execa(tsxPath, [cliPath, 'task', 'show', '.agentloop/tasks/missing.md'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(
      'agentloop: Task contract not found: .agentloop/tasks/missing.md',
    );
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

  test('accepts redact-paths on task lifecycle update commands', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    const relativeTaskPath = '.agentloop/tasks/2026-06-09-demo.md';

    for (const subcommand of ['set', 'status', 'done', 'archive', 'clear']) {
      const help = await execa(tsxPath, [cliPath, 'task', subcommand, '--help'], {
        cwd: dir,
        timeout: CLI_PROCESS_TIMEOUT_MS,
      });
      expect(help.stdout).toContain('--redact-paths');
    }

    await execa(tsxPath, [cliPath, 'task', 'set', relativeTaskPath, '--redact-paths'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    await execa(
      tsxPath,
      [cliPath, 'task', 'status', relativeTaskPath, 'review', '--redact-paths'],
      {
        cwd: dir,
        timeout: CLI_PROCESS_TIMEOUT_MS,
      },
    );
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: review\n');

    await execa(tsxPath, [cliPath, 'task', 'done', '--redact-paths'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    expect(await readFile(taskPath, 'utf8')).toBe('# Demo task\n\n- Status: done\n');

    await execa(tsxPath, [cliPath, 'task', 'clear', '--redact-paths'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    await expect(readFile(path.join(dir, '.agentloop/state.json'), 'utf8')).rejects.toThrow();

    const archiveResult = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', relativeTaskPath, '--redact-paths'],
      {
        cwd: dir,
        timeout: CLI_PROCESS_TIMEOUT_MS,
      },
    );
    expect(archiveResult.stdout).toContain(
      '`.agentloop/tasks/2026-06-09-demo.md` -> `.agentloop/tasks/archive/2026-06-09-demo.md`',
    );
  });

  test('redacts stored absolute active task paths when clearing task state', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    const statePath = path.join(dir, '.agentloop/state.json');

    await writeJson(statePath, { version: 1, activeTaskPath: taskPath });
    const humanResult = await execa(tsxPath, [cliPath, 'task', 'clear', '--redact-paths'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    expect(humanResult.stdout).toContain('[git-root]/.agentloop/tasks/2026-06-09-demo.md');
    expect(humanResult.stdout).not.toContain(dir);

    await writeJson(statePath, { version: 1, activeTaskPath: taskPath });
    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'task', 'clear', '--json', '--redact-paths'],
      {
        cwd: dir,
        timeout: CLI_PROCESS_TIMEOUT_MS,
      },
    );
    expect(JSON.parse(jsonResult.stdout)).toEqual({
      activeTask: null,
      cleared: true,
      activeTaskPath: '[git-root]/.agentloop/tasks/2026-06-09-demo.md',
    });
    expect(jsonResult.stdout).not.toContain(dir);
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

  test('labels AgentFlight placeholders in task list output', async () => {
    const { dir } = await createTaskStateFixture();
    const title = 'Separate AgentFlight placeholders from roadmap task counts';
    await writeFile(
      path.join(
        dir,
        '.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md',
      ),
      agentFlightPlaceholderMarkdown(title),
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'list', '--json'], { cwd: dir });
    const humanResult = await execa(tsxPath, [cliPath, 'task', 'list'], { cwd: dir });

    expect(JSON.parse(jsonResult.stdout).tasks).toContainEqual(
      expect.objectContaining({
        title,
        status: 'deferred',
        source: 'agentflight-placeholder',
      }),
    );
    expect(humanResult.stdout).toContain(
      '`Separate AgentFlight placeholders from roadmap task counts` (`deferred`, `AgentFlight placeholder`)',
    );
  });

  test('accepts redact-paths on task list without changing output or active state', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-real-deferred.md'),
      '# Real deferred\n\n- Status: deferred\n',
    );

    const help = await execa(tsxPath, [cliPath, 'task', 'list', '--help'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    expect(help.stdout).toContain('--redact-paths');

    const human = await execa(tsxPath, [cliPath, 'task', 'list'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    const redactedHuman = await execa(tsxPath, [cliPath, 'task', 'list', '--redact-paths'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    const json = JSON.parse(
      (
        await execa(tsxPath, [cliPath, 'task', 'list', '--json'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        })
      ).stdout,
    );
    const redactedJson = JSON.parse(
      (
        await execa(tsxPath, [cliPath, 'task', 'list', '--json', '--redact-paths'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        })
      ).stdout,
    );

    expect(redactedHuman.stdout).toBe(human.stdout);
    expect(redactedJson).toEqual(json);
    await expect(readFile(path.join(dir, '.agentloop/state.json'), 'utf8')).rejects.toThrow();
  });

  test('filters task list status output from the CLI', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-real-deferred.md'),
      '# Real deferred\n\n- Status: deferred\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-review.md'),
      '# Review task\n\n- Status: review\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-17-agentflight-placeholder.md'),
      agentFlightPlaceholderMarkdown('Deferred placeholder'),
    );

    const help = await execa(tsxPath, [cliPath, 'task', 'list', '--help'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    expect(help.stdout).toContain('--status <status>');

    const human = await execa(tsxPath, [cliPath, 'task', 'list', '--status', 'deferred'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    expect(human.stdout).toContain('`Real deferred` (`deferred`)');
    expect(human.stdout).toContain(
      '`Deferred placeholder` (`deferred`, `AgentFlight placeholder`)',
    );
    expect(human.stdout).not.toContain('`Demo task` (`proposed`)');
    expect(human.stdout).not.toContain('`Review task` (`review`)');

    const json = JSON.parse(
      (
        await execa(tsxPath, [cliPath, 'task', 'list', '--json', '--status', 'deferred'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        })
      ).stdout,
    );
    expect(json.tasks).toEqual([
      expect.objectContaining({ title: 'Real deferred', status: 'deferred' }),
      expect.objectContaining({
        title: 'Deferred placeholder',
        status: 'deferred',
        source: 'agentflight-placeholder',
      }),
    ]);
    expect(json.taskContracts).toEqual([
      expect.objectContaining({ title: 'Real deferred', status: 'deferred' }),
    ]);
    expect(json.agentFlightPlaceholders).toEqual([
      expect.objectContaining({
        title: 'Deferred placeholder',
        status: 'deferred',
        source: 'agentflight-placeholder',
      }),
    ]);

    await expect(readFile(path.join(dir, '.agentloop/state.json'), 'utf8')).rejects.toThrow();
  });

  test('prints unsupported task list status errors as JSON when requested', async () => {
    const { dir } = await createTaskStateFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'list', '--status', 'waiting', '--json'],
      { cwd: dir, reject: false, timeout: CLI_PROCESS_TIMEOUT_MS },
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
    await expect(readFile(path.join(dir, '.agentloop/state.json'), 'utf8')).rejects.toThrow();
  });

  test('keeps unsupported task list status errors human-readable by default', async () => {
    const { dir } = await createTaskStateFixture();

    const result = await execa(tsxPath, [cliPath, 'task', 'list', '--status', 'waiting'], {
      cwd: dir,
      reject: false,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Unsupported task status "waiting".');
    await expect(readFile(path.join(dir, '.agentloop/state.json'), 'utf8')).rejects.toThrow();
  });

  test('groups AgentFlight placeholders after ordinary task contracts in task list output', async () => {
    const { dir } = await createTaskStateFixture();
    const placeholderTitle = 'Group AgentFlight placeholders in task list';
    await writeFile(
      path.join(
        dir,
        '.agentloop/tasks/2026-06-16-group-agentflight-placeholders-in-task-list-2.md',
      ),
      agentFlightPlaceholderMarkdown(placeholderTitle),
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-real-deferred.md'),
      '# Real deferred\n\n- Status: deferred\n',
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'list'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    const realIndex = result.stdout.indexOf('`Real deferred` (`deferred`)');
    const sectionIndex = result.stdout.indexOf('AgentFlight placeholders:');
    const placeholderIndex = result.stdout.indexOf(
      '`Group AgentFlight placeholders in task list` (`deferred`, `AgentFlight placeholder`)',
    );
    expect(realIndex).toBeGreaterThan(-1);
    expect(sectionIndex).toBeGreaterThan(realIndex);
    expect(placeholderIndex).toBeGreaterThan(sectionIndex);
    expect(result.stdout).toContain(
      '  `.agentloop/tasks/2026-06-16-group-agentflight-placeholders-in-task-list-2.md`',
    );
  });

  test('orders real task contracts before AgentFlight placeholders in JSON task list output', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    const realTaskPath = path.join(dir, '.agentloop/tasks/2026-06-16-real-roadmap-task.md');
    const placeholderTaskPath = path.join(
      dir,
      '.agentloop/tasks/2026-06-16-prioritize-real-task-contracts-in-json-task-list.md',
    );
    await writeFile(realTaskPath, '# Real roadmap task\n\n- Status: deferred\n');
    await writeFile(
      placeholderTaskPath,
      agentFlightPlaceholderMarkdown('Prioritize real task contracts in JSON task list'),
    );
    await utimes(
      taskPath,
      new Date('2026-06-16T10:00:00.000Z'),
      new Date('2026-06-16T10:00:00.000Z'),
    );
    await utimes(
      realTaskPath,
      new Date('2026-06-16T11:00:00.000Z'),
      new Date('2026-06-16T11:00:00.000Z'),
    );
    await utimes(
      placeholderTaskPath,
      new Date('2026-06-16T12:00:00.000Z'),
      new Date('2026-06-16T12:00:00.000Z'),
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'list', '--json'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    const tasks = JSON.parse(result.stdout).tasks as Array<{ title: string; source?: string }>;

    const firstPlaceholderIndex = tasks.findIndex(
      (task) => task.source === 'agentflight-placeholder',
    );
    const lastRealTaskIndex = tasks.reduce(
      (latest, task, index) => (task.source === 'agentflight-placeholder' ? latest : index),
      -1,
    );
    expect(firstPlaceholderIndex).toBeGreaterThan(lastRealTaskIndex);
    expect(tasks.map((task) => task.title)).toEqual([
      'Real roadmap task',
      'Demo task',
      'Prioritize real task contracts in JSON task list',
    ]);
  });

  test('exposes AgentFlight placeholder groups in JSON task list output', async () => {
    const { dir, taskPath } = await createTaskStateFixture();
    const realTaskPath = path.join(dir, '.agentloop/tasks/2026-06-16-real-deferred.md');
    const placeholderTaskPath = path.join(
      dir,
      '.agentloop/tasks/2026-06-17-expose-agentflight-placeholder-groups-in-task-list-json.md',
    );
    await writeFile(
      realTaskPath,
      '# Real deferred\n\n- Status: deferred\n',
    );
    await writeFile(
      placeholderTaskPath,
      agentFlightPlaceholderMarkdown('Expose AgentFlight placeholder groups in task list JSON'),
    );
    await utimes(
      taskPath,
      new Date('2026-06-16T10:00:00.000Z'),
      new Date('2026-06-16T10:00:00.000Z'),
    );
    await utimes(
      realTaskPath,
      new Date('2026-06-16T11:00:00.000Z'),
      new Date('2026-06-16T11:00:00.000Z'),
    );
    await utimes(
      placeholderTaskPath,
      new Date('2026-06-16T12:00:00.000Z'),
      new Date('2026-06-16T12:00:00.000Z'),
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'list', '--json'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    const payload = JSON.parse(result.stdout) as {
      tasks: Array<{ title: string; source?: string }>;
      taskContracts: Array<{ title: string; source?: string }>;
      agentFlightPlaceholders: Array<{ title: string; source?: string }>;
    };

    expect(payload.tasks.map((task) => task.title)).toEqual([
      'Real deferred',
      'Demo task',
      'Expose AgentFlight placeholder groups in task list JSON',
    ]);
    expect(payload.taskContracts).toEqual([
      expect.objectContaining({ title: 'Real deferred' }),
      expect.objectContaining({ title: 'Demo task' }),
    ]);
    expect(payload.taskContracts).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ source: 'agentflight-placeholder' })]),
    );
    expect(payload.agentFlightPlaceholders).toEqual([
      expect.objectContaining({
        title: 'Expose AgentFlight placeholder groups in task list JSON',
        source: 'agentflight-placeholder',
      }),
    ]);
    expect(payload.tasks).toHaveLength(
      payload.taskContracts.length + payload.agentFlightPlaceholders.length,
    );
  });

  test('bounds AgentFlight placeholders in human task list output while JSON stays complete', async () => {
    const { dir } = await createTaskStateFixture();
    const placeholderTitles = Array.from(
      { length: 7 },
      (_, index) => `AgentFlight placeholder ${index + 1}`,
    );
    for (const [index, title] of placeholderTitles.entries()) {
      await writeFile(
        path.join(dir, `.agentloop/tasks/2026-06-16-agentflight-placeholder-${index + 1}.md`),
        agentFlightPlaceholderMarkdown(title),
      );
    }

    const humanResult = await execa(tsxPath, [cliPath, 'task', 'list'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'task', 'list', '--json'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    const visiblePlaceholderRows =
      humanResult.stdout.match(
        /`AgentFlight placeholder \d+` \(`deferred`, `AgentFlight placeholder`\)/g,
      ) ?? [];
    const jsonPlaceholders = JSON.parse(jsonResult.stdout).tasks.filter(
      (task: { source?: string }) => task.source === 'agentflight-placeholder',
    );

    expect(visiblePlaceholderRows).toHaveLength(5);
    expect(humanResult.stdout).toContain('... 2 more AgentFlight placeholder task(s) hidden');
    expect(humanResult.stdout).toContain(
      'Run `agentloop task list --json` to inspect all placeholders.',
    );
    expect(jsonPlaceholders).toHaveLength(7);
  });

  test('prints compact task list JSON when brief JSON is requested', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-real-deferred.md'),
      '# Real deferred\n\n- Status: deferred\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-review.md'),
      '# Review task\n\n- Status: review\n',
    );
    for (const index of [1, 2, 3, 4]) {
      await writeFile(
        path.join(dir, `.agentloop/tasks/2026-06-17-placeholder-${index}.md`),
        agentFlightPlaceholderMarkdown(`Placeholder ${index}`),
      );
    }

    const [fullResult, compactResult, compactDeferredResult, humanResult, briefHumanResult] =
      await Promise.all([
        execa(tsxPath, [cliPath, 'task', 'list', '--json'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        }),
        execa(tsxPath, [cliPath, 'task', 'list', '--json', '--brief'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        }),
        execa(tsxPath, [cliPath, 'task', 'list', '--json', '--brief', '--status', 'deferred'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        }),
        execa(tsxPath, [cliPath, 'task', 'list'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        }),
        execa(tsxPath, [cliPath, 'task', 'list', '--brief'], {
          cwd: dir,
          timeout: CLI_PROCESS_TIMEOUT_MS,
        }),
      ]);

    const full = JSON.parse(fullResult.stdout);
    const compact = JSON.parse(compactResult.stdout);
    const compactDeferred = JSON.parse(compactDeferredResult.stdout);

    expect(full.tasks).toHaveLength(7);
    expect(full.taskContracts).toHaveLength(3);
    expect(full.agentFlightPlaceholders).toHaveLength(4);
    expect(compact.tasks).toBeUndefined();
    expect(compact.totalCount).toBe(7);
    expect(compact.statusFilter).toBeNull();
    expect(compact.taskContracts).toEqual({
      count: 3,
      hiddenCount: 0,
      preview: expect.arrayContaining([
        expect.objectContaining({ title: 'Real deferred', status: 'deferred' }),
        expect.objectContaining({ title: 'Review task', status: 'review' }),
        expect.objectContaining({ title: 'Demo task', status: 'proposed' }),
      ]),
    });
    expect(compact.agentFlightPlaceholders).toEqual({
      count: 4,
      hiddenCount: 1,
      preview: expect.arrayContaining([
        expect.objectContaining({ status: 'deferred', source: 'agentflight-placeholder' }),
      ]),
    });
    expect(compact.agentFlightPlaceholders.preview).toHaveLength(3);
    expect(
      compact.agentFlightPlaceholders.preview.every((task: { title: string }) =>
        task.title.startsWith('Placeholder '),
      ),
    ).toBe(true);
    expect(compact.brief).toBe(
      'AgentLoopKit tasks: total=7, taskContracts=3, agentFlightPlaceholders=4',
    );

    expect(compactDeferred.tasks).toBeUndefined();
    expect(compactDeferred.statusFilter).toBe('deferred');
    expect(compactDeferred.totalCount).toBe(5);
    expect(compactDeferred.taskContracts).toEqual({
      count: 1,
      hiddenCount: 0,
      preview: [expect.objectContaining({ title: 'Real deferred', status: 'deferred' })],
    });
    expect(compactDeferred.agentFlightPlaceholders).toEqual({
      count: 4,
      hiddenCount: 1,
      preview: expect.arrayContaining([
        expect.objectContaining({ status: 'deferred', source: 'agentflight-placeholder' }),
      ]),
    });
    expect(compactDeferred.agentFlightPlaceholders.preview).toHaveLength(3);
    expect(
      compactDeferred.agentFlightPlaceholders.preview.every((task: { title: string }) =>
        task.title.startsWith('Placeholder '),
      ),
    ).toBe(true);
    expect(briefHumanResult.stdout).toBe(humanResult.stdout);
    expect(compactResult.stdout.length).toBeLessThan(fullResult.stdout.length);
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
    expect(result.stderr).toContain(
      'Use one of: proposed, in-progress, blocked, deferred, review, done.',
    );
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
    expect(JSON.parse(listResult.stdout)).toEqual({
      tasks: [],
      taskContracts: [],
      agentFlightPlaceholders: [],
    });
    const currentResult = await execa(tsxPath, [cliPath, 'task', 'current', '--json'], {
      cwd: dir,
    });
    expect(JSON.parse(currentResult.stdout)).toEqual({ activeTask: null });
  });

  test('prints a status-first next step after bulk archiving tasks', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-first.md'),
      '# First done task\n\n- Status: done\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-second.md'),
      '# Second done task\n\n- Status: done\n',
    );

    const result = await execa(tsxPath, [cliPath, 'task', 'archive', '--status', 'done'], {
      cwd: dir,
    });

    expect(result.stdout).toContain(
      'Bulk task archive complete: archived `2` task contract(s) with status `done`.',
    );
    expect(result.stdout).toContain(
      'Next step: run `agentloop status --redact-paths`; if it asks for handoff, run `agentloop handoff --write-run`.',
    );
  });

  test('does not print the handoff evidence step for bulk archive dry runs', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-first.md'),
      '# First done task\n\n- Status: done\n',
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '--status', 'done', '--dry-run'],
      { cwd: dir },
    );

    expect(result.stdout).toContain(
      'Bulk task archive dry run: would archive `1` task contract(s) with status `done`.',
    );
    expect(result.stdout).not.toContain('capture reviewer evidence');
    expect(await readFile(path.join(dir, '.agentloop/tasks/2026-06-09-first.md'), 'utf8')).toBe(
      '# First done task\n\n- Status: done\n',
    );
  });

  test('keeps bulk archive JSON output data-only', async () => {
    const { dir } = await createTaskStateFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-first.md'),
      '# First done task\n\n- Status: done\n',
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'task', 'archive', '--status', 'done', '--json'],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      taskArchive: {
        mode: 'bulk',
        status: 'done',
        dryRun: false,
        count: 1,
        tasks: [
          {
            previousPath: '.agentloop/tasks/2026-06-09-first.md',
            path: '.agentloop/tasks/archive/2026-06-09-first.md',
            title: 'First done task',
            status: 'done',
          },
        ],
      },
    });
  });
});
