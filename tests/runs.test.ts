import path from 'node:path';
import { access, chmod, mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { toSafeDisplayPath } from '../src/core/display-path.js';
import { singleLineInlineCode } from '../src/core/markdown-format.js';
import {
  findFileIntent,
  findFileIntentWithSearch,
  listRuns,
  readRun,
  readRunChangedFiles,
  writeVerificationRun,
} from '../src/core/runs.js';
import { setActiveTask } from '../src/core/task-state.js';
import { RUN_ARTIFACT_MAX_BYTES } from '../src/core/run-artifacts.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_LEDGER_TEST_TIMEOUT_MS = 90_000;

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

function repoPath(cwd: string, filePath: string) {
  return toSafeDisplayPath(cwd, filePath);
}

async function createRunFixture() {
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
    vi.restoreAllMocks();
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test(
    'records ship runs and looks up file intent from the local ledger',
    async () => {
      const dir = await createRunFixture();

      const ship = JSON.parse(
        (await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir })).stdout,
      );
      const runs = JSON.parse(
        (await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout,
      );
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
      expect(intent.search).toMatchObject({
        totalRunCount: 1,
        inspectedRunCount: 1,
        truncated: false,
      });
      expect(intent.runs).toEqual([
        expect.objectContaining({
          id: ship.run.id,
          why: 'Changed in ship run for task "Fix login redirect bug".',
        }),
      ]);
    },
    CLI_LEDGER_TEST_TIMEOUT_MS,
  );

  test(
    'accepts redact-paths on run ledger read commands without changing output',
    async () => {
      const dir = await createRunFixture();

      const ship = JSON.parse(
        (await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir })).stdout,
      );

      for (const command of ['runs', 'show-run', 'intent']) {
        const help = await execa(tsxPath, [cliPath, command, '--help'], { cwd: dir });
        expect(help.stdout).toContain('--redact-paths');
      }

      const runsHuman = await execa(tsxPath, [cliPath, 'runs', '--latest'], { cwd: dir });
      const runsRedactedHuman = await execa(
        tsxPath,
        [cliPath, 'runs', '--latest', '--redact-paths'],
        { cwd: dir },
      );
      const runsJson = JSON.parse(
        (await execa(tsxPath, [cliPath, 'runs', '--latest', '--json'], { cwd: dir })).stdout,
      );
      const runsRedactedJson = JSON.parse(
        (
          await execa(tsxPath, [cliPath, 'runs', '--latest', '--json', '--redact-paths'], {
            cwd: dir,
          })
        ).stdout,
      );

      const showHuman = await execa(tsxPath, [cliPath, 'show-run', ship.run.id], { cwd: dir });
      const showRedactedHuman = await execa(
        tsxPath,
        [cliPath, 'show-run', ship.run.id, '--redact-paths'],
        { cwd: dir },
      );
      const showJson = JSON.parse(
        (await execa(tsxPath, [cliPath, 'show-run', ship.run.id, '--json'], { cwd: dir })).stdout,
      );
      const showRedactedJson = JSON.parse(
        (
          await execa(tsxPath, [cliPath, 'show-run', ship.run.id, '--json', '--redact-paths'], {
            cwd: dir,
          })
        ).stdout,
      );

      const intentHuman = await execa(tsxPath, [cliPath, 'intent', 'src/auth/callback.ts'], {
        cwd: dir,
      });
      const intentRedactedHuman = await execa(
        tsxPath,
        [cliPath, 'intent', 'src/auth/callback.ts', '--redact-paths'],
        { cwd: dir },
      );
      const intentJson = JSON.parse(
        (await execa(tsxPath, [cliPath, 'intent', 'src/auth/callback.ts', '--json'], { cwd: dir }))
          .stdout,
      );
      const intentRedactedJson = JSON.parse(
        (
          await execa(
            tsxPath,
            [cliPath, 'intent', 'src/auth/callback.ts', '--json', '--redact-paths'],
            { cwd: dir },
          )
        ).stdout,
      );

      expect(runsRedactedHuman.stdout).toBe(runsHuman.stdout);
      expect(runsRedactedJson).toEqual(runsJson);
      expect(showRedactedHuman.stdout).toBe(showHuman.stdout);
      expect(showRedactedJson).toEqual(showJson);
      expect(intentRedactedHuman.stdout).toBe(intentHuman.stdout);
      expect(intentRedactedJson).toEqual(intentJson);
      expect(intentHuman.stdout).toContain('Searched newest');
      expect(intentJson.search).toMatchObject({
        inspectedRunCount: 1,
        truncated: false,
      });
    },
    CLI_LEDGER_TEST_TIMEOUT_MS,
  );

  test('records verification runs in the local ledger when requested', async () => {
    const dir = await createRunFixture();

    const verify = JSON.parse(
      (
        await execa(
          tsxPath,
          [
            cliPath,
            'verify',
            '--no-build',
            '--no-test',
            '--no-lint',
            '--no-typecheck',
            '--write-run',
            '--json',
          ],
          { cwd: dir },
        )
      ).stdout,
    );
    const runs = JSON.parse(
      (await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout,
    );
    const shown = JSON.parse(
      (await execa(tsxPath, [cliPath, 'show-run', verify.run.id, '--json'], { cwd: dir })).stdout,
    );
    const intent = JSON.parse(
      (await execa(tsxPath, [cliPath, 'intent', 'src/auth/callback.ts', '--json'], { cwd: dir }))
        .stdout,
    );

    expect(verify.overallStatus).toBe('not-run');
    expect(verify.run.id).toMatch(/verify$/);
    expect(verify.run.metadata.verificationReportPath).toBe(repoPath(dir, verify.reportPath));
    expect(runs.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: verify.run.id,
          command: 'verify',
          verificationReportPath: repoPath(dir, verify.reportPath),
        }),
      ]),
    );
    expect(shown.run.metadata.command).toBe('verify');
    expect(shown.run.metadata.verificationReportPath).toBe(repoPath(dir, verify.reportPath));
    expect(shown.run.score).toBeNull();
    expect(intent.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: verify.run.id,
          why: 'Verification run for task "Fix login redirect bug".',
        }),
      ]),
    );
  });

  test('records handoff runs in the local ledger when requested', async () => {
    const dir = await createRunFixture();

    const handoff = JSON.parse(
      (await execa(tsxPath, [cliPath, 'handoff', '--write-run', '--json'], { cwd: dir })).stdout,
    );
    const runs = JSON.parse(
      (await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout,
    );
    const shown = JSON.parse(
      (await execa(tsxPath, [cliPath, 'show-run', handoff.run.id, '--json'], { cwd: dir })).stdout,
    );
    const intent = JSON.parse(
      (await execa(tsxPath, [cliPath, 'intent', 'src/auth/callback.ts', '--json'], { cwd: dir }))
        .stdout,
    );

    expect(handoff.run.id).toMatch(/handoff$/);
    expect(handoff.run.metadata.handoffPath).toBe(repoPath(dir, handoff.outPath));
    expect(runs.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: handoff.run.id,
          command: 'handoff',
          handoffPath: repoPath(dir, handoff.outPath),
        }),
      ]),
    );
    expect(shown.run.metadata.command).toBe('handoff');
    expect(shown.run.metadata.handoffPath).toBe(repoPath(dir, handoff.outPath));
    expect(shown.run.diffStat).toContain('src/auth/callback.ts');
    expect(intent.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: handoff.run.id,
          why: 'Reviewer handoff for task "Fix login redirect bug".',
        }),
      ]),
    );
  });

  test('rejects run directories that resolve outside the repo through symlinks', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir('agentloopkit-outside-run-');
    tempDirs.push(dir, outsideDir);

    await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/runs/2026-06-12-00-00-verify'), 'dir');

    await expect(
      writeVerificationRun({
        cwd: dir,
        timestamp: '2026-06-12-00-00',
        task: null,
        verificationReportPath: path.join(dir, '.agentloop/reports/report.md'),
        overallStatus: 'pass',
        changedFiles: [],
        markdown: '# Verification Report\n',
      }),
    ).rejects.toThrow('Run directory must stay inside the run ledger root.');
    await expect(access(path.join(outsideDir, 'metadata.json'))).rejects.toThrow();
  });

  test('keeps same-minute run records instead of overwriting them', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const first = await writeVerificationRun({
      cwd: dir,
      timestamp: '2026-06-12-00-00',
      task: null,
      verificationReportPath: path.join(dir, '.agentloop/reports/first.md'),
      overallStatus: 'pass',
      changedFiles: [],
      markdown: '# First Verification Report\n',
    });
    const second = await writeVerificationRun({
      cwd: dir,
      timestamp: '2026-06-12-00-00',
      task: null,
      verificationReportPath: path.join(dir, '.agentloop/reports/second.md'),
      overallStatus: 'pass',
      changedFiles: [],
      markdown: '# Second Verification Report\n',
    });

    expect(first.id).toBe('2026-06-12-00-00-verify');
    expect(second.id).toBe('2026-06-12-00-00-verify-2');
    await expect(
      readFile(path.join(first.path, 'verification-report.md'), 'utf8'),
    ).resolves.toContain('First Verification Report');
    await expect(
      readFile(path.join(second.path, 'verification-report.md'), 'utf8'),
    ).resolves.toContain('Second Verification Report');
  });

  test('orders same-minute runs by precise metadata timestamp', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runsDir = path.join(dir, '.agentloop/runs');
    await mkdir(path.join(runsDir, '2026-06-12-00-00-a-verify'), { recursive: true });
    await mkdir(path.join(runsDir, '2026-06-12-00-00-b-ship'), { recursive: true });
    await mkdir(path.join(runsDir, '2026-06-12-00-00-c-handoff'), { recursive: true });

    const base = {
      createdAt: '2026-06-12-00-00',
      task: null,
      changedFileCount: 1,
    };
    await writeFile(
      path.join(runsDir, '2026-06-12-00-00-a-verify/metadata.json'),
      JSON.stringify(
        {
          ...base,
          id: '2026-06-12-00-00-a-verify',
          command: 'verify',
          createdAtEpochMs: 1_000,
          overallStatus: 'pass',
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, '2026-06-12-00-00-b-ship/metadata.json'),
      JSON.stringify(
        {
          ...base,
          id: '2026-06-12-00-00-b-ship',
          command: 'ship',
          createdAtEpochMs: 3_000,
          score: 91,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, '2026-06-12-00-00-c-handoff/metadata.json'),
      JSON.stringify(
        {
          ...base,
          id: '2026-06-12-00-00-c-handoff',
          command: 'handoff',
          createdAtEpochMs: 2_000,
        },
        null,
        2,
      ),
    );

    await expect(listRuns(dir)).resolves.toEqual([
      expect.objectContaining({ id: '2026-06-12-00-00-b-ship', command: 'ship' }),
      expect.objectContaining({ id: '2026-06-12-00-00-c-handoff', command: 'handoff' }),
      expect.objectContaining({ id: '2026-06-12-00-00-a-verify', command: 'verify' }),
    ]);
  });

  test('keeps legacy run metadata that omits task state', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runId = '2026-06-12-00-00-ship';
    const runDir = path.join(dir, '.agentloop/runs', runId);
    await mkdir(runDir, { recursive: true });
    await writeFile(
      path.join(runDir, 'metadata.json'),
      JSON.stringify(
        {
          id: runId,
          command: 'ship',
          createdAt: '2026-06-12-00-00',
          score: 96,
          shipReportPath: '.agentloop/reports/ship-report.md',
          changedFileCount: 3,
        },
        null,
        2,
      ),
    );

    await expect(listRuns(dir)).resolves.toEqual([
      expect.objectContaining({
        id: runId,
        command: 'ship',
        task: null,
        score: 96,
      }),
    ]);
    await expect(readRun(dir, runId)).resolves.toMatchObject({
      metadata: {
        id: runId,
        task: null,
      },
    });
  });

  test('limits run ledger CLI output for recent and latest runs', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    const runsDir = path.join(dir, '.agentloop/runs');
    await mkdir(path.join(runsDir, '2026-06-12-00-00-a-verify'), { recursive: true });
    await mkdir(path.join(runsDir, '2026-06-12-00-00-b-handoff'), { recursive: true });
    await mkdir(path.join(runsDir, '2026-06-12-00-00-c-ship'), { recursive: true });

    const base = {
      createdAt: '2026-06-12-00-00',
      task: null,
      changedFileCount: 1,
    };
    await writeFile(
      path.join(runsDir, '2026-06-12-00-00-a-verify/metadata.json'),
      JSON.stringify(
        { ...base, id: '2026-06-12-00-00-a-verify', command: 'verify', createdAtEpochMs: 1_000 },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, '2026-06-12-00-00-b-handoff/metadata.json'),
      JSON.stringify(
        { ...base, id: '2026-06-12-00-00-b-handoff', command: 'handoff', createdAtEpochMs: 2_000 },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, '2026-06-12-00-00-c-ship/metadata.json'),
      JSON.stringify(
        {
          ...base,
          id: '2026-06-12-00-00-c-ship',
          command: 'ship',
          createdAtEpochMs: 3_000,
          score: 99,
        },
        null,
        2,
      ),
    );

    const limited = JSON.parse(
      (await execa(tsxPath, [cliPath, 'runs', '--limit', '2', '--json'], { cwd: dir })).stdout,
    );
    const latest = await execa(tsxPath, [cliPath, 'runs', '--latest'], { cwd: dir });

    expect(limited.runs.map((run: { id: string }) => run.id)).toEqual([
      '2026-06-12-00-00-c-ship',
      '2026-06-12-00-00-b-handoff',
    ]);
    expect(latest.stdout).toContain('2026-06-12-00-00-c-ship');
    expect(latest.stdout).not.toContain('2026-06-12-00-00-b-handoff');
    expect(latest.stdout).not.toContain('2026-06-12-00-00-a-verify');
  });

  test('prints run ledger human output values on one markdown line', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    const changedFilePath = 'src/auth/callback\nfile.ts';
    await mkdir(runsDir, { recursive: true });
    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-00-00-ship',
          command: 'ship\nstep',
          createdAt: '2026-06-12-00-00',
          createdAtEpochMs: 1_000,
          task: {
            path: '.agentloop/tasks/2026-06-12-fix-login.md',
            title: 'Fix login\nredirect bug',
            status: 'done',
          },
          score: 99,
          changedFileCount: 1,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, 'changed-files.json'),
      JSON.stringify([{ path: changedFilePath, status: 'M' }], null, 2),
    );

    const runs = await execa(tsxPath, [cliPath, 'runs', '--latest'], { cwd: dir });
    const shown = await execa(tsxPath, [cliPath, 'show-run', '2026-06-12-00-00-ship'], {
      cwd: dir,
    });
    const intent = await execa(tsxPath, [cliPath, 'intent', changedFilePath], { cwd: dir });

    expect(runs.stdout).toContain(
      `- ${singleLineInlineCode('2026-06-12-00-00-ship')} ${singleLineInlineCode(
        'ship\nstep',
      )} score ${singleLineInlineCode('99')}/100`,
    );
    expect(shown.stdout).toContain(`- Command: ${singleLineInlineCode('ship\nstep')}`);
    expect(intent.stdout).toContain(
      `AgentLoopKit intent for ${singleLineInlineCode(changedFilePath)}:`,
    );
    expect(intent.stdout).toContain(
      `- ${singleLineInlineCode('2026-06-12-00-00-ship')}: ${singleLineInlineCode(
        'Changed in ship run for task "Fix login\nredirect bug".',
      )}`,
    );
    expect(`${runs.stdout}\n${shown.stdout}\n${intent.stdout}`).not.toContain('ship\nstep');
    expect(`${runs.stdout}\n${shown.stdout}\n${intent.stdout}`).not.toContain(changedFilePath);

    const runsJson = JSON.parse(
      (await execa(tsxPath, [cliPath, 'runs', '--latest', '--json'], { cwd: dir })).stdout,
    );
    const shownJson = JSON.parse(
      (
        await execa(tsxPath, [cliPath, 'show-run', '2026-06-12-00-00-ship', '--json'], {
          cwd: dir,
        })
      ).stdout,
    );
    const intentJson = JSON.parse(
      (await execa(tsxPath, [cliPath, 'intent', changedFilePath, '--json'], { cwd: dir })).stdout,
    );

    expect(runsJson.runs[0].command).toBe('ship\nstep');
    expect(shownJson.run.metadata.command).toBe('ship\nstep');
    expect(intentJson.file).toBe(changedFilePath);
    expect(intentJson.runs[0].why).toBe('Changed in ship run for task "Fix login\nredirect bug".');
  });

  test('separates AgentLoop evidence churn in human run ledger output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    const changedFiles = [
      { path: 'src/status.ts', status: 'M' },
      { path: '.agentloop/reports/2026-06-12-00-00-verification-report.md', status: '??' },
      { path: '.agentflight/reports/session-proof.md', status: '??' },
    ];
    await mkdir(runsDir, { recursive: true });
    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-00-00-ship',
          command: 'ship',
          createdAt: '2026-06-12-00-00',
          createdAtEpochMs: 1_000,
          task: null,
          score: 99,
          changedFileCount: changedFiles.length,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, 'changed-files.json'),
      JSON.stringify(changedFiles, null, 2),
    );

    const runs = await execa(tsxPath, [cliPath, 'runs', '--latest'], { cwd: dir });
    const shown = await execa(tsxPath, [cliPath, 'show-run', '2026-06-12-00-00-ship'], {
      cwd: dir,
    });
    const runsJson = JSON.parse(
      (await execa(tsxPath, [cliPath, 'runs', '--latest', '--json'], { cwd: dir })).stdout,
    );
    const shownJson = JSON.parse(
      (
        await execa(tsxPath, [cliPath, 'show-run', '2026-06-12-00-00-ship', '--json'], {
          cwd: dir,
        })
      ).stdout,
    );

    expect(runs.stdout).toContain(
      'score `99`/100 - `3` changed files (`1` non-evidence, `2` AgentLoop evidence)',
    );
    expect(shown.stdout).toContain(
      '- Changed files: `3` (`1` non-evidence, `2` AgentLoop evidence)',
    );
    expect(runsJson.runs[0]).not.toHaveProperty('nonEvidenceChangedFileCount');
    expect(runsJson.runs[0]).not.toHaveProperty('agentLoopEvidenceChangedFileCount');
    expect(shownJson.run.changedFiles).toEqual(changedFiles);
  });

  test('rejects invalid run ledger limits before loading the workspace', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const human = await execa(tsxPath, [cliPath, 'runs', '--limit', '0'], {
      cwd: dir,
      reject: false,
    });
    const json = await execa(tsxPath, [cliPath, 'runs', '--limit', 'nope', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(human.exitCode).toBe(1);
    expect(human.stderr).toContain('--limit must be a positive integer.');
    expect(human.stderr).not.toContain('AgentLoopKit config not found');
    expect(json.exitCode).toBe(1);
    expect(JSON.parse(json.stdout).error).toMatchObject({
      code: 'RUN_LIMIT_INVALID',
      message: '--limit must be a positive integer.',
    });
    expect(json.stderr).toBe('');
  });

  test('hydrates run task metadata from archived task files when available', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    const archivedTaskPath = path.join(dir, '.agentloop/tasks/archive/2026-06-12-fix-login.md');
    await mkdir(runsDir, { recursive: true });
    await mkdir(path.dirname(archivedTaskPath), { recursive: true });
    await writeFile(archivedTaskPath, '# Fix login redirect bug\n\n- Status: done\n');
    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-00-00-ship',
          command: 'ship',
          createdAt: '2026-06-12-00-00',
          createdAtEpochMs: 1_000,
          task: {
            path: '.agentloop/tasks/2026-06-12-fix-login.md',
            title: 'Old run snapshot title',
            status: 'in-progress',
          },
          score: 100,
          changedFileCount: 1,
        },
        null,
        2,
      ),
    );

    await expect(listRuns(dir)).resolves.toEqual([
      expect.objectContaining({
        task: {
          path: '.agentloop/tasks/archive/2026-06-12-fix-login.md',
          title: 'Fix login redirect bug',
          status: 'done',
        },
      }),
    ]);

    const record = await readRun(dir, '2026-06-12-00-00-ship');
    expect(record.metadata.task).toEqual({
      path: '.agentloop/tasks/archive/2026-06-12-fix-login.md',
      title: 'Fix login redirect bug',
      status: 'done',
    });
    await expect(readFile(path.join(runsDir, 'metadata.json'), 'utf8')).resolves.toContain(
      '"status": "in-progress"',
    );
  });

  test('can list bounded run summaries without hydrating task files', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runsDir = path.join(dir, '.agentloop/runs');
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-12-fix-login.md');
    await mkdir(path.join(runsDir, '2026-06-12-00-00-old-ship'), { recursive: true });
    await mkdir(path.join(runsDir, '2026-06-13-00-00-new-verify'), { recursive: true });
    await mkdir(path.dirname(taskPath), { recursive: true });
    await writeFile(taskPath, '# Current task title\n\n- Status: done\n');

    await writeFile(
      path.join(runsDir, '2026-06-12-00-00-old-ship/metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-00-00-old-ship',
          command: 'ship',
          createdAt: '2026-06-12-00-00',
          createdAtEpochMs: 1_000,
          task: {
            path: '.agentloop/tasks/2026-06-12-fix-login.md',
            title: 'Stored task title',
            status: 'in-progress',
          },
          score: 90,
          changedFileCount: 1,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, '2026-06-13-00-00-new-verify/metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-13-00-00-new-verify',
          command: 'verify',
          createdAt: '2026-06-13-00-00',
          createdAtEpochMs: 2_000,
          task: null,
          overallStatus: 'pass',
          changedFileCount: 1,
        },
        null,
        2,
      ),
    );

    await expect(listRuns(dir, { limit: 1, hydrateTask: false })).resolves.toEqual([
      expect.objectContaining({ id: '2026-06-13-00-00-new-verify' }),
    ]);
    await expect(
      listRuns(dir, {
        limit: 1,
        taskPath: '.agentloop/tasks/2026-06-12-fix-login.md',
        hydrateTask: false,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        id: '2026-06-12-00-00-old-ship',
        task: {
          path: '.agentloop/tasks/2026-06-12-fix-login.md',
          title: 'Stored task title',
          status: 'in-progress',
        },
      }),
    ]);
    await expect(listRuns(dir, { limit: 1, taskPath, hydrateTask: true })).resolves.toEqual([
      expect.objectContaining({
        id: '2026-06-12-00-00-old-ship',
        task: {
          path: '.agentloop/tasks/2026-06-12-fix-login.md',
          title: 'Current task title',
          status: 'done',
        },
      }),
    ]);
  });

  test('preselects newest run buckets before reading metadata for unfiltered limits', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    const runsDir = path.join(dir, '.agentloop/runs');
    const oldRunDir = path.join(runsDir, '2026-06-12-00-00-old-ship');
    const newRunDir = path.join(runsDir, '2026-06-13-00-00-new-verify');
    await mkdir(oldRunDir, { recursive: true });
    await mkdir(newRunDir, { recursive: true });

    const oldMetadataPath = path.join(oldRunDir, 'metadata.json');
    await writeJson(oldMetadataPath, {
      id: '2026-06-12-00-00-old-ship',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: null,
      score: 90,
      changedFileCount: 1,
    });
    await chmod(oldMetadataPath, 0o000);
    await writeJson(path.join(newRunDir, 'metadata.json'), {
      id: '2026-06-13-00-00-new-verify',
      command: 'verify',
      createdAt: '2026-06-13-00-00',
      createdAtEpochMs: 2_000,
      task: null,
      overallStatus: 'pass',
      changedFileCount: 1,
    });

    await expect(listRuns(dir, { limit: 1, hydrateTask: false })).resolves.toEqual([
      expect.objectContaining({ id: '2026-06-13-00-00-new-verify' }),
    ]);

    const latest = JSON.parse(
      (await execa(tsxPath, [cliPath, 'runs', '--latest', '--json'], { cwd: dir })).stdout,
    );
    expect(latest.runs).toEqual([
      expect.objectContaining({ id: '2026-06-13-00-00-new-verify' }),
    ]);
  });

  test('normalizes bounded run summary limit edge cases', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    await mkdir(runsDir, { recursive: true });
    await writeJson(path.join(runsDir, 'metadata.json'), {
      id: '2026-06-12-00-00-ship',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: null,
      score: 90,
      changedFileCount: 1,
    });

    await expect(listRuns(dir, { limit: 0 })).resolves.toEqual([]);
    await expect(listRuns(dir, { limit: -1 })).resolves.toEqual([]);
    await expect(listRuns(dir, { limit: Number.NaN })).resolves.toEqual([]);
    await expect(listRuns(dir, { limit: Number.POSITIVE_INFINITY })).resolves.toEqual([]);
    await expect(listRuns(dir, { limit: 1.9 })).resolves.toEqual([
      expect.objectContaining({ id: '2026-06-12-00-00-ship' }),
    ]);
  });

  test('matches archived and active task paths when filtering run summaries', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runsRoot = path.join(dir, '.agentloop/runs');
    await mkdir(path.join(runsRoot, '2026-06-12-00-00-active-ship'), { recursive: true });
    await mkdir(path.join(runsRoot, '2026-06-13-00-00-archived-ship'), { recursive: true });

    await writeJson(path.join(runsRoot, '2026-06-12-00-00-active-ship/metadata.json'), {
      id: '2026-06-12-00-00-active-ship',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: {
        path: '.agentloop/tasks/2026-06-12-fix-login.md',
        title: 'Stored active task',
        status: 'done',
      },
      changedFileCount: 1,
    });
    await writeJson(path.join(runsRoot, '2026-06-13-00-00-archived-ship/metadata.json'), {
      id: '2026-06-13-00-00-archived-ship',
      command: 'ship',
      createdAt: '2026-06-13-00-00',
      createdAtEpochMs: 2_000,
      task: {
        path: '.agentloop/tasks/archive/2026-06-12-fix-login.md',
        title: 'Stored archived task',
        status: 'done',
      },
      changedFileCount: 1,
    });

    await expect(
      listRuns(dir, {
        hydrateTask: false,
        taskPath: '.agentloop/tasks/2026-06-12-fix-login.md',
      }),
    ).resolves.toEqual([
      expect.objectContaining({ id: '2026-06-13-00-00-archived-ship' }),
      expect.objectContaining({ id: '2026-06-12-00-00-active-ship' }),
    ]);
    await expect(
      listRuns(dir, {
        hydrateTask: false,
        taskPath: '.agentloop/tasks/archive/2026-06-12-fix-login.md',
      }),
    ).resolves.toEqual([
      expect.objectContaining({ id: '2026-06-13-00-00-archived-ship' }),
      expect.objectContaining({ id: '2026-06-12-00-00-active-ship' }),
    ]);
  });

  test('falls back to stored run task metadata when the task file is missing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    await mkdir(runsDir, { recursive: true });
    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-00-00-ship',
          command: 'ship',
          createdAt: '2026-06-12-00-00',
          createdAtEpochMs: 1_000,
          task: {
            path: '.agentloop/tasks/2026-06-12-missing.md',
            title: 'Stored task title',
            status: 'in-progress',
          },
          score: 92,
          changedFileCount: 1,
        },
        null,
        2,
      ),
    );

    await expect(listRuns(dir)).resolves.toEqual([
      expect.objectContaining({
        task: {
          path: '.agentloop/tasks/2026-06-12-missing.md',
          title: 'Stored task title',
          status: 'in-progress',
        },
      }),
    ]);
  });

  test('sanitizes stored absolute run paths at the ledger read boundary', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir('agentloopkit-outside-run-path-');
    tempDirs.push(dir, outsideDir);
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    await mkdir(runsDir, { recursive: true });

    await writeFile(
      path.join(runsDir, 'metadata.json'),
      JSON.stringify(
        {
          id: '2026-06-12-00-00-ship',
          command: 'ship',
          createdAt: '2026-06-12-00-00',
          createdAtEpochMs: 1_000,
          task: {
            path: path.join(dir, '.agentloop/tasks/2026-06-12-fix-login.md'),
            title: 'Fix login redirect bug',
            status: 'review',
          },
          verificationReportPath: path.join(outsideDir, 'private-verification-report.md'),
          shipReportPath: path.join(dir, '.agentloop/reports/2026-06-12-00-00-ship-report.md'),
          handoffPath: path.join(dir, '.agentloop/handoffs/2026-06-12-00-00-pr-summary.md'),
          score: 94,
          changedFileCount: 2,
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(runsDir, 'changed-files.json'),
      JSON.stringify(
        [
          { path: path.join(dir, 'src/auth/callback.ts'), status: 'M' },
          { path: path.join(outsideDir, 'private.ts'), status: 'M' },
        ],
        null,
        2,
      ),
    );

    await expect(listRuns(dir)).resolves.toEqual([
      expect.objectContaining({
        id: '2026-06-12-00-00-ship',
        task: expect.objectContaining({
          path: '.agentloop/tasks/2026-06-12-fix-login.md',
        }),
        verificationReportPath: 'private-verification-report.md',
        shipReportPath: '.agentloop/reports/2026-06-12-00-00-ship-report.md',
        handoffPath: '.agentloop/handoffs/2026-06-12-00-00-pr-summary.md',
      }),
    ]);

    const record = await readRun(dir, '2026-06-12-00-00-ship');
    expect(record.metadata.task?.path).toBe('.agentloop/tasks/2026-06-12-fix-login.md');
    expect(record.metadata.verificationReportPath).toBe('private-verification-report.md');
    expect(record.metadata.shipReportPath).toBe(
      '.agentloop/reports/2026-06-12-00-00-ship-report.md',
    );
    expect(record.metadata.handoffPath).toBe('.agentloop/handoffs/2026-06-12-00-00-pr-summary.md');
    expect(record.changedFiles).toEqual([
      { path: 'src/auth/callback.ts', status: 'M' },
      { path: 'private.ts', status: 'M' },
    ]);
    expect(JSON.stringify(record)).not.toContain(dir);
    expect(JSON.stringify(record)).not.toContain('..');

    await expect(findFileIntent(dir, 'src/auth/callback.ts')).resolves.toEqual([
      expect.objectContaining({
        id: '2026-06-12-00-00-ship',
        file: 'src/auth/callback.ts',
      }),
    ]);
  });

  test('reads changed-file artifacts directly with sanitized paths and safe misses', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir('agentloopkit-outside-changed-files-');
    tempDirs.push(dir, outsideDir);
    const runsDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    await mkdir(runsDir, { recursive: true });

    await expect(readRunChangedFiles(dir, '2026-06-12-00-00-ship')).resolves.toEqual([]);
    await writeJson(path.join(runsDir, 'changed-files.json'), [
      { path: path.join(dir, 'src/auth/callback.ts'), status: 'M' },
      { path: path.join(outsideDir, 'private.ts'), status: 'M' },
    ]);

    await expect(readRunChangedFiles(dir, '2026-06-12-00-00-ship')).resolves.toEqual([
      { path: 'src/auth/callback.ts', status: 'M' },
      { path: 'private.ts', status: 'M' },
    ]);
    await expect(readRunChangedFiles(dir, '2026-06-12-00-00-missing')).rejects.toMatchObject({
      code: 'RUN_NOT_FOUND',
    });
    await expect(readRunChangedFiles(dir, '.')).rejects.toMatchObject({
      code: 'RUN_ID_INVALID',
    });
  });

  test('finds file intent without hydrating unrelated run artifacts', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir('agentloopkit-outside-intent-artifacts-');
    tempDirs.push(dir, outsideDir);
    const runDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    await mkdir(runDir, { recursive: true });
    await writeJson(path.join(runDir, 'metadata.json'), {
      id: '2026-06-12-00-00-ship',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: {
        path: '.agentloop/tasks/2026-06-12-fix-login.md',
        title: 'Fix login redirect',
        status: 'done',
      },
      score: 95,
      changedFileCount: 1,
    });
    await writeJson(path.join(runDir, 'changed-files.json'), [
      { path: path.join(dir, 'src/auth/callback.ts'), status: 'M' },
    ]);
    await writeJson(path.join(outsideDir, 'score.json'), { totalScore: 99 });
    await symlink(path.join(outsideDir, 'score.json'), path.join(runDir, 'score.json'));
    await writeFile(path.join(outsideDir, 'diffstat.txt'), 'outside diffstat\n');
    await symlink(path.join(outsideDir, 'diffstat.txt'), path.join(runDir, 'diffstat.txt'));

    await expect(findFileIntent(dir, 'src/auth/callback.ts')).resolves.toEqual([
      expect.objectContaining({
        id: '2026-06-12-00-00-ship',
        file: 'src/auth/callback.ts',
        why: 'Changed in ship run for task "Fix login redirect".',
      }),
    ]);
  });

  test('hydrates matched task metadata for file intent reasons', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-12-fix-login.md');
    await mkdir(runDir, { recursive: true });
    await mkdir(path.dirname(taskPath), { recursive: true });
    await writeFile(
      taskPath,
      '# Current login redirect title\n\n- Status: done\n\n## Problem Statement\nStored title changed.\n',
    );
    await writeJson(path.join(runDir, 'metadata.json'), {
      id: '2026-06-12-00-00-ship',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: {
        path: '.agentloop/tasks/2026-06-12-fix-login.md',
        title: 'Stored login title',
        status: 'in-progress',
      },
      score: 95,
      changedFileCount: 1,
    });
    await writeJson(path.join(runDir, 'changed-files.json'), [
      { path: 'src/auth/callback.ts', status: 'M' },
    ]);

    await expect(findFileIntent(dir, 'src/auth/callback.ts')).resolves.toEqual([
      expect.objectContaining({
        task: expect.objectContaining({
          title: 'Current login redirect title',
          status: 'done',
        }),
        why: 'Changed in ship run for task "Current login redirect title".',
      }),
    ]);
  });

  test('orders file intent matches by run metadata timestamp within the same minute', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const runsRoot = path.join(dir, '.agentloop/runs');
    const newerRun = path.join(runsRoot, '2026-06-12-00-00-a-ship');
    const olderRun = path.join(runsRoot, '2026-06-12-00-00-c-ship');
    await mkdir(newerRun, { recursive: true });
    await mkdir(olderRun, { recursive: true });

    const base = {
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      task: {
        path: '.agentloop/tasks/2026-06-12-fix-login.md',
        title: 'Fix login redirect',
        status: 'done',
      },
      score: 95,
      changedFileCount: 1,
    };
    await writeJson(path.join(newerRun, 'metadata.json'), {
      ...base,
      id: '2026-06-12-00-00-a-ship',
      createdAtEpochMs: 2_000,
    });
    await writeJson(path.join(olderRun, 'metadata.json'), {
      ...base,
      id: '2026-06-12-00-00-c-ship',
      createdAtEpochMs: 1_000,
    });
    await writeJson(path.join(newerRun, 'changed-files.json'), [
      { path: 'src/auth/callback.ts', status: 'M' },
    ]);
    await writeJson(path.join(olderRun, 'changed-files.json'), [
      { path: 'src/auth/callback.ts', status: 'M' },
    ]);

    const intent = await findFileIntentWithSearch(dir, 'src/auth/callback.ts');

    expect(intent.runs.map((run) => run.id)).toEqual([
      '2026-06-12-00-00-a-ship',
      '2026-06-12-00-00-c-ship',
    ]);
  });

  test('bounds file intent lookup newest-first and reports truncated search context', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    async function writeIntentRun(index: number) {
      const id = `2026-06-12-00-${String(index).padStart(2, '0')}-ship`;
      const runDirectory = path.join(dir, '.agentloop/runs', id);
      await mkdir(runDirectory, { recursive: true });
      await writeJson(path.join(runDirectory, 'metadata.json'), {
        id,
        command: 'ship',
        createdAt: `2026-06-12-00-${String(index).padStart(2, '0')}`,
        createdAtEpochMs: index,
        task: {
          path: `.agentloop/tasks/2026-06-12-task-${index}.md`,
          title: `Task ${index}`,
          status: 'done',
        },
        score: 90,
        changedFileCount: 1,
      });
      await writeJson(path.join(runDirectory, 'changed-files.json'), [
        { path: 'src/auth/callback.ts', status: 'M' },
      ]);
    }

    for (let index = 1; index <= 12; index += 1) {
      await writeIntentRun(index);
    }

    const intent = await findFileIntentWithSearch(dir, 'src/auth/callback.ts', {
      matchLimit: 3,
      scanLimit: 50,
    });

    expect(intent.file).toBe('src/auth/callback.ts');
    expect(intent.runs.map((run) => run.id)).toEqual([
      '2026-06-12-00-12-ship',
      '2026-06-12-00-11-ship',
      '2026-06-12-00-10-ship',
    ]);
    expect(intent.search).toEqual({
      totalRunCount: 12,
      inspectedRunCount: 3,
      scanLimit: 50,
      matchLimit: 3,
      truncated: true,
      stoppedAfterMatches: true,
    });
  });

  test('normalizes in-repo absolute intent paths and rejects outside paths', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir('agentloopkit-outside-intent-path-');
    tempDirs.push(dir, outsideDir);
    const runDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-ship');
    await mkdir(runDir, { recursive: true });
    await writeJson(path.join(runDir, 'metadata.json'), {
      id: '2026-06-12-00-00-ship',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: null,
      score: 95,
      changedFileCount: 1,
    });
    await writeJson(path.join(runDir, 'changed-files.json'), [
      { path: path.join(dir, 'src/auth/callback.ts'), status: 'M' },
    ]);

    await expect(findFileIntent(dir, path.join(dir, 'src/auth/callback.ts'))).resolves.toEqual([
      expect.objectContaining({
        file: 'src/auth/callback.ts',
      }),
    ]);
    await expect(findFileIntent(dir, path.join(outsideDir, 'secret.ts'))).rejects.toMatchObject({
      code: 'RUN_INTENT_FILE_INVALID',
    });
    await expect(findFileIntent(dir, '../secret.ts')).rejects.toMatchObject({
      code: 'RUN_INTENT_FILE_INVALID',
    });

    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({
        name: 'demo',
        type: 'typescript-package',
        packageManager: 'npm',
      }),
    );
    const invalidJson = await execa(tsxPath, [cliPath, 'intent', '../secret.ts', '--json'], {
      cwd: dir,
      reject: false,
    });
    expect(invalidJson.exitCode).toBe(1);
    expect(JSON.parse(invalidJson.stdout)).toEqual({
      error: expect.objectContaining({
        code: 'RUN_INTENT_FILE_INVALID',
      }),
    });
  });

  test('does not follow symlinked run metadata or artifacts', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir('agentloopkit-outside-run-artifacts-');
    tempDirs.push(dir, outsideDir);
    const metadataSymlinkRun = path.join(dir, '.agentloop/runs/2026-06-12-00-00-metadata');
    const changedFilesSymlinkRun = path.join(
      dir,
      '.agentloop/runs/2026-06-12-00-00-changed-files',
    );
    const diffstatSymlinkRun = path.join(dir, '.agentloop/runs/2026-06-12-00-00-diffstat');
    await mkdir(metadataSymlinkRun, { recursive: true });
    await mkdir(changedFilesSymlinkRun, { recursive: true });
    await mkdir(diffstatSymlinkRun, { recursive: true });

    await writeJson(path.join(outsideDir, 'metadata.json'), {
      id: '2026-06-12-00-00-metadata',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: null,
      score: 90,
      changedFileCount: 1,
    });
    await symlink(
      path.join(outsideDir, 'metadata.json'),
      path.join(metadataSymlinkRun, 'metadata.json'),
    );

    await writeJson(path.join(changedFilesSymlinkRun, 'metadata.json'), {
      id: '2026-06-12-00-00-changed-files',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 2_000,
      task: null,
      score: 91,
      changedFileCount: 1,
    });
    await writeJson(path.join(outsideDir, 'changed-files.json'), [
      { path: path.join(outsideDir, 'secret.ts'), status: 'M' },
    ]);
    await symlink(
      path.join(outsideDir, 'changed-files.json'),
      path.join(changedFilesSymlinkRun, 'changed-files.json'),
    );

    await writeJson(path.join(diffstatSymlinkRun, 'metadata.json'), {
      id: '2026-06-12-00-00-diffstat',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 3_000,
      task: null,
      score: 92,
      changedFileCount: 1,
    });
    await writeFile(path.join(outsideDir, 'diffstat.txt'), 'secret diffstat\n');
    await symlink(path.join(outsideDir, 'diffstat.txt'), path.join(diffstatSymlinkRun, 'diffstat.txt'));

    await expect(listRuns(dir, { hydrateTask: false })).resolves.not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '2026-06-12-00-00-metadata' })]),
    );
    await expect(readRun(dir, '2026-06-12-00-00-metadata')).rejects.toMatchObject({
      code: 'RUN_FILE_UNSAFE',
    });
    await expect(readRunChangedFiles(dir, '2026-06-12-00-00-changed-files')).rejects.toMatchObject({
      code: 'RUN_FILE_UNSAFE',
    });
    await expect(readRun(dir, '2026-06-12-00-00-diffstat')).rejects.toMatchObject({
      code: 'RUN_FILE_UNSAFE',
    });
  });

  test('rejects oversized run artifacts before reading them', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const metadataRunDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-metadata');
    const changedFilesRunDir = path.join(dir, '.agentloop/runs/2026-06-12-00-00-changed-files');
    await mkdir(metadataRunDir, { recursive: true });
    await mkdir(changedFilesRunDir, { recursive: true });

    await writeFile(
      path.join(metadataRunDir, 'metadata.json'),
      'x'.repeat(RUN_ARTIFACT_MAX_BYTES + 1),
    );
    await writeJson(path.join(changedFilesRunDir, 'metadata.json'), {
      id: '2026-06-12-00-00-changed-files',
      command: 'ship',
      createdAt: '2026-06-12-00-00',
      createdAtEpochMs: 1_000,
      task: null,
      score: 90,
      changedFileCount: 1,
    });
    await writeJson(path.join(changedFilesRunDir, 'changed-files.json'), [
      { path: `${'a'.repeat(RUN_ARTIFACT_MAX_BYTES)}.ts`, status: 'M' },
    ]);

    await expect(listRuns(dir, { hydrateTask: false })).resolves.not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '2026-06-12-00-00-metadata' })]),
    );
    await expect(readRun(dir, '2026-06-12-00-00-metadata')).rejects.toMatchObject({
      code: 'RUN_FILE_TOO_LARGE',
    });
    await expect(readRunChangedFiles(dir, '2026-06-12-00-00-changed-files')).rejects.toMatchObject({
      code: 'RUN_FILE_TOO_LARGE',
    });
  });
});
