import path from 'node:path';
import { mkdir, realpath, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_CHECK_GATES_TEST_TIMEOUT_MS = 90_000;

let tempDirs: string[] = [];

async function createInitializedRepo() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await execa('git', ['init', '-q'], { cwd: dir });
  await initializeAgentLoop({ cwd: dir });
  return dir;
}

async function commitAll(dir: string, message = 'baseline') {
  await execa('git', ['add', '.'], { cwd: dir });
  await execa(
    'git',
    ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', message],
    { cwd: dir },
  );
}

describe('check-gates command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints machine-readable pass results when evidence exists', async () => {
    const dir = await createInitializedRepo();
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-09-12-35-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await commitAll(dir);

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.git.root).toBe(await realpath(dir));
    expect(output.git.targetIsRoot).toBe(true);
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'verification-report', status: 'pass' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'pass' }),
        expect.objectContaining({
          id: 'task-hygiene',
          status: 'pass',
          message: 'Task folder hygiene checks passed.',
        }),
        expect.objectContaining({ id: 'repo-harness', status: 'pass' }),
        expect.objectContaining({ id: 'safety-policies', status: 'pass' }),
        expect.objectContaining({ id: 'git-context', status: 'pass' }),
      ]),
    );
    expect(output.nextAction.command).toBe('none');
  });

  test('passes strict gates when latest run references an archived task contract', async () => {
    const dir = await createInitializedRepo();
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-12-demo.md'),
      '# Demo task\n\n- Status: done\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-12-13-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-12-13-33-ship/metadata.json'), {
      id: '2026-06-12-13-33-ship',
      command: 'ship',
      createdAt: '2026-06-12-13-33',
      createdAtEpochMs: 1781264042972,
      task: {
        path: '.agentloop/tasks/2026-06-12-demo.md',
        title: 'Demo task',
        status: 'done',
      },
      verificationReportPath: '.agentloop/reports/2026-06-12-13-30-verification-report.md',
      handoffPath: '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md',
      shipReportPath: '.agentloop/reports/2026-06-12-13-33-ship-report.md',
      score: 96,
      changedFileCount: 1,
    });
    await commitAll(dir);

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--strict', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-contract',
          status: 'pass',
          message: 'Demo task',
          path: '.agentloop/tasks/archive/2026-06-12-demo.md',
        }),
      ]),
    );
  });

  test('does not request another handoff when latest handoff run covers dirty evidence', async () => {
    const dir = await createInitializedRepo();
    const runId = '2026-06-13-01-11-handoff';
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-13-docs-hygiene.md'),
      '# Docs hygiene\n\n- Status: done\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-13-01-06-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/handoffs/.gitkeep'), '');
    await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/runs/.gitkeep'), '');
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', 'init'],
      { cwd: dir },
    );

    await writeFile(path.join(dir, 'src.ts'), 'export const value = 2;\n');
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-13-01-11-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await writeJson(path.join(dir, '.agentloop/runs', runId, 'metadata.json'), {
      id: runId,
      command: 'handoff',
      createdAt: '2026-06-13-01-11',
      createdAtEpochMs: 1_000,
      task: {
        path: '.agentloop/tasks/2026-06-13-docs-hygiene.md',
        title: 'Docs hygiene',
        status: 'done',
      },
      verificationReportPath: '.agentloop/reports/2026-06-13-01-06-verification-report.md',
      handoffPath: '.agentloop/handoffs/2026-06-13-01-11-pr-summary.md',
      changedFileCount: 1,
    });
    await writeJson(path.join(dir, '.agentloop/runs', runId, 'changed-files.json'), [
      { status: 'M', path: 'src.ts' },
    ]);

    const coveredResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(coveredResult.exitCode).toBe(0);
    const coveredOutput = JSON.parse(coveredResult.stdout);
    expect(coveredOutput.overallStatus).toBe('pass');
    expect(coveredOutput.nextAction.command).toBe('agentloop create-task');

    await writeFile(path.join(dir, 'uncovered.ts'), 'export const uncovered = true;\n');

    const uncoveredResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(uncoveredResult.exitCode).toBe(0);
    const uncoveredOutput = JSON.parse(uncoveredResult.stdout);
    expect(uncoveredOutput.overallStatus).toBe('warn');
    expect(uncoveredOutput.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'warn',
          message: 'Latest handoff does not cover the current dirty files.',
        }),
      ]),
    );
    expect(uncoveredOutput.nextAction.command).toBe('agentloop handoff');

    const strictResult = await execa(tsxPath, [cliPath, 'check-gates', '--strict', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(strictResult.exitCode).toBe(1);
    expect(JSON.parse(strictResult.stdout)).toMatchObject({
      strict: true,
      overallStatus: 'fail',
      nextAction: {
        command: 'agentloop handoff',
        reason: 'Write a reviewer handoff after verification.',
      },
    });
  });

  test('does not request another handoff when latest ship run covers dirty evidence', async () => {
    const dir = await createInitializedRepo();
    const runId = '2026-06-13-01-12-ship';
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-13-ship-flow.md'),
      '# Ship flow\n\n- Status: done\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-13-01-06-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/handoffs/.gitkeep'), '');
    await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/runs/.gitkeep'), '');
    await commitAll(dir, 'init');

    await writeFile(path.join(dir, 'src.ts'), 'export const value = 2;\n');
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-13-01-12-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-13-01-12-ship-report.md'),
      '# AgentLoopKit Ship Report\n\n- Review readiness score: `94`/100\n',
    );
    await writeJson(path.join(dir, '.agentloop/runs', runId, 'metadata.json'), {
      id: runId,
      command: 'ship',
      createdAt: '2026-06-13-01-12',
      createdAtEpochMs: 2_000,
      task: {
        path: '.agentloop/tasks/2026-06-13-ship-flow.md',
        title: 'Ship flow',
        status: 'done',
      },
      verificationReportPath: '.agentloop/reports/2026-06-13-01-06-verification-report.md',
      handoffPath: '.agentloop/handoffs/2026-06-13-01-12-pr-summary.md',
      shipReportPath: '.agentloop/reports/2026-06-13-01-12-ship-report.md',
      score: 94,
      changedFileCount: 1,
    });
    await writeJson(path.join(dir, '.agentloop/runs', runId, 'changed-files.json'), [
      { status: 'M', path: 'src.ts' },
    ]);

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'pass',
          message: 'Reviewer handoff found.',
        }),
      ]),
    );
    expect(output.nextAction.command).toBe('agentloop create-task');
  });

  test('redacts local git root paths when requested', async () => {
    const dir = await createInitializedRepo();
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    const realRoot = await realpath(dir);

    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'check-gates', '--json', '--redact-paths'],
      {
        cwd: dir,
        reject: false,
      },
    );
    const humanResult = await execa(tsxPath, [cliPath, 'check-gates', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.stdout).not.toContain(realRoot);
    expect(humanResult.stdout).not.toContain(realRoot);
    const output = JSON.parse(jsonResult.stdout);
    expect(output.git.root).toBe('[git-root]');
    expect(output.git.targetIsRoot).toBe(true);
    expect(humanResult.stdout).toContain('- Git root: `[git-root]`');
    expect(humanResult.stdout).toContain('- Git target: `root directory`');
  });

  test('ignores symlinked report and handoff roots that resolve outside the repo', async () => {
    const dir = await createInitializedRepo();
    const outsideReports = await makeTempDir();
    const outsideHandoffs = await makeTempDir();
    tempDirs.push(outsideReports, outsideHandoffs);
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await writeFile(
      path.join(outsideReports, '2026-06-09-12-30-verification-report.md'),
      '# Outside Verification\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(outsideHandoffs, '2026-06-09-12-35-pr-summary.md'),
      '# Outside Handoff\n\nVerification status: Overall status: pass\n',
    );
    await rm(path.join(dir, '.agentloop/reports'), { recursive: true, force: true });
    await rm(path.join(dir, '.agentloop/handoffs'), { recursive: true, force: true });
    await symlink(outsideReports, path.join(dir, '.agentloop/reports'), 'dir');
    await symlink(outsideHandoffs, path.join(dir, '.agentloop/handoffs'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.stdout).not.toContain('Outside');
    const output = JSON.parse(result.stdout);
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'verification-report', status: 'fail' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'warn' }),
      ]),
    );
  });

  test('fails verification gate when the latest report predates the active task', async () => {
    const dir = await createInitializedRepo();
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-09-demo.md');
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md');
    await writeFile(taskPath, '# Demo task\n\n- Status: in-progress\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({ version: 1, activeTaskPath: '.agentloop/tasks/2026-06-09-demo.md' }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(reportPath, '# Verification Report\n\nOverall status: pass\n');
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-09-12-35-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await utimes(reportPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(taskPath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    const output = JSON.parse(result.stdout);
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'verification-report',
          status: 'fail',
          message: 'Latest verification report predates the current task. Rerun verification.',
          path: '.agentloop/reports/2026-06-09-12-30-verification-report.md',
        }),
      ]),
    );
    expect(output.nextAction.command).toBe(
      'agentloop verify --task .agentloop/tasks/2026-06-09-demo.md',
    );
  });

  test('treats required harness and policy symlinks outside the repo as missing', async () => {
    const dir = await createInitializedRepo();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-09-12-35-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await writeFile(path.join(outsideDir, 'AGENTS.md'), '# Outside agents\n\noutside-secret\n');
    await writeFile(
      path.join(outsideDir, 'secrets-policy.md'),
      '# Outside policy\n\noutside-secret\n',
    );
    await rm(path.join(dir, 'AGENTS.md'), { force: true });
    await rm(path.join(dir, '.agentloop/policies/secrets-policy.md'), { force: true });
    await symlink(path.join(outsideDir, 'AGENTS.md'), path.join(dir, 'AGENTS.md'), 'file');
    await symlink(
      path.join(outsideDir, 'secrets-policy.md'),
      path.join(dir, '.agentloop/policies/secrets-policy.md'),
      'file',
    );

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.stdout).not.toContain('outside-secret');
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('warn');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'repo-harness',
          status: 'warn',
          message: 'Missing harness files: AGENTS.md.',
        }),
        expect.objectContaining({
          id: 'safety-policies',
          status: 'warn',
          message: 'Missing policy files: .agentloop/policies/secrets-policy.md.',
        }),
      ]),
    );
  });

  test('prints invalid config errors as JSON', async () => {
    const dir = await createInitializedRepo();
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
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

  test('warns when review gates run from a git repository subdirectory', async () => {
    const dir = await makeTempDir();
    const packageDir = path.join(dir, 'packages', 'web');
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await mkdir(packageDir, { recursive: true });
    await writeFile(path.join(packageDir, 'package.json'), JSON.stringify({ name: 'demo-web' }));
    await initializeAgentLoop({ cwd: packageDir });
    await writeFile(path.join(packageDir, 'changed.ts'), 'export const changed = true;\n');
    await writeFile(
      path.join(packageDir, '.agentloop/tasks/2026-06-09-demo.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(packageDir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(packageDir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(packageDir, '.agentloop/handoffs/2026-06-09-12-35-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: packageDir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'check-gates'], {
      cwd: packageDir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    const output = JSON.parse(jsonResult.stdout);
    expect(output.overallStatus).toBe('warn');
    expect(output.git.root).toBe(await realpath(dir));
    expect(output.git.targetIsRoot).toBe(false);
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'git-target',
          status: 'warn',
          message:
            'Current directory is a Git subdirectory. AgentLoopKit files live in the current directory, not the Git root.',
        }),
      ]),
    );
    expect(humanResult.exitCode).toBe(0);
    expect(humanResult.stdout).toContain(`- Git root: \`${await realpath(dir)}\``);
    expect(humanResult.stdout).toContain('- Git target: `subdirectory`');
    expect(humanResult.stdout).toContain(
      '[`warn`] `Git target`: `Current directory is a Git subdirectory. AgentLoopKit files live in the current directory, not the Git root.`',
    );
  });

  test('renders markdown gate values with safe inline code when evidence contains backticks', async () => {
    const dir = await createInitializedRepo();
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', 'init'],
      { cwd: dir },
    );
    await execa('git', ['checkout', '-b', 'review`branch'], { cwd: dir });
    await writeFile(path.join(dir, 'changed`file.ts'), 'export const changed = true;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-11-active`gate.md'),
      '# Active `gate`\n\n- Status: in-progress\n',
    );

    const humanResult = await execa(tsxPath, [cliPath, 'check-gates'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(humanResult.exitCode).toBe(1);
    expect(humanResult.stdout).toContain('- Overall status: `fail`');
    expect(humanResult.stdout).toContain('- Git: ``review`branch``');
    expect(humanResult.stdout).toContain(`- Git root: \`${await realpath(dir)}\``);
    expect(humanResult.stdout).toContain('- Git target: `root directory`');
    expect(humanResult.stdout).toContain('- Changed files: `');
    expect(humanResult.stdout).toContain(
      '- [`pass`] `Task contract`: `` Active `gate` `` - ``.agentloop/tasks/2026-06-11-active`gate.md``',
    );
    expect(humanResult.stdout).toContain(
      '- [`fail`] `Verification report`: `No verification report found.`',
    );
    expect(humanResult.stdout).toContain(
      'Run ``agentloop verify --task .agentloop/tasks/2026-06-11-active`gate.md``.',
    );
    const output = JSON.parse(jsonResult.stdout);
    expect(output.git.branch).toBe('review`branch');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-contract',
          message: 'Active `gate`',
          path: '.agentloop/tasks/2026-06-11-active`gate.md',
        }),
      ]),
    );
    expect(output.nextAction.command).toBe(
      'agentloop verify --task .agentloop/tasks/2026-06-11-active`gate.md',
    );
  });

  test('warns and fails predictably when review evidence is missing', async () => {
    const dir = await createInitializedRepo();
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', 'init'],
      { cwd: dir },
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'check-gates'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(1);
    const output = JSON.parse(jsonResult.stdout);
    expect(output.overallStatus).toBe('fail');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'fail' }),
        expect.objectContaining({ id: 'verification-report', status: 'fail' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'warn' }),
        expect.objectContaining({ id: 'git-context', status: 'pass' }),
      ]),
    );
    expect(output.nextAction.command).toBe('agentloop create-task');
    expect(humanResult.exitCode).toBe(1);
    expect(humanResult.stdout).toContain('# AgentLoopKit Gates');
    expect(humanResult.stdout).toContain('[`fail`] `Task contract`');
    expect(humanResult.stdout).toContain('Run `agentloop create-task`.');
  });

  test('checks the newest open task instead of a newer finished fallback task', async () => {
    const dir = await createInitializedRepo();
    const openPath = path.join(dir, '.agentloop/tasks/2026-06-09-open-task.md');
    const donePath = path.join(dir, '.agentloop/tasks/2026-06-09-done-task.md');
    await writeFile(openPath, '# Open task\n\n- Status: in-progress\n');
    await writeFile(donePath, '# Done task\n\n- Status: done\n');
    await utimes(openPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(donePath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    const output = JSON.parse(result.stdout);
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-contract',
          status: 'pass',
          message: 'Open task',
          path: '.agentloop/tasks/2026-06-09-open-task.md',
        }),
      ]),
    );
  });

  test('warns about task folder hygiene diagnostics without failing default gates', async () => {
    const dir = await createInitializedRepo();
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-active-task.md'),
      '# Active task\n\n- Status: in-progress\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-finished-task.md'),
      '# Finished task\n\n- Status: done\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-09-12-35-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await commitAll(dir);

    const defaultResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });
    const strictResult = await execa(tsxPath, [cliPath, 'check-gates', '--strict', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'check-gates'], {
      cwd: dir,
      reject: false,
    });

    expect(defaultResult.exitCode).toBe(0);
    const output = JSON.parse(defaultResult.stdout);
    expect(output.overallStatus).toBe('warn');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-hygiene',
          status: 'warn',
          message:
            'Task folder has 1 hygiene diagnostic. Run `agentloop task doctor` for cleanup details.',
        }),
      ]),
    );
    expect(output.nextAction).toEqual({
      command: 'agentloop task doctor',
      reason: 'Review task-folder hygiene diagnostics before refreshing handoff evidence.',
    });

    expect(strictResult.exitCode).toBe(1);
    expect(JSON.parse(strictResult.stdout)).toMatchObject({
      strict: true,
      overallStatus: 'fail',
      nextAction: {
        command: 'agentloop task doctor',
        reason: 'Review task-folder hygiene diagnostics before refreshing handoff evidence.',
      },
    });

    expect(humanResult.exitCode).toBe(0);
    expect(humanResult.stdout).toContain(
      '[`warn`] `Task hygiene`: ``Task folder has 1 hygiene diagnostic. Run `agentloop task doctor` for cleanup details.``',
    );
    expect(humanResult.stdout).toContain('Run `agentloop task doctor`.');
  });

  test(
    'passes strict gates for clean verified evidence with no changed files',
    async () => {
      const dir = await createInitializedRepo();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-09-12-35-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', 'init'],
      { cwd: dir },
    );

      const defaultResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
        cwd: dir,
        reject: false,
      });
      const strictResult = await execa(tsxPath, [cliPath, 'check-gates', '--strict', '--json'], {
        cwd: dir,
        reject: false,
      });
      const humanResult = await execa(tsxPath, [cliPath, 'check-gates'], {
        cwd: dir,
        reject: false,
      });

      expect(defaultResult.exitCode).toBe(0);
      const defaultOutput = JSON.parse(defaultResult.stdout);
      expect(defaultOutput.overallStatus).toBe('pass');
      expect(defaultOutput.strict).toBe(false);
      expect(defaultOutput.nextAction).toEqual({
        command: 'none',
        reason: 'Gate evidence is complete and the repo is clean.',
      });
      expect(defaultOutput.gates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'git-context',
            status: 'pass',
            message: 'No changed files detected.',
          }),
        ]),
      );

      expect(strictResult.exitCode).toBe(0);
      const strictOutput = JSON.parse(strictResult.stdout);
      expect(strictOutput.overallStatus).toBe('pass');
      expect(strictOutput.strict).toBe(true);
      expect(strictOutput.nextAction).toEqual({
        command: 'none',
        reason: 'Gate evidence is complete and the repo is clean.',
      });
      expect(strictOutput.gates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'git-context',
            status: 'pass',
            message: 'No changed files detected.',
          }),
        ]),
      );
      expect(humanResult.exitCode).toBe(0);
      expect(humanResult.stdout).toContain('No command required.');
      expect(humanResult.stdout).toContain('Gate evidence is complete and the repo is clean.');
    },
    CLI_CHECK_GATES_TEST_TIMEOUT_MS,
  );
});
