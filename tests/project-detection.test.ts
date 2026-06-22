import path from 'node:path';
import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import {
  detectMonorepo,
  detectPackageScripts,
  detectProjectType,
} from '../src/core/project-detection.js';

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

  test('skips unreadable directories while detecting project type', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const unreadableDir = path.join(dir, '.Trash');
    await mkdir(path.join(dir, 'docs'));
    await mkdir(unreadableDir);
    await writeFile(path.join(dir, 'README.md'), '# Docs');
    await writeFile(path.join(dir, 'docs', 'guide.md'), '# Guide');
    await chmod(unreadableDir, 0o000);

    try {
      await expect(detectProjectType(dir)).resolves.toBe('docs-only');
    } finally {
      await chmod(unreadableDir, 0o700);
    }
  });

  test('does not use deeply nested files for metadata-free project type detection', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const deepDocsDir = path.join(dir, 'large-folder', 'nested', 'archive', 'docs');
    await mkdir(deepDocsDir, { recursive: true });
    await writeFile(path.join(deepDocsDir, 'guide.md'), '# Deep docs');

    await expect(detectProjectType(dir)).resolves.toBe('generic');
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

  test('detects workspace markers without changing project type', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      workspaces: ['apps/*', 'packages/*'],
      dependencies: { typescript: 'latest' },
    });
    await writeFile(path.join(dir, 'pnpm-workspace.yaml'), 'packages:\n  - apps/*\n');

    await expect(detectProjectType(dir)).resolves.toBe('typescript-package');
    await expect(detectMonorepo(dir)).resolves.toEqual({
      detected: true,
      markers: ['package.json workspaces', 'pnpm-workspace.yaml'],
    });
  });

  test('detects nested package manifests as monorepo markers', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, 'apps/web'), { recursive: true });
    await mkdir(path.join(dir, 'functions'), { recursive: true });
    await mkdir(path.join(dir, 'firestore-tests'), { recursive: true });
    await writeJson(path.join(dir, 'apps/web/package.json'), { name: 'web' });
    await writeJson(path.join(dir, 'functions/package.json'), { name: 'functions' });
    await writeJson(path.join(dir, 'firestore-tests/package.json'), {
      name: 'firestore-tests',
    });

    await expect(detectMonorepo(dir)).resolves.toEqual({
      detected: true,
      markers: [
        'nested package manifests: apps/web/package.json, functions/package.json, firestore-tests/package.json',
      ],
    });
  });

  test('caps nested package manifest marker examples', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    for (const name of ['admin', 'api', 'console', 'docs', 'site', 'web']) {
      await mkdir(path.join(dir, 'apps', name), { recursive: true });
      await writeJson(path.join(dir, 'apps', name, 'package.json'), { name });
    }

    await expect(detectMonorepo(dir)).resolves.toEqual({
      detected: true,
      markers: [
        'nested package manifests: apps/admin/package.json, apps/api/package.json, apps/console/package.json, apps/docs/package.json, apps/site/package.json (+1 more)',
      ],
    });
  });

  test('detects common monorepo tool config files', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'turbo.json'), '{}');
    await writeFile(path.join(dir, 'nx.json'), '{}');
    await writeFile(path.join(dir, 'lerna.json'), '{}');
    await writeFile(path.join(dir, 'rush.json'), '{}');

    await expect(detectMonorepo(dir)).resolves.toEqual({
      detected: true,
      markers: ['turbo.json', 'nx.json', 'lerna.json', 'rush.json'],
    });
  });
});
