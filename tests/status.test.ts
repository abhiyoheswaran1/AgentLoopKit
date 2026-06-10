import path from 'node:path';
import { mkdir, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('status command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints machine-readable repo status with latest unpinned task and report', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'demo', scripts: { test: 'vitest', build: 'tsc' } }, null, 2),
    );
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-add-settings-page.md'),
      '# Add settings page\n\n- Status: proposed\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.project.name).toBe('demo');
    expect(status.activeTask).toBeNull();
    expect(status.latestTask.title).toBe('Add settings page');
    expect(status.latestReport.overallStatus).toBe('pass');
    expect(status.workingTree.dirty).toBe(true);
    expect(status.workingTree.changedFileCount).toBeGreaterThan(0);
    expect(status.commands.configured).toContain('test');
    expect(status.nextAction.command).toBe(
      'agentloop task set .agentloop/tasks/2026-06-09-add-settings-page.md',
    );
  });

  test('prints markdown next action when no task exists', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(tsxPath, [cliPath, 'status'], { cwd: dir, reject: false });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('# AgentLoopKit Status');
    expect(result.stdout).toContain('agentloop create-task');
  });

  test('points back to verification when the latest report failed', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'changed.txt'), 'pending change\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-fix-login.md'),
      '# Fix login\n\n- Status: in progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: fail\n',
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask.title).toBe('Fix login');
    expect(status.latestReport.overallStatus).toBe('fail');
    expect(status.nextAction.command).toBe(
      'agentloop task set .agentloop/tasks/2026-06-09-fix-login.md',
    );
    expect(status.nextAction.reason).toContain('No active task is pinned');
    expect(markdownResult.stdout).toContain('Active task: none pinned.');
    expect(markdownResult.stdout).toContain(
      'Latest open task: Fix login (in progress) - .agentloop/tasks/2026-06-09-fix-login.md',
    );
    expect(markdownResult.stdout).toContain('Latest verification: fail');
    expect(markdownResult.stdout).toContain(
      'Run `agentloop task set .agentloop/tasks/2026-06-09-fix-login.md`.',
    );
  });

  test('uses modified time instead of filename sort for the active task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const olderPath = path.join(dir, '.agentloop/tasks/2026-06-09-z-old-task.md');
    const newerPath = path.join(dir, '.agentloop/tasks/2026-06-09-a-new-task.md');
    await writeFile(olderPath, '# Older task\n\n- Status: proposed\n');
    await writeFile(newerPath, '# Newer task\n\n- Status: in progress\n');
    await utimes(olderPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(newerPath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask.title).toBe('Newer task');
    expect(status.latestTask.path).toContain('2026-06-09-a-new-task.md');
  });

  test('ignores completed tasks when choosing the latest unpinned task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const openPath = path.join(dir, '.agentloop/tasks/2026-06-09-open-task.md');
    const donePath = path.join(dir, '.agentloop/tasks/2026-06-09-done-task.md');
    await writeFile(openPath, '# Open task\n\n- Status: in-progress\n');
    await writeFile(donePath, '# Done task\n\n- Status: done\n');
    await utimes(openPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(donePath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask.title).toBe('Open task');
    expect(status.latestTask.path).toBe('.agentloop/tasks/2026-06-09-open-task.md');
  });

  test('reports no fallback active task when all task contracts are terminal', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-done-task.md'),
      '# Done task\n\n- Status: done\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-completed-task.md'),
      '# Completed task\n\n- Status: completed\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-verified-task.md'),
      '# Verified task\n\n- Status: verified\n',
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask).toBeNull();
    expect(status.nextAction.command).toBe('agentloop create-task');
    expect(markdownResult.stdout).toContain('Active task: No task contract found.');
  });

  test('prefers explicit active task state over modified time fallback', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const explicitPath = path.join(dir, '.agentloop/tasks/2026-06-09-explicit-task.md');
    const newerPath = path.join(dir, '.agentloop/tasks/2026-06-09-newer-task.md');
    await writeFile(explicitPath, '# Explicit task\n\n- Status: in progress\n');
    await writeFile(newerPath, '# Newer task\n\n- Status: proposed\n');
    await utimes(explicitPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(newerPath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-09-explicit-task.md',
      }),
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.activeTask.title).toBe('Explicit task');
    expect(status.activeTask.path).toBe('.agentloop/tasks/2026-06-09-explicit-task.md');
  });

  test('recommends archiving an explicitly active done task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const doneTaskPath = path.join(dir, '.agentloop/tasks/2026-06-09-done-task.md');
    await writeFile(doneTaskPath, '# Done task\n\n- Status: done\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({ version: 1, activeTaskPath: '.agentloop/tasks/2026-06-09-done-task.md' }),
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.activeTask.status).toBe('done');
    expect(status.nextAction.command).toBe(
      'agentloop task archive .agentloop/tasks/2026-06-09-done-task.md',
    );
    expect(status.nextAction.reason).toContain('active task is done');
    expect(markdownResult.stdout).toContain(
      'Run `agentloop task archive .agentloop/tasks/2026-06-09-done-task.md`.',
    );
  });
});
