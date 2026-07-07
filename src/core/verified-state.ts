import { createHash } from 'node:crypto';
import { execa } from 'execa';

async function runGit(args: string[], cwd: string): Promise<string> {
  const result = await execa('git', args, { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout : '';
}

// AgentLoopKit's own evidence bookkeeping (verification reports, handoffs, run
// metadata, guard logs, the active-task pointer) is written to the working tree
// as a side effect of running verification and reviewer tooling itself. Those
// writes must not retroactively invalidate the fingerprint they were computed
// alongside, so they are excluded via pathspec magic before hashing. Real
// source and task-contract paths (including .agentloop/harness and
// .agentloop/policies) are left in scope.
const EVIDENCE_PATHSPEC_EXCLUSIONS = [
  ':(exclude).agentloop/reports',
  ':(exclude).agentloop/handoffs',
  ':(exclude).agentloop/runs',
  ':(exclude).agentloop/guard',
  ':(exclude).agentloop/state.json',
];

// Deterministic content fingerprint of the working-tree state that verification
// ran against: tracked changes vs HEAD plus path-level dirty/untracked status,
// excluding AgentLoopKit's own evidence bookkeeping paths (see above).
// Outside a git repo both commands yield '' → a stable sentinel hash. Never throws.
export async function computeVerifiedStateFingerprint(options: { cwd: string }): Promise<string> {
  const pathspecArgs = ['--', '.', ...EVIDENCE_PATHSPEC_EXCLUSIONS];
  const [diff, status] = await Promise.all([
    runGit(['diff', 'HEAD', ...pathspecArgs], options.cwd),
    runGit(['status', '--porcelain', ...pathspecArgs], options.cwd),
  ]);
  return createHash('sha256').update(`diff\0${diff}\0status\0${status}`).digest('hex');
}
