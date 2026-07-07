import path from 'node:path';
import { mkdir, realpath, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_STATUS_TEST_TIMEOUT_MS = 90_000;

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

function taskContractMarkdown(title: string, options: { status?: string; taskType?: string } = {}) {
  const status = options.status ?? 'deferred';
  const taskType = options.taskType ?? 'feature';
  return `# ${title}

- Created date: 2026-06-17
- Task type: ${taskType}
- Status: ${status}

## Problem Statement
Test task.

## Desired Outcome
Test task is handled.

## Files or Areas Not to Touch
- tests/fixtures
`;
}

describe('status command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('documents status brief JSON help copy', async () => {
    const result = await execa(tsxPath, [cliPath, 'status', '--help'], {
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('--brief');
    expect(result.stdout.replace(/\s+/g, ' ')).toContain(
      'compact human output; with --json, compact machine-readable output',
    );
  });

  test('shows loop guidance for the active task when a matching loop file exists', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-21-feature-task.md'),
      taskContractMarkdown('Feature task', { status: 'in-progress', taskType: 'feature' }),
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-21-feature-task.md',
      }),
    );

    const [jsonResult, humanResult] = await Promise.all([
      execa(tsxPath, [cliPath, 'status', '--json'], { cwd: dir }),
      execa(tsxPath, [cliPath, 'status'], { cwd: dir }),
    ]);

    const status = JSON.parse(jsonResult.stdout);
    expect(status.loopGuidance).toEqual({
      taskType: 'feature',
      path: '.agentloop/loops/feature.md',
    });
    expect(humanResult.stdout).toContain('- Loop guidance: `.agentloop/loops/feature.md`');
    expect(status.nextAction.command).toBe('agentloop verify');
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

  test('prints compact JSON repo status when brief JSON is requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'compact-demo', scripts: { test: 'vitest' } }, null, 2),
    );
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-current-task.md'),
      '# Current task\n\n- Status: in-progress\n\n## Files or Areas Not to Touch\n- tests/fixtures\n',
    );
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: '.agentloop/tasks/2026-06-09-current-task.md',
    });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-deferred-task.md'),
      '# Deferred task\n\n- Status: deferred\n',
    );
    for (const index of [1, 2, 3, 4]) {
      await writeFile(
        path.join(dir, `.agentloop/tasks/2026-06-09-placeholder-${index}.md`),
        agentFlightPlaceholderMarkdown(`Placeholder ${index}`),
      );
    }

    const [fullResult, briefResult] = await Promise.all([
      execa(tsxPath, [cliPath, 'status', '--json', '--redact-paths'], {
        cwd: dir,
        reject: false,
      }),
      execa(tsxPath, [cliPath, 'status', '--json', '--brief', '--redact-paths'], {
        cwd: dir,
        reject: false,
      }),
    ]);

    expect(fullResult.exitCode).toBe(0);
    expect(briefResult.exitCode).toBe(0);
    const fullStatus = JSON.parse(fullResult.stdout);
    const compactStatus = JSON.parse(briefResult.stdout);

    expect(fullStatus.workingTree.changedFiles.length).toBeGreaterThan(0);
    expect(compactStatus.project.name).toBe('compact-demo');
    expect(compactStatus.git.root).toBe('[git-root]');
    expect(compactStatus.workingTree).toMatchObject({
      dirty: true,
      changedFileCount: fullStatus.workingTree.changedFileCount,
      nonEvidenceChangedFileCount: fullStatus.workingTree.nonEvidenceChangedFileCount,
      agentLoopEvidenceChangedFileCount: fullStatus.workingTree.agentLoopEvidenceChangedFileCount,
    });
    expect(compactStatus.workingTree.changedFiles).toBeUndefined();
    expect(compactStatus.activeTask).toMatchObject({
      title: 'Current task',
      path: '.agentloop/tasks/2026-06-09-current-task.md',
    });
    expect(compactStatus.deferredTasks).toEqual({
      count: 1,
      hiddenCount: 0,
      preview: [
        {
          path: '.agentloop/tasks/2026-06-09-deferred-task.md',
          title: 'Deferred task',
          status: 'deferred',
        },
      ],
    });
    expect(compactStatus.agentFlightPlaceholderTasks.count).toBe(4);
    expect(compactStatus.agentFlightPlaceholderTasks.preview).toHaveLength(3);
    expect(compactStatus.nextAction).toMatchObject({
      command: 'agentloop verify',
      reason: 'A task exists, but no verification report was found.',
    });
    expect(compactStatus.brief).toContain('AgentLoopKit: task="Current task"');
    expect(compactStatus.markdown).toBeUndefined();
    expect(compactStatus.latestRun).toBeUndefined();
    expect(briefResult.stdout.length).toBeLessThan(fullResult.stdout.length);
  });

  test('selects latest timestamped verification report by filename when mtimes are stale', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    const olderReport = path.join(
      dir,
      '.agentloop/reports/2026-06-16-11-51-verification-report.md',
    );
    const newerReport = path.join(
      dir,
      '.agentloop/reports/2026-06-16-12-24-verification-report.md',
    );
    await writeFile(olderReport, '# Older Verification\n\nOverall status: fail\n');
    await writeFile(newerReport, '# Newer Verification\n\nOverall status: pass\n');
    await utimes(
      newerReport,
      new Date('2026-06-16T12:24:00.000Z'),
      new Date('2026-06-16T12:24:00.000Z'),
    );
    await utimes(
      olderReport,
      new Date('2026-06-16T12:48:00.000Z'),
      new Date('2026-06-16T12:48:00.000Z'),
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.latestReport.path).toBe(
      '.agentloop/reports/2026-06-16-12-24-verification-report.md',
    );
    expect(status.latestReport.overallStatus).toBe('pass');
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

  test('routes active task placeholder contracts to harden before handoff', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    const taskPath = '.agentloop/tasks/2026-06-19-placeholder-task.md';
    await writeFile(
      path.join(dir, taskPath),
      `# Placeholder task

- Created date: 2026-06-19
- Task type: feature
- Status: in-progress

## Problem Statement
Exercise placeholder task routing.

## Desired Outcome
Status points to task doctor before review evidence is generated.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Acceptance Criteria
- Add acceptance criteria before implementation starts.

## Verification Commands
- No verification command recorded.

## Rollback Notes
Document how to revert or disable this change.
`,
    );
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: taskPath,
    });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-19-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

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
    const status = JSON.parse(jsonResult.stdout);
    expect(status.nextAction.command).toBe('agentloop harden');
    expect(status.nextAction.reason).toMatch(/blocking soft spot/i);
    expect(humanResult.stdout).toContain('Run `agentloop harden`.');
    expect(humanResult.stdout).toContain('blocking soft spot');
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

  test('recommends task doctor when the active task pointer is stale', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/missing.md',
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-16-20-30-verification-report.md'),
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
    expect(status.activeTask).toBeNull();
    expect(status.nextAction.command).toBe('agentloop task doctor');
    expect(status.nextAction.reason).toContain('active task pointer is stale');
    expect(markdownResult.stdout).toContain(
      '- Active task: stale pointer - `.agentloop/tasks/missing.md`',
    );
    expect(markdownResult.stdout).toContain('Run `agentloop task doctor`.');
  });

  test('still recommends creating a task when dirty work has no task evidence', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
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
    expect(status.nextAction.reason).toContain('1 existing dirty non-evidence file');
    expect(status.nextAction.reason).toContain('Examples: `changed.txt`.');
  });

  test('omits dirty-work guidance when only AgentLoop evidence is dirty', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
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
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-17-00-40-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.workingTree.nonEvidenceChangedFileCount).toBe(0);
    expect(status.workingTree.agentLoopEvidenceChangedFileCount).toBe(1);
    expect(status.nextAction.command).toBe('agentloop create-task');
    expect(status.nextAction.reason).not.toContain('existing dirty non-evidence');
    expect(status.nextAction.reason).not.toContain('Examples:');
  });

  test('separates AgentLoop evidence churn in working tree status output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
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
        'init',
      ],
      { cwd: dir },
    );
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/index.ts'), 'export const changed = true;\n');
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-17-00-30-verification-report.md'),
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
    const briefResult = await execa(tsxPath, [cliPath, 'status', '--brief'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(markdownResult.exitCode).toBe(0);
    expect(briefResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.workingTree).toMatchObject({
      dirty: true,
      changedFileCount: 2,
      nonEvidenceChangedFileCount: 1,
      agentLoopEvidenceChangedFileCount: 1,
    });
    expect(briefResult.stdout).toContain('tree=dirty (2; 1 non-evidence, 1 AgentLoop evidence)');
    expect(markdownResult.stdout).toContain(
      '- Working tree: `dirty (2 changed file(s); 1 non-evidence, 1 AgentLoop evidence)`',
    );
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

  test('renders status markdown values as single-line inline code when task data contains line breaks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const taskPath = '.agentloop/tasks/2026-06-10-active\n- [x] injected.md';
    await writeFile(path.join(dir, 'changed.txt'), 'pending change\n');
    await writeFile(
      path.join(dir, taskPath),
      'No heading, so status falls back to the filename.\n\n- Status: in-progress\n\n## Files or Areas Not to Touch\n- tests/fixtures\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({ version: 1, activeTaskPath: taskPath }, null, 2),
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
    expect(humanResult.stdout).toContain(
      '- Active task: `2026-06-10-active\\n- [x] injected` (`in-progress`) - `.agentloop/tasks/2026-06-10-active\\n- [x] injected.md`',
    );
    expect(humanResult.stdout).toContain(
      'Run `agentloop verify`.\n\nA task exists, but no verification report was found.',
    );
    expect(humanResult.stdout).not.toContain('\n- [x] injected`:');
    expect(humanResult.stdout).not.toContain('\n- [x] injected.md`');
    const status = JSON.parse(jsonResult.stdout);
    expect(status.activeTask).toMatchObject({
      title: '2026-06-10-active\n- [x] injected',
      status: 'in-progress',
      path: '.agentloop/tasks/2026-06-10-active\n- [x] injected.md',
    });
    expect(status.nextAction.command).toBe('agentloop verify');
  });

  test('prints compact status with --brief', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-09-ship-brief-status.md');
    await writeFile(
      taskPath,
      '# Ship brief status\n\n- Status: in progress\n\n## Files or Areas Not to Touch\n- tests/fixtures\n',
    );
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

  test(
    'shows latest run ledger evidence in JSON, markdown, and brief status',
    async () => {
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
    },
    CLI_STATUS_TEST_TIMEOUT_MS,
  );

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
    await writeFile(
      path.join(dir, taskPath),
      '# Review login\n\n- Status: review\n\n## Files or Areas Not to Touch\n- tests/fixtures\n',
    );
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

  test('labels latest verification as previous evidence when no active or open task exists', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-done-task.md'),
      '# Done task\n\n- Status: done\n',
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
    const briefResult = await execa(tsxPath, [cliPath, 'status', '--brief'], {
      cwd: dir,
      reject: false,
    });
    const compactJsonResult = await execa(tsxPath, [cliPath, 'status', '--json', '--brief'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(markdownResult.exitCode).toBe(0);
    expect(briefResult.exitCode).toBe(0);
    expect(compactJsonResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    const compactStatus = JSON.parse(compactJsonResult.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask).toBeNull();
    expect(status.latestReport).toMatchObject({
      overallStatus: 'pass',
      path: '.agentloop/reports/2026-06-09-12-30-verification-report.md',
    });
    expect(status.latestPreviousReport).toBeUndefined();
    expect(status.nextAction.command).toBe('agentloop create-task');
    expect(markdownResult.stdout).toContain(
      '- Latest previous verification: `pass` - `.agentloop/reports/2026-06-09-12-30-verification-report.md`',
    );
    expect(markdownResult.stdout).not.toContain('- Latest verification: `pass`');
    expect(briefResult.stdout).toContain('verification=previous:pass');
    expect(briefResult.stdout).not.toContain('verification=pass;');
    expect(compactStatus.latestReport.overallStatus).toBe('pass');
    expect(compactStatus.latestPreviousReport).toBeUndefined();
    expect(compactStatus.brief).toContain('verification=previous:pass');
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
    expect(status.nextAction.command).toBe('none');
    expect(status.nextAction.reason).toContain(
      '1 deferred task contract is parked, and the repo is clean',
    );
    expect(markdownResult.stdout).toContain('Active task: none active; 1 deferred task parked.');
    expect(markdownResult.stdout).toContain('Deferred tasks: 1 parked - `Deferred task`');
    expect(markdownResult.stdout).toContain('No command required.');
  });

  test('names the release approval boundary when only deferred release tasks are parked', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-publish-marketplace-action.md'),
      taskContractMarkdown('Publish Marketplace action', { taskType: 'release' }),
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-add-winget-manifest.md'),
      taskContractMarkdown('Add WinGet manifest', { taskType: 'release' }),
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
    expect(markdownResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.latestTask).toBeNull();
    expect(status.deferredTasks).toHaveLength(2);
    expect(status.nextAction.command).toBe('none');
    expect(status.nextAction.reason).toContain('deferred release-channel task contracts');
    expect(status.nextAction.reason).toContain('maintainer approval');
    expect(markdownResult.stdout).toContain('No command required.');
    expect(markdownResult.stdout).toContain('maintainer approval');
  });

  test('keeps dirty release-boundary guidance scoped to non-release task creation', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'changed.txt'), 'pending local work\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-publish-marketplace-action.md'),
      taskContractMarkdown('Publish Marketplace action', { taskType: 'release' }),
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.workingTree.dirty).toBe(true);
    expect(status.nextAction.command).toBe('agentloop create-task');
    expect(status.nextAction.reason).toContain('maintainer approval');
    expect(status.nextAction.reason).toContain('Create a non-release task');
    expect(status.nextAction.reason).toContain('existing dirty non-evidence files');
  });

  test('separates AgentFlight placeholders from deferred roadmap tasks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const title = 'Separate AgentFlight placeholders from roadmap task counts';
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-deferred-task.md'),
      '# Deferred task\n\n- Status: deferred\n',
    );
    await writeFile(
      path.join(
        dir,
        '.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md',
      ),
      agentFlightPlaceholderMarkdown(title),
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
    expect(status.latestTask).toBeNull();
    expect(status.deferredTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-10-deferred-task.md',
        title: 'Deferred task',
        status: 'deferred',
      },
    ]);
    expect(status.agentFlightPlaceholderTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md',
        title,
        status: 'deferred',
        source: 'agentflight-placeholder',
      },
    ]);
    expect(status.nextAction.reason).toContain(
      '1 deferred task contract is parked, and the repo is clean',
    );
    expect(markdownResult.stdout).toContain('Active task: none active; 1 deferred task parked.');
    expect(markdownResult.stdout).toContain('Deferred tasks: 1 parked - `Deferred task`');
    expect(markdownResult.stdout).toContain(
      'AgentFlight placeholders: 1 preserved - `Separate AgentFlight placeholders from roadmap task counts`',
    );
  });

  test('does not use proposed AgentFlight placeholders as fallback tasks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const title = 'AgentFlight placeholder only';
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-agentflight-placeholder-only.md'),
      agentFlightPlaceholderMarkdown(title, 'proposed'),
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask).toBeNull();
    expect(status.deferredTasks).toEqual([]);
    expect(status.agentFlightPlaceholderTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-16-agentflight-placeholder-only.md',
        title,
        status: 'proposed',
        source: 'agentflight-placeholder',
      },
    ]);
    expect(status.nextAction.command).toBe('agentloop create-task');
  });

  test('ignores active AgentFlight placeholders and falls back to a real open task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const placeholderTitle = 'Ignore active AgentFlight placeholder tasks';
    await writeFile(
      path.join(
        dir,
        '.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md',
      ),
      agentFlightPlaceholderMarkdown(placeholderTitle, 'proposed'),
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-16-real-task.md'),
      '# Real task\n\n- Status: proposed\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify(
        {
          version: 1,
          activeTaskPath:
            '.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md',
        },
        null,
        2,
      ),
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.activeTask).toBeNull();
    expect(status.latestTask).toMatchObject({
      path: '.agentloop/tasks/2026-06-16-real-task.md',
      title: 'Real task',
      status: 'proposed',
    });
    expect(status.agentFlightPlaceholderTasks).toEqual(
      expect.arrayContaining([
        {
          path: '.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md',
          title: placeholderTitle,
          status: 'proposed',
          source: 'agentflight-placeholder',
        },
      ]),
    );
    expect(status.nextAction.command).toBe(
      'agentloop task set .agentloop/tasks/2026-06-16-real-task.md',
    );
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
    const archivedTaskPath = path.join(dir, '.agentloop/tasks/archive/2026-06-12-fix-login.md');
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

  test('does not request another handoff when dirty files are covered by the latest handoff run', async () => {
    const dir = await makeTempDir();
    const runId = '2026-06-13-00-33-handoff';
    const runsDir = path.join(dir, '.agentloop/runs', runId);
    const archivedTaskPath = path.join(dir, '.agentloop/tasks/archive/2026-06-13-docs-hygiene.md');
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    await mkdir(path.dirname(archivedTaskPath), { recursive: true });
    await writeFile(archivedTaskPath, '# Docs hygiene\n\n- Status: done\n');
    await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/runs/.gitkeep'), '');
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/handoffs/.gitkeep'), '');
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
    await mkdir(runsDir, { recursive: true });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 2;\n');
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-13-00-33-pr-summary.md'),
      '# PR Summary\n',
    );
    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: runId,
          command: 'handoff',
          createdAt: '2026-06-13-00-33',
          createdAtEpochMs: 1_000,
          task: {
            path: '.agentloop/tasks/2026-06-13-docs-hygiene.md',
            title: 'Old docs hygiene',
            status: 'in-progress',
          },
          handoffPath: '.agentloop/handoffs/2026-06-13-00-33-pr-summary.md',
          changedFileCount: 12,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, 'changed-files.json'),
      `${JSON.stringify([{ status: 'M', path: 'src.ts' }], null, 2)}\n`,
    );

    const result = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const status = JSON.parse(result.stdout);
    expect(status.workingTree.dirty).toBe(true);
    expect(status.workingTree.changedFiles).toContainEqual({ status: 'M', path: 'src.ts' });
    expect(status.workingTree.changedFiles).toContainEqual({
      status: '??',
      path: '.agentloop/handoffs/2026-06-13-00-33-pr-summary.md',
    });
    expect(status.workingTree.changedFiles).toContainEqual({
      status: '??',
      path: `.agentloop/runs/${runId}/metadata.json`,
    });
    expect(status.workingTree.changedFiles).toContainEqual({
      status: '??',
      path: `.agentloop/runs/${runId}/changed-files.json`,
    });
    expect(status.latestRun.task).toMatchObject({
      path: '.agentloop/tasks/archive/2026-06-13-docs-hygiene.md',
      status: 'done',
    });
    expect(status.nextAction.command).toBe('agentloop create-task');
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
    await writeFile(
      path.join(dir, taskPath),
      '# Active handoff\n\n- Status: in-progress\n\n## Files or Areas Not to Touch\n- tests/fixtures\n',
    );
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

    const jsonResult = await execa(tsxPath, [cliPath, 'status', '--json'], {
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

    expect(jsonResult.exitCode).toBe(0);
    expect(briefResult.exitCode).toBe(0);
    expect(markdownResult.exitCode).toBe(0);
    const status = JSON.parse(jsonResult.stdout);
    expect(status.activeTask).toMatchObject({
      path: taskPath,
      title: 'Active handoff',
      status: 'in-progress',
    });
    expect(status.workingTree.dirty).toBe(true);
    expect(status.nextAction.command).toBe('agentloop task done');
    expect(status.nextAction.reason).toContain('handoff evidence cover the current dirty files');
    expect(briefResult.stdout).toContain('next="agentloop task done"');
    expect(markdownResult.stdout).toContain('Run `agentloop task done`.');
  });
});
