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

async function createStartFixture(
  options: {
    task?: boolean;
    verification?: boolean;
    changedFile?: string;
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
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-23-10-20-verify'), { recursive: true });

  if (options.task !== false) {
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-23-fix-auth-copy.md');
    await writeFile(
      taskPath,
      `# Fix auth copy

- Created date: 2026-06-23
- Task type: bugfix
- Status: in-progress

## Problem Statement
Auth copy is unclear.

## Desired Outcome
Users understand the auth redirect.

## Likely Files or Areas
- src/auth

## Files or Areas Not to Touch
- src/billing

## Acceptance Criteria
- Auth copy is clearer.

## Verification Commands
- npm test -- auth

## Risk Notes
- Auth-adjacent copy changed.
- Local fixture path: ${dir}

## Rollback Notes
Revert the copy change.
`,
    );
    await setActiveTask({ cwd: dir, config, taskPath });
  }

  if (options.verification !== false) {
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-23-10-20-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-23-10-20-verify/metadata.json'), {
      id: '2026-06-23-10-20-verify',
      command: 'verify',
      createdAt: '2026-06-23-10-20',
      createdAtEpochMs: Date.parse('2026-06-23T10:20:00Z'),
      task: {
        path: '.agentloop/tasks/2026-06-23-fix-auth-copy.md',
        title: 'Fix auth copy',
        status: 'in-progress',
      },
      verificationReportPath: '.agentloop/reports/2026-06-23-10-20-verification-report.md',
      overallStatus: 'pass',
      changedFileCount: 1,
    });
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-23-10-20-verify/changed-files.json'), [
      { status: 'M', path: 'src/auth/copy.ts' },
    ]);
  }

  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await mkdir(path.join(dir, 'src/profile'), { recursive: true });
  await mkdir(path.join(dir, 'src/billing'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "old";\n');
  await writeFile(path.join(dir, 'src/profile/copy.ts'), 'export const copy = "old";\n');
  await writeFile(path.join(dir, 'src/billing/price.ts'), 'export const price = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);
  const changedFile = options.changedFile ?? 'src/auth/copy.ts';
  await writeFile(path.join(dir, changedFile), 'export const copy = "new";\n');

  return dir;
}

async function createArchivedStartFixture() {
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
  await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-24-08-10-handoff'), { recursive: true });

  await writeFile(
    path.join(dir, '.agentloop/tasks/archive/2026-06-24-release-previous-work.md'),
    `# Release previous work

- Created date: 2026-06-24
- Task type: release
- Status: done

## Problem Statement
Previous release work needed publication.

## Desired Outcome
Previous release evidence is preserved.

## Likely Files or Areas
- README.md

## Acceptance Criteria
- Previous release evidence is archived.

## Verification Commands
- npm test

## Rollback Notes
No active work rollback is needed.
`,
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-24-08-10-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await writeJson(path.join(dir, '.agentloop/runs/2026-06-24-08-10-handoff/metadata.json'), {
    id: '2026-06-24-08-10-handoff',
    command: 'handoff',
    createdAt: '2026-06-24-08-10',
    createdAtEpochMs: Date.parse('2026-06-24T08:10:00Z'),
    task: {
      path: '.agentloop/tasks/2026-06-24-release-previous-work.md',
      title: 'Release previous work',
      status: 'done',
    },
    verificationReportPath: '.agentloop/reports/2026-06-24-08-10-verification-report.md',
    handoffPath: '.agentloop/handoffs/2026-06-24-08-10-pr-summary.md',
    changedFileCount: 0,
  });

  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Archived release evidence']);

  return dir;
}

describe('start command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints a compact agent briefing with routing and impact metrics', async () => {
    const dir = await createStartFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'codex', '--goal', 'implement', '--redact-paths'],
      { cwd: dir },
    );

    expect(result.stdout).toContain('# AgentLoop Start');
    expect(result.stdout).toContain('Agent briefing:');
    expect(result.stdout).toContain('Preflight:');
    expect(result.stdout).toContain('## Usefulness Proof');
    expect(result.stdout).toContain('Preflight state:');
    expect(result.stdout).toContain('Context avoided:');
    expect(result.stdout).toContain('Source handles available:');
    expect(result.stdout).toContain('Next safe command:');
    expect(result.stdout).toContain('## Active Task');
    expect(result.stdout).toContain('## Next Safe Command');
    expect(result.stdout).toContain('## Read First');
    expect(result.stdout).toContain('`task:active`');
    expect(result.stdout).toContain('## Do Not Broad-Scan');
    expect(result.stdout).toContain('## Impact Ledger');
    expect(result.stdout).toContain('Estimated context avoided');
    expect(result.stdout).toContain('1 risk-sensitive changed file needs focused review');
    expect(result.stdout).toContain('agentloop context show task:active');
    expect(result.stdout).not.toContain(dir);
  });

  test('emits JSON for agents and automation', async () => {
    const dir = await createStartFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-23-fix-auth-copy.md'),
      `# Fix auth copy ${dir}

- Created date: 2026-06-23
- Task type: bugfix
- Status: in-progress

## Problem Statement
Auth copy is unclear.

## Desired Outcome
Users understand the auth redirect.

## Likely Files or Areas
- src/auth

## Files or Areas Not to Touch
- src/billing

## Acceptance Criteria
- Auth copy is clearer.

## Verification Commands
- npm test -- auth

## Rollback Notes
Revert the copy change.
`,
    );
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-23-10-20-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'codex', '--goal', 'implement', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.target).toBe('codex');
    expect(payload.goal).toBe('implement');
    expect(payload.status).toBe('ready-to-continue');
    expect(payload.preflight).toMatchObject({
      state: 'ready-to-continue',
      task: {
        title: 'Fix auth copy [git-root]',
        status: 'in-progress',
        path: '.agentloop/tasks/2026-06-23-fix-auth-copy.md',
      },
    });
    expect(payload.preflight.headline).toMatch(/ready/i);
    expect(payload.preflight.reason).toContain('task');
    expect(payload.usefulnessProof).toMatchObject({
      preflightState: 'ready-to-continue',
      staleProofCaught: false,
      scopeDriftCaught: false,
      nextSafeCommand: 'agentloop ship',
    });
    expect(payload.usefulnessProof.sourceHandlesAvailable).toEqual(
      expect.arrayContaining(['task:active', 'evidence-map:current', 'context-budget:current']),
    );
    expect(payload.usefulnessProof.summary).toContain('agent can continue');
    expect(payload.readFirst[0].handle).toBe('task:active');
    expect(payload.impact.verificationFreshness).toBe('fresh');
    expect(payload.impact.scopeDriftFileCount).toBe(0);
    expect(payload.impact.summary).toContain('estimated context');
    expect(payload.riskSummary).toMatchObject({
      blockers: 0,
      warnings: 1,
      topRisks: ['risk-sensitive-files'],
    });
    expect(
      payload.sourceHandles.some((handle: { id: string }) => handle.id === 'context-budget:current'),
    ).toBe(true);
    expect(payload.contextPack).toBeUndefined();
    expect(JSON.stringify(payload)).not.toContain('"files"');
    expect(result.stdout).not.toContain(dir);
    expect(payload.safety).toMatchObject({
      readOnly: true,
      localEvidenceOnly: true,
      localGitStatus: true,
      verificationCommandsRun: false,
      projectCommandsRun: false,
    });
  });

  test('prioritizes evidence before task detail for review briefings', async () => {
    const dir = await createStartFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'human', '--goal', 'review', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.readFirst[0].handle).toBe('evidence-map:current');
    expect(payload.preflight.state).toBe('review-ready');
  });

  test('surfaces missing verification as risk and impact', async () => {
    const dir = await createStartFixture({ verification: false });

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'generic', '--goal', 'implement', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.impact.verificationFreshness).toBe('missing');
    expect(payload.impact.staleEvidenceCaught).toBe(false);
    expect(payload.preflight.state).toBe('needs-verification');
    expect(payload.riskSummary.blockers).toBe(1);
    expect(payload.risk.some((item: { code: string }) => item.code === 'verification-missing')).toBe(
      true,
    );
    expect(payload.nextCommand.command).toBe('agentloop verify --task-commands --progress');
  });

  test('routes missing task state before implementation', async () => {
    const dir = await createStartFixture({ task: false, verification: false });

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'generic', '--goal', 'implement', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.preflight).toMatchObject({
      state: 'needs-task',
      task: null,
    });
    expect(payload.riskSummary.blockers).toBeGreaterThanOrEqual(1);
    expect(payload.nextCommand.command).toContain('agentloop');
  });

  test('does not treat archived latest-run task evidence as active work', async () => {
    const dir = await createArchivedStartFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'codex', '--goal', 'implement', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.preflight).toMatchObject({
      state: 'needs-task',
      task: null,
    });
    expect(payload.nextCommand.command).not.toBe('agentloop ship');
    expect(payload.readFirst.some((route: { handle: string }) => route.handle === 'task:active')).toBe(
      false,
    );
    expect(payload.sourceHandles.some((handle: { id: string }) => handle.id === 'task:active')).toBe(
      false,
    );
    expect(payload.markdown).toContain('No active task contract found.');
    expect(payload.markdown).not.toContain('Release previous work');
  });

  test('uses scope-drift state when changed files are outside task evidence', async () => {
    const dir = await createStartFixture({ changedFile: 'src/profile/copy.ts' });

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'codex', '--goal', 'implement', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.preflight.state).toBe('scope-drift');
    expect(payload.impact.scopeDriftFileCount).toBe(1);
    expect(payload.riskSummary.topRisks).toContain('scope-drift');
  });

  test('blocks when changed files match files-not-to-touch scope', async () => {
    const dir = await createStartFixture({ changedFile: 'src/billing/price.ts' });

    const result = await execa(
      tsxPath,
      [cliPath, 'start', '--for', 'codex', '--goal', 'implement', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.preflight.state).toBe('blocked-by-risk');
    expect(payload.status).toBe('blocked-by-risk');
    expect(payload.riskSummary.blockers).toBe(1);
    expect(payload.riskSummary.topRisks).toContain('forbidden-files');
  });
});
