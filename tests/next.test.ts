import path from 'node:path';
import { access, mkdir, utimes, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

async function exists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

describe('next command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints the next action as JSON without running configured verification commands', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify(
        {
          name: 'next-demo',
          scripts: {
            test: "node -e \"require('fs').writeFileSync('marker.txt', 'ran')\"",
          },
        },
        null,
        2,
      ),
    );
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'changed.txt'), 'pending change\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-add-settings.md'),
      '# Add settings\n\n- Status: in-progress\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-10-add-settings.md',
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-10-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.command).toBe('agentloop handoff');
    expect(next.reason).toContain('verification evidence');
    expect(next.activeTask.title).toBe('Add settings');
    expect(next.latestTask).toBeNull();
    expect(next.latestReport.overallStatus).toBe('pass');
    expect(next.workingTree.dirty).toBe(true);
    expect(next.workingTree.changedFileCount).toBeGreaterThan(0);
    expect(await exists(path.join(dir, 'marker.txt'))).toBe(false);
  });

  test('prints invalid config errors as JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'CONFIG_ERROR',
      message: expect.stringContaining('Invalid AgentLoopKit config'),
    });
  });

  test('prints a concise human next action when no task exists', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('# AgentLoopKit Next Action');
    expect(result.stdout).toContain('Run `agentloop create-task`.');
    expect(result.stdout).toContain('No task contract was found.');
  });

  test('renders next markdown values with safe inline code when task data contains backticks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'changed.txt'), 'pending change\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-active`task.md'),
      '# Active `task`\n\n- Status: review`ready\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-10-active`task.md',
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-10-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass`ok\n',
    );

    const humanResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(humanResult.exitCode).toBe(0);
    expect(humanResult.stdout).toContain('Run `agentloop handoff`.');
    expect(humanResult.stdout).toContain(
      '- Active task: `` Active `task` `` (``review`ready``) - ``.agentloop/tasks/2026-06-10-active`task.md``',
    );
    expect(humanResult.stdout).toContain(
      '- Latest verification: `pass` - `.agentloop/reports/2026-06-10-10-00-verification-report.md`',
    );
    const next = JSON.parse(jsonResult.stdout);
    expect(next.activeTask.title).toBe('Active `task`');
    expect(next.activeTask.path).toBe('.agentloop/tasks/2026-06-10-active`task.md');
    expect(next.latestReport.overallStatus).toBe('pass');
  });

  test('points back to verification when the latest report failed', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-fix-login.md'),
      '# Fix login\n\n- Status: review\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-10-fix-login.md',
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-10-05-verification-report.md'),
      '# Verification Report\n\nOverall status: fail\n',
    );

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.command).toBe('agentloop verify');
    expect(next.reason).toContain('failed');
    expect(next.activeTask.title).toBe('Fix login');
    expect(next.latestTask).toBeNull();
    expect(next.latestReport.overallStatus).toBe('fail');
  });

  test('recommends finishing an active review task when verification passed and the tree is clean', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const taskPath = '.agentloop/tasks/2026-06-10-review-login.md';
    await writeFile(path.join(dir, taskPath), '# Review login\n\n- Status: review\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: taskPath,
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-10-05-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask.status).toBe('review');
    expect(next.latestReport.overallStatus).toBe('pass');
    expect(next.command).toBe('agentloop task done');
    expect(next.reason).toContain('active task is in review');
  });

  test('does not treat an older verification report as evidence for the active task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-10-current-task.md');
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-10-08-00-verification-report.md');
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, '# Verification Report\n\nOverall status: pass\n');
    await writeFile(taskPath, '# Current task\n\n- Status: in-progress\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-10-current-task.md',
      }),
    );
    await utimes(reportPath, new Date('2026-06-10T08:00:00Z'), new Date('2026-06-10T08:00:00Z'));
    await utimes(taskPath, new Date('2026-06-10T09:00:00Z'), new Date('2026-06-10T09:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask.title).toBe('Current task');
    expect(next.latestTask).toBeNull();
    expect(next.latestReport).toBeNull();
    expect(next.command).toBe('agentloop verify');
    expect(next.reason).toContain('no verification report');
  });

  test('ignores an unpinned done task when choosing the next action', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-10-complete-task.md');
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-10-08-00-verification-report.md');
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, '# Verification Report\n\nOverall status: pass\n');
    await writeFile(taskPath, '# Complete task\n\n- Status: done\n');
    await writeFile(path.join(dir, 'changed.txt'), 'pending handoff\n');
    await utimes(reportPath, new Date('2026-06-10T08:00:00Z'), new Date('2026-06-10T08:00:00Z'));
    await utimes(taskPath, new Date('2026-06-10T09:00:00Z'), new Date('2026-06-10T09:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask).toBeNull();
    expect(next.latestTask).toBeNull();
    expect(next.latestReport.overallStatus).toBe('pass');
    expect(next.command).toBe('agentloop create-task');
  });

  test('recommends pinning an unpinned open task before continuing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-open-task.md'),
      '# Open task\n\n- Status: in-progress\n',
    );

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask).toBeNull();
    expect(next.latestTask.title).toBe('Open task');
    expect(next.command).toBe('agentloop task set .agentloop/tasks/2026-06-10-open-task.md');
    expect(next.reason).toContain('No active task is pinned');
    expect(await exists(path.join(dir, '.agentloop/state.json'))).toBe(false);
  });

  test('does not recommend a command when only deferred tasks are parked in a clean repo', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-deferred-task.md'),
      '# Deferred task\n\n- Status: deferred\n',
    );
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      [
        '-c',
        'user.name=AgentLoopKit Test',
        '-c',
        'user.email=test@example.com',
        'commit',
        '-m',
        'baseline',
        '-q',
      ],
      { cwd: dir },
    );

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask).toBeNull();
    expect(next.latestTask).toBeNull();
    expect(next.deferredTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-10-deferred-task.md',
        title: 'Deferred task',
        status: 'deferred',
      },
    ]);
    expect(next.command).toBe('none');
    expect(next.reason).toContain('1 deferred task contract is parked, and the repo is clean');
  });

  test('prints no required command when only deferred tasks are parked in a clean repo', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-deferred-task.md'),
      '# Deferred task\n\n- Status: deferred\n',
    );
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      [
        '-c',
        'user.name=AgentLoopKit Test',
        '-c',
        'user.email=test@example.com',
        'commit',
        '-m',
        'baseline',
        '-q',
      ],
      { cwd: dir },
    );

    const result = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('# AgentLoopKit Next Action');
    expect(result.stdout).toContain('No command required.');
    expect(result.stdout).toContain('Deferred tasks: 1 parked - `Deferred task`');
    expect(result.stdout).toContain('1 deferred task contract is parked, and the repo is clean');
  });

  test('recommends finishing an active task when dirty files are covered by the latest handoff run', async () => {
    const dir = await makeTempDir();
    const runId = '2026-06-13-00-44-handoff';
    const taskPath = '.agentloop/tasks/2026-06-13-active-handoff.md';
    const handoffPath = '.agentloop/handoffs/2026-06-13-00-44-pr-summary.md';
    const runsDir = path.join(dir, '.agentloop/runs', runId);
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    await writeFile(path.join(dir, taskPath), '# Active handoff\n\n- Status: in-progress\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({ version: 1, activeTaskPath: taskPath }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-13-00-40-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/runs/.gitkeep'), '');
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/handoffs/.gitkeep'), '');
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.name=AgentLoopKit Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'baseline', '-q'],
      { cwd: dir },
    );
    await mkdir(runsDir, { recursive: true });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 2;\n');
    await writeFile(path.join(dir, handoffPath), '# PR Summary\n');
    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: runId,
          command: 'handoff',
          createdAt: '2026-06-13-00-44',
          createdAtEpochMs: 1_000,
          task: {
            path: taskPath,
            title: 'Active handoff',
            status: 'in-progress',
          },
          verificationReportPath: '.agentloop/reports/2026-06-13-00-40-verification-report.md',
          handoffPath,
          changedFileCount: 1,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, 'changed-files.json'),
      `${JSON.stringify([{ status: 'M', path: 'src.ts' }], null, 2)}\n`,
    );

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask).toMatchObject({
      path: taskPath,
      title: 'Active handoff',
      status: 'in-progress',
    });
    expect(next.workingTree.dirty).toBe(true);
    expect(next.command).toBe('agentloop task done');
    expect(next.reason).toContain('handoff evidence cover the current dirty files');
  });

  test('recommends archiving a pinned done task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-10-complete-task.md');
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-10-08-00-verification-report.md');
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, '# Verification Report\n\nOverall status: pass\n');
    await writeFile(taskPath, '# Complete task\n\n- Status: done\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-10-complete-task.md',
      }),
    );

    const result = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask.status).toBe('done');
    expect(next.latestTask).toBeNull();
    expect(next.latestReport.overallStatus).toBe('pass');
    expect(next.command).toBe(
      'agentloop task archive .agentloop/tasks/2026-06-10-complete-task.md',
    );
  });
});
