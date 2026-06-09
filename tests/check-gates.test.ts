import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createInitializedRepo() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await execa('git', ['init', '-q'], { cwd: dir });
  await initializeAgentLoop({ cwd: dir });
  return dir;
}

describe('check-gates command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints machine-readable pass results when evidence exists', async () => {
    const dir = await createInitializedRepo();
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-09-12-35-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'verification-report', status: 'pass' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'pass' }),
        expect.objectContaining({ id: 'repo-harness', status: 'pass' }),
        expect.objectContaining({ id: 'safety-policies', status: 'pass' }),
        expect.objectContaining({ id: 'git-context', status: 'pass' }),
      ]),
    );
    expect(output.nextAction.command).toBe('agentloop handoff');
  });

  test('warns and fails predictably when review evidence is missing', async () => {
    const dir = await createInitializedRepo();
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', 'init'],
      { cwd: dir },
    );

    const jsonResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'check-gates'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(1);
    const output = JSON.parse(jsonResult.stdout);
    expect(output.overallStatus).toBe('fail');
    expect(output.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'fail' }),
        expect.objectContaining({ id: 'verification-report', status: 'fail' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'warn' }),
        expect.objectContaining({ id: 'git-context', status: 'warn' }),
      ]),
    );
    expect(output.nextAction.command).toBe('agentloop create-task');
    expect(humanResult.exitCode).toBe(1);
    expect(humanResult.stdout).toContain('# AgentLoopKit Gates');
    expect(humanResult.stdout).toContain('[fail] Task contract');
    expect(humanResult.stdout).toContain('Run `agentloop create-task`.');
  });
});
