import { execa } from 'execa';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';

export type GitFileStatus = {
  status: string;
  path: string;
};

export async function commandExists(command: string) {
  const result = await execa(command, ['--version'], { reject: false });
  return result.exitCode === 0;
}

export async function isInsideGitRepo(cwd: string) {
  const result = await execa('git', ['rev-parse', '--is-inside-work-tree'], { cwd, reject: false });
  return result.exitCode === 0 && result.stdout.trim() === 'true';
}

export async function getGitBranch(cwd: string) {
  const result = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout.trim() : '';
}

export async function getGitCommit(cwd: string) {
  const result = await execa('git', ['rev-parse', '--short', 'HEAD'], { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout.trim() : '';
}

export async function getGitRoot(cwd: string) {
  const result = await execa('git', ['rev-parse', '--show-toplevel'], { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout.trim() : '';
}

export async function getGitAbsoluteDir(cwd: string) {
  const result = await execa('git', ['rev-parse', '--absolute-git-dir'], {
    cwd,
    reject: false,
  });
  return result.exitCode === 0 ? result.stdout.trim() : '';
}

export async function getGitStatus(cwd: string) {
  const result = await execa(
    'git',
    ['-c', 'core.quotePath=false', 'status', '--short', '--untracked-files=all'],
    {
      cwd,
      reject: false,
    },
  );
  return result.exitCode === 0 ? result.stdout : '';
}

export async function listTrackedPaths(cwd: string, pathspecs: string[]): Promise<string[]> {
  if (pathspecs.length === 0) return [];
  const result = await execa('git', ['ls-files', '-z', '--', ...pathspecs], {
    cwd,
    reject: false,
  });
  if (result.exitCode !== 0) return [];
  return result.stdout.split('\0').filter((entry) => entry.length > 0);
}

export async function getGitDiffStat(cwd: string) {
  const result = await execa('git', ['diff', '--stat'], { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout : '';
}

function sanitizeDiffStatPath(filePath: string) {
  return filePath.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

export function appendUntrackedFilesToDiffStat(diffStat: string, changedFiles: GitFileStatus[]) {
  const untrackedLines = changedFiles
    .filter((file) => file.status === '??' && !isAgentLoopEvidenceFile(file.path))
    .map((file) => `${sanitizeDiffStatPath(file.path)} | untracked`);
  if (!untrackedLines.length) return diffStat;

  const cleanDiffStat = diffStat.trimEnd();
  return [cleanDiffStat, ...untrackedLines].filter(Boolean).join('\n');
}

export function filterNonAgentLoopEvidenceFiles(changedFiles: GitFileStatus[]) {
  return changedFiles.filter((file) => !isAgentLoopEvidenceFile(file.path));
}

// git wraps a path in double quotes (and C-escapes its bytes) whenever the
// raw bytes would otherwise be ambiguous in porcelain output — most notably
// when the path contains a space, which would collide with the " -> "
// rename arrow or the "XY " status prefix — regardless of core.quotePath.
// core.quotePath only controls whether *non-ASCII* bytes get octal-escaped;
// the surrounding quoting for "unsafe" paths (e.g. containing a space)
// still happens. Strip that quoting back off so downstream consumers
// (coverage/scope/hash matching) see the real relative path instead of a
// literal `"..."` string.
export function dequoteGitPath(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length < 2 || !trimmed.startsWith('"') || !trimmed.endsWith('"')) {
    return raw;
  }

  const inner = trimmed.slice(1, -1);
  const simpleEscapes: Record<string, number> = {
    '"': 0x22,
    '\\': 0x5c,
    a: 0x07,
    b: 0x08,
    f: 0x0c,
    n: 0x0a,
    r: 0x0d,
    t: 0x09,
    v: 0x0b,
  };

  const bytes: number[] = [];
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (ch === '\\') {
      const next = inner[i + 1];
      if (next !== undefined && next in simpleEscapes) {
        bytes.push(simpleEscapes[next]);
        i += 1;
        continue;
      }
      if (next >= '0' && next <= '7') {
        let octal = '';
        let j = i + 1;
        while (j < inner.length && octal.length < 3 && inner[j] >= '0' && inner[j] <= '7') {
          octal += inner[j];
          j += 1;
        }
        bytes.push(parseInt(octal, 8) & 0xff);
        i = j - 1;
        continue;
      }
      // Unrecognized escape: keep the backslash and following char as-is.
      bytes.push(...Buffer.from(ch, 'utf8'));
      continue;
    }
    bytes.push(...Buffer.from(ch, 'utf8'));
  }

  return Buffer.from(bytes).toString('utf8');
}

export async function parseGitStatus(status: string): Promise<GitFileStatus[]> {
  return status
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const rawPath = line.slice(3).trim();
      const statusCode = line.slice(0, 2).trim() || '?';
      // Rename/copy entries (status R/C) are formatted as "old -> new"; the
      // path that matters for hashing/coverage is the new (current) path.
      // Only R/C statuses carry an arrow at all, and we split on the LAST
      // " -> " so an arrow occurring inside a quoted old path can't be
      // mistaken for the real old/new separator.
      const isRenameOrCopy = /[RC]/.test(statusCode);
      const arrowIndex = isRenameOrCopy ? rawPath.lastIndexOf(' -> ') : -1;
      const finalRaw = arrowIndex === -1 ? rawPath : rawPath.slice(arrowIndex + 4).trim();
      return {
        status: statusCode,
        path: dequoteGitPath(finalRaw),
      };
    });
}
