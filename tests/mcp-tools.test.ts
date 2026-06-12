import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { createTaskContractFile } from '../src/core/task-contract.js';
import { loadAgentLoopConfig } from '../src/core/config.js';
import { setActiveTask } from '../src/core/task-state.js';
import { callMcpTool, listMcpTools } from '../src/core/mcp-tools.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

type StatusPayload = {
  nextAction: {
    command: string;
  };
};

type NextPayload = {
  command: string;
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
    score?: number;
    shipReportPath?: string;
  }>;
};

type RunPayload = {
  run: {
    metadata: {
      id: string;
      command: string;
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

type HandoffsPayload = {
  handoffs: Array<{
    title: string;
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
      acceptanceCriteria: ['Route returns JSON'],
      verificationCommands: ['npm test'],
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
          path: '.agentloop/tasks/2026-06-10-add-api-route.md',
          title: 'Add API route',
          status: 'review',
        },
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
      'agentloop_latest_verification_report',
      'agentloop_latest_ship_report',
      'agentloop_list_runs',
      'agentloop_show_run',
      'agentloop_file_intent',
      'agentloop_maintainer_check',
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
    const handoffs = await callMcpTool({ cwd: dir, name: 'agentloop_list_handoffs' });
    const handoff = await callMcpTool({ cwd: dir, name: 'agentloop_latest_handoff' });

    const statusPayload = status.payload as StatusPayload;
    const nextPayload = next.payload as NextPayload;
    const tasksPayload = tasks.payload as TaskPayload;
    const activeTaskPayload = activeTask.payload as ActiveTaskPayload;
    const policiesPayload = policies.payload as PoliciesPayload;
    const policyPayload = policy.payload as PolicyPayload;
    const reportPayload = report.payload as ReportPayload;
    const shipReportPayload = shipReport.payload as ShipReportPayload;
    const runsPayload = runs.payload as RunsPayload;
    const runPayload = run.payload as RunPayload;
    const intentPayload = intent.payload as IntentPayload;
    const maintainerCheckPayload = maintainerCheck.payload as MaintainerCheckPayload;
    const handoffsPayload = handoffs.payload as HandoffsPayload;
    const handoffPayload = handoff.payload as HandoffPayload;

    expect(statusPayload.nextAction.command).toBe('agentloop handoff');
    expect(nextPayload.command).toBe('agentloop handoff');
    expect(tasksPayload.tasks[0]).toMatchObject({ title: 'Add API route', active: true });
    expect(activeTaskPayload.task).toMatchObject({ title: 'Add API route' });
    expect(activeTaskPayload.task.content).toContain('Route returns JSON');
    expect(policiesPayload.policies.map((entry) => entry.name)).toContain('security-policy');
    expect(policyPayload.policy.title).toBe('Security Policy');
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
        shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
      }),
    ]);
    expect(runsPayload.runs[0].shipReportPath).not.toContain(dir);
    expect(runPayload.run.metadata).toMatchObject({
      id: '2026-06-10-12-32-ship',
      command: 'ship',
      shipReportPath: '.agentloop/reports/2026-06-10-12-32-ship-report.md',
    });
    expect(runPayload.run.metadata.shipReportPath).not.toContain(dir);
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
    expect(handoffsPayload.handoffs[0]).toMatchObject({ title: 'PR Summary' });
    expect(handoffPayload.handoff.content).toContain('Route implementation handoff.');
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
        name: 'agentloop_read_policy',
        arguments: { policyName: '../AGENTS.md' },
      }),
    ).rejects.toThrow('Policy not found');
  });
});
