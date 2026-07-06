import path from 'node:path';
import { mkdir, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { createTaskContractFile } from '../src/core/task-contract.js';
import { loadAgentLoopConfig } from '../src/core/config.js';
import { setActiveTask } from '../src/core/task-state.js';
import { callMcpTool, listMcpTools } from '../src/core/mcp-tools.js';
import * as runsModule from '../src/core/runs.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

type StatusPayload = {
  git: {
    root: string;
  };
  nextAction: {
    command: string;
  };
};

type NextPayload = {
  nextAction: {
    command: string;
  };
};

type TaskPayload = {
  tasks: Array<{
    title: string;
    active: boolean;
  }>;
};

type ActiveTaskPayload = {
  task: {
    title: string;
    content: string;
  };
};

type PoliciesPayload = {
  policies: Array<{
    name: string;
  }>;
};

type PolicyPayload = {
  policy: {
    title: string;
  };
};

type PolicyStatusPayload = {
  policies: Array<{
    name: string;
    status: string;
    templatePath: string | null;
  }>;
  summary: {
    current: number;
    modified: number;
    missing: number;
    extra: number;
  };
};

type ReportPayload = {
  report: {
    path: string;
    content: string;
  };
};

type ShipReportPayload = {
  shipReport: {
    path: string;
    content: string;
  };
};

type RunsPayload = {
  runs: Array<{
    id: string;
    command: string;
    task?: {
      path: string;
      title: string;
      status: string;
    } | null;
    score?: number;
    verificationReportPath?: string;
    shipReportPath?: string;
  }>;
};

type RunPayload = {
  run: {
    metadata: {
      id: string;
      command: string;
      verificationReportPath?: string;
      shipReportPath?: string;
    };
    score: {
      totalScore: number;
    } | null;
    changedFiles: Array<{
      path: string;
    }>;
    diffStat: string;
  };
};

type IntentPayload = {
  file: string;
  runs: Array<{
    id: string;
    why: string;
    shipReportPath?: string;
  }>;
  search: {
    totalRunCount: number;
    inspectedRunCount: number;
    scanLimit: number;
    matchLimit: number;
    truncated: boolean;
    stoppedAfterMatches: boolean;
  };
};

type MaintainerCheckPayload = {
  status: string;
  checks: Array<{
    id: string;
    status: string;
    message: string;
  }>;
  maintainerChecklist: string[];
  suggestedContributorRequest: string;
};

type GatesPayload = {
  strict: boolean;
  overallStatus: string;
  gates: Array<{
    id: string;
    status: string;
  }>;
  nextAction: {
    command: string;
  };
};

type ArtifactsPayload = {
  tasks: {
    count: number;
    latest: {
      title: string;
      path: string;
    } | null;
  };
  verificationReports: {
    count: number;
    latest: {
      path: string;
      overallStatus: string;
    } | null;
  };
  handoffs: {
    count: number;
    latest: {
      path: string;
    } | null;
  };
};

type ReviewContextPayload = {
  status: {
    activeTask: {
      title: string;
      path: string;
    } | null;
    latestVerification: {
      overallStatus: string;
      path: string;
      title: string;
    } | null;
    nextAction: {
      command: string;
    };
  };
  gates: {
    overallStatus: string;
    gates: Array<{
      id: string;
      status: string;
    }>;
  };
  policies: {
    summary: {
      current: number;
      modified: number;
      missing: number;
      extra: number;
    };
  };
  artifacts: ArtifactsPayload;
  evidenceMap: {
    files?: unknown;
    fileList: {
      omitted: true;
      handle: string;
      command: string;
    };
    summary: {
      changedFileCount: number;
    };
  };
  recentRuns: Array<{
    id: string;
    command: string;
    score?: number;
    shipReportPath?: string;
  }>;
  latestShip: {
    id: string;
    score: number;
    shipReportPath: string;
  } | null;
  safety: {
    readOnly: boolean;
    includesMarkdownContent: boolean;
    localGitStatus: boolean;
    verificationCommandsRun: boolean;
    projectCommandsRun: boolean;
  };
};

type LatestArtifactsPayload = {
  latest: Array<{
    type: string;
    path: string;
    overallStatus?: string;
  }>;
};

type HandoffsPayload = {
  handoffs: Array<{
    path: string;
    title: string;
    modifiedAt: string;
  }>;
};

type HandoffPayload = {
  handoff: {
    content: string;
  };
};

async function createInitializedRepo() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const outsideDir = await makeTempDir();
  tempDirs.push(outsideDir);
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
      title: 'Add API route',
      type: 'feature',
      problemStatement: 'The API route is missing.',
      desiredOutcome: 'The API route returns JSON for callers.',
      likelyFiles: ['src/routes/api.ts'],
      acceptanceCriteria: ['Route returns JSON'],
      verificationCommands: ['npm test'],
      rollbackNotes: 'Revert the route implementation.',
    },
  });
  await setActiveTask({ cwd: dir, config, taskPath: task.path });
  const taskRelativePath = path.relative(dir, task.path).split(path.sep).join('/');
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-30-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n\nTests passed.\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-32-ship-report.md'),
    '# AgentLoopKit Ship Report\n\n- Review readiness score: `96`/100\n',
  );
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/handoffs/2026-06-10-12-31-pr-summary.md'),
    '# PR Summary\n\nRoute implementation handoff.\n',
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
          path: taskRelativePath,
          title: 'Stored API route snapshot',
          status: 'review',
        },
        verificationReportPath: path.join(outsideDir, 'private-verification-report.md'),
        shipReportPath: path.join(dir, '.agentloop/reports/2026-06-10-12-32-ship-report.md'),
        score: 96,
        changedFileCount: 2,
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship/score.json'),
    `${JSON.stringify({ totalScore: 96 }, null, 2)}\n`,
  );
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship/changed-files.json'),
    `${JSON.stringify([{ path: 'src/routes/api.ts', status: 'M' }], null, 2)}\n`,
  );
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-10-12-32-ship/diffstat.txt'),
    ' src/routes/api.ts | 4 ++++\n',
  );
  return { dir };
}

describe('mcp tools', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('lists read-only AgentLoopKit MCP tools', () => {
    expect(listMcpTools().map((tool) => tool.name)).toEqual([
      'agentloop_status',
      'agentloop_next',
      'agentloop_list_tasks',
      'agentloop_show_active_task',
      'agentloop_list_policies',
      'agentloop_read_policy',
      'agentloop_policy_status',
      'agentloop_latest_verification_report',
      'agentloop_latest_ship_report',
      'agentloop_list_runs',
      'agentloop_show_run',
      'agentloop_file_intent',
      'agentloop_maintainer_check',
      'agentloop_check_gates',
      'agentloop_artifacts',
      'agentloop_review_context',
      'agentloop_start',
      'agentloop_context_budget',
      'agentloop_context_handles',
      'agentloop_context_pack',
      'agentloop_context_show',
      'agentloop_list_handoffs',
      'agentloop_latest_handoff',
    ]);
  });

  test('returns status, task, policy, report, and handoff data without running commands', async () => {
    const { dir } = await createInitializedRepo();

    const status = await callMcpTool({ cwd: dir, name: 'agentloop_status' });
    const next = await callMcpTool({ cwd: dir, name: 'agentloop_next' });
    const tasks = await callMcpTool({ cwd: dir, name: 'agentloop_list_tasks' });
    const activeTask = await callMcpTool({ cwd: dir, name: 'agentloop_show_active_task' });
    const policies = await callMcpTool({ cwd: dir, name: 'agentloop_list_policies' });
    const policy = await callMcpTool({
      cwd: dir,
      name: 'agentloop_read_policy',
      arguments: { policyName: 'security' },
    });
    const policyStatus = await callMcpTool({ cwd: dir, name: 'agentloop_policy_status' });
    const report = await callMcpTool({ cwd: dir, name: 'agentloop_latest_verification_report' });
    const shipReport = await callMcpTool({ cwd: dir, name: 'agentloop_latest_ship_report' });
    const runs = await callMcpTool({
      cwd: dir,
      name: 'agentloop_list_runs',
      arguments: { limit: 1 },
    });
    const run = await callMcpTool({
      cwd: dir,
      name: 'agentloop_show_run',
      arguments: { id: '2026-06-10-12-32-ship' },
    });
    const intent = await callMcpTool({
      cwd: dir,
      name: 'agentloop_file_intent',
      arguments: { file: 'src/routes/api.ts' },
    });
    const maintainerCheck = await callMcpTool({
      cwd: dir,
      name: 'agentloop_maintainer_check',
    });
    const gates = await callMcpTool({
      cwd: dir,
      name: 'agentloop_check_gates',
      arguments: { strict: true },
    });
    const artifacts = await callMcpTool({ cwd: dir, name: 'agentloop_artifacts' });
    const reviewContext = await callMcpTool({ cwd: dir, name: 'agentloop_review_context' });
    const start = await callMcpTool({
      cwd: dir,
      name: 'agentloop_start',
      arguments: { target: 'codex', goal: 'review' },
    });
    const contextHandles = await callMcpTool({ cwd: dir, name: 'agentloop_context_handles' });
    const latestVerificationArtifacts = await callMcpTool({
      cwd: dir,
      name: 'agentloop_artifacts',
      arguments: { type: 'verification', latest: true },
    });
    const handoffs = await callMcpTool({ cwd: dir, name: 'agentloop_list_handoffs' });
    const handoff = await callMcpTool({ cwd: dir, name: 'agentloop_latest_handoff' });

    const statusPayload = status.payload as StatusPayload;
    const nextPayload = next.payload as NextPayload;
    const tasksPayload = tasks.payload as TaskPayload;
    const activeTaskPayload = activeTask.payload as ActiveTaskPayload;
    const policiesPayload = policies.payload as PoliciesPayload;
    const policyPayload = policy.payload as PolicyPayload;
    const policyStatusPayload = policyStatus.payload as PolicyStatusPayload;
    const reportPayload = report.payload as ReportPayload;
    const shipReportPayload = shipReport.payload as ShipReportPayload;
    const runsPayload = runs.payload as RunsPayload;
    const runPayload = run.payload as RunPayload;
    const intentPayload = intent.payload as IntentPayload;
    const maintainerCheckPayload = maintainerCheck.payload as MaintainerCheckPayload;
    const gatesPayload = gates.payload as GatesPayload;
    const artifactsPayload = artifacts.payload as ArtifactsPayload;
    const reviewContextPayload = reviewContext.payload as ReviewContextPayload;
    const startPayload = start.payload as {
      start: {
        target: string;
        goal: string;
        preflight: {
          state: string;
          headline: string;
          reason: string;
        };
        readFirst: Array<{ handle: string }>;
        riskSummary: { blockers: number; warnings: number; topRisks: string[] };
        impact: { verificationFreshness: string; summary: string };
      };
    };
    const contextHandlesPayload = contextHandles.payload as {
      contextHandles: {
        handles: Array<{ id: string; available: boolean; command: string }>;
        markdown: string;
        safety: {
          readOnly: true;
          localEvidenceOnly: true;
          localGitStatus: true;
          verificationCommandsRun: false;
          projectCommandsRun: false;
        };
      };
    };
    const latestVerificationArtifactsPayload =
      latestVerificationArtifacts.payload as LatestArtifactsPayload;
    const handoffsPayload = handoffs.payload as HandoffsPayload;
    const handoffPayload = handoff.payload as HandoffPayload;

    expect(statusPayload.git.root).toBe('[git-root]');
    expect(JSON.stringify(statusPayload)).not.toContain(dir);
    expect(statusPayload.nextAction.command).toBe('agentloop handoff');
    expect(nextPayload.nextAction.command).toBe('agentloop handoff');
    expect(tasksPayload.tasks[0]).toMatchObject({ title: 'Add API route', active: true });
    expect(activeTaskPayload.task).toMatchObject({ title: 'Add API route' });
    expect(activeTaskPayload.task.content).toContain('Route returns JSON');
    expect(policiesPayload.policies.map((entry) => entry.name)).toContain('security-policy');
    expect(policyPayload.policy.title).toBe('Security Policy');
    expect(policyStatusPayload.summary).toEqual({
      current: 8,
      modified: 0,
      missing: 0,
      extra: 0,
    });
    expect(policyStatusPayload.policies).toContainEqual({
      name: 'security-policy',
      title: 'Security Policy',
      path: '.agentloop/policies/security-policy.md',
      status: 'current',
      templatePath: 'templates/policies/security-policy.md',
    });
    expect(reportPayload.report.path).toBe(
      '.agentloop/reports/2026-06-10-12-30-verification-report.md',
    );
    expect(reportPayload.report.content).toContain('Tests passed.');
    expect(shipReportPayload.shipReport.path).toBe(
      '.agentloop/reports/2026-06-10-12-32-ship-report.md',
    );
    expect(shipReportPayload.shipReport.content).toContain('Review readiness score');
    expect(runsPayload.runs).toEqual([
      expect.objectContaining({
        id: '2026-06-10-12-32-ship',
        command: 'ship',
        score: 96,
        verificationReportPath: 'private-verification-report.md',
        shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
      }),
    ]);
    expect(runsPayload.runs[0].shipReportPath).not.toContain(dir);
    expect(runPayload.run.metadata).toMatchObject({
      id: '2026-06-10-12-32-ship',
      command: 'ship',
      verificationReportPath: 'private-verification-report.md',
      shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
    });
    expect(runPayload.run.metadata.shipReportPath).not.toContain(dir);
    expect(runPayload.run.metadata.verificationReportPath).not.toContain('..');
    expect(runPayload.run.score?.totalScore).toBe(96);
    expect(runPayload.run.changedFiles).toEqual([{ path: 'src/routes/api.ts', status: 'M' }]);
    expect(runPayload.run.diffStat).toContain('src/routes/api.ts');
    expect(intentPayload).toEqual({
      file: 'src/routes/api.ts',
      runs: [
        expect.objectContaining({
          id: '2026-06-10-12-32-ship',
          why: 'Changed in ship run for task "Add API route".',
          shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
        }),
      ],
      search: expect.objectContaining({
        totalRunCount: 1,
        inspectedRunCount: 1,
        truncated: false,
      }),
    });
    expect(intentPayload.runs[0].shipReportPath).not.toContain(dir);
    expect(maintainerCheckPayload.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'verification-evidence', status: 'pass' }),
      ]),
    );
    expect(maintainerCheckPayload.maintainerChecklist).toContain(
      'Confirm the task contract matches the pull request scope.',
    );
    expect(maintainerCheckPayload.suggestedContributorRequest).toEqual(expect.any(String));
    expect(gatesPayload.strict).toBe(true);
    expect(gatesPayload.overallStatus).toBe('fail');
    expect(gatesPayload.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'verification-report', status: 'pass' }),
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'warn',
          message: 'Latest handoff does not cover the current dirty files.',
        }),
      ]),
    );
    expect(gatesPayload.nextAction.command).toBe('agentloop handoff');
    expect(artifactsPayload.tasks.count).toBe(1);
    expect(artifactsPayload.tasks.latest).toMatchObject({
      title: 'Add API route',
      path: expect.stringContaining('.agentloop/tasks/'),
    });
    expect(artifactsPayload.verificationReports.latest).toMatchObject({
      path: '.agentloop/reports/2026-06-10-12-30-verification-report.md',
      overallStatus: 'pass',
    });
    expect(artifactsPayload.handoffs.latest?.path).toBe(
      '.agentloop/handoffs/2026-06-10-12-31-pr-summary.md',
    );
    expect(reviewContextPayload.status.activeTask).toMatchObject({
      title: 'Add API route',
      path: expect.stringContaining('.agentloop/tasks/'),
    });
    expect(reviewContextPayload.status.latestVerification).toEqual({
      overallStatus: 'pass',
      path: '.agentloop/reports/2026-06-10-12-30-verification-report.md',
      title: 'Verification Report',
    });
    expect(reviewContextPayload.status.nextAction.command).toBe('agentloop handoff');
    expect(reviewContextPayload.gates.overallStatus).toBe('warn');
    expect(reviewContextPayload.gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'verification-report', status: 'pass' }),
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'warn',
          message: 'Latest handoff does not cover the current dirty files.',
        }),
      ]),
    );
    expect(reviewContextPayload.policies.summary.current).toBe(8);
    expect(reviewContextPayload.artifacts.verificationReports.latest).toMatchObject({
      path: '.agentloop/reports/2026-06-10-12-30-verification-report.md',
      overallStatus: 'pass',
    });
    expect(reviewContextPayload.evidenceMap.files).toBeUndefined();
    expect(reviewContextPayload.evidenceMap.fileList).toMatchObject({
      omitted: true,
      handle: 'evidence-map:current',
      command: 'agentloop context show evidence-map:current',
    });
    expect(reviewContextPayload.evidenceMap.summary.changedFileCount).toBeGreaterThan(0);
    expect(JSON.stringify(reviewContext.payload)).not.toContain('"coveredByTask"');
    expect(reviewContextPayload.recentRuns).toEqual([
      expect.objectContaining({
        id: '2026-06-10-12-32-ship',
        command: 'ship',
        score: 96,
        shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
      }),
    ]);
    expect(reviewContextPayload.latestShip).toEqual({
      id: '2026-06-10-12-32-ship',
      score: 96,
      shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
    });
    expect(reviewContextPayload.safety).toEqual({
      readOnly: true,
      includesMarkdownContent: false,
      localGitStatus: true,
      verificationCommandsRun: false,
      projectCommandsRun: false,
    });
    expect(startPayload.start.target).toBe('codex');
    expect(startPayload.start.goal).toBe('review');
    expect(startPayload.start.preflight).toMatchObject({
      state: 'scope-drift',
    });
    expect(startPayload.start.preflight.headline).toMatch(/scope/i);
    expect(startPayload.start.preflight.reason).toContain('outside local task');
    expect(startPayload.start.readFirst[0].handle).toBe('evidence-map:current');
    expect(startPayload.start.impact.verificationFreshness).toBe('fresh');
    expect(startPayload.start.impact.summary).toContain('estimated context');
    expect(startPayload.start.riskSummary.blockers).toBe(0);
    expect(contextHandlesPayload.contextHandles.handles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task:active',
          available: true,
          command: 'agentloop context show task:active',
        }),
        expect.objectContaining({
          id: 'evidence-map:current',
          available: true,
        }),
      ]),
    );
    expect(contextHandlesPayload.contextHandles.markdown).toContain(
      '# AgentLoopKit Context Handles',
    );
    expect(contextHandlesPayload.contextHandles.safety).toEqual({
      readOnly: true,
      localEvidenceOnly: true,
      localGitStatus: true,
      verificationCommandsRun: false,
      projectCommandsRun: false,
    });
    expect(JSON.stringify(reviewContext.payload)).not.toContain(dir);
    expect(JSON.stringify(reviewContext.payload)).not.toContain('Route implementation handoff.');
    expect(latestVerificationArtifactsPayload.latest).toEqual([
      {
        type: 'verification',
        title: 'Verification Report',
        path: '.agentloop/reports/2026-06-10-12-30-verification-report.md',
        overallStatus: 'pass',
      },
    ]);
    expect(handoffsPayload.handoffs[0]).toMatchObject({ title: 'PR Summary' });
    expect(handoffPayload.handoff.content).toContain('Route implementation handoff.');
  });

  test('uses bounded run listing for MCP run summaries', async () => {
    const { dir } = await createInitializedRepo();
    const listRunsSpy = vi.spyOn(runsModule, 'listRuns');

    const runs = await callMcpTool({
      cwd: dir,
      name: 'agentloop_list_runs',
      arguments: { limit: 1 },
    });

    expect((runs.payload as RunsPayload).runs).toHaveLength(1);
    expect((runs.payload as RunsPayload).runs[0].task).toMatchObject({
      title: 'Add API route',
      status: 'proposed',
    });
    expect(listRunsSpy).toHaveBeenCalledWith(dir, { limit: 1 });
  });

  test('bounds MCP latest artifact run lookup without changing full artifact inventory', async () => {
    const { dir } = await createInitializedRepo();
    const listRunsSpy = vi.spyOn(runsModule, 'listRuns');

    await callMcpTool({
      cwd: dir,
      name: 'agentloop_artifacts',
      arguments: { latest: true },
    });
    expect(listRunsSpy).toHaveBeenLastCalledWith(dir, { limit: 1 });

    listRunsSpy.mockClear();
    await callMcpTool({
      cwd: dir,
      name: 'agentloop_artifacts',
    });
    expect(listRunsSpy).toHaveBeenLastCalledWith(dir);
    listRunsSpy.mockRestore();
  });

  test('bounds MCP handoff list content reads before applying the limit', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'demo', scripts: { test: 'vitest' } }, null, 2),
    );
    await initializeAgentLoop({ cwd: dir });
    const handoffsDir = path.join(dir, '.agentloop/handoffs');
    await mkdir(handoffsDir, { recursive: true });
    const newest = path.join(handoffsDir, '2026-06-10-12-35-pr-summary.md');
    const older = path.join(handoffsDir, '2026-06-10-12-34-pr-summary.md');
    const oldest = path.join(handoffsDir, '2026-06-10-12-33-pr-summary.md');
    await writeFile(newest, '# Newest PR Summary\n\nNewest handoff.\n');
    await writeFile(older, '# Older PR Summary\n\nOlder handoff.\n');
    await writeFile(oldest, '# Oldest PR Summary\n\nOldest handoff.\n');
    await utimes(oldest, new Date('2026-06-10T12:33:00Z'), new Date('2026-06-10T12:33:00Z'));
    await utimes(older, new Date('2026-06-10T12:34:00Z'), new Date('2026-06-10T12:34:00Z'));
    await utimes(newest, new Date('2026-06-10T12:35:00Z'), new Date('2026-06-10T12:35:00Z'));

    const handoffs = await callMcpTool({
      cwd: dir,
      name: 'agentloop_list_handoffs',
      arguments: { limit: 1 },
    });

    expect((handoffs.payload as HandoffsPayload).handoffs).toEqual([
      {
        path: '.agentloop/handoffs/2026-06-10-12-35-pr-summary.md',
        title: 'Newest PR Summary',
        modifiedAt: new Date('2026-06-10T12:35:00Z').toISOString(),
      },
    ]);
    expect(JSON.stringify(handoffs.payload)).not.toContain('Newest handoff.');
    expect(JSON.stringify(handoffs.payload)).not.toContain('modifiedMs');
    expect(handoffs.content[0].text).toBe(JSON.stringify(handoffs.payload, null, 2));
  });

  test('skips oversized selected MCP handoff summaries', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'demo', scripts: { test: 'vitest' } }, null, 2),
    );
    await initializeAgentLoop({ cwd: dir });
    const handoffsDir = path.join(dir, '.agentloop/handoffs');
    await mkdir(handoffsDir, { recursive: true });
    const handoff = path.join(handoffsDir, '2026-06-10-12-36-pr-summary.md');
    await writeFile(handoff, `# Oversized PR Summary\n\n${'x'.repeat(1_048_577)}\n`);
    await utimes(
      handoff,
      new Date('2026-06-10T12:36:00Z'),
      new Date('2026-06-10T12:36:00Z'),
    );

    const handoffs = await callMcpTool({
      cwd: dir,
      name: 'agentloop_list_handoffs',
      arguments: { limit: 1 },
    });

    expect((handoffs.payload as HandoffsPayload).handoffs).toEqual([]);
    expect(JSON.stringify(handoffs.payload)).not.toContain('Oversized PR Summary');
  });

  test('redacts local roots when expanding context handles through MCP', async () => {
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
        title: 'Check MCP redaction',
        type: 'feature',
        problemStatement: `Local root appears in a fixture: ${dir}`,
        desiredOutcome: 'MCP context handle expansion can redact local roots.',
        acceptanceCriteria: ['MCP output redacts local root paths'],
        verificationCommands: ['npm test'],
        rollbackNotes: 'Remove the redaction fixture.',
      },
    });
    await setActiveTask({ cwd: dir, config, taskPath: task.path });

    const unredacted = await callMcpTool({
      cwd: dir,
      name: 'agentloop_context_show',
      arguments: { handle: 'task:active' },
    });
    const redacted = await callMcpTool({
      cwd: dir,
      name: 'agentloop_context_show',
      arguments: { handle: 'task:active', redactPaths: true },
    });

    expect(JSON.stringify(unredacted.payload)).toContain(dir);
    expect(JSON.stringify(redacted.payload)).toContain('[git-root]');
    expect(JSON.stringify(redacted.payload)).not.toContain(dir);
  });

  test('rejects unknown tools and policy traversal attempts', async () => {
    const { dir } = await createInitializedRepo();

    await expect(callMcpTool({ cwd: dir, name: 'agentloop_verify' })).rejects.toThrow(
      'Unknown MCP tool',
    );
    await expect(
      callMcpTool({
        cwd: dir,
        name: 'agentloop_show_run',
        arguments: { id: '../2026-06-10-12-32-ship' },
      }),
    ).rejects.toThrow('Invalid run id');
    await expect(
      callMcpTool({
        cwd: dir,
        name: 'agentloop_show_run',
        arguments: { id: '2026-06-10-99-99-ship' },
      }),
    ).rejects.toThrow('Run not found');
    await expect(
      callMcpTool({
        cwd: dir,
        name: 'agentloop_file_intent',
        arguments: { file: '' },
      }),
    ).rejects.toThrow('MCP tool argument "file" must be a non-empty string');
    await expect(
      callMcpTool({
        cwd: dir,
        name: 'agentloop_check_gates',
        arguments: { strict: 'true' },
      }),
    ).rejects.toThrow('MCP tool argument "strict" must be a boolean');
    await expect(
      callMcpTool({
        cwd: dir,
        name: 'agentloop_artifacts',
        arguments: { type: 'unknown' },
      }),
    ).rejects.toThrow('MCP tool argument "type" must be one of:');
    await expect(
      callMcpTool({
        cwd: dir,
        name: 'agentloop_read_policy',
        arguments: { policyName: '../AGENTS.md' },
      }),
    ).rejects.toThrow('Policy not found');
  });
});
