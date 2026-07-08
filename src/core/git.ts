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

export async function parseGitStatus(status: string): Promise<GitFileStatus[]> {
  return status
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const rawPath = line.slice(3).trim();
      // Rename/copy entries (status R/C) are formatted as "old -> new"; the
      // path that matters for hashing/coverage is the new (current) path.
      const arrowIndex = rawPath.indexOf(' -> ');
      const path = arrowIndex === -1 ? rawPath : rawPath.slice(arrowIndex + 4).trim();
      return {
        status: line.slice(0, 2).trim() || '?',
        path,
      };
    });
}
