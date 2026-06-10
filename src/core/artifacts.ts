import path from 'node:path';
import { readdir, stat } from 'node:fs/promises';
import { pathExists } from './file-system.js';

export const verificationReportPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-verification-report\.md$/;
export const prSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-pr-summary\.md$/;
export const ciSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-ci-summary\.md$/;
export const generatedMarkdownPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-.+\.md$/;

export async function latestMarkdownFile(dir: string, options: { pattern?: RegExp } = {}) {
  if (!(await pathExists(dir))) return undefined;
  const entries = await Promise.all(
    (
      await readdir(dir, { withFileTypes: true })
    )
      .filter(
        (entry) =>
          entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md',
      )
      .filter((entry) => !options.pattern || options.pattern.test(entry.name))
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
