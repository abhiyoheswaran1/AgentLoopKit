import { execa } from 'execa';

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
  const result = await execa('git', ['status', '--short', '--untracked-files=all'], {
    cwd,
    reject: false,
  });
  return result.exitCode === 0 ? result.stdout : '';
}

export async function getGitDiffStat(cwd: string) {
  const result = await execa('git', ['diff', '--stat'], { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout : '';
}

export async function parseGitStatus(status: string): Promise<GitFileStatus[]> {
  return status
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => ({
      status: line.slice(0, 2).trim() || '?',
      path: line.slice(3).trim(),
    }));
}
