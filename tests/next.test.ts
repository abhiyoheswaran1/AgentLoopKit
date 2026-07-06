import path from 'node:path';
import { access, mkdir, realpath, utimes, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

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
`;
}

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
    expect(next.nextAction.command).toBe('agentloop handoff');
    expect(next.nextAction.reason).toContain('verification evidence');
    expect(next.activeTask.title).toBe('Add settings');
    expect(next.latestTask).toBeNull();
    expect(next.latestReport.overallStatus).toBe('pass');
    expect(next.workingTree.dirty).toBe(true);
    expect(next.workingTree.changedFileCount).toBeGreaterThan(0);
    expect(await exists(path.join(dir, 'marker.txt'))).toBe(false);
  });

  test('shows loop guidance for the selected active task', async () => {
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
      execa(tsxPath, [cliPath, 'next', '--json'], { cwd: dir }),
      execa(tsxPath, [cliPath, 'next'], { cwd: dir }),
    ]);

    const next = JSON.parse(jsonResult.stdout);
    expect(next.loopGuidance).toEqual({
      taskType: 'feature',
      path: '.agentloop/loops/feature.md',
    });
    expect(humanResult.stdout).toContain('- Loop guidance: `.agentloop/loops/feature.md`');
    expect(next.nextAction.command).toBe('agentloop verify');
  });

  test('shows loop guidance for the selected latest open task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-21-feature-task.md'),
      taskContractMarkdown('Feature task', { status: 'proposed', taskType: 'feature' }),
    );

    const [jsonResult, humanResult] = await Promise.all([
      execa(tsxPath, [cliPath, 'next', '--json'], { cwd: dir }),
      execa(tsxPath, [cliPath, 'next'], { cwd: dir }),
    ]);

    const next = JSON.parse(jsonResult.stdout);
    expect(next.nextAction.command).toBe('agentloop task set .agentloop/tasks/2026-06-21-feature-task.md');
    expect(next.loopGuidance).toEqual({
      taskType: 'feature',
      path: '.agentloop/loops/feature.md',
    });
    expect(humanResult.stdout).toContain('- Loop guidance: `.agentloop/loops/feature.md`');
  });

  test('separates AgentLoop evidence churn in working tree output', async () => {
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
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/index.ts'), 'export const value = 1;\n');
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-17-00-40-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.exitCode).toBe(0);
    const next = JSON.parse(jsonResult.stdout);
    expect(next.workingTree).toMatchObject({
      dirty: true,
      changedFileCount: 2,
      nonEvidenceChangedFileCount: 1,
      agentLoopEvidenceChangedFileCount: 1,
    });
    expect(humanResult.stdout).toContain(
      '- Working tree: `dirty (2; 1 non-evidence, 1 AgentLoop evidence)`',
    );
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

  test('accepts redacted output mode for human and JSON output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });

    const humanResult = await execa(tsxPath, [cliPath, 'next', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });

    expect(humanResult.exitCode).toBe(0);
    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.stdout).not.toContain(await realpath(dir));
    expect(jsonResult.stdout).not.toContain(await realpath(dir));
    expect(JSON.parse(jsonResult.stdout).nextAction.command).toBe('agentloop create-task');
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

    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    const next = JSON.parse(jsonResult.stdout);
    expect(next.nextAction.command).toBe('agentloop task doctor');
    expect(next.nextAction.reason).toContain('active task pointer is stale');
    expect(next.activeTask).toBeNull();
    expect(markdownResult.stdout).toContain('Run `agentloop task doctor`.');
    expect(markdownResult.stdout).toContain(
      '- Active task: stale pointer - `.agentloop/tasks/missing.md`',
    );
  });

  test('recommends task doctor when the active task still has placeholder sections', async () => {
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
Next points to task doctor before review evidence is generated.

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
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: taskPath,
      }),
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-19-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(markdownResult.exitCode).toBe(0);
    const next = JSON.parse(jsonResult.stdout);
    expect(next.nextAction.command).toBe('agentloop task doctor');
    expect(next.nextAction.reason).toBe(
      'Active task still has placeholder guidance in review-critical sections. Replace it before verification or handoff evidence.',
    );
    expect(next.activeTask.path).toBe(taskPath);
    expect(markdownResult.stdout).toContain('Run `agentloop task doctor`.');
    expect(markdownResult.stdout).toContain(
      'Active task still has placeholder guidance in review-critical sections.',
    );
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

  test('renders next markdown values as single-line inline code when task data contains line breaks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const taskPath = '.agentloop/tasks/2026-06-10-active\n- [x] injected.md';
    await writeFile(path.join(dir, 'changed.txt'), 'pending change\n');
    await writeFile(
      path.join(dir, taskPath),
      'No heading, so next falls back to the filename.\n\n- Status: in-progress\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({ version: 1, activeTaskPath: taskPath }, null, 2),
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
    expect(humanResult.stdout).toContain(
      '- Active task: `2026-06-10-active\\n- [x] injected` (`in-progress`) - `.agentloop/tasks/2026-06-10-active\\n- [x] injected.md`',
    );
    expect(humanResult.stdout).toContain(
      'Run `agentloop verify`.\n\nA task exists, but no verification report was found.',
    );
    expect(humanResult.stdout).not.toContain('\n- [x] injected`:');
    expect(humanResult.stdout).not.toContain('\n- [x] injected.md`');
    const next = JSON.parse(jsonResult.stdout);
    expect(next.activeTask).toMatchObject({
      title: '2026-06-10-active\n- [x] injected',
      status: 'in-progress',
      path: '.agentloop/tasks/2026-06-10-active\n- [x] injected.md',
    });
    expect(next.nextAction.command).toBe('agentloop verify');
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
    expect(next.nextAction.command).toBe('agentloop verify');
    expect(next.nextAction.reason).toContain('failed');
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
    expect(next.nextAction.command).toBe('agentloop task done');
    expect(next.nextAction.reason).toContain('active task is in review');
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
    expect(next.nextAction.command).toBe('agentloop verify');
    expect(next.nextAction.reason).toContain('no verification report');
  });

  test('ignores an unpinned done task when choosing the next action', async () => {
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
    const humanResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(humanResult.exitCode).toBe(0);
    const next = JSON.parse(result.stdout);
    expect(next.activeTask).toBeNull();
    expect(next.latestTask).toBeNull();
    expect(next.latestReport.overallStatus).toBe('pass');
    expect(next.latestPreviousReport).toBeUndefined();
    expect(next.nextAction.command).toBe('agentloop create-task');
    expect(next.nextAction.reason).toContain('1 existing dirty non-evidence file');
    expect(next.nextAction.reason).toContain('Examples: `changed.txt`.');
    expect(humanResult.stdout).toContain('Examples: `changed.txt`.');
    expect(humanResult.stdout).toContain(
      '- Latest previous verification: `pass` - `.agentloop/reports/2026-06-10-08-00-verification-report.md`',
    );
    expect(humanResult.stdout).not.toContain('- Latest verification: `pass`');
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
    expect(next.nextAction.command).toBe('agentloop task set .agentloop/tasks/2026-06-10-open-task.md');
    expect(next.nextAction.reason).toContain('No active task is pinned');
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
    expect(next.nextAction.command).toBe('none');
    expect(next.nextAction.reason).toContain('1 deferred task contract is parked, and the repo is clean');
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

  test('names maintainer approval when only deferred release tasks are parked', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-publish-marketplace-action.md'),
      taskContractMarkdown('Publish Marketplace action', { taskType: 'release' }),
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-add-winget-manifest.md'),
      taskContractMarkdown('Add WinGet manifest', { taskType: 'release' }),
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

    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.exitCode).toBe(0);
    const next = JSON.parse(jsonResult.stdout);
    expect(next.nextAction.command).toBe('none');
    expect(next.nextAction.reason).toContain('deferred release-channel task contracts');
    expect(next.nextAction.reason).toContain('maintainer approval');
    expect(humanResult.stdout).toContain('No command required.');
    expect(humanResult.stdout).toContain('maintainer approval');
  });

  test('reports AgentFlight placeholders separately from deferred roadmap tasks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
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

    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.exitCode).toBe(0);
    const next = JSON.parse(jsonResult.stdout);
    expect(next.deferredTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-10-deferred-task.md',
        title: 'Deferred task',
        status: 'deferred',
      },
    ]);
    expect(next.agentFlightPlaceholderTasks).toEqual([
      {
        path: '.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md',
        title,
        status: 'deferred',
        source: 'agentflight-placeholder',
      },
    ]);
    expect(next.nextAction.command).toBe('none');
    expect(next.nextAction.reason).toContain('1 deferred task contract is parked, and the repo is clean');
    expect(humanResult.stdout).toContain('Deferred tasks: 1 parked - `Deferred task`');
    expect(humanResult.stdout).toContain(
      'AgentFlight placeholders: 1 preserved - `Separate AgentFlight placeholders from roadmap task counts`',
    );
  });

  test('ignores active AgentFlight placeholders and recommends setting a real task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
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

    const jsonResult = await execa(tsxPath, [cliPath, 'next', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'next'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.exitCode).toBe(0);
    const next = JSON.parse(jsonResult.stdout);
    expect(next.activeTask).toBeNull();
    expect(next.latestTask).toMatchObject({
      path: '.agentloop/tasks/2026-06-16-real-task.md',
      title: 'Real task',
      status: 'proposed',
    });
    expect(next.agentFlightPlaceholderTasks).toEqual(
      expect.arrayContaining([
        {
          path: '.agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md',
          title: placeholderTitle,
          status: 'proposed',
          source: 'agentflight-placeholder',
        },
      ]),
    );
    expect(next.nextAction.command).toBe('agentloop task set .agentloop/tasks/2026-06-16-real-task.md');
    expect(humanResult.stdout).toContain('- Active task: none');
    expect(humanResult.stdout).toContain('- Latest open task: `Real task` (`proposed`)');
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
    expect(next.nextAction.command).toBe('agentloop task done');
    expect(next.nextAction.reason).toContain('handoff evidence cover the current dirty files');
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
    expect(next.nextAction.command).toBe(
      'agentloop task archive .agentloop/tasks/2026-06-10-complete-task.md',
    );
  });
});
