import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readdir, readFile, symlink, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

type TreeSnapshotEntry = {
  path: string;
  type: 'dir' | 'file' | 'symlink';
  content?: string;
};

async function writeConfig(dir: string) {
  await writeJson(
    path.join(dir, 'agentloop.config.json'),
    createDefaultConfig({ name: 'demo', type: 'typescript-package', packageManager: 'pnpm' }),
  );
}

async function writeEvidenceFile(
  dir: string,
  relativePath: string,
  content: string,
  modifiedAt: string,
) {
  const filePath = path.join(dir, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  const timestamp = new Date(modifiedAt);
  await utimes(filePath, timestamp, timestamp);
}

async function createRepoWithArtifacts() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeConfig(dir);
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/2026-06-10-old-task.md',
    '# Old task\n\n- Status: proposed\n',
    '2026-06-10T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/2026-06-11-new-task.md',
    '# New task\n\n- Status: in-progress\n',
    '2026-06-11T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/README.md',
    '# Tasks\n',
    '2026-06-11T10:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-09-00-verification-report.md',
    '# Old Verification\n\nOverall status: fail\n',
    '2026-06-10T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-00-verification-report.md',
    '# Latest Verification\n\nOverall status: pass\n',
    '2026-06-10T10:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
    '# Latest Handoff\n',
    '2026-06-10T10:05:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-10-agentloop-report.html',
    '<!doctype html><title>AgentLoopKit Report</title>',
    '2026-06-10T10:10:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/agentloop-verification.svg',
    '<svg role="img"></svg>',
    '2026-06-10T10:15:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-20-ci-summary.md',
    '# AgentLoopKit CI Summary\n',
    '2026-06-10T10:20:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-10-10-25-release-notes.md',
    '# Release Notes\n',
    '2026-06-10T10:25:00.000Z',
  );
  await writeFile(path.join(dir, '.env'), 'AGENTLOOP_SECRET=do-not-print-this-fixture\n');
  return dir;
}

async function snapshotTree(root: string): Promise<TreeSnapshotEntry[]> {
  if (!existsSync(root)) return [];
  const entries: TreeSnapshotEntry[] = [];

  async function walk(current: string) {
    const dirents = await readdir(current, { withFileTypes: true });
    for (const dirent of dirents) {
      const absolutePath = path.join(current, dirent.name);
      const relativePath = path.relative(root, absolutePath).split(path.sep).join('/');
      if (dirent.isDirectory()) {
        entries.push({ path: relativePath, type: 'dir' });
        await walk(absolutePath);
      } else if (dirent.isFile()) {
        entries.push({
          path: relativePath,
          type: 'file',
          content: await readFile(absolutePath, 'utf8'),
        });
      } else if (dirent.isSymbolicLink()) {
        entries.push({ path: relativePath, type: 'symlink' });
      }
    }
  }

  await walk(root);
  return entries.sort((left, right) => left.path.localeCompare(right.path));
}

describe('artifacts command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints stable JSON counts and repo-relative latest artifact paths', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      tasks: {
        count: 2,
        byStatus: {
          'in-progress': 1,
          proposed: 1,
        },
        latest: {
          path: '.agentloop/tasks/2026-06-11-new-task.md',
          title: 'New task',
          status: 'in-progress',
        },
      },
      verificationReports: {
        count: 2,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-00-verification-report.md',
          title: 'Latest Verification',
          overallStatus: 'pass',
        },
      },
      handoffs: {
        count: 1,
        latest: {
          path: '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
          title: 'Latest Handoff',
        },
      },
      htmlReports: {
        count: 1,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-10-agentloop-report.html',
        },
      },
      badges: {
        count: 1,
        latest: {
          path: '.agentloop/reports/agentloop-verification.svg',
        },
      },
      ciSummaries: {
        count: 1,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-20-ci-summary.md',
          title: 'AgentLoopKit CI Summary',
        },
      },
      releaseNotes: {
        count: 1,
        latest: {
          path: '.agentloop/handoffs/2026-06-10-10-25-release-notes.md',
          title: 'Release Notes',
        },
      },
    });
  });

  test('prints a concise markdown evidence inventory', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('# AgentLoopKit Artifacts');
    expect(result.stdout).toContain('- Tasks: 2 total (in-progress: 1, proposed: 1)');
    expect(result.stdout).toContain(
      '- Latest task: New task (in-progress) - .agentloop/tasks/2026-06-11-new-task.md',
    );
    expect(result.stdout).toContain('- Verification reports: 2');
    expect(result.stdout).toContain(
      '- Latest verification: pass - .agentloop/reports/2026-06-10-10-00-verification-report.md',
    );
    expect(result.stdout).toContain(
      '- Latest handoff: Latest Handoff - .agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
    );
    expect(result.stdout).toContain(
      '- Latest HTML report: .agentloop/reports/2026-06-10-10-10-agentloop-report.html',
    );
    expect(result.stdout).toContain(
      '- Latest badge: .agentloop/reports/agentloop-verification.svg',
    );
    expect(result.stdout).toContain(
      '- Latest CI summary: AgentLoopKit CI Summary - .agentloop/reports/2026-06-10-10-20-ci-summary.md',
    );
    expect(result.stdout).toContain(
      '- Latest release notes: Release Notes - .agentloop/handoffs/2026-06-10-10-25-release-notes.md',
    );
    expect(result.stdout).not.toContain('do-not-print-this-fixture');
  });

  test('returns zero counts when AgentLoop artifact directories are missing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      tasks: { count: 0, byStatus: {}, latest: null },
      verificationReports: { count: 0, latest: null },
      handoffs: { count: 0, latest: null },
      htmlReports: { count: 0, latest: null },
      badges: { count: 0, latest: null },
      ciSummaries: { count: 0, latest: null },
      releaseNotes: { count: 0, latest: null },
    });
    expect(existsSync(path.join(dir, '.agentloop'))).toBe(false);
  });

  test('does not create, delete, or mutate artifact files', async () => {
    const dir = await createRepoWithArtifacts();
    const before = await snapshotTree(path.join(dir, '.agentloop'));

    const textResult = await execa(tsxPath, [cliPath, 'artifacts'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(textResult.exitCode).toBe(0);
    expect(jsonResult.exitCode).toBe(0);
    expect(await snapshotTree(path.join(dir, '.agentloop'))).toEqual(before);
  });

  test('does not inspect artifact roots that resolve outside the repository', async () => {
    const dir = await makeTempDir();
    const outsideReports = await makeTempDir();
    tempDirs.push(dir, outsideReports);
    await writeConfig(dir);
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await writeEvidenceFile(
      outsideReports,
      '2026-06-10-10-00-verification-report.md',
      '# Outside Verification\n\nOverall status: pass\n\noutside-secret-content\n',
      '2026-06-10T10:00:00.000Z',
    );
    await symlink(outsideReports, path.join(dir, '.agentloop/reports'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('outside-secret-content');
    expect(JSON.parse(result.stdout)).toMatchObject({
      verificationReports: { count: 0, latest: null },
      htmlReports: { count: 0, latest: null },
      badges: { count: 0, latest: null },
      ciSummaries: { count: 0, latest: null },
    });
  });

  test('prints invalid config errors as JSON without writing artifacts', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'CONFIG_ERROR',
        message: expect.stringContaining('Invalid AgentLoopKit config'),
      },
    });
    expect(existsSync(path.join(dir, '.agentloop'))).toBe(false);
  });
});
