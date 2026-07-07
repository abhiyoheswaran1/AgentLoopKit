import { createHash } from 'node:crypto';
import path from 'node:path';
import { execa } from 'execa';

const DEFAULT_REPORTS_DIR = '.agentloop/reports';
const DEFAULT_HANDOFFS_DIR = '.agentloop/handoffs';

// AgentLoopKit's own evidence bookkeeping (run metadata, guard logs, the
// active-task pointer) is written to the working tree as a side effect of
// running verification and reviewer tooling itself, and is never
// user-configurable. Those writes must not retroactively invalidate the
// fingerprint they were computed alongside, so they are excluded via pathspec
// magic before hashing. Real source and task-contract paths (including
// .agentloop/harness and .agentloop/policies) are left in scope.
//
// reportsDir/handoffsDir are NOT included here: they are configurable
// (config.paths.reportsDir / config.paths.handoffsDir) and must be threaded
// in per-call so the exclusion matches wherever the caller's config actually
// writes them (see buildExclusionPathspec).
const FIXED_EVIDENCE_PATHSPEC_EXCLUSIONS = [
  ':(exclude).agentloop/runs',
  ':(exclude).agentloop/guard',
  ':(exclude).agentloop/state.json',
];

async function runGit(args: string[], cwd: string): Promise<string> {
  const result = await execa('git', args, { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout : '';
}

function normalizeEvidenceDir(dir: string): string {
  const posix = dir.split(path.sep).join('/');
  return posix.replace(/\/+$/, '');
}

// IMPORTANT: this exclusion set is a DELIBERATE, NARROW subset of
// AgentLoopKit-owned paths — not "everything the evidence classifier
// recognizes". Do NOT derive it from isAgentLoopEvidenceFile /
// agentLoopEvidenceGroup (see agentloop-evidence.ts): that classifier also
// covers .agentloop/tasks/*.md (task contracts) and .agentflight/* (inputs),
// which MUST stay fingerprinted so that editing acceptance criteria or
// changing an input after verify correctly re-stales the verification.
// Sharing the classifier here would open a false-fresh trust hole. Only the
// reports/handoffs/runs/guard/state-pointer paths below — pure write-side
// effects of the verify/reviewer tooling itself — belong in this list.
function buildExclusionPathspec(options: { reportsDir?: string; handoffsDir?: string }): string[] {
  const reportsDir = normalizeEvidenceDir(options.reportsDir ?? DEFAULT_REPORTS_DIR);
  const handoffsDir = normalizeEvidenceDir(options.handoffsDir ?? DEFAULT_HANDOFFS_DIR);
  return [
    `:(exclude)${reportsDir}`,
    `:(exclude)${handoffsDir}`,
    ...FIXED_EVIDENCE_PATHSPEC_EXCLUSIONS,
  ];
}

// Deterministic content fingerprint of the working-tree state that verification
// ran against: tracked changes vs HEAD plus path-level dirty/untracked status,
// excluding AgentLoopKit's own evidence bookkeeping paths (see above).
// reportsDir/handoffsDir default to AgentLoopKit's stock paths, but callers
// with a configured (non-default) reportsDir/handoffsDir MUST pass them —
// and the record site and check site MUST pass the identical values for a
// given repo, or the fingerprint they compare against each other will diverge
// and every verification will look stale with zero source edits.
// Outside a git repo both commands yield '' → a stable sentinel hash. Never throws.
export async function computeVerifiedStateFingerprint(options: {
  cwd: string;
  reportsDir?: string;
  handoffsDir?: string;
}): Promise<string> {
  const pathspecArgs = ['--', '.', ...buildExclusionPathspec(options)];
  const [diff, status] = await Promise.all([
    runGit(['diff', 'HEAD', ...pathspecArgs], options.cwd),
    runGit(['status', '--porcelain', ...pathspecArgs], options.cwd),
  ]);
  return createHash('sha256').update(`diff\0${diff}\0status\0${status}`).digest('hex');
}
