import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { setActiveTask } from '../src/core/task-state.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createReadyFixture(
  options: {
    verification?: 'pass' | 'fail' | 'missing';
    acceptancePlaceholder?: boolean;
    changedFile?: string;
    forbiddenFile?: string;
  } = {},
) {
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
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-27-12-00-verify'), { recursive: true });
  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await mkdir(path.join(dir, 'src/profile'), { recursive: true });
  await mkdir(path.join(dir, 'src/billing'), { recursive: true });

  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-27-fix-auth-copy.md');
  const forbiddenFile = options.forbiddenFile ?? 'src/billing';
  await writeFile(
    taskPath,
    `# Fix auth copy

- Created date: 2026-06-27
- Task type: bugfix
- Status: in-progress

## Problem Statement
Auth copy is unclear.

## Desired Outcome
Users understand the auth redirect.

## Likely Files or Areas
- src/auth

## Files or Areas Not to Touch
- ${forbiddenFile}

## Acceptance Criteria
- ${
      options.acceptancePlaceholder
        ? 'Add acceptance criteria before implementation starts.'
        : 'Auth copy is clearer.'
    }

## Verification Commands
- npm test -- auth

## Rollback Notes
Revert the copy change.
`,
  );
  await setActiveTask({ cwd: dir, config, taskPath });

  if (options.verification !== 'missing') {
    const status = options.verification ?? 'pass';
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-27-12-00-verification-report.md'),
      `# Verification Report\n\n- Overall status: ${status}\n`,
    );
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-27-12-00-verify/metadata.json'), {
      id: '2026-06-27-12-00-verify',
      command: 'verify',
      createdAt: '2026-06-27-12-00',
      createdAtEpochMs: Date.parse('2026-06-27T12:00:00Z'),
      task: {
        path: '.agentloop/tasks/2026-06-27-fix-auth-copy.md',
        title: 'Fix auth copy',
        status: 'in-progress',
      },
      verificationReportPath: '.agentloop/reports/2026-06-27-12-00-verification-report.md',
      overallStatus: status,
      changedFileCount: 1,
    });
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-27-12-00-verify/changed-files.json'), [
      { status: 'M', path: 'src/auth/copy.ts' },
    ]);
  }

  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "old";\n');
  await writeFile(path.join(dir, 'src/profile/copy.ts'), 'export const copy = "old";\n');
  await writeFile(path.join(dir, 'src/billing/price.ts'), 'export const price = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  const changedFile = options.changedFile ?? 'src/auth/copy.ts';
  await writeFile(path.join(dir, changedFile), 'export const copy = "new";\n');

  return dir;
}

async function createIdleFixture() {
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
  await mkdir(path.join(dir, '.agentloop'), { recursive: true });
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  return dir;
}

describe('ready command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('marks review readiness when task scope, acceptance, verification, and drift gates pass', async () => {
    const dir = await createReadyFixture();

    const result = await execa(tsxPath, [cliPath, 'ready', '--json', '--redact-paths'], {
      cwd: dir,
    });
    const payload = JSON.parse(result.stdout);

    expect(payload.status).toBe('ready');
    expect(payload.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'acceptance-criteria', status: 'pass' }),
        expect.objectContaining({ id: 'verification', status: 'pass' }),
        expect.objectContaining({ id: 'scope-drift', status: 'pass' }),
      ]),
    );
    expect(payload.tokenReceipt).toMatchObject({
      heuristic: 'chars-divided-by-four',
      estimatedBroadContextTokens: expect.any(Number),
      estimatedCompactContextTokens: expect.any(Number),
      estimatedAgentLoopOverheadTokens: expect.any(Number),
      estimatedNetContextReductionTokens: expect.any(Number),
    });
    expect(payload.evidenceMap.files).toBeUndefined();
    expect(payload.evidenceMap.fileList).toMatchObject({
      omitted: true,
      handle: 'evidence-map:current',
    });
    expect(payload.nextAction.command).toBe('agentloop ship');
    expect(payload.safety).toMatchObject({
      readOnly: true,
      localEvidenceOnly: true,
      runsVerification: false,
      executesExternalAgents: false,
    });
    expect(result.stdout).not.toContain(dir);
  });

  test('blocks readiness when acceptance criteria still contain placeholders', async () => {
    const dir = await createReadyFixture({ acceptancePlaceholder: true });

    const result = await execa(tsxPath, [cliPath, 'ready', '--json'], { cwd: dir });
    const payload = JSON.parse(result.stdout);

    expect(payload.status).toBe('blocked');
    expect(payload.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'acceptance-criteria',
          status: 'fail',
          message: expect.stringContaining('Acceptance Criteria'),
        }),
      ]),
    );
    expect(payload.nextAction.command).toBe('agentloop task doctor');
  });

  test('blocks readiness for missing, failed, and stale verification gates', async () => {
    const missing = await createReadyFixture({ verification: 'missing' });
    const failed = await createReadyFixture({ verification: 'fail' });

    const missingPayload = JSON.parse(
      (
        await execa(tsxPath, [cliPath, 'ready', '--json'], {
          cwd: missing,
        })
      ).stdout,
    );
    const failedPayload = JSON.parse(
      (
        await execa(tsxPath, [cliPath, 'ready', '--json'], {
          cwd: failed,
        })
      ).stdout,
    );

    expect(missingPayload.status).toBe('blocked');
    expect(missingPayload.gates).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'verification', status: 'fail' })]),
    );
    expect(failedPayload.status).toBe('blocked');
    expect(failedPayload.gates).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'verification', status: 'fail' })]),
    );
  });

  test('surfaces scope drift and forbidden files as readiness blockers', async () => {
    const drift = await createReadyFixture({ changedFile: 'src/profile/copy.ts' });
    const forbidden = await createReadyFixture({ changedFile: 'src/billing/price.ts' });

    const driftPayload = JSON.parse(
      (await execa(tsxPath, [cliPath, 'ready', '--json'], { cwd: drift })).stdout,
    );
    const forbiddenPayload = JSON.parse(
      (await execa(tsxPath, [cliPath, 'ready', '--json'], { cwd: forbidden })).stdout,
    );

    expect(driftPayload.status).toBe('blocked');
    expect(driftPayload.gates).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'scope-drift', status: 'fail' })]),
    );
    expect(forbiddenPayload.status).toBe('blocked');
    expect(forbiddenPayload.gates).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'forbidden-files', status: 'fail' })]),
    );
  });

  test('returns non-zero in strict mode when readiness is blocked', async () => {
    const dir = await createReadyFixture({ verification: 'missing' });

    const result = await execa(tsxPath, [cliPath, 'ready', '--strict', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout).status).toBe('blocked');
  });

  test('prints concise human readiness output with token-cost warning', async () => {
    const dir = await createReadyFixture({ verification: 'missing' });

    const result = await execa(tsxPath, [cliPath, 'ready', '--redact-paths'], { cwd: dir });

    expect(result.stdout).toContain('# AgentLoopKit Ready');
    expect(result.stdout).toContain('## Gates');
    expect(result.stdout).toContain('## Token Receipt');
    expect(result.stdout).toContain('AgentLoopKit overhead');
    expect(result.stdout).toContain('## Next Action');
    expect(result.stdout).not.toContain(dir);
  });

  test('does not warn about context cost when the repo is idle with no task', async () => {
    const dir = await createIdleFixture();

    const result = await execa(tsxPath, [cliPath, 'ready', '--json'], { cwd: dir });
    const payload = JSON.parse(result.stdout);

    expect(payload.status).toBe('blocked');
    expect(payload.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'context-budget',
          status: 'pass',
          message: 'No changed-file context to compact yet.',
        }),
      ]),
    );
    expect(payload.tokenReceipt.warning).toBe('No changed-file context to compact yet.');
  });
});
