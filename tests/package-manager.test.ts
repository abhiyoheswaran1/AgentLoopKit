import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import { detectPackageManager, packageManagerRunCommand } from '../src/core/package-manager.js';

let tempDirs: string[] = [];

describe('package manager detection', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('detects pnpm from lockfile', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9');

    await expect(detectPackageManager(dir)).resolves.toBe('pnpm');
  });

  test('uses packageManager field before npm fallback', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), { packageManager: 'bun@1.2.0' });

    await expect(detectPackageManager(dir)).resolves.toBe('bun');
  });

  test('builds script run commands for managers', () => {
    expect(packageManagerRunCommand('pnpm', 'test')).toBe('pnpm run test');
    expect(packageManagerRunCommand('npm', 'test')).toBe('npm run test');
    expect(packageManagerRunCommand('yarn', 'test')).toBe('yarn run test');
    expect(packageManagerRunCommand('bun', 'test')).toBe('bun run test');
  });
});
