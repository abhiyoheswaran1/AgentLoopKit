import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function pathExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readTextIfExists(filePath: string) {
  if (!(await pathExists(filePath))) return '';
  return readFile(filePath, 'utf8');
}

export async function writeFileIfMissing(filePath: string, content: string) {
  if (await pathExists(filePath)) return false;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  return true;
}

export async function writeTextFile(filePath: string, content: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

export async function listFilesRecursive(root: string, options: { ignore?: string[] } = {}) {
  const ignore = new Set(
    options.ignore ?? ['.git', '.agentloop', 'node_modules', 'dist', 'coverage'],
  );
  const files: string[] = [];

  async function walk(current: string) {
    if (!(await pathExists(current))) return;
    const entries = await readdir(current, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (ignore.has(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (entry.isFile()) {
        files.push(absolute);
      }
    }
  }

  const rootStat = await stat(root).catch(() => undefined);
  if (!rootStat?.isDirectory()) return [];
  await walk(root);
  return files;
}
