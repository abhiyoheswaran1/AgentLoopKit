import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { checkMarkdownLinks, findMarkdownFiles } from '../src/core/markdown-links.js';

let tempDirs: string[] = [];

describe('markdown link checking', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('reports missing local markdown links', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'README.md'), '[Missing](docs/missing.md)\n');

    const result = await checkMarkdownLinks({ rootDir: dir });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        filePath: path.join(dir, 'README.md'),
        linkText: 'Missing',
        target: 'docs/missing.md',
        reason: 'missing target',
      }),
    ]);
  });

  test('accepts existing local links with anchors and ignores external links', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await writeFile(path.join(dir, 'docs', 'guide.md'), '# Guide\n');
    await writeFile(
      path.join(dir, 'README.md'),
      [
        '[Guide](docs/guide.md#setup)',
        '[Section](#local-section)',
        '[External](https://example.com)',
        '[Mail](mailto:hello@example.com)',
      ].join('\n'),
    );

    const result = await checkMarkdownLinks({ rootDir: dir });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  test('ignores markdown-looking links in fenced code blocks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(
      path.join(dir, 'README.md'),
      ['```md', '[Missing](docs/missing.md)', '```'].join('\n'),
    );

    const result = await checkMarkdownLinks({ rootDir: dir });

    expect(result.ok).toBe(true);
  });

  test('finds markdown files while ignoring dependency and git directories', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, 'node_modules', 'pkg'), { recursive: true });
    await mkdir(path.join(dir, '.git'), { recursive: true });
    await writeFile(path.join(dir, 'README.md'), '# Root\n');
    await writeFile(path.join(dir, 'node_modules', 'pkg', 'README.md'), '# Package\n');
    await writeFile(path.join(dir, '.git', 'ignored.md'), '# Git\n');

    const files = await findMarkdownFiles(dir);

    expect(files).toEqual([path.join(dir, 'README.md')]);
  });
});
