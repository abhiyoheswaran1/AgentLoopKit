import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import {
  buildContextHandleInventory,
  buildContextPack,
  showContextHandle,
} from '../src/core/context-contract.js';
import { buildEvidenceMap } from '../src/core/evidence-map.js';
import * as runsModule from '../src/core/runs.js';
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

async function createArchivedContextFixture(options: { activePointer?: boolean } = {}) {
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

  const archivedTaskPath = path.join(
    dir,
    '.agentloop/tasks/archive/2026-06-24-release-previous-work.md',
  );
  await writeFile(
    archivedTaskPath,
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
  if (options.activePointer) {
    await setActiveTask({ cwd: dir, config, taskPath: archivedTaskPath });
  }
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

async function createEmptyContextFixture() {
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
  await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });

  await writeFile(path.join(dir, 'README.md'), '# Demo\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  return dir;
}

describe('context command', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
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

  test('emits JSON context budget without changed-file detail', async () => {
    const dir = await createContextFixture();

    const result = await execa(tsxPath, [cliPath, 'context', 'budget', '--json'], {
      cwd: dir,
    });
    const payload = JSON.parse(result.stdout);

    expect(payload.contextBudget.heuristic).toBe('chars-divided-by-four');
    expect(payload.evidenceMap.files).toBeUndefined();
    expect(payload.evidenceMap.fileList).toMatchObject({
      omitted: true,
      handle: 'evidence-map:current',
      command: 'agentloop context show evidence-map:current',
    });
    expect(payload.evidenceMap.summary.changedFileCount).toBeGreaterThan(0);
    expect(JSON.stringify(payload)).not.toContain('"coveredByTask"');
  });

  test('redacts local roots in context budget, handles, and pack output', async () => {
    const dir = await createContextFixture();
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-fix-auth-copy.md');
    await writeFile(
      taskPath,
      `# Task mentions ${dir}

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
The task title and body can contain ${dir}.

## Desired Outcome
Shareable context output redacts local roots.

## Likely Files or Areas
- src/auth/copy.ts

## Acceptance Criteria
- Context output redacts local roots.

## Verification Commands
- npm test -- auth

## Rollback Notes
Revert the redaction fixture.
`,
    );

    const cases: Array<{ args: string[]; includesUserMetadata: boolean }> = [
      { args: ['context', 'budget', '--redact-paths'], includesUserMetadata: false },
      { args: ['context', 'budget', '--json', '--redact-paths'], includesUserMetadata: true },
      { args: ['context', 'handles', '--redact-paths'], includesUserMetadata: false },
      { args: ['context', 'handles', '--json', '--redact-paths'], includesUserMetadata: false },
      {
        args: ['context', 'pack', '--for', 'codex', '--goal', 'continue', '--redact-paths'],
        includesUserMetadata: true,
      },
      {
        args: [
          'context',
          'pack',
          '--for',
          'codex',
          '--goal',
          'continue',
          '--json',
          '--redact-paths',
        ],
        includesUserMetadata: true,
      },
    ];

    for (const { args, includesUserMetadata } of cases) {
      const result = await execa(tsxPath, [cliPath, ...args], { cwd: dir });
      if (includesUserMetadata) {
        expect(result.stdout, args.join(' ')).toContain('[git-root]');
      }
      expect(result.stdout, args.join(' ')).not.toContain(dir);
    }
  });

  test('prints a context handle inventory with availability and expansion commands', async () => {
    const dir = await createContextFixture();

    const result = await execa(tsxPath, [cliPath, 'context', 'handles', '--redact-paths'], {
      cwd: dir,
    });

    expect(result.stdout).toContain('# AgentLoopKit Context Handles');
    expect(result.stdout).toContain('## Available');
    expect(result.stdout).toContain('`task:active`');
    expect(result.stdout).toContain('`evidence-map:current`');
    expect(result.stdout).toContain('`context-budget:current`');
    expect(result.stdout).toContain('`verification:latest`');
    expect(result.stdout).toContain('`run:latest`');
    expect(result.stdout).toContain('agentloop context show task:active');
    expect(result.stdout).toContain('Use `agentloop context show <handle>` only when needed.');
    expect(result.stdout).not.toContain(dir);
  });

  test('emits JSON context handle inventory for agent discovery', async () => {
    const dir = await createContextFixture();

    const result = await execa(tsxPath, [cliPath, 'context', 'handles', '--json'], {
      cwd: dir,
    });
    const payload = JSON.parse(result.stdout);

    expect(payload.handles.map((handle: { id: string }) => handle.id)).toEqual([
      'task:active',
      'evidence-map:current',
      'context-budget:current',
      'verification:latest',
      'run:latest',
    ]);
    expect(payload.handles.every((handle: { available: boolean }) => handle.available)).toBe(true);
    expect(payload.safety).toMatchObject({
      readOnly: true,
      localEvidenceOnly: true,
      localGitStatus: true,
      verificationCommandsRun: false,
      projectCommandsRun: false,
    });
  });

  test('marks missing context handles unavailable without throwing', async () => {
    const dir = await createEmptyContextFixture();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
      commands: { test: 'npm test' },
    });

    const inventory = await buildContextHandleInventory({ cwd: dir, config });

    expect(inventory.handles.find((handle) => handle.id === 'task:active')).toMatchObject({
      available: false,
      unavailableReason: 'No active task contract is available.',
    });
    expect(inventory.handles.find((handle) => handle.id === 'verification:latest')).toMatchObject({
      available: false,
      unavailableReason: 'No verification report is available.',
    });
    expect(inventory.handles.find((handle) => handle.id === 'run:latest')).toMatchObject({
      available: false,
      unavailableReason: 'No run ledger entry is available.',
    });
    expect(inventory.handles.find((handle) => handle.id === 'evidence-map:current')).toMatchObject({
      available: true,
    });
    expect(inventory.markdown).toContain('## Unavailable');
    expect(inventory.markdown).toContain('No active task contract is available.');
  });

  test('builds handle inventory without evidence-map run scans', async () => {
    const dir = await createContextFixture();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
      commands: { test: 'npm test' },
    });
    const listRunsSpy = vi.spyOn(runsModule, 'listRuns');

    const inventory = await buildContextHandleInventory({ cwd: dir, config });

    expect(inventory.handles.find((handle) => handle.id === 'run:latest')).toMatchObject({
      available: true,
    });
    expect(listRunsSpy).toHaveBeenCalledTimes(1);
    expect(listRunsSpy).toHaveBeenCalledWith(dir, { limit: 1, hydrateTask: false });
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
    expect(payload.evidenceMap.files).toBeUndefined();
    expect(payload.evidenceMap.fileList).toMatchObject({
      omitted: true,
      handle: 'evidence-map:current',
      command: 'agentloop context show evidence-map:current',
    });
    expect(payload.evidenceMap.summary.changedFileCount).toBeGreaterThan(0);
    expect(payload.evidenceMap.coverage).toBeTruthy();
    expect(payload.evidenceMap.risk).toBeTruthy();
    expect(payload.evidenceMap.verification).toBeTruthy();
    expect(payload.evidenceMap.nextActions.length).toBeGreaterThan(0);
    expect(JSON.stringify(payload)).not.toContain('"coveredByTask"');
    expect(payload.receipt.included.length).toBeGreaterThan(0);
    expect(payload.receipt.omitted.length).toBeGreaterThan(0);
    expect(payload.handles.some((handle: { id: string }) => handle.id === 'task:active')).toBe(
      true,
    );
    expect(payload.safety).toMatchObject({
      readOnly: true,
      localEvidenceOnly: true,
      localGitStatus: true,
      verificationCommandsRun: false,
      projectCommandsRun: false,
    });
  });

  test('builds context packs with bounded run ledger listings', async () => {
    const dir = await createContextFixture();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
      commands: { test: 'npm test' },
    });
    const listRunsSpy = vi.spyOn(runsModule, 'listRuns');

    const pack = await buildContextPack({
      cwd: dir,
      config,
      target: 'codex',
      goal: 'continue',
    });

    expect(listRunsSpy).toHaveBeenCalledTimes(2);
    for (const [, options] of listRunsSpy.mock.calls) {
      expect(options?.hydrateTask).toBe(false);
      expect(Number.isFinite(options?.limit)).toBe(true);
    }
    expect(listRunsSpy).toHaveBeenCalledWith(dir, { limit: 1, hydrateTask: false });
    expect(listRunsSpy).toHaveBeenCalledWith(
      dir,
      expect.objectContaining({
        hydrateTask: false,
        limit: 10,
        taskPath: expect.stringContaining('2026-06-11-fix-auth-copy.md'),
      }),
    );
    expect(pack.handles.some((handle) => handle.id === 'run:latest')).toBe(true);
    expect('files' in pack.evidenceMap).toBe(false);
    expect(pack.evidenceMap.fileList).toMatchObject({
      omitted: true,
      handle: 'evidence-map:current',
    });
  });

  test('uses current task metadata for run coverage when stored run metadata is stale', async () => {
    const dir = await createContextFixture();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
      commands: { test: 'npm test' },
    });
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-fix-auth-copy.md');
    await writeFile(
      taskPath,
      `# Updated auth copy

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

## Rollback Notes
Revert the copy change.
`,
    );
    const runMetadataPath = path.join(
      dir,
      '.agentloop/runs/2026-06-11-12-20-verify/metadata.json',
    );
    const runMetadata = JSON.parse(await readFile(runMetadataPath, 'utf8')) as Record<
      string,
      unknown
    >;
    await writeJson(runMetadataPath, {
      ...runMetadata,
      task: {
        path: '.agentloop/tasks/archive/2026-06-11-fix-auth-copy.md',
        title: 'Stored stale auth copy',
        status: 'done',
      },
    });

    const evidenceMap = await buildEvidenceMap({
      cwd: dir,
      config,
      taskEvidenceMode: 'current-work',
    });

    expect(evidenceMap.files.find((file) => file.path === 'src/auth/copy.ts')).toMatchObject(
      {
        coveredByRun: true,
        runCoverage: {
          taskTitle: 'Updated auth copy',
        },
      },
    );
  });

  test('shows the latest run handle through a bounded run listing', async () => {
    const dir = await createContextFixture();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
      commands: { test: 'npm test' },
    });
    const listRunsSpy = vi.spyOn(runsModule, 'listRuns');

    const result = await showContextHandle({
      cwd: dir,
      config,
      handle: 'run:latest',
    });

    expect(result.kind).toBe('run');
    expect(result.content).toContain('2026-06-11-12-20-verify');
    expect(listRunsSpy).toHaveBeenCalledTimes(1);
    expect(listRunsSpy).toHaveBeenCalledWith(dir, { limit: 1, hydrateTask: false });
  });

  test('does not label archived latest-run task evidence as active context', async () => {
    const dir = await createArchivedContextFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'context', 'pack', '--for', 'codex', '--goal', 'continue', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.evidenceMap.task).toBeNull();
    expect(payload.handles.some((handle: { id: string }) => handle.id === 'task:active')).toBe(
      false,
    );
    expect(payload.evidenceMap.nextActions[0].command).toBe('agentloop create-task');
    expect(payload.markdown).toContain('- Active task: none');
    expect(payload.markdown).not.toContain('Release previous work');
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

  test('supports read de-duplication by context handle digest', async () => {
    const dir = await createContextFixture();

    const first = await execa(tsxPath, [cliPath, 'context', 'show', 'task:active', '--json'], {
      cwd: dir,
    });
    const firstPayload = JSON.parse(first.stdout);
    expect(firstPayload.contentDigest).toMatch(/^sha256:/);
    expect(firstPayload.unchanged).toBe(false);
    expect(firstPayload.content).toContain('# Fix auth copy');

    const deduped = await execa(
      tsxPath,
      [cliPath, 'context', 'show', 'task:active', '--json', '--since', firstPayload.contentDigest],
      { cwd: dir },
    );
    const dedupedPayload = JSON.parse(deduped.stdout);
    expect(dedupedPayload).toMatchObject({
      handle: 'task:active',
      unchanged: true,
      contentDigest: firstPayload.contentDigest,
    });
    expect(dedupedPayload.content).toBeUndefined();
    expect(dedupedPayload.message).toContain('unchanged since');

    const full = await execa(
      tsxPath,
      [
        cliPath,
        'context',
        'show',
        'task:active',
        '--json',
        '--since',
        firstPayload.contentDigest,
        '--full',
      ],
      { cwd: dir },
    );
    const fullPayload = JSON.parse(full.stdout);
    expect(fullPayload.unchanged).toBe(true);
    expect(fullPayload.content).toContain('# Fix auth copy');
  });

  test('refuses oversized verification handle expansion', async () => {
    const dir = await createContextFixture();
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-11-12-20-verification-report.md'),
      `# Verification Report\n\n${'x'.repeat(1_048_577)}`,
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'context', 'show', 'verification:latest', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout).error).toMatchObject({
      code: 'CONTEXT_HANDLE_FILE_TOO_LARGE',
    });
  });

  test('expands full changed-file detail through the evidence-map handle', async () => {
    const dir = await createContextFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'context', 'show', 'evidence-map:current', '--json', '--redact-paths'],
      {
        cwd: dir,
      },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.kind).toBe('evidence-map');
    expect(payload.content).toContain('## Changed Files');
    expect(payload.content).toContain('src/auth/copy.ts');
    expect(payload.content).toContain('covered-by-task');
    expect(payload.content).toContain('covered-by-run:2026-06-11-12-20-verify');
    expect(payload.content).not.toContain(dir);
  });

  test('does not expand an archived active pointer through task active handle', async () => {
    const dir = await createArchivedContextFixture({ activePointer: true });

    const result = await execa(tsxPath, [cliPath, 'context', 'show', 'task:active'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('No active task is available for handle task:active.');
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
