import path from 'node:path';
import { access, mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { writeVerificationRun } from '../src/core/runs.js';
import { setActiveTask } from '../src/core/task-state.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createRunFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);

  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  const config = createDefaultConfig({ name: 'demo', type: 'typescript-package', packageManager: 'npm' });
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

## Acceptance Criteria
- Password-reset login redirects to the requested page.

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

describe('run ledger commands', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('records ship runs and looks up file intent from the local ledger', async () => {
    const dir = await createRunFixture();

    const ship = JSON.parse(
      (await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir })).stdout,
    );
    const runs = JSON.parse((await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout);
    const shown = JSON.parse(
      (await execa(tsxPath, [cliPath, 'show-run', ship.run.id, '--json'], { cwd: dir })).stdout,
    );
    const intent = JSON.parse(
      (await execa(tsxPath, [cliPath, 'intent', 'src/auth/callback.ts', '--json'], { cwd: dir }))
        .stdout,
    );

    expect(ship.run.id).toMatch(/ship$/);
    expect(runs.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: ship.run.id,
          command: 'ship',
          score: ship.readiness.totalScore,
        }),
      ]),
    );
    expect(shown.run.metadata.id).toBe(ship.run.id);
    expect(shown.run.score.totalScore).toBe(ship.readiness.totalScore);
    expect(intent.file).toBe('src/auth/callback.ts');
    expect(intent.runs).toEqual([
      expect.objectContaining({
        id: ship.run.id,
        why: 'Changed in ship run for task "Fix login redirect bug".',
      }),
    ]);
  });

  test('records verification runs in the local ledger when requested', async () => {
    const dir = await createRunFixture();

    const verify = JSON.parse(
      (
        await execa(
          tsxPath,
          [cliPath, 'verify', '--no-build', '--no-test', '--no-lint', '--no-typecheck', '--write-run', '--json'],
          { cwd: dir },
        )
      ).stdout,
    );
    const runs = JSON.parse((await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout);
    const shown = JSON.parse(
      (await execa(tsxPath, [cliPath, 'show-run', verify.run.id, '--json'], { cwd: dir })).stdout,
    );
    const intent = JSON.parse(
      (await execa(tsxPath, [cliPath, 'intent', 'src/auth/callback.ts', '--json'], { cwd: dir }))
        .stdout,
    );

    expect(verify.overallStatus).toBe('not-run');
    expect(verify.run.id).toMatch(/verify$/);
    expect(runs.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: verify.run.id,
          command: 'verify',
          verificationReportPath: verify.reportPath,
        }),
      ]),
    );
    expect(shown.run.metadata.command).toBe('verify');
    expect(shown.run.metadata.verificationReportPath).toBe(verify.reportPath);
    expect(shown.run.score).toBeNull();
    expect(intent.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: verify.run.id,
          why: 'Verification run for task "Fix login redirect bug".',
        }),
      ]),
    );
  });

  test('records handoff runs in the local ledger when requested', async () => {
    const dir = await createRunFixture();

    const handoff = JSON.parse(
      (await execa(tsxPath, [cliPath, 'handoff', '--write-run', '--json'], { cwd: dir })).stdout,
    );
    const runs = JSON.parse((await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout);
    const shown = JSON.parse(
      (await execa(tsxPath, [cliPath, 'show-run', handoff.run.id, '--json'], { cwd: dir })).stdout,
    );
    const intent = JSON.parse(
      (await execa(tsxPath, [cliPath, 'intent', 'src/auth/callback.ts', '--json'], { cwd: dir }))
        .stdout,
    );

    expect(handoff.run.id).toMatch(/handoff$/);
    expect(runs.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: handoff.run.id,
          command: 'handoff',
          handoffPath: handoff.outPath,
        }),
      ]),
    );
    expect(shown.run.metadata.command).toBe('handoff');
    expect(shown.run.metadata.handoffPath).toBe(handoff.outPath);
    expect(shown.run.diffStat).toContain('src/auth/callback.ts');
    expect(intent.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: handoff.run.id,
          why: 'Reviewer handoff for task "Fix login redirect bug".',
        }),
      ]),
    );
  });

  test('rejects run directories that resolve outside the repo through symlinks', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir('agentloopkit-outside-run-');
    tempDirs.push(dir, outsideDir);

    await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/runs/2026-06-12-00-00-verify'), 'dir');

    await expect(
      writeVerificationRun({
        cwd: dir,
        timestamp: '2026-06-12-00-00',
        task: null,
        verificationReportPath: path.join(dir, '.agentloop/reports/report.md'),
        overallStatus: 'pass',
        changedFiles: [],
        markdown: '# Verification Report\n',
      }),
    ).rejects.toThrow('Run directory must stay inside the run ledger root.');
    await expect(access(path.join(outsideDir, 'metadata.json'))).rejects.toThrow();
  });

  test('keeps same-minute run records instead of overwriting them', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const first = await writeVerificationRun({
      cwd: dir,
      timestamp: '2026-06-12-00-00',
      task: null,
      verificationReportPath: path.join(dir, '.agentloop/reports/first.md'),
      overallStatus: 'pass',
      changedFiles: [],
      markdown: '# First Verification Report\n',
    });
    const second = await writeVerificationRun({
      cwd: dir,
      timestamp: '2026-06-12-00-00',
      task: null,
      verificationReportPath: path.join(dir, '.agentloop/reports/second.md'),
      overallStatus: 'pass',
      changedFiles: [],
      markdown: '# Second Verification Report\n',
    });

    expect(first.id).toBe('2026-06-12-00-00-verify');
    expect(second.id).toBe('2026-06-12-00-00-verify-2');
    await expect(readFile(path.join(first.path, 'verification-report.md'), 'utf8')).resolves.toContain(
      'First Verification Report',
    );
    await expect(readFile(path.join(second.path, 'verification-report.md'), 'utf8')).resolves.toContain(
      'Second Verification Report',
    );
  });
});
