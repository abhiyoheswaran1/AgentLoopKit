import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export async function makeTempDir(prefix = 'agentloopkit-') {
  return mkdtemp(path.join(tmpdir(), prefix));
}

export async function removeTempDir(dir: string) {
  await rm(dir, { recursive: true, force: true });
}

export async function writeJson(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(value, null, 2));
}
