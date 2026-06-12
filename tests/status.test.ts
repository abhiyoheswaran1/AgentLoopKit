import path from 'node:path';
import { mkdir, realpath, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_STATUS_TEST_TIMEOUT_MS = 90_000;

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
    expect(status.git.root).toBe(await realpath(dir));
    expect(status.git.targetIsRoot).toBe(true);
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

  test('redacts local git root paths when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const realRoot = await realpath(dir);

    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--json', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'status', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.exitCode).toBe(0);
    expect(jsonResult.stdout).not.toContain(realRoot);
    expect(humanResult.stdout).not.toContain(realRoot);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.git.root).toBe('[git-root]');
    expect(status.git.targetIsRoot).toBe(true);
    expect(humanResult.stdout).toContain('- Git root: `[git-root]`');
    expect(humanResult.stdout).toContain('- Git target: `root directory`');
  });

  test('discovers parent AgentLoop config when run from a nested directory', async () => {
    const dir = await makeTempDir();
    const nested = path.join(dir, 'src', 'features');
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await mkdir(nested, { recursive: true });
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'root-demo', scripts: { test: 'vitest' } }, null, 2),
    );
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: nested,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.project.name).toBe('root-demo');
    expect(status.git.root).toBe(await realpath(dir));
    expect(status.git.targetIsRoot).toBe(true);
  });

  test('ignores symlinked task and report roots that resolve outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideTasks = await makeTempDir();
    const outsideReports = await makeTempDir();
    tempDirs.push(dir, outsideTasks, outsideReports);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(outsideTasks, '2026-06-09-outside-task.md'),
      '# Outside task\n\n- Status: proposed\n',
    );
    await writeFile(
      path.join(outsideReports, '2026-06-09-12-30-verification-report.md'),
      '# Outside Verification\n\nOverall status: pass\n',
    );
    await rm(path.join(dir, '.agentloop/tasks'), { recursive: true, force: true });
    await rm(path.join(dir, '.agentloop/reports'), { recursive: true, force: true });
    await symlink(outsideTasks, path.join(dir, '.agentloop/tasks'), 'dir');
    await symlink(outsideReports, path.join(dir, '.agentloop/reports'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('Outside');
    const status = JSON.parse(result.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask).toBeNull();
    expect(status.latestReport).toBeUndefined();
    expect(status.nextAction.command).toBe('agentloop create-task');
  });

  test('prints invalid config errors as JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
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

  test('prints missing config errors as JSON before setup', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'CONFIG_ERROR',
      message: expect.stringContaining('AgentLoopKit config not found'),
    });
    expect(output.error.message).toContain('agentloop init');
  });

  test('prints a clear missing config hint in human output before setup', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('agentloop: AgentLoopKit config not found');
    expect(result.stderr).toContain('agentloop init');
    expect(result.stderr).not.toContain('ENOENT');
  });

  test('prints malformed config errors as JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'agentloop.config.json'), '{not-json');

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
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

  test('keeps malformed config errors human-readable by default', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'agentloop.config.json'), '{not-json');

    const result = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Invalid AgentLoopKit config');
  });

  test('prints git target warning when status runs from a git repository subdirectory', async () => {
    const dir = await makeTempDir();
    const packageDir = path.join(dir, 'packages', 'web');
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await mkdir(packageDir, { recursive: true });
    await writeFile(path.join(packageDir, 'package.json'), JSON.stringify({ name: 'demo-web' }));
    await initializeAgentLoop({ cwd: packageDir });

    const result = await execa(tsxPath, [cliPath, 'status'], {
      cwd: packageDir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`- Git root: \`${await realpath(dir)}\``);
    expect(result.stdout).toContain('- Git target: `subdirectory`');
    expect(result.stdout).toContain(
      '- Git target warning: AgentLoopKit files live in the current directory, not the Git root.',
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

  test('still recommends creating a task when dirty work has no task evidence', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'changed.txt'), 'unscoped change\n');

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.workingTree.dirty).toBe(true);
    expect(status.latestRun).toBeUndefined();
    expect(status.nextAction.command).toBe('agentloop create-task');
  });

  test('renders status markdown values with safe inline code when task data contains backticks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'demo`pkg', scripts: { test: 'vitest' } }, null, 2),
    );
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-active`task.md'),
      '# Active `task`\n\n- Status: review`ready\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-09-active`task.md',
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass`ok\n',
    );

    const humanResult = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(humanResult.exitCode).toBe(0);
    expect(humanResult.stdout).toContain('- Project: ``demo`pkg`` (`node`)');
    expect(humanResult.stdout).toContain(
      '- Active task: `` Active `task` `` (``review`ready``) - ``.agentloop/tasks/2026-06-09-active`task.md``',
    );
    expect(humanResult.stdout).toContain(
      '- Latest verification: `pass` - `.agentloop/reports/2026-06-09-12-30-verification-report.md`',
    );
    const status = JSON.parse(jsonResult.stdout);
    expect(status.project.name).toBe('demo`pkg');
    expect(status.activeTask.title).toBe('Active `task`');
    expect(status.activeTask.path).toBe('.agentloop/tasks/2026-06-09-active`task.md');
    expect(status.latestReport.overallStatus).toBe('pass');
  });

  test('prints compact status with --brief', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-09-ship-brief-status.md');
    await writeFile(taskPath, '# Ship brief status\n\n- Status: in progress\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-09-ship-brief-status.md',
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(path.join(dir, 'changed.txt'), 'pending change\n');

    const result = await execa(tsxPath, [cliPath, 'status', '--brief'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--brief', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('# AgentLoopKit Status');
    expect(result.stdout).toContain('AgentLoopKit:');
    expect(result.stdout).toContain('task="Ship brief status"');
    expect(result.stdout).toContain('status="in progress"');
    expect(result.stdout).toContain('verification=pass');
    expect(result.stdout).toContain('tree=dirty');
    expect(result.stdout).toContain('next="agentloop handoff"');
    expect(jsonResult.exitCode).toBe(0);
    const output = JSON.parse(jsonResult.stdout);
    expect(output.brief).toContain('next="agentloop handoff"');
  });

  test('shows latest run ledger evidence in JSON, markdown, and brief status', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, '.agentloop/runs/2026-06-12-10-00-ship'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/runs/2026-06-12-10-00-ship/metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-10-00-ship',
          command: 'ship',
          createdAt: '2026-06-12-10-00',
          task: {
            path: '.agentloop/tasks/2026-06-12-review-login.md',
            title: 'Review login redirect',
            status: 'review',
          },
          verificationReportPath: '/tmp/demo/.agentloop/reports/verify.md',
          shipReportPath: '/tmp/demo/.agentloop/reports/ship.md',
          score: 91,
          changedFileCount: 4,
        },
        null,
        2,
      ),
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });
    const briefResult = await execa(tsxPath, [cliPath, 'status', '--brief'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.latestRun).toMatchObject({
      id: '2026-06-12-10-00-ship',
      command: 'ship',
      score: 91,
      changedFileCount: 4,
      shipReportPath: '.agentloop/reports/ship.md',
    });
    expect(markdownResult.stdout).toContain(
      '- Latest run: `ship` `91`/100 - `2026-06-12-10-00-ship`',
    );
    expect(markdownResult.stdout).toContain('`.agentloop/reports/ship.md`');
    expect(briefResult.stdout).toContain('run="ship 91/100"');
  }, CLI_STATUS_TEST_TIMEOUT_MS);

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
      'Latest open task: `Fix login` (`in progress`) - `.agentloop/tasks/2026-06-09-fix-login.md`',
    );
    expect(markdownResult.stdout).toContain('Latest verification: `fail`');
    expect(markdownResult.stdout).toContain(
      'Run `agentloop task set .agentloop/tasks/2026-06-09-fix-login.md`.',
    );
  });

  test('recommends finishing an active review task when verification passed and the tree is clean', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const taskPath = '.agentloop/tasks/2026-06-09-review-login.md';
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
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
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
    expect(status.activeTask).toMatchObject({
      path: taskPath,
      title: 'Review login',
      status: 'review',
    });
    expect(status.nextAction.command).toBe('agentloop task done');
    expect(status.nextAction.reason).toContain('active task is in review');
    expect(markdownResult.stdout).toContain('Run `agentloop task done`.');
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

  test('ignores deferred tasks when choosing the latest unpinned task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const openPath = path.join(dir, '.agentloop/tasks/2026-06-09-open-task.md');
    const deferredPath = path.join(dir, '.agentloop/tasks/2026-06-10-deferred-task.md');
    await writeFile(openPath, '# Open task\n\n- Status: proposed\n');
    await writeFile(deferredPath, '# Deferred task\n\n- Status: deferred\n');
    await utimes(openPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(deferredPath, new Date('2026-06-10T10:00:00Z'), new Date('2026-06-10T10:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask.title).toBe('Open task');
    expect(status.latestTask.path).toBe('.agentloop/tasks/2026-06-09-open-task.md');
    expect(status.deferredTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-10-deferred-task.md',
        title: 'Deferred task',
        status: 'deferred',
      },
    ]);
    expect(status.nextAction.command).toBe(
      'agentloop task set .agentloop/tasks/2026-06-09-open-task.md',
    );
  });

  test('reports no latest task when only deferred tasks are present', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-deferred-task.md'),
      '# Deferred task\n\n- Status: deferred\n',
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
    expect(status.deferredTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-10-deferred-task.md',
        title: 'Deferred task',
        status: 'deferred',
      },
    ]);
    expect(status.nextAction.command).toBe('agentloop create-task');
    expect(status.nextAction.reason).toContain('1 deferred task contract is parked');
    expect(markdownResult.stdout).toContain('Active task: none active; 1 deferred task parked.');
    expect(markdownResult.stdout).toContain('Deferred tasks: 1 parked - `Deferred task`');
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

  test('hydrates latest run task metadata from archived task files', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    const archivedTaskPath = path.join(
      dir,
      '.agentloop/tasks/archive/2026-06-12-fix-login.md',
    );
    await mkdir(runsDir, { recursive: true });
    await mkdir(path.dirname(archivedTaskPath), { recursive: true });
    await writeFile(archivedTaskPath, '# Fix login redirect bug\n\n- Status: done\n');
    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-00-00-ship',
          command: 'ship',
          createdAt: '2026-06-12-00-00',
          createdAtEpochMs: 1_000,
          task: {
            path: '.agentloop/tasks/2026-06-12-fix-login.md',
            title: 'Old run snapshot title',
            status: 'in-progress',
          },
          score: 100,
          changedFileCount: 1,
        },
        null,
        2,
      ),
    );
    await writeFile(path.join(dir, 'changed.txt'), 'post-archive evidence change\n');

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });
    const briefResult = await execa(tsxPath, [cliPath, 'status', '--brief'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'status'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(briefResult.exitCode).toBe(0);
    expect(markdownResult.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.latestRun.task).toEqual({
      path: '.agentloop/tasks/archive/2026-06-12-fix-login.md',
      title: 'Fix login redirect bug',
      status: 'done',
    });
    expect(status.nextAction.command).toBe('agentloop handoff');
    expect(status.nextAction.reason).toContain('latest run references completed task evidence');
    expect(briefResult.stdout).toContain('next="agentloop handoff"');
    expect(markdownResult.stdout).toContain('Run `agentloop handoff`.');
  });
});
