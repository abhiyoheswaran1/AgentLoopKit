import path from 'node:path';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import {
  commandExists,
  dequoteGitPath,
  getGitBranch,
  getGitCommit,
  getGitDiffStat,
  getGitRoot,
  getGitStatus,
  isInsideGitRepo,
  listTrackedPaths,
  parseGitStatus,
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

  test('disables git path quoting so status output stays unquoted', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const { execa } = await import('execa');
    await execa('git', ['init', '-q'], { cwd: dir });

    // core.quotePath defaults to true in git; if getGitStatus omitted the
    // override, a non-ASCII filename would come back C-quoted (e.g.
    // "caf\303\251.txt") instead of the literal unicode path.
    await writeFile(path.join(dir, 'café.txt'), 'unicode fixture\n');

    const status = await getGitStatus(dir);

    expect(status).toContain('café.txt');
    expect(status).not.toContain('\\303\\251');
  });

  test('parseGitStatus resolves the unquoted unicode path to a real GitFileStatus', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const { execa } = await import('execa');
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(path.join(dir, 'café.txt'), 'unicode fixture\n');

    const changedFiles = await parseGitStatus(await getGitStatus(dir));

    expect(changedFiles).toContainEqual({ status: '??', path: 'café.txt' });
  });

  test('parseGitStatus resolves a rename-with-spaces to the real unquoted path', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const { execa } = await import('execa');
    await execa('git', ['init', '-q'], { cwd: dir });
    await writeFile(path.join(dir, 'normal.txt'), 'fixture\n');
    await execa('git', ['add', '.'], { cwd: dir });
    await execa(
      'git',
      ['-c', 'user.email=test@example.com', '-c', 'user.name=Test User', 'commit', '-m', 'init'],
      { cwd: dir },
    );

    // git still wraps the destination of a rename in double quotes to
    // disambiguate it from the " -> " arrow when the filename contains a
    // space, even with core.quotePath=false.
    await execa('git', ['mv', 'normal.txt', 'renamed with spaces.txt'], { cwd: dir });

    const rawStatus = await getGitStatus(dir);
    expect(rawStatus).toContain('"renamed with spaces.txt"');

    const changedFiles = await parseGitStatus(rawStatus);

    expect(changedFiles).toContainEqual({ status: 'R', path: 'renamed with spaces.txt' });
  });

  test('listTrackedPaths returns only git-tracked matches', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const { execa } = await import('execa');
    await execa('git', ['init', '-q'], { cwd: dir });
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/state.json'), '{}\n');
    await writeFile(path.join(dir, '.agentloop/untracked.txt'), 'x\n');
    await execa('git', ['add', '.agentloop/state.json'], { cwd: dir });

    const tracked = await listTrackedPaths(dir, ['.agentloop/state.json', '.agentloop/runs/']);
    expect(tracked).toEqual(['.agentloop/state.json']);

    const none = await listTrackedPaths(dir, ['.agentloop/runs/']);
    expect(none).toEqual([]);
  });

  test('listTrackedPaths returns [] outside a git repo', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    expect(await listTrackedPaths(dir, ['.agentloop/state.json'])).toEqual([]);
  });
});

describe('parseGitStatus', () => {
  test('parses ordinary modified/added/untracked lines unchanged', async () => {
    const status = [' M modified.ts', 'A  added.ts', '?? untracked.ts'].join('\n');

    await expect(parseGitStatus(status)).resolves.toEqual([
      { status: 'M', path: 'modified.ts' },
      { status: 'A', path: 'added.ts' },
      { status: '??', path: 'untracked.ts' },
    ]);
  });

  test('resolves a rename line to the new path, not the literal "old -> new" string', async () => {
    const status = 'R  old.ts -> new.ts';

    await expect(parseGitStatus(status)).resolves.toEqual([{ status: 'R', path: 'new.ts' }]);
  });

  test('resolves a copy line to the new path', async () => {
    const status = 'C  original.ts -> copy.ts';

    await expect(parseGitStatus(status)).resolves.toEqual([{ status: 'C', path: 'copy.ts' }]);
  });

  test('resolves a rename with nested directories on both sides', async () => {
    const status = 'R  src/old/dir/file.ts -> src/new/dir/file.ts';

    await expect(parseGitStatus(status)).resolves.toEqual([
      { status: 'R', path: 'src/new/dir/file.ts' },
    ]);
  });

  test('strips git quoting from a rename destination that contains a space', async () => {
    const status = 'R  old.txt -> "renamed with spaces.txt"';

    await expect(parseGitStatus(status)).resolves.toEqual([
      { status: 'R', path: 'renamed with spaces.txt' },
    ]);
  });

  test('does not split on an arrow embedded inside a quoted old name', async () => {
    const status = 'R  "old -> weird.txt" -> "renamed with spaces.txt"';

    await expect(parseGitStatus(status)).resolves.toEqual([
      { status: 'R', path: 'renamed with spaces.txt' },
    ]);
  });

  test('parses ordinary M/A/?? lines unaffected by quoting logic', async () => {
    const status = [' M src/x.ts', 'A  added file.ts', '?? untracked.ts'].join('\n');

    await expect(parseGitStatus(status)).resolves.toEqual([
      { status: 'M', path: 'src/x.ts' },
      { status: 'A', path: 'added file.ts' },
      { status: '??', path: 'untracked.ts' },
    ]);
  });
});

describe('dequoteGitPath', () => {
  test('leaves an unquoted path untouched', () => {
    expect(dequoteGitPath('src/x.ts')).toBe('src/x.ts');
  });

  test('strips surrounding quotes from a quoted-for-space path', () => {
    expect(dequoteGitPath('"renamed with spaces.txt"')).toBe('renamed with spaces.txt');
  });

  test('unescapes a C-quoted octal-escaped unicode path', () => {
    expect(dequoteGitPath('"caf\\303\\251.txt"')).toBe('café.txt');
  });

  test('unescapes embedded quote and backslash escapes', () => {
    expect(dequoteGitPath('"quote\\".txt"')).toBe('quote".txt');
    expect(dequoteGitPath('"back\\\\slash.txt"')).toBe('back\\slash.txt');
  });
});
