import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { GitFileStatus } from './git.js';
import { readRun, RunChangedFile, RunSummary } from './runs.js';
import { computeFileContentHash } from './verified-state.js';

function normalizeGitStatusPath(filePath: string) {
  return filePath.replace(/\\/g, '/').replace(/\/+$/, '');
}

function normalizeEvidencePath(cwd: string, filePath: string) {
  const comparablePath = path.isAbsolute(filePath) ? path.relative(cwd, filePath) : filePath;
  return normalizeGitStatusPath(comparablePath);
}

function parseHandoffChangedPaths(markdown: string) {
  const paths = new Set<string>();
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\s*-\s+(?:[A-Z?!]{1,2})\s+`([^`]+)`\s*$/);
    if (match?.[1]) paths.add(normalizeGitStatusPath(match[1]));
  }
  return paths;
}

function parseHandoffEvidenceGroups(markdown: string) {
  const groups = new Set<string>();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.includes('AgentLoop evidence:') || !line.includes('grouped under')) continue;
    for (const match of line.matchAll(/`([^`]+\/)`/g)) {
      groups.add(match[1].replace(/\\/g, '/'));
    }
  }
  return groups;
}

function isCoveredByEvidenceGroup(filePath: string, evidenceGroups: Set<string>) {
  const normalizedPath = normalizeGitStatusPath(filePath);
  return [...evidenceGroups].some((groupPath) => {
    const normalizedGroup = normalizeGitStatusPath(groupPath);
    return normalizedPath === normalizedGroup || normalizedPath.startsWith(groupPath);
  });
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

function isCoveredAgentLoopArtifactDirectory(
  filePath: string,
  coveredPaths: Set<string>,
  latestRun: RunSummary | undefined,
) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (!normalizedPath.endsWith('/')) return false;
  if (
    !['.agentloop/handoffs/', '.agentloop/reports/', '.agentloop/runs/'].includes(normalizedPath)
  ) {
    return false;
  }

  if (isReviewEvidenceRun(latestRun)) {
    const runPath = `.agentloop/runs/${latestRun.id}/`;
    if (runPath.startsWith(normalizedPath)) return true;
  }

  return [...coveredPaths].some((coveredPath) => coveredPath.startsWith(normalizedPath));
}

export async function dirtyCoveredByLatestHandoffRun(
  cwd: string,
  changedFiles: GitFileStatus[],
  latestRun: RunSummary | undefined,
  latestRunChangedFiles?: GitFileStatus[],
  latestHandoffPath?: string,
) {
  if (changedFiles.length === 0) return false;

  const latestRunRecord = isReviewEvidenceRun(latestRun)
    ? await readRun(cwd, latestRun.id).catch(() => undefined)
    : undefined;
  const runChangedFiles = (latestRunChangedFiles ?? latestRunRecord?.changedFiles ?? []) as RunChangedFile[];
  const coveredPaths = new Set(
    runChangedFiles.map((changedFile) => normalizeGitStatusPath(changedFile.path)),
  );
  const runChangedHashByPath = new Map<string, string | undefined>(
    runChangedFiles.map((file) => [normalizeGitStatusPath(file.path), file.hash]),
  );
  const coveredEvidenceGroups = new Set<string>();
  if (isReviewEvidenceRun(latestRun)) {
    for (const artifactPath of [
      latestRun.verificationReportPath,
      latestRun.shipReportPath,
      latestRun.handoffPath,
    ]) {
      if (artifactPath) coveredPaths.add(normalizeEvidencePath(cwd, artifactPath));
    }
  }

  if (latestHandoffPath) {
    coveredPaths.add(normalizeEvidencePath(cwd, latestHandoffPath));
    const handoffMarkdown = await readFile(latestHandoffPath, 'utf8').catch(() => '');
    for (const coveredPath of parseHandoffChangedPaths(handoffMarkdown)) {
      coveredPaths.add(coveredPath);
    }
    for (const coveredGroup of parseHandoffEvidenceGroups(handoffMarkdown)) {
      coveredEvidenceGroups.add(coveredGroup);
    }
  }

  const results = await Promise.all(
    changedFiles.map(async (changedFile) => {
      if (isLatestReviewEvidenceRunArtifact(changedFile.path, latestRun)) return true;
      if (isCoveredAgentLoopArtifactDirectory(changedFile.path, coveredPaths, latestRun)) return true;
      if (isCoveredByEvidenceGroup(changedFile.path, coveredEvidenceGroups)) return true;
      const norm = normalizeGitStatusPath(changedFile.path);
      if (!coveredPaths.has(norm)) return false;
      const recordedHash = runChangedHashByPath.get(norm);
      if (recordedHash === undefined) return true; // artifact/prose/legacy: path-presence
      const currentHash = await computeFileContentHash({ cwd, filePath: changedFile.path });
      return currentHash !== undefined && currentHash === recordedHash;
    }),
  );
  return results.every(Boolean);
}
