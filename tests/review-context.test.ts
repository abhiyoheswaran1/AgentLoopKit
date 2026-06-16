import path from 'node:path';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { createTaskContractFile } from '../src/core/task-contract.js';
import { loadAgentLoopConfig } from '../src/core/config.js';
import { setActiveTask } from '../src/core/task-state.js';
import { getReviewContext, renderReviewContextMarkdown } from '../src/core/review-context.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createRepoWithReviewContextEvidence() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await execa('git', ['init', '-q'], { cwd: dir });
  await writeFile(
    path.join(dir, 'package.json'),
    JSON.stringify({ name: 'demo', scripts: { test: 'vitest' } }, null, 2),
  );
  await initializeAgentLoop({ cwd: dir });
  const config = await loadAgentLoopConfig(dir);
  const task = await createTaskContractFile({
    cwd: dir,
    config,
    input: {
      title: 'Fix login redirect bug',
      type: 'bugfix',
      problemStatement: 'Login redirects lose the requested URL.',
      desiredOutcome: 'Users return to the originally requested URL after login.',
      acceptanceCriteria: ['Redirect destination is preserved'],
      verificationCommands: ['npm test'],
      riskNotes: ['Touches auth-adjacent routing'],
      rollbackNotes: 'Revert the redirect handler change.',
    },
  });
  await setActiveTask({ cwd: dir, config, taskPath: task.path });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-30-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n\nTests passed.\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-32-ship-report.md'),
    '# AgentLoopKit Ship Report\n\n- Review readiness score: `94`/100\n',
  );
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/handoffs/2026-06-10-12-31-pr-summary.md'),
    '# PR Summary\n\nReview handoff.\n',
  );
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship/metadata.json'),
    `${JSON.stringify(
      {
        id: '2026-06-10-12-32-ship',
        command: 'ship',
        createdAt: '2026-06-10-12-32',
        createdAtEpochMs: Date.parse('2026-06-10T12:32:00Z'),
        task: {
          path: '.agentloop/tasks/2026-06-10-fix-login-redirect-bug.md',
          title: 'Fix login redirect bug',
          status: 'review',
        },
        shipReportPath: path.join(dir, '.agentloop/reports/2026-06-10-12-32-ship-report.md'),
        score: 94,
        changedFileCount: 1,
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship/score.json'),
    `${JSON.stringify({ totalScore: 94 }, null, 2)}\n`,
  );
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship/changed-files.json'),
    `${JSON.stringify([{ path: 'src/auth/redirect.ts', status: 'M' }], null, 2)}\n`,
  );
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship/diffstat.txt'),
    ' src/auth/redirect.ts | 4 ++++\n',
  );
  await writeJson(path.join(dir, '.agentloop/github/context.json'), {
    issue: {
      number: 42,
      title: 'Login redirect drops target',
      state: 'OPEN',
      url: 'https://github.com/example/app/issues/42',
      author: 'octocat',
      labels: ['bug', 'ai-review'],
      bodyExcerpt: 'Users lose redirect targets after reset.',
    },
    pullRequest: {
      number: 77,
      title: 'Fix login redirect',
      state: 'OPEN',
      url: 'https://github.com/example/app/pull/77',
      author: 'contributor',
      labels: ['bugfix'],
      isDraft: false,
      baseRefName: 'main',
      headRefName: 'fix/login-redirect',
      changedFiles: 3,
      additions: 42,
      deletions: 9,
      bodyExcerpt: 'Implements the redirect fix.',
    },
  });
  return dir;
}

describe('review-context command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints a JSON review context snapshot without absolute artifact paths', async () => {
    const dir = await createRepoWithReviewContextEvidence();

    const result = await execa(tsxPath, [cliPath, 'review-context', '--json'], { cwd: dir });
    const payload = JSON.parse(result.stdout);

    expect(payload.status.activeTask).toMatchObject({
      title: 'Fix login redirect bug',
    });
    expect(payload.status.latestVerification).toEqual({
      path: '.agentloop/reports/2026-06-10-12-30-verification-report.md',
      title: 'Verification Report',
      overallStatus: 'pass',
    });
    expect(payload.gates.overallStatus).toBe('warn');
    expect(payload.gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'warn',
          message: 'Latest handoff does not cover the current dirty files.',
        }),
      ]),
    );
    expect(payload.policies.summary.current).toBe(8);
    expect(payload.artifacts.verificationReports.latest).toMatchObject({
      overallStatus: 'pass',
    });
    expect(payload.recentRuns[0]).toMatchObject({
      id: '2026-06-10-12-32-ship',
      score: 94,
      shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
    });
    expect(payload.latestShip).toEqual({
      id: '2026-06-10-12-32-ship',
      score: 94,
      shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
    });
    expect(payload.githubMetadata).toMatchObject({
      status: 'present',
      path: '.agentloop/github/context.json',
      issue: {
        number: 42,
        title: 'Login redirect drops target',
        bodyExcerpt: 'Users lose redirect targets after reset.',
      },
      pullRequest: {
        number: 77,
        title: 'Fix login redirect',
        bodyExcerpt: 'Implements the redirect fix.',
      },
    });
    expect(payload.safety).toEqual({
      readOnly: true,
      includesMarkdownContent: false,
      commandsRun: [],
    });
    expect(JSON.stringify(payload)).not.toContain(dir);
  });

  test('prints concise Markdown review context by default', async () => {
    const dir = await createRepoWithReviewContextEvidence();

    const result = await execa(tsxPath, [cliPath, 'review-context'], { cwd: dir });

    expect(result.stdout).toContain('# AgentLoopKit Review Context');
    expect(result.stdout).toContain('- Active task: `Fix login redirect bug`');
    expect(result.stdout).toContain('- Latest verification: `pass`');
    expect(result.stdout).toContain('- Gates: `warn`');
    expect(result.stdout).toContain('- Latest ship score: `94`/100');
    expect(result.stdout).toContain('- GitHub metadata: issue `#42` `OPEN`, PR `#77` `OPEN`');
    expect(result.stdout).toContain('Run `agentloop handoff`.');
    expect(result.stdout).not.toContain(dir);
    expect(result.stdout).not.toContain('Review handoff.');
  });

  test('renders human Markdown with line-safe inline values', () => {
    const context = {
      status: {
        project: { name: 'demo', type: 'generic', packageManager: 'npm' },
        workingTree: { dirty: true, changedFileCount: 2, changedFiles: [] },
        activeTask: {
          path: '.agentloop/tasks/fix\nlogin.md',
          title: 'Fix\nlogin redirect',
          status: 'review\nready',
        },
        latestTask: null,
        latestVerification: {
          path: '.agentloop/reports/verification\nreport.md',
          title: 'Verification Report',
          overallStatus: 'pass\nwith-note',
        },
        latestRun: undefined,
        nextAction: {
          command: 'agentloop\nhandoff',
          reason: 'Create a reviewer handoff.',
        },
      },
      gates: {
        strict: false,
        overallStatus: 'warn',
        gates: [],
        nextAction: {
          command: 'agentloop check-gates',
          reason: 'Review warnings.',
        },
      },
      policies: {
        policies: [],
        summary: { current: 1, modified: 2, missing: 3, extra: 4 },
      },
      artifacts: {
        tasks: { count: 1, byStatus: {}, latest: null },
        verificationReports: { count: 1, latest: null },
        handoffs: { count: 0, latest: null },
        shipReports: { count: 0, latest: null },
        htmlReports: { count: 0, latest: null },
        badges: { count: 0, latest: null },
        ciSummaries: { count: 0, latest: null },
        releaseNotes: { count: 0, latest: null },
        runs: { count: 1, latest: null },
      },
      recentRuns: [
        {
          id: '2026-06-16\nship',
          command: 'ship',
          createdAt: '2026-06-16',
          task: null,
          score: 96,
          changedFileCount: 2,
        },
      ],
      latestShip: {
        id: '2026-06-16\nship',
        score: 96,
        shipReportPath: '.agentloop/reports/ship\nreport.md',
      },
      githubMetadata: {
        status: 'invalid',
        path: '.agentloop/github/context\nbad.json',
        message: 'Unexpected\nJSON token',
      },
      safety: {
        readOnly: true,
        includesMarkdownContent: false,
        commandsRun: [],
      },
    } as Awaited<ReturnType<typeof getReviewContext>>;

    const markdown = renderReviewContextMarkdown(context);

    expect(markdown).toContain('`Fix\\nlogin redirect`');
    expect(markdown).toContain('`review\\nready`');
    expect(markdown).toContain('`.agentloop/reports/verification\\nreport.md`');
    expect(markdown).toContain('- Gates: `warn`');
    expect(markdown).toContain('- `ship` `96`/100');
    expect(markdown).toContain('`2026-06-16\\nship`');
    expect(markdown).toContain('`.agentloop/github/context\\nbad.json`');
    expect(markdown).toContain('`Unexpected\\nJSON token`');
    expect(markdown).toContain('Run `agentloop\\nhandoff`.');
    expect(markdown).not.toContain('`Fix\nlogin redirect`');
    expect(markdown).not.toContain('Run `agentloop\nhandoff`.');
  });

  test('accepts redacted output mode for human and JSON output', async () => {
    const dir = await createRepoWithReviewContextEvidence();
    const realRoot = await realpath(dir);

    const humanResult = await execa(tsxPath, [cliPath, 'review-context', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'review-context', '--json', '--redact-paths'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(humanResult.exitCode).toBe(0);
    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.stdout).not.toContain(realRoot);
    expect(jsonResult.stdout).not.toContain(realRoot);
    expect(JSON.parse(jsonResult.stdout).safety.readOnly).toBe(true);
  });
});
