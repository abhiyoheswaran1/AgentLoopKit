import { existsSync, realpathSync } from 'node:fs';
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

export function isInsidePath(parent: string, child: string) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function normalizeExistingAncestor(filePath: string) {
  let current = filePath;
  const missingSegments: string[] = [];

  while (!existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) break;
    missingSegments.unshift(path.basename(current));
    current = parent;
  }

  try {
    return path.join(realpathSync.native(current), ...missingSegments);
  } catch {
    return filePath;
  }
}

export async function listFilesRecursive(
  root: string,
  options: { ignore?: string[]; maxDepth?: number; maxEntries?: number } = {},
) {
  const ignore = new Set(
    options.ignore ?? ['.git', '.agentloop', 'node_modules', 'dist', 'coverage'],
  );
  const files: string[] = [];
  let inspectedEntries = 0;

  async function walk(current: string, depth: number) {
    if (!(await pathExists(current))) return;
    if (options.maxEntries !== undefined && inspectedEntries >= options.maxEntries) return;
    const entries = await readdir(current, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (options.maxEntries !== undefined && inspectedEntries >= options.maxEntries) break;
      inspectedEntries += 1;
      if (ignore.has(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (options.maxDepth === undefined || depth < options.maxDepth) {
          await walk(absolute, depth + 1);
        }
      } else if (entry.isFile()) {
        files.push(absolute);
      }
    }
  }

  const rootStat = await stat(root).catch(() => undefined);
  if (!rootStat?.isDirectory()) return [];
  await walk(root, 0);
  return files;
}
