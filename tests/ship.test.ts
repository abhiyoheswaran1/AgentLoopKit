import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readFile, realpath, rename, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { singleLineInlineCode } from '../src/core/markdown-format.js';
import { createShipReport, renderShipGithubComment, type ShipResult } from '../src/core/ship.js';
import { setActiveTask } from '../src/core/task-state.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_SHIP_TEST_TIMEOUT_MS = 90_000;

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createShipFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);

  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  const config = createDefaultConfig({
    name: 'demo',
    type: 'typescript-package',
    packageManager: 'npm',
    commands: { test: 'npm test' },
  });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);

  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/harness'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });
  await writeFile(path.join(dir, 'AGENTS.md'), '# Agents\n');
  await writeFile(path.join(dir, 'AGENTLOOP.md'), '# AgentLoop\n');
  for (const file of [
    'commands.md',
    'definition-of-done.md',
    'review-checklist.md',
    'autonomous-work-rules.md',
  ]) {
    await writeFile(path.join(dir, '.agentloop/harness', file), `# ${file}\n`);
  }
  for (const file of ['no-destructive-actions.md', 'git-policy.md', 'secrets-policy.md']) {
    await writeFile(path.join(dir, '.agentloop/policies', file), `# ${file}\n`);
  }

  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-fix-login.md');
  await writeFile(
    taskPath,
    `# Fix login redirect bug

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
Login redirects users to the wrong page after password reset.

## Desired Outcome
Users land on the intended destination after a successful login.

## Constraints
- Keep the auth callback API unchanged.

## Non-Goals
- Do not redesign the login UI.

## Acceptance Criteria
- Password-reset login redirects to the requested page.
- Existing login redirect tests still pass.

## Verification Commands
- npm test -- auth

## Risk Notes
- Auth flow touched; review redirect edge cases.

## Rollback Notes
Revert the auth callback change.
`,
  );
  await setActiveTask({ cwd: dir, config, taskPath });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "fixed";\n');
  return dir;
}

describe('ship command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('writes a review-readiness ship report from local evidence', async () => {
    const dir = await createShipFixture();

    const result = await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.readiness.totalScore).toBeGreaterThanOrEqual(85);
    expect(output.readiness.claims).toContain(
      'This is a review-readiness score, not a code-quality score.',
    );
    expect(output.changedFiles).toEqual([{ status: 'M', path: 'src/auth/callback.ts' }]);
    expect(output.shipReportPath).toMatch(/\.agentloop\/reports\/.+-ship-report\.md$/);
    expect(output.handoffPath).toMatch(/\.agentloop\/handoffs\/.+-pr-summary\.md$/);
    expect(output.shipReportPath).not.toContain(dir);
    expect(output.handoffPath).not.toContain(dir);
    expect(output.verificationReportPath).not.toContain(dir);
    expect(output.gates.overallStatus).toBe('pass');
    expect(output.gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'pass',
          message: 'Reviewer handoff found.',
        }),
      ]),
    );
    expect(output.run.path).not.toContain(dir);
    expect(output.githubComment).toBeUndefined();
    expect(existsSync(path.join(dir, output.shipReportPath))).toBe(true);
    expect(existsSync(path.join(dir, output.handoffPath))).toBe(true);

    const markdown = await readFile(path.join(dir, output.shipReportPath), 'utf8');
    expect(markdown).toContain('# AgentLoopKit Ship Report');
    expect(markdown).toContain('Make agent-generated code reviewable, verifiable, and merge-ready.');
    expect(markdown).toContain('This is a review-readiness score, not a code-quality score.');
    expect(markdown).toContain('src/auth/callback.ts');
    expect(markdown).toContain('Review risk-sensitive files before merge.');
    expect(markdown).toContain('.agentloop/reports/');
    expect(markdown).not.toContain('Latest handoff does not cover the current dirty files.');
    expect(markdown).not.toContain(dir);
  });

  test('keeps same-minute ship report and handoff artifacts instead of overwriting them', async () => {
    const dir = await createShipFixture();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
      commands: { test: 'npm test' },
    });

    const first = await createShipReport({ cwd: dir, config, timestamp: '2026-06-11-12-05' });
    const second = await createShipReport({ cwd: dir, config, timestamp: '2026-06-11-12-05' });

    expect(first.shipReportPath).toBe('.agentloop/reports/2026-06-11-12-05-ship-report.md');
    expect(first.handoffPath).toBe('.agentloop/handoffs/2026-06-11-12-05-pr-summary.md');
    expect(second.shipReportPath).toBe('.agentloop/reports/2026-06-11-12-05-ship-report-2.md');
    expect(second.handoffPath).toBe('.agentloop/handoffs/2026-06-11-12-05-pr-summary-2.md');
    expect(existsSync(path.join(dir, first.shipReportPath))).toBe(true);
    expect(first.handoffPath).toBeDefined();
    expect(second.handoffPath).toBeDefined();
    expect(existsSync(path.join(dir, first.handoffPath!))).toBe(true);
    expect(existsSync(path.join(dir, second.shipReportPath))).toBe(true);
    expect(existsSync(path.join(dir, second.handoffPath!))).toBe(true);
  });

  test('uses latest run task evidence when the task contract was archived', async () => {
    const dir = await createShipFixture();
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await rename(
      path.join(dir, '.agentloop/tasks/2026-06-11-fix-login.md'),
      path.join(dir, '.agentloop/tasks/archive/2026-06-11-fix-login.md'),
    );
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-05-ship/metadata.json'), {
      id: '2026-06-11-12-05-ship',
      command: 'ship',
      createdAt: '2026-06-11-12-05',
      createdAtEpochMs: 1781179500000,
      task: {
        path: '.agentloop/tasks/2026-06-11-fix-login.md',
        title: 'Fix login redirect bug',
        status: 'done',
      },
      verificationReportPath: '.agentloop/reports/2026-06-11-12-00-verification-report.md',
      shipReportPath: '.agentloop/reports/2026-06-11-12-05-ship-report.md',
      changedFileCount: 1,
      score: 96,
    });

    const result = await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.task).toEqual({
      path: '.agentloop/tasks/archive/2026-06-11-fix-login.md',
      title: 'Fix login redirect bug',
      status: 'in-progress',
    });
    const taskClarity = output.readiness.dimensions.find(
      (dimension: { id: string }) => dimension.id === 'task-clarity',
    );
    expect(taskClarity).toEqual(
      expect.objectContaining({
        id: 'task-clarity',
        score: expect.any(Number),
      }),
    );
    expect(taskClarity?.score).toBeGreaterThan(0);
    expect(taskClarity?.reason).not.toBe('No task contract is active or discoverable.');
    expect(output.readiness.blockers).not.toContain('No task contract found.');
    expect(output.readiness.totalScore).toBeGreaterThanOrEqual(85);

    const markdown = await readFile(path.join(dir, output.shipReportPath), 'utf8');
    expect(markdown).toContain('Fix login redirect bug');
    expect(markdown).toContain('.agentloop/tasks/archive/2026-06-11-fix-login.md');
  });

  test('renders ship report task paths on one markdown line', async () => {
    const dir = await createShipFixture();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
      commands: { test: 'npm test' },
    });
    const taskPath = '.agentloop/tasks/ship\n-task.md';
    await rename(path.join(dir, '.agentloop/tasks/2026-06-11-fix-login.md'), path.join(dir, taskPath));
    await setActiveTask({ cwd: dir, config, taskPath });

    const result = await createShipReport({ cwd: dir, config, timestamp: '2026-06-11-12-06' });

    expect(result.task?.path).toBe(taskPath);
    expect(result.markdown).toContain(
      `- Task: ${singleLineInlineCode('Fix login redirect bug')} (${singleLineInlineCode(
        'in-progress',
      )}) - ${singleLineInlineCode(taskPath)}`,
    );
    expect(result.markdown).not.toContain('ship\n-task.md`');
  });

  test('renders ship GitHub comment dynamic values on one markdown line', () => {
    const comment = renderShipGithubComment(
      {
        readiness: {
          totalScore: 96,
          claims: ['This is a review-readiness score, not a code-quality score.'],
          blockers: [],
          strengths: [],
          warnings: ['Risk-sensitive files changed: src/auth/callback\n-extra.ts'],
          recommendedNextActions: ['Review file src/auth/callback\n-extra.ts before merge.'],
          dimensions: [],
        },
        task: {
          path: '.agentloop/tasks/comment.md',
          title: 'Ship\n- [x] injected',
          status: 'review\n-ready',
        },
        verification: { status: 'pass\nmaybe', fresh: true },
        verificationReportPath: '.agentloop/reports/report\n-path.md',
        gates: { overallStatus: 'pass\nmaybe', gates: [] },
        shipReportPath: '.agentloop/reports/ship\n-report.md',
        changedFiles: [],
        diffStat: '',
        timestamp: '2026-06-11-12-06',
        markdown: '',
        run: {} as ShipResult['run'],
      } as unknown as ShipResult,
    );

    expect(comment).toContain(
      `- Task: ${singleLineInlineCode('Ship\n- [x] injected')} (${singleLineInlineCode(
        'review\n-ready',
      )})`,
    );
    expect(comment).toContain(
      `- Verification: ${singleLineInlineCode('pass\nmaybe')} - ${singleLineInlineCode(
        '.agentloop/reports/report\n-path.md',
      )}`,
    );
    expect(comment).toContain(`- Gates: ${singleLineInlineCode('pass\nmaybe')}`);
    expect(comment).toContain(`- Ship report: ${singleLineInlineCode('.agentloop/reports/ship\n-report.md')}`);
    expect(comment).toContain('- Risk-sensitive files changed: src/auth/callback\\n-extra.ts');
    expect(comment).toContain('- Review file src/auth/callback\\n-extra.ts before merge.');
    expect(comment).not.toContain('\n- [x] injected');
    expect(comment).not.toContain('report\n-path.md');
    expect(comment).not.toContain('callback\n-extra.ts');
  });

  test('includes GitHub comment markdown in JSON output when requested', async () => {
    const dir = await createShipFixture();

    const result = await execa(tsxPath, [cliPath, 'ship', '--json', '--github-comment'], {
      cwd: dir,
    });
    const output = JSON.parse(result.stdout);

    expect(output.githubComment).toContain('## AgentLoopKit Review Readiness');
    expect(output.githubComment).toContain(`Score: ${output.readiness.totalScore}/100`);
    expect(output.githubComment).toContain('This is a review-readiness score, not a code-quality score.');
    expect(output.githubComment).toContain('.agentloop/reports/');
    expect(output.githubComment).not.toContain(dir);
    expect(output.shipReportPath).not.toContain(dir);
    expect(output.handoffPath).not.toContain(dir);
    expect(output.verificationReportPath).not.toContain(dir);
    expect(output.run.path).not.toContain(dir);
    expect(output.githubComment).toContain('### Blockers');
    expect(output.githubComment).toContain('### Warnings');
    expect(output.githubComment).toContain('### Next Actions');
  });

  test(
    'escapes Markdown control characters in ship report and GitHub comment readiness lists',
    async () => {
      const dir = await createShipFixture();
      await writeFile(path.join(dir, 'src/auth/[callback].ts'), 'export const extra = true;\n');
      await git(dir, ['add', '-N', 'src/auth/[callback].ts']);

      const result = await execa(tsxPath, [cliPath, 'ship', '--json', '--github-comment'], {
        cwd: dir,
      });
      const output = JSON.parse(result.stdout);
      const markdown = await readFile(path.join(dir, output.shipReportPath), 'utf8');

      expect(output.readiness.warnings).toContain(
        'Risk-sensitive files changed: src/auth/[callback].ts, src/auth/callback.ts',
      );
      expect(markdown).toContain(
        '- Risk-sensitive files changed: src/auth/\\[callback\\].ts, src/auth/callback.ts',
      );
      expect(output.githubComment).toContain(
        '- Risk-sensitive files changed: src/auth/\\[callback\\].ts, src/auth/callback.ts',
      );
      expect(markdown).not.toContain(
        '- Risk-sensitive files changed: src/auth/[callback].ts, src/auth/callback.ts',
      );
      expect(output.githubComment).not.toContain(
        '- Risk-sensitive files changed: src/auth/[callback].ts, src/auth/callback.ts',
      );
    },
    CLI_SHIP_TEST_TIMEOUT_MS,
  );

  test(
    'redacts nested gate git root paths when requested',
    async () => {
      const dir = await createShipFixture();
      const realRoot = await realpath(dir);

      const defaultResult = await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir });
      const defaultOutput = JSON.parse(defaultResult.stdout);
      expect(defaultOutput.gates.git.root).toBe(realRoot);

      const redactedResult = await execa(tsxPath, [cliPath, 'ship', '--json', '--redact-paths'], {
        cwd: dir,
        reject: false,
      });

      expect(redactedResult.exitCode).toBe(0);
      expect(redactedResult.stdout).not.toContain(realRoot);
      const redactedOutput = JSON.parse(redactedResult.stdout);
      expect(redactedOutput.gates.git.root).toBe('[git-root]');
      expect(redactedOutput.gates.git.targetIsRoot).toBe(true);
      expect(redactedOutput.gates.markdown).toContain('- Git root: `[git-root]`');
      expect(redactedOutput.gates.markdown).not.toContain(realRoot);
    },
    CLI_SHIP_TEST_TIMEOUT_MS,
  );

  test('prints only GitHub comment markdown when requested without JSON', async () => {
    const dir = await createShipFixture();

    const result = await execa(tsxPath, [cliPath, 'ship', '--github-comment'], { cwd: dir });

    expect(result.stdout).toContain('## AgentLoopKit Review Readiness');
    expect(result.stdout).toContain('This is a review-readiness score, not a code-quality score.');
    expect(result.stdout).toContain('.agentloop/reports/');
    expect(result.stdout).toContain('### Next Actions');
    expect(result.stdout).not.toContain('# AgentLoopKit Ship Report');
    expect(result.stdout).not.toContain('Ship report written:');
    expect(result.stdout).not.toContain(dir);
  });

  test('accepts redacted GitHub comment output', async () => {
    const dir = await createShipFixture();
    const realRoot = await realpath(dir);

    const result = await execa(tsxPath, [cliPath, 'ship', '--github-comment', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('## AgentLoopKit Review Readiness');
    expect(result.stdout).not.toContain(realRoot);
  });
});
