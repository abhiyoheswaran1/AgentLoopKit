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

async function createGuardFixture(
  options: {
    verification?: boolean;
    includeLocalPathInTaskTitle?: boolean;
    likelyAreas?: string[];
    forbiddenAreas?: string[];
  } = {},
) {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const taskTitle = options.includeLocalPathInTaskTitle ? `Fix auth copy ${dir}` : 'Fix auth copy';
  const likelyAreas = options.likelyAreas ?? ['src/auth'];
  const forbiddenAreas = options.forbiddenAreas ?? ['docs/private.md'];

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
  await mkdir(path.join(dir, '.agentloop/guard'), { recursive: true });

  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-fix-auth-copy.md');
  await writeFile(
    taskPath,
    `# ${taskTitle}

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
Auth copy is unclear.

## Desired Outcome
Users understand the auth redirect.

## Likely Files or Areas
${likelyAreas.map((area) => `- ${area}`).join('\n')}

## Files or Areas Not to Touch
${forbiddenAreas.map((area) => `- ${area}`).join('\n')}

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

  if (options.verification) {
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
  }

  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await mkdir(path.join(dir, 'docs'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "old";\n');
  await writeFile(path.join(dir, 'docs/readme.md'), 'old docs\n');
  await writeFile(path.join(dir, 'docs/private.md'), 'private docs\n');

  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "new";\n');

  return dir;
}

async function writeRunTaskMetadata(dir: string) {
  const runId = '2026-06-11-12-30-ship';
  const runDir = path.join(dir, '.agentloop/runs', runId);
  await mkdir(runDir, { recursive: true });
  await writeFile(
    path.join(runDir, 'metadata.json'),
    JSON.stringify(
      {
        id: runId,
        command: 'ship',
        createdAt: '2026-06-11-12-30',
        task: {
          path: '.agentloop/tasks/2026-06-11-fix-auth-copy.md',
          title: 'Fix auth copy',
          status: 'in-progress',
        },
        score: 96,
        changedFileCount: 1,
      },
      null,
      2,
    ),
  );
}

describe('guard command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints a local guard summary with context-budget guidance', async () => {
    const dir = await createGuardFixture();

    const result = await execa(tsxPath, [cliPath, 'guard', '--redact-paths'], { cwd: dir });

    expect(result.stdout).toContain('# AgentLoopKit Guard');
    expect(result.stdout).toContain('- Status: `fail`');
    expect(result.stdout).toContain('verification-missing');
    expect(result.stdout).toContain('## Context Budget');
    expect(result.stdout).toContain('`agentloop resume-pack --for codex --redact-paths`');
    expect(result.stdout).not.toContain(dir);
  });

  test('emits JSON and returns non-zero in strict mode when evidence is not reviewable', async () => {
    const dir = await createGuardFixture({ includeLocalPathInTaskTitle: true });

    const result = await execa(
      tsxPath,
      [cliPath, 'guard', '--strict', '--json', '--redact-paths'],
      { cwd: dir, reject: false },
    );
    const payload = JSON.parse(result.stdout);

    expect(result.exitCode).toBe(1);
    expect(payload.status).toBe('fail');
    expect(payload.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'verification-missing',
          severity: 'fail',
        }),
      ]),
    );
    expect(payload.contextBudget).toMatchObject({
      heuristic: 'chars-divided-by-four',
      savingsCommand: 'agentloop resume-pack --for codex --redact-paths',
    });
    expect(payload.evidenceMap.task.title).toBe('Fix auth copy [git-root]');
    expect(payload.safety).toMatchObject({
      readOnlyByDefault: true,
      writesFiles: false,
      localEvidenceOnly: true,
    });
    expect(result.stdout).not.toContain(dir);
  });

  test('supports compact JSON output without changing default JSON shape', async () => {
    const dir = await createGuardFixture({ verification: true });

    const fullResult = await execa(tsxPath, [cliPath, 'guard', '--json', '--redact-paths'], {
      cwd: dir,
    });
    const compactResult = await execa(
      tsxPath,
      [cliPath, 'guard', '--json', '--compact', '--redact-paths'],
      {
        cwd: dir,
      },
    );
    const fullPayload = JSON.parse(fullResult.stdout);
    const compactPayload = JSON.parse(compactResult.stdout);

    expect(fullPayload.evidenceMap.files).toEqual(expect.any(Array));
    expect(fullPayload.evidenceMap.fileList).toBeUndefined();
    expect(compactPayload.evidenceMap.files).toBeUndefined();
    expect(compactPayload.evidenceMap.fileList).toMatchObject({
      omitted: true,
      changedFileCount: 1,
      handle: 'evidence-map:current',
    });
    expect(compactPayload.status).toBe(fullPayload.status);
    expect(compactPayload.findings).toEqual(fullPayload.findings);
  });

  test('caps long changed-file path lists in compact findings', async () => {
    const dir = await createGuardFixture({
      verification: true,
      likelyAreas: ['src'],
      forbiddenAreas: ['src'],
    });
    await mkdir(path.join(dir, 'src/bulk'), { recursive: true });
    for (let index = 0; index < 12; index += 1) {
      await writeFile(path.join(dir, `src/bulk/file-${index}.ts`), `export const value${index} = true;\n`);
    }

    const result = await execa(
      tsxPath,
      [cliPath, 'guard', '--json', '--compact', '--redact-paths'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);
    const finding = payload.findings.find((item: { id: string }) => item.id === 'forbidden-files');

    expect(finding).toMatchObject({
      id: 'forbidden-files',
      pathCount: 13,
      pathsOmitted: true,
      handle: 'evidence-map:current',
      command: 'agentloop context show evidence-map:current',
    });
    expect(finding.paths).toHaveLength(5);
  });

  test('returns zero in strict mode when task scope and verification are reviewable', async () => {
    const dir = await createGuardFixture({ verification: true });

    const result = await execa(
      tsxPath,
      [cliPath, 'guard', '--strict', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.status).toBe('pass');
    expect(payload.evidenceMap.summary.reviewability).toBe('reviewable');
    expect(payload.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'guard-pass',
          severity: 'info',
        }),
      ]),
    );
  });

  test('blocks when no active task exists even if latest run has task evidence', async () => {
    const dir = await createGuardFixture({ verification: true });
    await writeRunTaskMetadata(dir);
    await execa(
      tsxPath,
      [cliPath, 'task', 'status', '.agentloop/tasks/2026-06-11-fix-auth-copy.md', 'done'],
      { cwd: dir },
    );
    await execa(tsxPath, [cliPath, 'task', 'clear'], { cwd: dir });

    const result = await execa(
      tsxPath,
      [cliPath, 'guard', '--strict', '--json', '--redact-paths'],
      { cwd: dir, reject: false },
    );
    const payload = JSON.parse(result.stdout);

    expect(result.exitCode).toBe(1);
    expect(payload.status).toBe('fail');
    expect(payload.evidenceMap.task).toBeNull();
    expect(payload.evidenceMap.summary.reviewability).toBe('blocked');
    expect(payload.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-missing',
          severity: 'fail',
        }),
      ]),
    );
    expect(payload.findings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'guard-pass',
        }),
      ]),
    );
  });

  test('keeps strict mode passing when only context-budget pressure is present', async () => {
    const dir = await createGuardFixture({ verification: true });
    for (let index = 0; index < 22; index += 1) {
      await writeFile(path.join(dir, 'src/auth', `extra-${index}.ts`), `export const v${index} = true;\n`);
    }

    const result = await execa(
      tsxPath,
      [cliPath, 'guard', '--strict', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.status).toBe('pass');
    expect(payload.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'context-budget-pressure',
          severity: 'info',
        }),
      ]),
    );
  });

  test('supports bounded watch mode for automation and tests', async () => {
    const dir = await createGuardFixture({ verification: true });

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'guard',
        '--watch',
        '--max-iterations',
        '2',
        '--interval-ms',
        '5',
        '--json',
        '--redact-paths',
      ],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.mode).toBe('watch');
    expect(payload.snapshots).toHaveLength(2);
    expect(payload.snapshots[0].status).toBe('pass');
    expect(payload.snapshots[1].iteration).toBe(2);
  });

  test('compacts each watch snapshot when compact JSON is requested', async () => {
    const dir = await createGuardFixture({ verification: true });

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'guard',
        '--watch',
        '--max-iterations',
        '2',
        '--interval-ms',
        '5',
        '--json',
        '--compact',
        '--redact-paths',
      ],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.mode).toBe('watch');
    expect(payload.snapshots).toHaveLength(2);
    for (const snapshot of payload.snapshots) {
      expect(snapshot.evidenceMap.files).toBeUndefined();
      expect(snapshot.evidenceMap.fileList).toMatchObject({
        omitted: true,
        changedFileCount: 1,
      });
    }
  });

  test('writes reports and baselines only when explicitly requested', async () => {
    const dir = await createGuardFixture({ verification: true });

    const reportResult = await execa(
      tsxPath,
      [cliPath, 'guard', '--write-report', '--json', '--redact-paths'],
      { cwd: dir },
    );
    const reportPayload = JSON.parse(reportResult.stdout);

    expect(reportPayload.report).toMatchObject({ written: true });
    expect(reportPayload.report.path).toContain('.agentloop/reports/');
    const report = await readFile(path.join(dir, reportPayload.report.path), 'utf8');
    expect(report).toContain('# AgentLoopKit Guard Report');
    expect(report).toContain('## Context Budget');

    const baselineResult = await execa(
      tsxPath,
      [
        cliPath,
        'guard',
        '--write-baseline',
        '.agentloop/guard/baseline.json',
        '--json',
        '--redact-paths',
      ],
      { cwd: dir },
    );
    const baselinePayload = JSON.parse(baselineResult.stdout);

    expect(baselinePayload.baseline).toMatchObject({
      written: true,
      path: '.agentloop/guard/baseline.json',
      changedFileCount: 1,
    });

    await writeFile(path.join(dir, 'docs/readme.md'), 'new docs\n');

    const comparisonResult = await execa(
      tsxPath,
      [
        cliPath,
        'guard',
        '--baseline',
        '.agentloop/guard/baseline.json',
        '--json',
        '--redact-paths',
      ],
      { cwd: dir },
    );
    const comparisonPayload = JSON.parse(comparisonResult.stdout);

    expect(comparisonPayload.baseline).toMatchObject({
      loaded: true,
      path: '.agentloop/guard/baseline.json',
      baselineChangedFileCount: 1,
      newChangedFileCount: 1,
    });
    expect(comparisonPayload.baseline.newChangedFileExamples).toEqual(['docs/readme.md']);
  });

  test('returns JSON errors for invalid options and unsafe paths', async () => {
    const dir = await createGuardFixture({ verification: true });

    const invalidInterval = await execa(
      tsxPath,
      [cliPath, 'guard', '--watch', '--interval-ms', '0', '--json'],
      { cwd: dir, reject: false },
    );
    expect(invalidInterval.exitCode).toBe(1);
    expect(JSON.parse(invalidInterval.stdout).error).toMatchObject({
      code: 'GUARD_OPTION_INVALID',
      option: 'interval-ms',
    });

    const unsafeBaseline = await execa(
      tsxPath,
      [cliPath, 'guard', '--write-baseline', '../baseline.json', '--json'],
      { cwd: dir, reject: false },
    );
    expect(unsafeBaseline.exitCode).toBe(1);
    expect(JSON.parse(unsafeBaseline.stdout).error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'guard-baseline',
      reason: 'outside-directory',
    });

    const unsafeReport = await execa(
      tsxPath,
      [cliPath, 'guard', '--write-report', '--out', '../guard.md', '--json'],
      { cwd: dir, reject: false },
    );
    expect(unsafeReport.exitCode).toBe(1);
    expect(JSON.parse(unsafeReport.stdout).error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'report',
      reason: 'outside-directory',
    });
  });
});
