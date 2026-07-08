import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { dirtyCoveredByLatestHandoffRun } from '../src/core/handoff-coverage.js';
import { getGitStatus, parseGitStatus } from '../src/core/git.js';
import { listRuns, writeHandoffRun } from '../src/core/runs.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createHandoffCoverageFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);

  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  await mkdir(path.join(dir, 'src'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await writeFile(path.join(dir, 'src/x.ts'), 'export const x = 1;\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-q', '-m', 'add src/x.ts']);

  const handoffPath = path.join(dir, '.agentloop/handoffs/2026-06-11-12-20-pr-summary.md');
  await writeFile(handoffPath, '# PR Summary\n\nVerification status: Overall status: pass\n');

  return { dir, handoffPath };
}

describe('dirtyCoveredByLatestHandoffRun', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('handoff coverage drops when a covered file changes content after the handoff run', async () => {
    const { dir: cwd, handoffPath } = await createHandoffCoverageFixture();

    // Dirty the file, then record a review-evidence (handoff) run whose
    // changed-files entry for src/x.ts carries a real content hash of the
    // current (dirty) content.
    await writeFile(path.join(cwd, 'src/x.ts'), 'export const x = 2;\n');
    await writeHandoffRun({
      cwd,
      timestamp: '2026-06-11-12-20',
      task: null,
      handoffPath,
      changedFiles: [{ status: 'M', path: 'src/x.ts' }],
      diffStat: 'src/x.ts | 2 +-\n',
      markdown: '# PR Summary\n\nVerification status: Overall status: pass\n',
    });

    const latestRun = (await listRuns(cwd))[0];
    expect(latestRun?.command).toBe('handoff');

    const changedFiles = await parseGitStatus(await getGitStatus(cwd));
    expect(
      await dirtyCoveredByLatestHandoffRun(cwd, changedFiles, latestRun, undefined, handoffPath),
    ).toBe(true);

    await writeFile(path.join(cwd, 'src/x.ts'), '// edited after the handoff run\n');
    const changedAfter = await parseGitStatus(await getGitStatus(cwd));
    expect(
      await dirtyCoveredByLatestHandoffRun(cwd, changedAfter, latestRun, undefined, handoffPath),
    ).toBe(false);
  });

  test('legacy run changed-files without a hash keep path-presence handoff coverage', async () => {
    const { dir: cwd, handoffPath } = await createHandoffCoverageFixture();

    await writeFile(path.join(cwd, 'src/x.ts'), 'export const x = 2;\n');

    // Simulate a run recorded before content hashing existed: changed-files.json
    // entries with no `hash` field at all.
    const runId = '2026-06-11-12-20-handoff';
    const runDir = path.join(cwd, '.agentloop/runs', runId);
    await mkdir(runDir, { recursive: true });
    await writeJson(path.join(runDir, 'metadata.json'), {
      id: runId,
      command: 'handoff',
      createdAt: '2026-06-11-12-20',
      createdAtEpochMs: Date.parse('2026-06-11T12:20:00Z'),
      task: null,
      handoffPath: '.agentloop/handoffs/2026-06-11-12-20-pr-summary.md',
      changedFileCount: 1,
    });
    await writeJson(path.join(runDir, 'changed-files.json'), [{ status: 'M', path: 'src/x.ts' }]);

    const latestRun = (await listRuns(cwd))[0];
    expect(latestRun?.command).toBe('handoff');

    const changedFiles = await parseGitStatus(await getGitStatus(cwd));
    expect(
      await dirtyCoveredByLatestHandoffRun(cwd, changedFiles, latestRun, undefined, handoffPath),
    ).toBe(true);

    // Editing the file further still keeps path-presence coverage — there is
    // no recorded hash to check against.
    await writeFile(path.join(cwd, 'src/x.ts'), '// edited after the legacy run\n');
    const changedAfter = await parseGitStatus(await getGitStatus(cwd));
    expect(
      await dirtyCoveredByLatestHandoffRun(cwd, changedAfter, latestRun, undefined, handoffPath),
    ).toBe(true);
  });
});
