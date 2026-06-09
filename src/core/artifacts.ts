import path from 'node:path';
import { readdir, stat } from 'node:fs/promises';
import { pathExists } from './file-system.js';

export async function latestMarkdownFile(dir: string) {
  if (!(await pathExists(dir))) return undefined;
  const entries = await Promise.all(
    (
      await readdir(dir, { withFileTypes: true })
    )
      .filter(
        (entry) =>
          entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md',
      )
      .map(async (entry) => {
        const filePath = path.join(dir, entry.name);
        const fileStat = await stat(filePath);
        return { filePath, name: entry.name, mtimeMs: fileStat.mtimeMs };
      }),
  );
  entries.sort((left, right) => {
    if (left.mtimeMs !== right.mtimeMs) return left.mtimeMs - right.mtimeMs;
    return left.name.localeCompare(right.name);
  });
  return entries.at(-1)?.filePath;
}
