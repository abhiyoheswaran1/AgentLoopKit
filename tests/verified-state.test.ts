import path from 'node:path';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { computeFileContentHash, computeVerifiedStateFingerprint } from '../src/core/verified-state.js';

const dirs: string[] = [];
async function gitRepo() {
  const dir = await mkdtemp(path.join(tmpdir(), 'vsf-'));
  dirs.push(dir);
  await execa('git', ['init', '-q'], { cwd: dir });
  await execa('git', ['config', 'user.email', 'a@b.c'], { cwd: dir });
  await execa('git', ['config', 'user.name', 'Test'], { cwd: dir });
  await writeFile(path.join(dir, 'a.ts'), 'export const a = 1;\n');
  await execa('git', ['add', '.'], { cwd: dir });
  await execa('git', ['commit', '-q', '-m', 'init'], { cwd: dir });
  return dir;
}
afterEach(async () => { await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true }))); });

describe('computeVerifiedStateFingerprint', () => {
  test('is a deterministic 64-hex hash, stable across repeated calls', async () => {
    const dir = await gitRepo();
    const a = await computeVerifiedStateFingerprint({ cwd: dir });
    const b = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).toBe(b);
  });
  test('changes when a tracked file content changes', async () => {
    const dir = await gitRepo();
    const before = await computeVerifiedStateFingerprint({ cwd: dir });
    await writeFile(path.join(dir, 'a.ts'), 'export const a = 2;\n');
    const after = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(after).not.toBe(before);
  });
  test('changes when an untracked file is added (path-level)', async () => {
    const dir = await gitRepo();
    const before = await computeVerifiedStateFingerprint({ cwd: dir });
    await writeFile(path.join(dir, 'new.ts'), 'export const n = 1;\n');
    const after = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(after).not.toBe(before);
  });
  test('does not throw outside a git repo and returns a stable hash', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'vsf-nogit-'));
    dirs.push(dir);
    const a = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).toBe(await computeVerifiedStateFingerprint({ cwd: dir }));
  });
});

describe('computeFileContentHash', () => {
  test('returns a stable git blob hash for a tracked file', async () => {
    const dir = await gitRepo();
    const h1 = await computeFileContentHash({ cwd: dir, filePath: 'a.ts' });
    const h2 = await computeFileContentHash({ cwd: dir, filePath: 'a.ts' });
    expect(h1).toMatch(/^[a-f0-9]{40}$/);
    expect(h1).toBe(h2);
  });
  test('changes when content changes', async () => {
    const dir = await gitRepo();
    const before = await computeFileContentHash({ cwd: dir, filePath: 'a.ts' });
    await writeFile(path.join(dir, 'a.ts'), 'export const a = 99;\n');
    expect(await computeFileContentHash({ cwd: dir, filePath: 'a.ts' })).not.toBe(before);
  });
  test('returns undefined for a missing file, no throw', async () => {
    const dir = await gitRepo();
    expect(await computeFileContentHash({ cwd: dir, filePath: 'nope.ts' })).toBeUndefined();
  });
});
