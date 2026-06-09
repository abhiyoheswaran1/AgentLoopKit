import path from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import { pathExists } from './file-system.js';

export type MarkdownLinkIssue = {
  filePath: string;
  linkText: string;
  target: string;
  resolvedPath: string;
  reason: 'missing target' | 'outside root';
};

export type MarkdownLinkCheckResult = {
  ok: boolean;
  files: string[];
  issues: MarkdownLinkIssue[];
};

const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.turbo',
  '.vercel',
  'coverage',
  'dist',
  'node_modules',
]);

const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx']);
const LINK_PATTERN = /!?\[([^\]\n]+)\]\(([^)\n]+)\)/g;

export async function findMarkdownFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          await walk(entryPath);
        }
        continue;
      }

      if (entry.isFile() && MARKDOWN_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        files.push(entryPath);
      }
    }
  }

  await walk(rootDir);
  return files.sort();
}

export async function checkMarkdownLinks(options: {
  rootDir: string;
  files?: string[];
}): Promise<MarkdownLinkCheckResult> {
  const rootDir = path.resolve(options.rootDir);
  const files = options.files ?? (await findMarkdownFiles(rootDir));
  const issues: MarkdownLinkIssue[] = [];

  for (const filePath of files) {
    const content = stripFencedCodeBlocks(await readFile(filePath, 'utf8'));
    for (const link of extractLinks(content)) {
      if (shouldIgnoreTarget(link.target)) continue;

      const targetPath = resolveTargetPath(filePath, link.target);
      const relativeFromRoot = path.relative(rootDir, targetPath);
      if (relativeFromRoot.startsWith('..') || path.isAbsolute(relativeFromRoot)) {
        issues.push({
          filePath,
          linkText: link.text,
          target: link.target,
          resolvedPath: targetPath,
          reason: 'outside root',
        });
        continue;
      }

      if (!(await targetExists(targetPath))) {
        issues.push({
          filePath,
          linkText: link.text,
          target: link.target,
          resolvedPath: targetPath,
          reason: 'missing target',
        });
      }
    }
  }

  return { ok: issues.length === 0, files, issues };
}

function stripFencedCodeBlocks(content: string): string {
  const lines = content.split('\n');
  let inFence = false;
  const output: string[] = [];

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      output.push('');
      continue;
    }
    output.push(inFence ? '' : line);
  }

  return output.join('\n');
}

function extractLinks(content: string): Array<{ text: string; target: string }> {
  const links: Array<{ text: string; target: string }> = [];
  for (const match of content.matchAll(LINK_PATTERN)) {
    const text = match[1].trim();
    const target = normalizeTarget(match[2]);
    if (target) links.push({ text, target });
  }
  return links;
}

function normalizeTarget(rawTarget: string): string {
  const withoutTitle = rawTarget.trim().split(/\s+/)[0] ?? '';
  const withoutAngleBrackets =
    withoutTitle.startsWith('<') && withoutTitle.endsWith('>')
      ? withoutTitle.slice(1, -1)
      : withoutTitle;
  return withoutAngleBrackets.trim();
}

function shouldIgnoreTarget(target: string): boolean {
  return target.startsWith('#') || target.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(target);
}

function resolveTargetPath(filePath: string, target: string): string {
  const withoutAnchor = target.split('#')[0] ?? target;
  const withoutQuery = withoutAnchor.split('?')[0] ?? withoutAnchor;
  return path.resolve(path.dirname(filePath), decodeTargetPath(withoutQuery));
}

function decodeTargetPath(targetPath: string): string {
  try {
    return decodeURIComponent(targetPath);
  } catch {
    return targetPath;
  }
}

async function targetExists(targetPath: string): Promise<boolean> {
  if (!(await pathExists(targetPath))) return false;
  const targetStats = await stat(targetPath);
  return targetStats.isFile() || targetStats.isDirectory();
}
