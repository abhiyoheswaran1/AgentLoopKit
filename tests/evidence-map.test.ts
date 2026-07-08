import path from 'node:path';
import { mkdir, readFile, writeFile, utimes } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import {
  buildEvidenceMap,
  renderEvidenceMapCompactMarkdown,
  renderEvidenceMapMarkdown,
} from '../src/core/evidence-map.js';
import { writeVerificationRun } from '../src/core/runs.js';
import { setActiveTask } from '../src/core/task-state.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createEvidenceMapFixture(options: { report?: boolean } = {}) {
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
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-11-12-10-ship'), { recursive: true });

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

## Likely Files or Areas
- src/auth
- tests/auth/callback.test.ts

## Files or Areas Not to Touch
- docs/private.md

## Acceptance Criteria
- \`npm test -- auth\` passes.

## Verification Commands
- npm test -- auth

## Risk Notes
- Auth flow touched; review redirect edge cases.

## Rollback Notes
Revert the auth callback change.
`,
  );
  await setActiveTask({ cwd: dir, config, taskPath });

  if (options.report !== false) {
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
  }

  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await mkdir(path.join(dir, 'tests/auth'), { recursive: true });
  await mkdir(path.join(dir, 'docs'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "old";\n');
  await writeFile(path.join(dir, 'tests/auth/callback.test.ts'), 'test("old", () => {});\n');
  await writeFile(path.join(dir, 'docs/readme.md'), 'old docs\n');
  await writeFile(path.join(dir, 'docs/private.md'), 'private old docs\n');

  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "fixed";\n');
  await writeFile(path.join(dir, 'tests/auth/callback.test.ts'), 'test("fixed", () => {});\n');
  await writeFile(path.join(dir, 'docs/readme.md'), 'new docs\n');
  await writeFile(path.join(dir, 'docs/private.md'), 'private new docs\n');
  await writeFile(path.join(dir, '.agentloop/reports/scratch.md'), '# Scratch evidence\n');

  await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-10-ship/metadata.json'), {
    id: '2026-06-11-12-10-ship',
    command: 'ship',
    createdAt: '2026-06-11-12-10',
    createdAtEpochMs: Date.parse('2026-06-11T12:10:00Z'),
    task: {
      path: '.agentloop/tasks/2026-06-11-fix-login.md',
      title: 'Fix login redirect bug',
      status: 'in-progress',
    },
    shipReportPath: '.agentloop/reports/2026-06-11-12-10-ship-report.md',
    score: 90,
    changedFileCount: 1,
  });
  await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-10-ship/score.json'), {
    totalScore: 90,
  });
  await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-10-ship/changed-files.json'), [
    { status: 'M', path: 'docs/readme.md' },
  ]);

  return { dir, config, taskPath };
}

describe('evidence map', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('maps changed files to task coverage, run coverage, risk, and forbidden scope', async () => {
    const { dir, config } = await createEvidenceMapFixture();

    const map = await buildEvidenceMap({ cwd: dir, config });

    expect(map.summary.reviewability).toBe('needs-attention');
    expect(map.summary.changedFileCount).toBe(8);
    expect(map.summary.nonEvidenceChangedFileCount).toBe(4);
    expect(map.coverage.coveredFileCount).toBe(3);
    expect(map.coverage.unexplainedFileCount).toBe(1);
    expect(map.risk.riskSensitiveFileCount).toBe(1);
    expect(map.verification).toMatchObject({ status: 'pass', fresh: true });
    expect(map.task).toMatchObject({
      title: 'Fix login redirect bug',
      path: '.agentloop/tasks/2026-06-11-fix-login.md',
    });

    expect(map.files.find((file) => file.path === 'src/auth/callback.ts')).toMatchObject({
      area: 'risk',
      coveredByTask: true,
      coveredByRun: false,
      forbiddenByTask: false,
      unexplained: false,
      riskSensitive: true,
      agentLoopEvidence: false,
    });
    expect(map.files.find((file) => file.path === 'tests/auth/callback.test.ts')).toMatchObject({
      area: 'tests',
      coveredByTask: true,
      unexplained: false,
    });
    expect(map.files.find((file) => file.path === 'docs/readme.md')).toMatchObject({
      area: 'docs',
      coveredByTask: false,
      coveredByRun: true,
      unexplained: false,
    });
    expect(map.files.find((file) => file.path === 'docs/private.md')).toMatchObject({
      forbiddenByTask: true,
      unexplained: true,
    });
    expect(map.files.find((file) => file.path === '.agentloop/reports/scratch.md')).toMatchObject({
      agentLoopEvidence: true,
      unexplained: false,
    });
    expect(map.nextActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          command: 'agentloop task show .agentloop/tasks/2026-06-11-fix-login.md',
          reason: expect.stringContaining('unexplained non-evidence'),
        }),
      ]),
    );
    expect(map.claims).toContain(
      'Evidence coverage is path-based local AgentLoopKit evidence, not proof of code correctness.',
    );
  });

  test('treats dot-directory task scope as a directory pattern', async () => {
    const { dir, config, taskPath } = await createEvidenceMapFixture();
    await writeFile(
      taskPath,
      `# Update local harness

- Created date: 2026-06-11
- Task type: feature
- Status: in-progress

## Problem Statement
Local harness guidance needs an update.

## Desired Outcome
Harness changes are covered by task scope.

## Likely Files or Areas
- .agentloop

## Acceptance Criteria
- Harness guidance is updated.

## Verification Commands
- npm test

## Rollback Notes
Revert the harness guidance.
`,
    );
    await mkdir(path.join(dir, '.agentloop/harness'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/harness/commands.md'), '# Commands\n');

    const map = await buildEvidenceMap({ cwd: dir, config });

    expect(map.files.find((file) => file.path === '.agentloop/harness/commands.md')).toMatchObject({
      coveredByTask: true,
      unexplained: false,
    });
  });

  test('classifies active task and state files as AgentLoop evidence for custom task paths', async () => {
    const { dir, config } = await createEvidenceMapFixture();
    const customTaskPath = path.join(dir, '.agentloop/tasks/app-trial.md');
    await writeFile(
      customTaskPath,
      `# App trial

- Created date: 2026-06-11
- Task type: tests
- Status: in-progress

## Problem Statement
Trial a clean harness app repository.

## Desired Outcome
Evidence map ignores AgentLoopKit task and state metadata as implementation drift.

## Likely Files or Areas
- src/auth

## Files or Areas Not to Touch
- docs/private.md

## Acceptance Criteria
- Task state is treated as local evidence.

## Verification Commands
- npm test

## Rollback Notes
Remove the trial task.
`,
    );
    await setActiveTask({ cwd: dir, config, taskPath: customTaskPath });

    const map = await buildEvidenceMap({
      cwd: dir,
      config,
      changedFiles: [
        { status: 'M', path: 'src/auth/callback.ts' },
        { status: 'M', path: '.agentloop/state.json' },
        { status: '??', path: '.agentloop/tasks/app-trial.md' },
      ],
    });

    expect(map.summary.nonEvidenceChangedFileCount).toBe(1);
    expect(map.summary.agentLoopEvidenceChangedFileCount).toBe(2);
    expect(map.coverage.unexplainedFileCount).toBe(0);
    expect(map.files.find((file) => file.path === '.agentloop/state.json')).toMatchObject({
      agentLoopEvidence: true,
      unexplained: false,
    });
    expect(map.files.find((file) => file.path === '.agentloop/tasks/app-trial.md')).toMatchObject({
      agentLoopEvidence: true,
      unexplained: false,
    });
  });

  test('reports missing and stale verification without reading changed file contents', async () => {
    const { dir, config, taskPath } = await createEvidenceMapFixture({ report: false });
    await writeFile(path.join(dir, 'src/[auth].ts'), 'export const value = true;\n');

    const missing = await buildEvidenceMap({ cwd: dir, config });

    expect(missing.summary.reviewability).toBe('blocked');
    expect(missing.verification).toMatchObject({ status: 'missing', fresh: false });
    expect(missing.nextActions[0]).toMatchObject({
      command: 'agentloop verify --task-commands --progress',
      reason: 'No verification report was found for the current task.',
    });
    expect(renderEvidenceMapMarkdown(missing)).toContain('src/\\[auth\\].ts');

    const reportPath = path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md');
    await writeFile(reportPath, '# Verification Report\n\n- Overall status: pass\n');
    await utimes(reportPath, new Date('2026-06-11T12:00:00Z'), new Date('2026-06-11T12:00:00Z'));
    await utimes(taskPath, new Date('2026-06-11T12:05:00Z'), new Date('2026-06-11T12:05:00Z'));

    const stale = await buildEvidenceMap({ cwd: dir, config });

    expect(stale.summary.reviewability).toBe('blocked');
    expect(stale.verification).toMatchObject({ status: 'pass', fresh: false });
    expect(stale.verification.staleReason).toContain('predates the current task');
    expect(stale.nextActions[0]).toMatchObject({
      command: 'agentloop verify --task-commands --progress',
      reason: expect.stringContaining('stale'),
    });
    expect(renderEvidenceMapCompactMarkdown(stale)).toContain(
      '- Evidence map: `10` changed file(s); `3` covered, `2` unexplained; verification `stale`; `1` risk-sensitive.',
    );

    const changedFileContents = await readFile(path.join(dir, 'docs/private.md'), 'utf8');
    expect(changedFileContents).toBe('private new docs\n');
  });

  test('recommends harden first when the active contract has blocking soft spots', async () => {
    const { dir, config, taskPath } = await createEvidenceMapFixture({ report: false });
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

## Likely Files or Areas
- src/auth
- tests/auth/callback.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- \`npm test -- auth\` passes.

## Verification Commands
- npm test -- auth

## Risk Notes
- Auth flow touched; review redirect edge cases.

## Rollback Notes
Revert the auth callback change.
`,
    );

    const map = await buildEvidenceMap({ cwd: dir, config });

    expect(map.nextActions[0].command).toBe('agentloop harden');
    expect(map.nextActions[0].reason).toMatch(/blocking soft spot/i);
  });

  test('does not recommend harden when the active contract has no blocking soft spots', async () => {
    const { dir, config } = await createEvidenceMapFixture();

    const map = await buildEvidenceMap({ cwd: dir, config });

    expect(map.nextActions.some((a) => a.command === 'agentloop harden')).toBe(false);
  });

  test('run coverage drops when a covered file changes content after the run', async () => {
    const { dir, config } = await createEvidenceMapFixture();
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/x.ts'), 'export const x = 1;\n');
    await git(dir, ['add', '.']);
    await git(dir, ['commit', '-m', 'add src/x.ts']);
    await writeFile(path.join(dir, 'src/x.ts'), 'export const x = 2;\n');

    // Use the real write-run entrypoint so the hash is recorded from
    // src/x.ts's content at run time.
    await writeVerificationRun({
      cwd: dir,
      timestamp: '2026-06-11-12-20',
      task: {
        path: '.agentloop/tasks/2026-06-11-fix-login.md',
        title: 'Fix login redirect bug',
        status: 'in-progress',
      },
      verificationReportPath: path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md'),
      overallStatus: 'pass',
      changedFiles: [{ status: 'M', path: 'src/x.ts' }],
      markdown: '# Verification Report\n\n- Overall status: pass\n',
    });

    const covered = await buildEvidenceMap({ cwd: dir, config });
    expect(covered.files.find((f) => f.path.endsWith('src/x.ts'))?.coveredByRun).toBe(true);

    await writeFile(path.join(dir, 'src/x.ts'), '// edited after the run\n');
    const after = await buildEvidenceMap({ cwd: dir, config });
    const x = after.files.find((f) => f.path.endsWith('src/x.ts'));
    expect(x?.coveredByRun).toBe(false);
  });

  test('legacy run entries without a hash keep path-presence coverage', async () => {
    const { dir, config } = await createEvidenceMapFixture();
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/x.ts'), 'export const x = 1;\n');
    await git(dir, ['add', '.']);
    await git(dir, ['commit', '-m', 'add src/x.ts']);

    // Manually write a run's changed-files.json with entries that have NO
    // hash field, simulating a legacy run recorded before Task 1.
    await mkdir(path.join(dir, '.agentloop/runs/2026-06-11-12-15-verify'), { recursive: true });
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-15-verify/metadata.json'), {
      id: '2026-06-11-12-15-verify',
      command: 'verify',
      createdAt: '2026-06-11-12-15',
      createdAtEpochMs: Date.parse('2026-06-11T12:15:00Z'),
      task: {
        path: '.agentloop/tasks/2026-06-11-fix-login.md',
        title: 'Fix login redirect bug',
        status: 'in-progress',
      },
      overallStatus: 'pass',
      changedFileCount: 1,
    });
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-11-12-15-verify/changed-files.json'), [
      { status: 'M', path: 'src/x.ts' },
    ]);

    await writeFile(path.join(dir, 'src/x.ts'), '// edited after the legacy run\n');

    const map = await buildEvidenceMap({ cwd: dir, config });
    expect(map.files.find((f) => f.path.endsWith('src/x.ts'))?.coveredByRun).toBe(true);
  });
});
