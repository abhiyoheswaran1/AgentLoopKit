import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
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

async function createExplainDiffFixture() {
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

  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-add-auth-copy.md');
  await writeFile(
    taskPath,
    `# Add auth copy

- Created date: 2026-06-11
- Task type: feature
- Status: in-progress

## Problem Statement
Auth copy is unclear.

## Desired Outcome
Users understand the auth redirect.

## Likely Files or Areas
- src/auth

## Files or Areas Not to Touch
- docs/private.md

## Acceptance Criteria
- \`npm test -- auth\` passes.

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
  await mkdir(path.join(dir, 'docs'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "old";\n');
  await writeFile(path.join(dir, 'docs/private.md'), 'private old docs\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "new";\n');
  await writeFile(path.join(dir, 'docs/private.md'), 'private new docs\n');
  return dir;
}

describe('explain-diff command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints a human evidence map without mutating the repo', async () => {
    const dir = await createExplainDiffFixture();
    const before = await git(dir, ['status', '--short', '--untracked-files=all']);

    const result = await execa(tsxPath, [cliPath, 'explain-diff', '--redact-paths'], {
      cwd: dir,
    });
    const after = await git(dir, ['status', '--short', '--untracked-files=all']);

    expect(result.stdout).toContain('# AgentLoopKit Evidence Map');
    expect(result.stdout).toContain('- Reviewability: `blocked`');
    expect(result.stdout).toContain('- Coverage: `1` covered, `1` unexplained.');
    expect(result.stdout).toContain('- Verification: `missing`');
    expect(result.stdout).toContain('- Risk-sensitive files: `1`');
    expect(result.stdout).toContain('- Unexplained examples: `docs/private.md`');
    expect(result.stdout).toContain('`agentloop verify --task-commands --progress`');
    expect(result.stdout).toContain(
      'Evidence coverage is path-based local AgentLoopKit evidence, not proof of code correctness.',
    );
    expect(result.stdout).not.toContain(dir);
    expect(after.stdout).toBe(before.stdout);
  });

  test('prints JSON evidence map for scripts', async () => {
    const dir = await createExplainDiffFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'explain-diff', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.summary).toMatchObject({
      reviewability: 'blocked',
      changedFileCount: 2,
      nonEvidenceChangedFileCount: 2,
    });
    expect(payload.coverage).toMatchObject({
      coveredFileCount: 1,
      unexplainedFileCount: 1,
      forbiddenFileCount: 1,
      unexplainedExamples: ['docs/private.md'],
    });
    expect(payload.verification).toMatchObject({ status: 'missing', fresh: false });
    expect(payload.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'src/auth/copy.ts',
          coveredByTask: true,
          unexplained: false,
        }),
        expect.objectContaining({
          path: 'docs/private.md',
          forbiddenByTask: true,
          unexplained: true,
        }),
      ]),
    );
    expect(payload.nextActions[0]).toMatchObject({
      command: 'agentloop verify --task-commands --progress',
    });
    expect(JSON.stringify(payload)).not.toContain(dir);
  });

  test('run coverage in the CLI output drops once the covered file changes content', async () => {
    const dir = await createExplainDiffFixture();
    await writeFile(path.join(dir, 'src/other.ts'), 'export const other = 1;\n');

    // Use the real write-run entrypoint so the hash is recorded from
    // src/other.ts's content at run time.
    await writeVerificationRun({
      cwd: dir,
      timestamp: '2026-06-11-12-30',
      task: {
        path: '.agentloop/tasks/2026-06-11-add-auth-copy.md',
        title: 'Add auth copy',
        status: 'in-progress',
      },
      verificationReportPath: path.join(dir, '.agentloop/reports/2026-06-11-12-30-verification-report.md'),
      overallStatus: 'pass',
      changedFiles: [{ status: '??', path: 'src/other.ts' }],
      markdown: '# Verification Report\n\n- Overall status: pass\n',
    });

    const before = await execa(
      tsxPath,
      [cliPath, 'explain-diff', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const beforePayload = JSON.parse(before.stdout);
    expect(
      beforePayload.files.find((file: { path: string }) => file.path === 'src/other.ts'),
    ).toMatchObject({
      coveredByRun: true,
      unexplained: false,
    });

    await writeFile(path.join(dir, 'src/other.ts'), 'export const other = 2; // edited after the run\n');

    const after = await execa(
      tsxPath,
      [cliPath, 'explain-diff', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const afterPayload = JSON.parse(after.stdout);
    expect(
      afterPayload.files.find((file: { path: string }) => file.path === 'src/other.ts'),
    ).toMatchObject({
      coveredByRun: false,
      unexplained: true,
    });
  });
});
