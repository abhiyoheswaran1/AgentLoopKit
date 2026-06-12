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

async function createMaintainerFixture() {
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
  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-auth.md');
  await writeFile(
    taskPath,
    '# Review auth redirect\n\n- Status: in-progress\n\n## Acceptance Criteria\n- Redirect behavior is covered.\n\n## Verification Commands\n- npm test -- auth\n',
  );
  await setActiveTask({ cwd: dir, config, taskPath });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/handoffs/2026-06-11-12-05-pr-summary.md'),
    '# PR Summary\n\n- Verification status: Overall status: pass\n',
  );
  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "fixed";\n');

  return dir;
}

describe('maintainer-check command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('warns maintainers about risky but reviewable AI-assisted changes', async () => {
    const dir = await createMaintainerFixture();

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.status).toBe('warn');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'verification-evidence', status: 'pass' }),
        expect.objectContaining({ id: 'auth-security-files', status: 'warn' }),
      ]),
    );
    expect(output.maintainerChecklist).toContain('Review auth/security-sensitive files manually.');
    expect(output.suggestedContributorRequest).toContain('Please confirm the auth/security-sensitive changes were reviewed manually.');
  });

  test('accepts latest run task evidence when the task contract was archived', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await git(dir, ['init', '-q']);
    await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
    await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-12-demo.md'),
      '# Demo task\n\n- Status: done\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-12-13-30-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md'),
      '# PR Summary\n\n- Verification status: Overall status: pass\n',
    );
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-12-13-33-ship/metadata.json'), {
      id: '2026-06-12-13-33-ship',
      command: 'ship',
      createdAt: '2026-06-12-13-33',
      createdAtEpochMs: 1781264042972,
      task: {
        path: '.agentloop/tasks/2026-06-12-demo.md',
        title: 'Demo task',
        status: 'done',
      },
      verificationReportPath: '.agentloop/reports/2026-06-12-13-30-verification-report.md',
      handoffPath: '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md',
      shipReportPath: '.agentloop/reports/2026-06-12-13-33-ship-report.md',
      score: 96,
      changedFileCount: 1,
    });
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.status).toBe('pass');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-contract',
          status: 'pass',
          message: 'Task contract found: Demo task',
          path: '.agentloop/tasks/archive/2026-06-12-demo.md',
        }),
        expect.objectContaining({ id: 'verification-evidence', status: 'pass' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'pass' }),
      ]),
    );
  });
});
