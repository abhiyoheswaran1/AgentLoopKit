import path from 'node:path';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import {
  commandExists,
  getGitBranch,
  getGitCommit,
  getGitDiffStat,
  getGitRoot,
  getGitStatus,
  isInsideGitRepo,
} from '../src/core/git.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];
const originalPath = process.env.PATH;

function withoutPath<T>(callback: () => Promise<T>) {
  return async () => {
    const emptyPath = await makeTempDir('agentloopkit-empty-path-');
    tempDirs.push(emptyPath);
    process.env.PATH = emptyPath;
    try {
      return await callback();
    } finally {
      process.env.PATH = originalPath;
    }
  };
}

describe('git helpers', () => {
  afterEach(async () => {
    process.env.PATH = originalPath;
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test(
    'degrade safely when git is missing from PATH',
    withoutPath(async () => {
      const dir = await makeTempDir();
      tempDirs.push(dir);

      await expect(commandExists('git')).resolves.toBe(false);
      await expect(isInsideGitRepo(dir)).resolves.toBe(false);
      await expect(getGitBranch(dir)).resolves.toBe('');
      await expect(getGitCommit(dir)).resolves.toBe('');
      await expect(getGitRoot(dir)).resolves.toBe('');
      await expect(getGitStatus(dir)).resolves.toBe('');
      await expect(getGitDiffStat(dir)).resolves.toBe('');
    }),
  );

  test('detects a git repository when git is available', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await import('execa').then(({ execa }) => execa('git', ['init', '-q'], { cwd: dir }));

    await expect(isInsideGitRepo(path.resolve(dir))).resolves.toBe(true);
    await expect(getGitRoot(path.resolve(dir))).resolves.toBe(await realpath(dir));
  });

  test('reports nested untracked files instead of directory shorthand', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const { execa } = await import('execa');
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(path.join(dir, 'README.md'), '# Fixture\n');
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', 'init'],
      { cwd: dir },
    );

    await mkdir(path.join(dir, 'src/features'), { recursive: true });
    await writeFile(path.join(dir, 'src/features/alpha.ts'), 'export const alpha = true;\n');
    await writeFile(path.join(dir, 'src/features/beta.ts'), 'export const beta = true;\n');

    const status = await getGitStatus(dir);

    expect(status).toContain('?? src/features/alpha.ts');
    expect(status).toContain('?? src/features/beta.ts');
  });
});
