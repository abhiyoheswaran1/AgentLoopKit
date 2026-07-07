import path from 'node:path';
import { mkdir, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { resolveCurrentVerificationEvidence } from '../src/core/evidence.js';
import { computeVerifiedStateFingerprint } from '../src/core/verified-state.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

const TASK_MARKDOWN = `# Demo task

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
Demo task for evidence freshness tests.

## Desired Outcome
Freshness reflects the current working tree.
`;

async function createFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);

  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  await mkdir(path.join(dir, 'src'), { recursive: true });
  await writeFile(path.join(dir, 'src/app.ts'), 'export const app = 1;\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-q', '-m', 'init']);

  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-demo.md');
  await mkdir(path.dirname(taskPath), { recursive: true });
  await writeFile(taskPath, TASK_MARKDOWN);

  return { dir, taskPath };
}

async function writeReport(options: {
  dir: string;
  reportPath: string;
  taskPath: string;
  includeFingerprint: boolean;
}) {
  const lines = ['# Verification Report', ''];
  if (options.includeFingerprint) {
    const fingerprint = await computeVerifiedStateFingerprint({ cwd: options.dir });
    lines.push(`- Verified-state fingerprint: \`${fingerprint}\``);
  }
  lines.push('- Overall status: pass');
  await mkdir(path.dirname(options.reportPath), { recursive: true });
  await writeFile(options.reportPath, lines.join('\n') + '\n');

  // Ensure the report mtime is >= the task mtime so only the fingerprint
  // (or, in the legacy case, the mtime comparison itself) governs freshness.
  const future = new Date(Date.now() + 60_000);
  await utimes(options.reportPath, future, future);
}

describe('resolveCurrentVerificationEvidence (content-addressed freshness)', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('freshness goes stale when the tree changes after verify (fingerprint mismatch)', async () => {
    const { dir, taskPath } = await createFixture();
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md');
    await writeReport({ dir, reportPath, taskPath, includeFingerprint: true });

    const before = await resolveCurrentVerificationEvidence({ cwd: dir, taskPath, reportPath });
    expect(before.currentReportPath).toBe(reportPath);
    expect(before.staleReport).toBeUndefined();

    await writeFile(path.join(dir, 'src/app.ts'), '// changed\n');

    const after = await resolveCurrentVerificationEvidence({ cwd: dir, taskPath, reportPath });
    expect(after.currentReportPath).toBeUndefined();
    expect(after.staleReport?.message).toMatch(/fingerprint/i);
  });

  test('legacy report with no fingerprint keeps mtime-based freshness', async () => {
    const { dir, taskPath } = await createFixture();
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md');
    await writeReport({ dir, reportPath, taskPath, includeFingerprint: false });

    const result = await resolveCurrentVerificationEvidence({ cwd: dir, taskPath, reportPath });
    expect(result.currentReportPath).toBe(reportPath);
    expect(result.staleReport).toBeUndefined();

    // Mutating the tree does not affect freshness for legacy (no-fingerprint) reports.
    await writeFile(path.join(dir, 'src/app.ts'), '// changed\n');
    const afterMutation = await resolveCurrentVerificationEvidence({
      cwd: dir,
      taskPath,
      reportPath,
    });
    expect(afterMutation.currentReportPath).toBe(reportPath);
  });
});
