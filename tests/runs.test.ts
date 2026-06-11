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
});
