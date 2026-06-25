import path from 'node:path';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { createTaskContractFile } from '../src/core/task-contract.js';
import { loadAgentLoopConfig } from '../src/core/config.js';
import { setActiveTask } from '../src/core/task-state.js';
import { getReviewContext, renderReviewContextMarkdown } from '../src/core/review-context.js';
import { compactEvidenceMap, type EvidenceMap } from '../src/core/evidence-map.js';
import type { ContextBudgetSummary } from '../src/core/context-budget.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

function minimalEvidenceMap(): EvidenceMap {
  return {
    summary: {
      reviewability: 'reviewable',
      changedFileCount: 0,
      nonEvidenceChangedFileCount: 0,
      agentLoopEvidenceChangedFileCount: 0,
    },
    task: null,
    verification: { status: 'missing', fresh: false, label: 'missing' },
    files: [],
    coverage: {
      coveredFileCount: 0,
      unexplainedFileCount: 0,
      forbiddenFileCount: 0,
      unexplainedExamples: [],
    },
    risk: {
      riskSensitiveFileCount: 0,
      riskSensitiveExamples: [],
    },
    nextActions: [],
    claims: [],
  };
}

function minimalContextBudget(): ContextBudgetSummary {
  return {
    heuristic: 'chars-divided-by-four',
    changedFileCount: 0,
    nonEvidenceChangedFileCount: 0,
    estimatedFileListTokens: 0,
    estimatedResumePackTokens: 0,
    savingsCommand: 'agentloop resume-pack --for codex --redact-paths',
    note: 'Token estimates use a transparent character-count heuristic, not a provider tokenizer or billing meter.',
  };
}

function minimalReviewWorkingTree(
  input: {
    dirty?: boolean;
    changedFileCount?: number;
    nonEvidenceChangedFileCount?: number;
    agentLoopEvidenceChangedFileCount?: number;
  } = {},
) {
  return {
    dirty: input.dirty ?? false,
    changedFileCount: input.changedFileCount ?? 0,
    nonEvidenceChangedFileCount: input.nonEvidenceChangedFileCount ?? 0,
    agentLoopEvidenceChangedFileCount: input.agentLoopEvidenceChangedFileCount ?? 0,
    changedFileExamples: [],
    changedFileExampleLimit: 5,
    changedFilesOmitted: false,
  };
}

function makeMinimalReviewContext(input: {
  activeTask?: { path: string; title: string; status: string } | null;
  latestTask?: { path: string; title: string; status: string } | null;
  taskGate?: { status: 'pass' | 'warn' | 'fail'; path?: string; message?: string } | null;
}) {
  return {
    status: {
      project: { name: 'demo', type: 'generic', packageManager: 'npm' },
      workingTree: minimalReviewWorkingTree(),
      activeTask: input.activeTask ?? null,
      activeTaskRiskNotes: null,
      latestTask: input.latestTask ?? null,
      latestVerification: null,
      latestRun: undefined,
      nextAction: {
        command: 'agentloop create-task',
        reason: 'Create a task.',
      },
    },
    gates: {
      strict: false,
      overallStatus: input.taskGate?.status ?? 'pass',
      gates: input.taskGate
        ? [
            {
              id: 'task-contract',
              name: 'Task contract',
              status: input.taskGate.status,
              message: input.taskGate.message ?? 'Task evidence',
              ...(input.taskGate.path ? { path: input.taskGate.path } : {}),
            },
          ]
        : [],
      nextAction: {
        command: 'agentloop create-task',
        reason: 'Create a task.',
      },
    },
    policies: {
      policies: [],
      summary: { current: 1, modified: 0, missing: 0, extra: 0 },
    },
    artifacts: {
      tasks: { count: 0, byStatus: {}, latest: null },
      verificationReports: { count: 0, latest: null },
      handoffs: { count: 0, latest: null },
      shipReports: { count: 0, latest: null },
      htmlReports: { count: 0, latest: null },
      badges: { count: 0, latest: null },
      ciSummaries: { count: 0, latest: null },
      releaseNotes: { count: 0, latest: null },
      runs: { count: 0, latest: null },
    },
    evidenceMap: compactEvidenceMap(minimalEvidenceMap()),
    contextBudget: minimalContextBudget(),
    recentRuns: [],
    latestShip: null,
    githubMetadata: {
      status: 'missing',
      path: '.agentloop/github/context.json',
    },
    safety: {
      readOnly: true,
      includesMarkdownContent: false,
      localGitStatus: true,
      verificationCommandsRun: false,
      projectCommandsRun: false,
    },
  } as Awaited<ReturnType<typeof getReviewContext>>;
}

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
      likelyFiles: ['src/auth/redirect.ts'],
      acceptanceCriteria: ['Redirect destination is preserved'],
      verificationCommands: ['npm test'],
      riskNotes: ['Touches auth-adjacent routing'],
      rollbackNotes: 'Revert the redirect handler change.',
    },
  });
  await setActiveTask({ cwd: dir, config, taskPath: task.path });
  await writeFile(
    path.join(
      dir,
      '.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context.md',
    ),
    [
      '# Surface AgentFlight placeholders in review context',
      '',
      '- Status: proposed',
      '',
      '## Problem Statement',
      'AgentFlight session task: Surface AgentFlight placeholders in review context',
      '',
      '## Desired Outcome',
      'Task is implemented with local verification evidence.',
      '',
    ].join('\n'),
  );
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
    expect(payload.status.workingTree.changedFiles).toBeUndefined();
    expect(payload.status.workingTree.changedFileExamples).toHaveLength(5);
    expect(payload.status.workingTree.changedFileExampleLimit).toBe(5);
    expect(payload.status.workingTree.changedFilesOmitted).toBe(true);
    expect(payload.evidenceMap.summary).toMatchObject({
      reviewability: expect.any(String),
      changedFileCount: expect.any(Number),
      nonEvidenceChangedFileCount: expect.any(Number),
    });
    expect(payload.evidenceMap.files).toBeUndefined();
    expect(payload.evidenceMap.fileList).toMatchObject({
      omitted: true,
      handle: 'evidence-map:current',
      command: 'agentloop context show evidence-map:current',
    });
    expect(payload.evidenceMap.coverage).toBeTruthy();
    expect(payload.evidenceMap.risk).toBeTruthy();
    expect(payload.evidenceMap.verification).toBeTruthy();
    expect(payload.evidenceMap.nextActions.length).toBeGreaterThan(0);
    expect(JSON.stringify(payload)).not.toContain('"coveredByTask"');
    expect(payload.evidenceMap.claims).toContain(
      'Evidence coverage is path-based local AgentLoopKit evidence, not proof of code correctness.',
    );
    expect(payload.status.activeTaskRiskNotes).toEqual({ count: 1 });
    expect(JSON.stringify(payload)).not.toContain('Touches auth-adjacent routing');
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
    expect(payload.artifacts.tasks.count).toBe(1);
    expect(payload.artifacts.tasks.agentFlightPlaceholders).toMatchObject({
      count: 1,
      latest: {
        path: '.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context.md',
        title: 'Surface AgentFlight placeholders in review context',
        status: 'proposed',
        source: 'agentflight-placeholder',
      },
    });
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
      localGitStatus: true,
      verificationCommandsRun: false,
      projectCommandsRun: false,
    });
    expect(JSON.stringify(payload)).not.toContain(dir);
  });

  test('prints concise Markdown review context by default', async () => {
    const dir = await createRepoWithReviewContextEvidence();

    const result = await execa(tsxPath, [cliPath, 'review-context'], { cwd: dir });

    expect(result.stdout).toContain('# AgentLoopKit Review Context');
    expect(result.stdout).toContain('- Evidence map:');
    expect(result.stdout).toContain('- Context budget:');
    expect(result.stdout).toContain('`agentloop resume-pack --for codex --redact-paths`');
    expect(result.stdout).toContain('- Active task: `Fix login redirect bug`');
    expect(result.stdout).toContain('- Active task risk notes: `1` recorded');
    expect(result.stdout).toContain('- Latest verification: `pass`');
    expect(result.stdout).toContain('- Gates: `warn`');
    expect(result.stdout).toContain(
      '- Artifacts: `1` task(s), `1` AgentFlight placeholder task(s), `1` verification report(s), `1` handoff(s)',
    );
    expect(result.stdout).toContain('- Latest ship score: `94`/100');
    expect(result.stdout).toContain('- GitHub metadata: issue `#42` `OPEN`, PR `#77` `OPEN`');
    expect(result.stdout).toContain('Run `agentloop handoff`.');
    expect(result.stdout).not.toContain(dir);
    expect(result.stdout).not.toContain('Review handoff.');
    expect(result.stdout).not.toContain('Touches auth-adjacent routing');
  });

  test('separates AgentLoop evidence churn in recent runs for human output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const runDir = path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship');
    const changedFiles = [
      { path: 'src/status.ts', status: 'M' },
      { path: '.agentloop/reports/2026-06-10-12-30-verification-report.md', status: '??' },
      { path: '.agentflight/reports/session-proof.md', status: '??' },
    ];
    await mkdir(runDir, { recursive: true });
    await writeFile(
      path.join(runDir, 'metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-10-12-32-ship',
          command: 'ship',
          createdAt: '2026-06-10-12-32',
          createdAtEpochMs: Date.parse('2026-06-10T12:32:00Z'),
          task: null,
          score: 94,
          changedFileCount: changedFiles.length,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runDir, 'changed-files.json'),
      `${JSON.stringify(changedFiles, null, 2)}\n`,
    );

    const human = await execa(tsxPath, [cliPath, 'review-context'], { cwd: dir });
    const json = JSON.parse(
      (await execa(tsxPath, [cliPath, 'review-context', '--json'], { cwd: dir })).stdout,
    );

    expect(human.stdout).toContain(
      '- `ship` `94`/100 - `3` changed file(s) (`1` non-evidence, `2` AgentLoop evidence) - `2026-06-10-12-32-ship`',
    );
    expect(json.recentRuns[0]).not.toHaveProperty('nonEvidenceChangedFileCount');
    expect(json.recentRuns[0]).not.toHaveProperty('agentLoopEvidenceChangedFileCount');
  });

  test('renders human Markdown with line-safe inline values', () => {
    const context = {
      status: {
        project: { name: 'demo', type: 'generic', packageManager: 'npm' },
        workingTree: minimalReviewWorkingTree({
          dirty: true,
          changedFileCount: 2,
          nonEvidenceChangedFileCount: 1,
          agentLoopEvidenceChangedFileCount: 1,
        }),
        activeTask: {
          path: '.agentloop/tasks/fix\nlogin.md',
          title: 'Fix\nlogin redirect',
          status: 'review\nready',
        },
        activeTaskRiskNotes: {
          count: 2,
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
      evidenceMap: compactEvidenceMap(minimalEvidenceMap()),
      contextBudget: minimalContextBudget(),
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
        localGitStatus: true,
        verificationCommandsRun: false,
        projectCommandsRun: false,
      },
    } as Awaited<ReturnType<typeof getReviewContext>>;

    const markdown = renderReviewContextMarkdown(context);

    expect(markdown).toContain('`Fix\\nlogin redirect`');
    expect(markdown).toContain('`review\\nready`');
    expect(markdown).toContain('- Active task risk notes: `2` recorded');
    expect(markdown).toContain('`.agentloop/reports/verification\\nreport.md`');
    expect(markdown).toContain('- Gates: `warn`');
    expect(markdown).toContain(
      '- Working tree: `dirty (2; 1 non-evidence, 1 AgentLoop evidence)`',
    );
    expect(markdown).toContain('- `ship` `96`/100');
    expect(markdown).toContain('`2026-06-16\\nship`');
    expect(markdown).toContain('`.agentloop/github/context\\nbad.json`');
    expect(markdown).toContain('`Unexpected\\nJSON token`');
    expect(markdown).toContain('Run `agentloop\\nhandoff`.');
    expect(markdown).not.toContain('`Fix\nlogin redirect`');
    expect(markdown).not.toContain('Run `agentloop\nhandoff`.');
  });

  test('labels task evidence source in human gate summary', () => {
    const activePath = '.agentloop/tasks/2026-06-10-active.md';
    const latestPath = '.agentloop/tasks/2026-06-10-latest.md';
    const archivedPath = '.agentloop/tasks/archive/2026-06-10-archived.md';
    const cases = [
      {
        context: makeMinimalReviewContext({
          activeTask: { path: activePath, title: 'Active task', status: 'review' },
          taskGate: { status: 'pass', path: activePath },
        }),
        expected: '- Gates: `pass` (task evidence: `Active task evidence`)',
      },
      {
        context: makeMinimalReviewContext({
          latestTask: { path: latestPath, title: 'Latest task', status: 'proposed' },
          taskGate: { status: 'pass', path: latestPath },
        }),
        expected: '- Gates: `pass` (task evidence: `Latest open task evidence`)',
      },
      {
        context: makeMinimalReviewContext({
          taskGate: { status: 'pass', path: archivedPath },
        }),
        expected: '- Gates: `pass` (task evidence: `Archived task evidence`)',
      },
      {
        context: makeMinimalReviewContext({
          taskGate: { status: 'fail', message: 'No task contract found.' },
        }),
        expected: '- Gates: `fail` (task evidence: `Missing task evidence`)',
      },
    ];

    for (const item of cases) {
      expect(renderReviewContextMarkdown(item.context)).toContain(item.expected);
    }
  });

  test('omits active task risk-note count when no task is active', () => {
    const context = {
      status: {
        project: { name: 'demo', type: 'generic', packageManager: 'npm' },
        workingTree: minimalReviewWorkingTree(),
        activeTask: null,
        activeTaskRiskNotes: null,
        latestTask: null,
        latestVerification: {
          path: '.agentloop/reports/2026-06-10-12-30-verification-report.md',
          title: 'Verification Report',
          overallStatus: 'pass',
        },
        latestRun: undefined,
        nextAction: {
          command: 'agentloop create-task',
          reason: 'Create a task.',
        },
      },
      gates: {
        strict: false,
        overallStatus: 'pass',
        gates: [],
        nextAction: {
          command: 'agentloop create-task',
          reason: 'Create a task.',
        },
      },
      policies: {
        policies: [],
        summary: { current: 1, modified: 0, missing: 0, extra: 0 },
      },
      artifacts: {
        tasks: { count: 0, byStatus: {}, latest: null },
        verificationReports: { count: 0, latest: null },
        handoffs: { count: 0, latest: null },
        shipReports: { count: 0, latest: null },
        htmlReports: { count: 0, latest: null },
        badges: { count: 0, latest: null },
        ciSummaries: { count: 0, latest: null },
        releaseNotes: { count: 0, latest: null },
        runs: { count: 0, latest: null },
      },
      evidenceMap: compactEvidenceMap(minimalEvidenceMap()),
      contextBudget: minimalContextBudget(),
      recentRuns: [],
      latestShip: null,
      githubMetadata: {
        status: 'missing',
        path: '.agentloop/github/context.json',
      },
      safety: {
        readOnly: true,
        includesMarkdownContent: false,
        localGitStatus: true,
        verificationCommandsRun: false,
        projectCommandsRun: false,
      },
    } as Awaited<ReturnType<typeof getReviewContext>>;

    const markdown = renderReviewContextMarkdown(context);

    expect(markdown).toContain('- Active task: none');
    expect(markdown).toContain(
      '- Latest previous verification: `pass` - `.agentloop/reports/2026-06-10-12-30-verification-report.md`',
    );
    expect(markdown).not.toContain('- Latest verification: `pass`');
    expect(markdown).not.toContain('Active task risk notes:');
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
