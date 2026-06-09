import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import { detectPackageScripts, detectProjectType } from '../src/core/project-detection.js';

let tempDirs: string[] = [];

describe('project detection', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('detects Next.js from dependencies', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      dependencies: { next: 'latest', react: 'latest' },
    });

    await expect(detectProjectType(dir)).resolves.toBe('nextjs');
  });

  test('detects docs-only repositories', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, 'docs'));
    await writeFile(path.join(dir, 'README.md'), '# Docs');
    await writeFile(path.join(dir, 'docs', 'guide.md'), '# Guide');

    await expect(detectProjectType(dir)).resolves.toBe('docs-only');
  });

  test('detects package scripts and prefixes them with package manager', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      scripts: { test: 'vitest', lint: 'eslint .', typecheck: 'tsc --noEmit', build: 'tsup' },
    });

    await expect(detectPackageScripts(dir, 'pnpm')).resolves.toEqual({
      test: 'pnpm run test',
      lint: 'pnpm run lint',
      typecheck: 'pnpm run typecheck',
      build: 'pnpm run build',
      format: '',
    });
  });
});
