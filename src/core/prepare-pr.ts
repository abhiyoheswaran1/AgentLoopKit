import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { resolveCurrentTaskVerificationEvidence } from './evidence.js';
import { pathExists, writeTextFile } from './file-system.js';
import { getGitStatus, GitFileStatus, parseGitStatus } from './git.js';
import { inlineCode } from './markdown-format.js';
import { resolveOutputArtifactPath } from './artifacts.js';
import { createShipReport, ShipResult } from './ship.js';
import { listRuns, readRun } from './runs.js';
import { readTaskContract, TaskContract } from './task-state.js';
import { renderChangeAreas } from './change-areas.js';
import { toSafeDisplayPath } from './display-path.js';

export type PreparePrResult = {
  titleSuggestion: string;
  body: string;
  githubComment?: string;
  shipReportPath: string;
  handoffPath?: string;
  writtenPath?: string;
  shipEvidence: {
    source: 'reused' | 'refreshed';
    runId?: string;
  };
  readiness: ShipResult['readiness'];
  changedFiles: ShipResult['changedFiles'];
};

type PreparePrShipEvidence = Pick<
  ShipResult,
  | 'timestamp'
  | 'readiness'
  | 'task'
  | 'verification'
  | 'verificationReportPath'
  | 'shipReportPath'
  | 'handoffPath'
  | 'changedFiles'
> &
  Pick<PreparePrResult, 'shipEvidence'>;

function sectionContent(markdown: string, heading: string) {
  const lines = markdown.split(/\r?\n/);
  const headingLine = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === headingLine);
  if (startIndex === -1) return '';

  const sectionLines: string[] = [];
  for (const line of lines.slice(startIndex + 1)) {
    if (/^##\s+/.test(line.trim())) break;
    sectionLines.push(line);
  }

  return sectionLines.join('\n').trim();
}

function listItems(section: string) {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function renderMarkdownList(values: string[], fallback: string) {
  return values.length ? values.map((value) => `- ${value}`).join('\n') : `- ${fallback}`;
}

function relativePath(cwd: string, filePath: string) {
  return toSafeDisplayPath(cwd, filePath);
}

function resolveMaybeRepoPath(cwd: string, filePath: string) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
}

function extractOverallStatus(markdown: string | undefined): ShipResult['verification']['status'] {
  const status = markdown?.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim().toLowerCase();
  if (status === 'pass' || status === 'fail') return status;
  if (status) return 'unknown';
  return 'missing';
}

function isGeneratedEvidencePath(filePath: string) {
  return (
    filePath.startsWith('.agentloop/reports/') ||
    filePath.startsWith('.agentloop/runs/') ||
    filePath.startsWith('.agentloop/handoffs/')
  );
}

function meaningfulChangeKeys(changedFiles: GitFileStatus[]) {
  return changedFiles
    .filter((file) => !isGeneratedEvidencePath(file.path))
    .map((file) => `${file.status} ${file.path}`)
    .sort();
}

function sameMeaningfulChanges(left: GitFileStatus[], right: GitFileStatus[]) {
  const leftKeys = meaningfulChangeKeys(left);
  const rightKeys = meaningfulChangeKeys(right);
  return (
    leftKeys.length === rightKeys.length && leftKeys.every((key, index) => key === rightKeys[index])
  );
}

function verificationLine(ship: PreparePrShipEvidence, cwd: string) {
  const report = ship.verificationReportPath
    ? ` (${relativePath(cwd, ship.verificationReportPath)})`
    : '';
  return `Overall status: ${ship.verification.status}${report}`;
}

function buildPrBody(input: { cwd: string; task: TaskContract | null; ship: PreparePrShipEvidence }) {
  const title = input.task?.title ?? 'AgentLoopKit review-ready changes';
  const taskContent = input.task?.content ?? '';
  const desiredOutcome = sectionContent(taskContent, 'Desired Outcome');
  const problem = sectionContent(taskContent, 'Problem Statement');
  const acceptance = listItems(sectionContent(taskContent, 'Acceptance Criteria'));
  const risks = listItems(sectionContent(taskContent, 'Risk Notes'));
  const rollback = sectionContent(taskContent, 'Rollback Notes');

  return `# ${title}

## Summary

${desiredOutcome || problem || 'Review the changed files and AgentLoopKit evidence before merge.'}

## Changed Files

${renderChangeAreas(input.ship.changedFiles)}

## Review Readiness

- Score: ${input.ship.readiness.totalScore}/100
${input.ship.readiness.claims.map((claim) => `- ${claim}`).join('\n')}
- Ship report: ${inlineCode(relativePath(input.cwd, input.ship.shipReportPath))}

## Acceptance Criteria

${renderMarkdownList(acceptance, 'No acceptance criteria were recorded.')}

## Verification Evidence

- ${verificationLine(input.ship, input.cwd)}

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

${renderMarkdownList(risks, 'No risk notes were recorded.')}

## Rollback Notes

${rollback || 'No rollback notes were recorded.'}

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
`;
}

function buildGithubComment(ship: PreparePrShipEvidence, cwd: string) {
  return `## AgentLoopKit Review Readiness

- Score: ${ship.readiness.totalScore}/100
- Ship report: ${inlineCode(relativePath(cwd, ship.shipReportPath))}
- Handoff: ${ship.handoffPath ? inlineCode(relativePath(cwd, ship.handoffPath)) : 'not generated'}
- ${ship.readiness.claims[0]}

### Blockers

${renderMarkdownList(ship.readiness.blockers, 'No blockers recorded.')}

### Warnings

${renderMarkdownList(ship.readiness.warnings, 'No warnings recorded.')}

### Next Actions

${renderMarkdownList(ship.readiness.recommendedNextActions, 'Review the diff and open the PR when ready.')}
`;
}

async function findReusableShipEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<PreparePrShipEvidence | undefined> {
  const evidence = await resolveCurrentTaskVerificationEvidence(options);
  if (!evidence.taskPath || !evidence.currentReportPath || evidence.staleReport) return undefined;

  const taskPath = relativePath(options.cwd, evidence.taskPath);
  const verificationReportPath = resolveMaybeRepoPath(options.cwd, evidence.currentReportPath);
  const currentChangedFiles = await parseGitStatus(await getGitStatus(options.cwd));

  for (const run of await listRuns(options.cwd)) {
    if (run.command !== 'ship' || run.score === undefined) continue;
    if (run.task?.path !== taskPath) continue;
    if (!run.shipReportPath || !(await pathExists(resolveMaybeRepoPath(options.cwd, run.shipReportPath)))) {
      continue;
    }
    if (
      !run.verificationReportPath ||
      resolveMaybeRepoPath(options.cwd, run.verificationReportPath) !== verificationReportPath
    ) {
      continue;
    }

    const record = await readRun(options.cwd, run.id);
    if (!record.score || !sameMeaningfulChanges(record.changedFiles, currentChangedFiles)) continue;
    const verificationMarkdown = await readFile(verificationReportPath, 'utf8');

    return {
      timestamp: run.createdAt,
      readiness: record.score,
      task: run.task,
      verification: {
        status: extractOverallStatus(verificationMarkdown),
        fresh: true,
        path: relativePath(options.cwd, verificationReportPath),
      },
      verificationReportPath: relativePath(options.cwd, verificationReportPath),
      shipReportPath: relativePath(options.cwd, run.shipReportPath),
      handoffPath: run.handoffPath ? relativePath(options.cwd, run.handoffPath) : undefined,
      changedFiles: record.changedFiles,
      shipEvidence: {
        source: 'reused',
        runId: run.id,
      },
    };
  }

  return undefined;
}

async function refreshShipEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
  timestamp?: string;
}): Promise<PreparePrShipEvidence> {
  const result = await createShipReport({
    cwd: options.cwd,
    config: options.config,
    timestamp: options.timestamp,
  });
  return {
    ...result,
    shipEvidence: {
      source: 'refreshed',
      runId: result.run.id,
    },
  };
}

export async function preparePullRequest(options: {
  cwd: string;
  config: AgentLoopConfig;
  timestamp?: string;
  githubComment?: boolean;
  write?: boolean;
}) {
  const preparedShip =
    (await findReusableShipEvidence(options)) ?? (await refreshShipEvidence(options));
  const evidence = await resolveCurrentTaskVerificationEvidence(options);
  const task = evidence.taskPath
    ? await readTaskContract({
        cwd: options.cwd,
        config: options.config,
        taskPath: evidence.taskPath,
      })
    : null;
  const body = buildPrBody({ cwd: options.cwd, task, ship: preparedShip });
  const githubComment = options.githubComment
    ? buildGithubComment(preparedShip, options.cwd)
    : undefined;
  let writtenPath: string | undefined;

  if (options.write) {
    const timestamp = options.timestamp ?? preparedShip.timestamp;
    writtenPath = resolveOutputArtifactPath({
      cwd: options.cwd,
      artifactType: 'handoff',
      requestedPath: path.join(options.config.paths.handoffsDir, `${timestamp}-pr-description.md`),
      expectedDir: options.config.paths.handoffsDir,
      expectedExtension: '.md',
    });
    await writeTextFile(writtenPath, body);
  }

  return {
    titleSuggestion: task?.title ?? 'AgentLoopKit review-ready changes',
    body,
    ...(githubComment ? { githubComment } : {}),
    shipReportPath: relativePath(options.cwd, preparedShip.shipReportPath),
    ...(preparedShip.handoffPath
      ? { handoffPath: relativePath(options.cwd, preparedShip.handoffPath) }
      : {}),
    ...(writtenPath ? { writtenPath: relativePath(options.cwd, writtenPath) } : {}),
    shipEvidence: preparedShip.shipEvidence,
    readiness: preparedShip.readiness,
    changedFiles: preparedShip.changedFiles,
  } satisfies PreparePrResult;
}
