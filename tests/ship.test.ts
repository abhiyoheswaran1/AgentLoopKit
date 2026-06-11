import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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

async function createShipFixture() {
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

## Constraints
- Keep the auth callback API unchanged.

## Non-Goals
- Do not redesign the login UI.

## Acceptance Criteria
- Password-reset login redirects to the requested page.
- Existing login redirect tests still pass.

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

describe('ship command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('writes a review-readiness ship report from local evidence', async () => {
    const dir = await createShipFixture();

    const result = await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.readiness.totalScore).toBeGreaterThanOrEqual(85);
    expect(output.readiness.claims).toContain(
      'This is a review-readiness score, not a code-quality score.',
    );
    expect(output.changedFiles).toEqual([{ status: 'M', path: 'src/auth/callback.ts' }]);
    expect(output.shipReportPath).toMatch(/\.agentloop\/reports\/.+-ship-report\.md$/);
    expect(output.handoffPath).toMatch(/\.agentloop\/handoffs\/.+-pr-summary\.md$/);
    expect(existsSync(output.shipReportPath)).toBe(true);
    expect(existsSync(output.handoffPath)).toBe(true);

    const markdown = await readFile(output.shipReportPath, 'utf8');
    expect(markdown).toContain('# AgentLoopKit Ship Report');
    expect(markdown).toContain('Make agent-generated code reviewable, verifiable, and merge-ready.');
    expect(markdown).toContain('This is a review-readiness score, not a code-quality score.');
    expect(markdown).toContain('src/auth/callback.ts');
    expect(markdown).toContain('Review risk-sensitive files before merge.');
  });
});
