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

async function createContextFixture() {
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
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-11-12-20-verify'), { recursive: true });

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
- Local fixture path: ${dir}

## Rollback Notes
Revert the copy change.
`,
  );
  await setActiveTask({ cwd: dir, config, taskPath });

  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-11-12-20-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-20-verify/metadata.json'), {
    id: '2026-06-11-12-20-verify',
    command: 'verify',
    createdAt: '2026-06-11-12-20',
    createdAtEpochMs: Date.parse('2026-06-11T12:20:00Z'),
    task: {
      path: '.agentloop/tasks/2026-06-11-fix-auth-copy.md',
      title: 'Fix auth copy',
      status: 'in-progress',
    },
    verificationReportPath: '.agentloop/reports/2026-06-11-12-20-verification-report.md',
    overallStatus: 'pass',
    changedFileCount: 1,
  });
  await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-20-verify/changed-files.json'), [
    { status: 'M', path: 'src/auth/copy.ts' },
  ]);

  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "new";\n');

  return dir;
}

describe('context command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints a context budget with transparent heuristic estimates', async () => {
    const dir = await createContextFixture();

    const result = await execa(tsxPath, [cliPath, 'context', 'budget', '--redact-paths'], {
      cwd: dir,
    });

    expect(result.stdout).toContain('# AgentLoopKit Context Budget');
    expect(result.stdout).toContain('Estimated changed-file list tokens');
    expect(result.stdout).toContain('not a provider tokenizer or billing meter');
    expect(result.stdout).toContain('agentloop context pack --for codex --goal continue --redact-paths');
    expect(result.stdout).not.toContain(dir);
  });

  test('prints an auditable context pack with receipts and source handles', async () => {
    const dir = await createContextFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'context', 'pack', '--for', 'codex', '--goal', 'continue', '--redact-paths'],
      { cwd: dir },
    );

    expect(result.stdout).toContain('# AgentLoopKit Context Pack');
    expect(result.stdout).toContain('- Target: `codex`');
    expect(result.stdout).toContain('- Goal: `continue`');
    expect(result.stdout).toContain('## Receipt');
    expect(result.stdout).toContain('## Source Handles');
    expect(result.stdout).toContain('task:active');
    expect(result.stdout).toContain('verification:latest');
    expect(result.stdout).toContain('chat history');
    expect(result.stdout).not.toContain(dir);
  });

  test('emits JSON context packs for software agents', async () => {
    const dir = await createContextFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'context', 'pack', '--for', 'codex', '--goal', 'continue', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.target).toBe('codex');
    expect(payload.goal).toBe('continue');
    expect(payload.contextBudget.heuristic).toBe('chars-divided-by-four');
    expect(payload.receipt.included.length).toBeGreaterThan(0);
    expect(payload.receipt.omitted.length).toBeGreaterThan(0);
    expect(payload.handles.some((handle: { id: string }) => handle.id === 'task:active')).toBe(
      true,
    );
    expect(payload.safety).toMatchObject({
      readOnly: true,
      localEvidenceOnly: true,
      commandsRun: [],
    });
  });

  test('shows local source truth by handle with optional local-path redaction', async () => {
    const dir = await createContextFixture();

    const result = await execa(tsxPath, [cliPath, 'context', 'show', 'task:active', '--redact-paths'], {
      cwd: dir,
    });

    expect(result.stdout).toContain('# Fix auth copy');
    expect(result.stdout).toContain('## Problem Statement');
    expect(result.stdout).toContain('[git-root]');
    expect(result.stdout).not.toContain(dir);
  });

  test('supports research as an explicit context-pack goal', async () => {
    const dir = await createContextFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'context', 'pack', '--for', 'generic', '--goal', 'research', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.goal).toBe('research');
    expect(payload.markdown).toContain('Use this pack to continue local research');
  });
});
