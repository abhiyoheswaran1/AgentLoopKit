import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { createTaskContractFile } from '../src/core/task-contract.js';
import { loadAgentLoopConfig } from '../src/core/config.js';
import { setActiveTask } from '../src/core/task-state.js';
import { makeTempDir, removeTempDir } from './helpers.js';

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
    expect(payload.gates.overallStatus).toBe('pass');
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
    expect(result.stdout).toContain('- Gates: `pass`');
    expect(result.stdout).toContain('- Latest ship score: `94`/100');
    expect(result.stdout).toContain('Run `agentloop handoff`.');
    expect(result.stdout).not.toContain(dir);
    expect(result.stdout).not.toContain('Review handoff.');
  });
});
