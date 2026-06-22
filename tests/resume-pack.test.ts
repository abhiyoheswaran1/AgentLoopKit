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

async function createResumePackFixture() {
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

  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-fix-auth-copy.md');
  await writeFile(
    taskPath,
    `# Fix auth copy

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
Auth copy is unclear.

## Desired Outcome
Users understand the auth redirect.

## Likely Files or Areas
- src/auth

## Acceptance Criteria
- Auth copy is clearer.

## Verification Commands
- npm test -- auth

## Risk Notes
- Auth-adjacent copy changed.

## Rollback Notes
Revert the copy change.
`,
  );
  await setActiveTask({ cwd: dir, config, taskPath });

  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "new";\n');

  return dir;
}

describe('resume-pack command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints a Codex resume pack from local evidence', async () => {
    const dir = await createResumePackFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'resume-pack', '--for', 'codex', '--redact-paths'],
      { cwd: dir },
    );

    expect(result.stdout).toContain('# AgentLoopKit Resume Pack');
    expect(result.stdout).toContain('- Target: `codex`');
    expect(result.stdout).toContain('Use this as compact continuation context for Codex.');
    expect(result.stdout).toContain('- Active task: `Fix auth copy` (`in-progress`)');
    expect(result.stdout).toContain(
      '- Evidence map: `1` changed file(s); `1` covered, `0` unexplained; verification `missing`; `1` risk-sensitive.',
    );
    expect(result.stdout).toContain('## Context Budget');
    expect(result.stdout).toContain('Estimated resume-pack tokens');
    expect(result.stdout).toContain('chars-divided-by-four');
    expect(result.stdout).toContain('`agentloop verify --task-commands --progress`');
    expect(result.stdout).toContain('Generated from local AgentLoopKit evidence only.');
    expect(result.stdout).not.toContain(dir);
  });

  test('accepts all supported resume-pack targets and emits JSON', async () => {
    const dir = await createResumePackFixture();

    for (const target of ['codex', 'claude', 'cursor', 'generic', 'human']) {
      const result = await execa(
        tsxPath,
        [cliPath, 'resume-pack', '--for', target, '--json', '--redact-paths'],
        { cwd: dir },
      );
      const payload = JSON.parse(result.stdout);

      expect(payload.target).toBe(target);
      expect(payload.evidenceMap.summary).toMatchObject({
        changedFileCount: 1,
        nonEvidenceChangedFileCount: 1,
      });
      expect(payload.contextBudget).toMatchObject({
        heuristic: 'chars-divided-by-four',
        savingsCommand: `agentloop resume-pack --for ${target} --redact-paths`,
      });
      expect(payload.markdown).toContain('# AgentLoopKit Resume Pack');
      expect(payload.markdown).toContain('## Context Budget');
      expect(payload.safety).toMatchObject({
        readOnly: true,
        localEvidenceOnly: true,
      });
      expect(result.stdout).not.toContain(dir);
    }
  });

  test('returns a parseable JSON error for unsupported targets', async () => {
    const dir = await createResumePackFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'resume-pack', '--for', 'robot', '--json'],
      { cwd: dir, reject: false },
    );
    const payload = JSON.parse(result.stdout);

    expect(result.exitCode).toBe(1);
    expect(payload.error).toMatchObject({
      code: 'RESUME_PACK_TARGET_INVALID',
      option: 'for',
      value: 'robot',
      supportedTargets: ['codex', 'claude', 'cursor', 'generic', 'human'],
    });
  });
});
