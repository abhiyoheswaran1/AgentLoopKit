import { GitFileStatus } from './git.js';
import { readRun, RunSummary } from './runs.js';

function normalizeGitStatusPath(filePath: string) {
  return filePath.replace(/\\/g, '/').replace(/\/+$/, '');
}

function isReviewEvidenceRun(latestRun: RunSummary | undefined): latestRun is RunSummary {
  return (
    latestRun?.command === 'handoff' ||
    (latestRun?.command === 'ship' && Boolean(latestRun.handoffPath))
  );
}

function isLatestReviewEvidenceRunArtifact(filePath: string, latestRun: RunSummary | undefined) {
  if (!isReviewEvidenceRun(latestRun)) return false;
  const normalizedPath = normalizeGitStatusPath(filePath);
  const runPath = `.agentloop/runs/${latestRun.id}`;
  return normalizedPath === runPath || normalizedPath.startsWith(`${runPath}/`);
}

export async function dirtyCoveredByLatestHandoffRun(
  cwd: string,
  changedFiles: GitFileStatus[],
  latestRun: RunSummary | undefined,
) {
  if (changedFiles.length === 0 || !isReviewEvidenceRun(latestRun)) return false;

  const latestRunRecord = await readRun(cwd, latestRun.id).catch(() => undefined);
  const coveredPaths = new Set(
    (latestRunRecord?.changedFiles ?? []).map((changedFile) =>
      normalizeGitStatusPath(changedFile.path),
    ),
  );
  for (const artifactPath of [
    latestRun.verificationReportPath,
    latestRun.shipReportPath,
    latestRun.handoffPath,
  ]) {
    if (artifactPath) coveredPaths.add(normalizeGitStatusPath(artifactPath));
  }

  return changedFiles.every((changedFile) => {
    if (isLatestReviewEvidenceRunArtifact(changedFile.path, latestRun)) return true;
    return coveredPaths.has(normalizeGitStatusPath(changedFile.path));
  });
}
