import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { resolveCurrentOrLatestRunTaskVerificationEvidence } from './evidence.js';
import { pathExists, writeTextFile } from './file-system.js';
import { getGitStatus, GitFileStatus, parseGitStatus } from './git.js';
import { readGithubMetadataContext, type GithubMetadataContext } from './github-metadata.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import { listItems, sectionContent } from './markdown-sections.js';
import { verificationNotRunItems } from './verification-report-sections.js';
import { resolveUniqueOutputArtifactPath } from './artifacts.js';
import { createShipReport, ShipResult } from './ship.js';
import { listRuns, readRun } from './runs.js';
import { readTaskContract, TaskContract } from './task-state.js';
import { renderCompactChangeAreas } from './change-areas.js';
import { toSafeDisplayPath } from './display-path.js';
import { buildEvidenceMap, renderEvidenceMapCompactMarkdown, type EvidenceMap } from './evidence-map.js';

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
  githubMetadata: GithubMetadataContext;
  readiness: ShipResult['readiness'];
  evidenceMap: EvidenceMap;
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
  Pick<PreparePrResult, 'shipEvidence'> & {
    verificationMarkdown?: string;
    evidenceMap?: EvidenceMap;
  };

function renderMarkdownList(values: string[], fallback: string) {
  return values.length
    ? values.map((value) => `- ${escapeSingleLineMarkdownProse(value)}`).join('\n')
    : `- ${escapeSingleLineMarkdownProse(fallback)}`;
}

function relativePath(cwd: string, filePath: string) {
  return toSafeDisplayPath(cwd, filePath);
}

function resolveMaybeRepoPath(cwd: string, filePath: string) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
}

function extractOverallStatus(markdown: string | undefined): ShipResult['verification']['status'] {
  const status = markdown
    ?.match(/Overall status:\s*([a-z-]+)/i)?.[1]
    ?.trim()
    .toLowerCase();
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
    ? ` (${inlineCode(relativePath(cwd, ship.verificationReportPath))})`
    : '';
  return `Overall status: ${ship.verification.status}${report}`;
}

function verificationNotRunLines(markdown: string | undefined) {
  if (!markdown) return renderMarkdownList([], 'No verification report was available.');
  return renderMarkdownList(
    verificationNotRunItems(markdown),
    'No skipped commands were recorded.',
  );
}

function escapedInlineProse(value: string) {
  return escapeMarkdownProse(value.replace(/\s+/g, ' ').trim());
}

function escapeSingleLineMarkdownProse(value: string) {
  return escapeMarkdownProse(value.replace(/\s+/g, ' ').trim());
}

function githubItemLine(
  label: string,
  item: { number: number | null; title: string; state: string; url: string },
) {
  const number = item.number === null ? 'unknown' : `#${item.number}`;
  const suffix = item.url ? ` (${inlineCode(item.url)})` : '';
  return `- ${label}: ${inlineCode(number)} ${inlineCode(item.state || 'unknown')} - ${escapedInlineProse(
    item.title || 'Untitled',
  )}${suffix}`;
}

function renderGithubMetadataSection(metadata: GithubMetadataContext) {
  if (metadata.status === 'missing') return '';
  if (metadata.status === 'invalid') {
    return `## Imported GitHub Context

- Metadata file: ${inlineCode(metadata.path)}
- Status: invalid
- Reason: ${escapeSingleLineMarkdownProse(metadata.message)}
`;
  }

  const lines = [`- Metadata file: ${inlineCode(metadata.path)}`];
  if (metadata.issue) {
    lines.push(githubItemLine('Issue', metadata.issue));
    if (metadata.issue.labels.length) {
      lines.push(
        `- Issue labels: ${metadata.issue.labels.map((label) => inlineCode(label)).join(', ')}`,
      );
    }
    if (metadata.issue.bodyExcerpt) {
      lines.push(`- Issue excerpt: ${escapedInlineProse(metadata.issue.bodyExcerpt)}`);
    }
  }
  if (metadata.pullRequest) {
    lines.push(githubItemLine('Pull request', metadata.pullRequest));
    lines.push(
      `- PR branch: ${inlineCode(metadata.pullRequest.headRefName || 'unknown')} -> ${inlineCode(
        metadata.pullRequest.baseRefName || 'unknown',
      )}`,
    );
    if (metadata.pullRequest.changedFiles !== null) {
      lines.push(`- PR changed files: ${inlineCode(String(metadata.pullRequest.changedFiles))}`);
    }
    if (metadata.pullRequest.bodyExcerpt) {
      lines.push(`- PR excerpt: ${escapedInlineProse(metadata.pullRequest.bodyExcerpt)}`);
    }
  }

  return `## Imported GitHub Context

${lines.join('\n')}
`;
}

function buildPrBody(input: {
  cwd: string;
  task: TaskContract | null;
  ship: PreparePrShipEvidence;
  evidenceMap: EvidenceMap;
  githubMetadata: GithubMetadataContext;
}) {
  const title = input.task?.title ?? 'AgentLoopKit review-ready changes';
  const taskContent = input.task?.content ?? '';
  const desiredOutcome = sectionContent(taskContent, 'Desired Outcome');
  const problem = sectionContent(taskContent, 'Problem Statement');
  const acceptance = listItems(sectionContent(taskContent, 'Acceptance Criteria'));
  const risks = listItems(sectionContent(taskContent, 'Risk Notes'));
  const rollback = sectionContent(taskContent, 'Rollback Notes');
  const githubMetadataSection = renderGithubMetadataSection(input.githubMetadata).trimEnd();
  const optionalGithubMetadataSection = githubMetadataSection ? `\n\n${githubMetadataSection}` : '';

  return `# ${escapeSingleLineMarkdownProse(title)}

## Summary

${escapeSingleLineMarkdownProse(
  desiredOutcome || problem || 'Review the changed files and AgentLoopKit evidence before merge.',
)}

## Changed Files

${renderCompactChangeAreas(input.ship.changedFiles)}

## Review Readiness

- Score: ${input.ship.readiness.totalScore}/100
${input.ship.readiness.claims.map((claim) => `- ${escapeSingleLineMarkdownProse(claim)}`).join('\n')}
- Ship report: ${inlineCode(relativePath(input.cwd, input.ship.shipReportPath))}

## Evidence Map

${renderEvidenceMapCompactMarkdown(input.evidenceMap)}

## Acceptance Criteria

${renderMarkdownList(acceptance, 'No acceptance criteria were recorded.')}

## Verification Evidence

- ${verificationLine(input.ship, input.cwd)}${optionalGithubMetadataSection}

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

${renderMarkdownList(risks, 'No risk notes were recorded.')}

## Rollback Notes

${escapeSingleLineMarkdownProse(rollback || 'No rollback notes were recorded.')}

## Verification Report Not Run

${verificationNotRunLines(input.ship.verificationMarkdown)}
`;
}

function buildGithubComment(ship: PreparePrShipEvidence, cwd: string) {
  return `## AgentLoopKit Review Readiness

- Score: ${ship.readiness.totalScore}/100
- Ship report: ${inlineCode(relativePath(cwd, ship.shipReportPath))}
- Handoff: ${ship.handoffPath ? inlineCode(relativePath(cwd, ship.handoffPath)) : 'not generated'}
- ${escapeSingleLineMarkdownProse(ship.readiness.claims[0] ?? 'No score boundary claim recorded.')}

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
  const evidence = await resolveCurrentOrLatestRunTaskVerificationEvidence(options);
  if (!evidence.taskPath || !evidence.currentReportPath || evidence.staleReport) return undefined;

  const taskPath = relativePath(options.cwd, evidence.taskPath);
  const verificationReportPath = resolveMaybeRepoPath(options.cwd, evidence.currentReportPath);
  const currentChangedFiles = await parseGitStatus(await getGitStatus(options.cwd));

  for (const run of await listRuns(options.cwd)) {
    if (run.command !== 'ship' || run.score === undefined) continue;
    if (run.task?.path !== taskPath) continue;
    if (
      !run.shipReportPath ||
      !(await pathExists(resolveMaybeRepoPath(options.cwd, run.shipReportPath)))
    ) {
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
      verificationMarkdown,
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
  redactPaths?: boolean;
}): Promise<PreparePrShipEvidence> {
  const result = await createShipReport({
    cwd: options.cwd,
    config: options.config,
    timestamp: options.timestamp,
    redactPaths: options.redactPaths,
  });
  const verificationMarkdown = result.verificationReportPath
    ? await readFile(resolveMaybeRepoPath(options.cwd, result.verificationReportPath), 'utf8')
    : undefined;
  return {
    ...result,
    verificationMarkdown,
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
  redactPaths?: boolean;
}) {
  const preparedShip =
    (await findReusableShipEvidence(options)) ?? (await refreshShipEvidence(options));
  const evidenceMap =
    preparedShip.evidenceMap ??
    (await buildEvidenceMap({
      cwd: options.cwd,
      config: options.config,
      changedFiles: preparedShip.changedFiles,
    }));
  const [evidence, githubMetadata] = await Promise.all([
    resolveCurrentOrLatestRunTaskVerificationEvidence(options),
    readGithubMetadataContext({ cwd: options.cwd, config: options.config }),
  ]);
  const task = evidence.taskPath
    ? await readTaskContract({
        cwd: options.cwd,
        config: options.config,
        taskPath: evidence.taskPath,
      })
    : null;
  const body = buildPrBody({
    cwd: options.cwd,
    task,
    ship: preparedShip,
    evidenceMap,
    githubMetadata,
  });
  const githubComment = options.githubComment
    ? buildGithubComment(preparedShip, options.cwd)
    : undefined;
  let writtenPath: string | undefined;

  if (options.write) {
    const timestamp = options.timestamp ?? preparedShip.timestamp;
    writtenPath = await resolveUniqueOutputArtifactPath({
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
    githubMetadata,
    readiness: preparedShip.readiness,
    evidenceMap,
    changedFiles: preparedShip.changedFiles,
  } satisfies PreparePrResult;
}
