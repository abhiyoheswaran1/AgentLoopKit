import { createHash } from 'node:crypto';
import { execa } from 'execa';

async function runGit(args: string[], cwd: string): Promise<string> {
  const result = await execa('git', args, { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout : '';
}

// Deterministic content fingerprint of the working-tree state that verification
// ran against: tracked changes vs HEAD plus path-level dirty/untracked status.
// Outside a git repo both commands yield '' → a stable sentinel hash. Never throws.
export async function computeVerifiedStateFingerprint(options: { cwd: string }): Promise<string> {
  const [diff, status] = await Promise.all([
    runGit(['diff', 'HEAD'], options.cwd),
    runGit(['status', '--porcelain'], options.cwd),
  ]);
  return createHash('sha256').update(`diff\0${diff}\0status\0${status}`).digest('hex');
}
