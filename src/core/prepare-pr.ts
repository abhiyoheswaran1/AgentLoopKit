import path from 'node:path';
import { AgentLoopConfig } from './config.js';
import { resolveCurrentTaskVerificationEvidence } from './evidence.js';
import { writeTextFile } from './file-system.js';
import { inlineCode } from './markdown-format.js';
import { resolveOutputArtifactPath } from './artifacts.js';
import { createShipReport, ShipResult } from './ship.js';
import { readTaskContract, TaskContract } from './task-state.js';

export type PreparePrResult = {
  titleSuggestion: string;
  body: string;
  githubComment?: string;
  shipReportPath: string;
  handoffPath?: string;
  writtenPath?: string;
  readiness: ShipResult['readiness'];
  changedFiles: ShipResult['changedFiles'];
};

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

function renderChangedFiles(changedFiles: ShipResult['changedFiles']) {
  return changedFiles.length
    ? changedFiles.map((file) => `- ${file.status} ${inlineCode(file.path)}`).join('\n')
    : '- No changed files detected.';
}

function verificationLine(ship: ShipResult) {
  const report = ship.verificationReportPath ? ` (${ship.verificationReportPath})` : '';
  return `Overall status: ${ship.verification.status}${report}`;
}

function buildPrBody(input: { task: TaskContract | null; ship: ShipResult }) {
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

${renderChangedFiles(input.ship.changedFiles)}

## Review Readiness

- Score: ${input.ship.readiness.totalScore}/100
${input.ship.readiness.claims.map((claim) => `- ${claim}`).join('\n')}
- Ship report: ${inlineCode(input.ship.shipReportPath)}

## Acceptance Criteria

${renderMarkdownList(acceptance, 'No acceptance criteria were recorded.')}

## Verification Evidence

- ${verificationLine(input.ship)}

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

function buildGithubComment(ship: ShipResult) {
  return `## AgentLoopKit Review Readiness

- Score: ${ship.readiness.totalScore}/100
- Ship report: ${inlineCode(ship.shipReportPath)}
- Handoff: ${ship.handoffPath ? inlineCode(ship.handoffPath) : 'not generated'}
- ${ship.readiness.claims[0]}

### Blockers

${renderMarkdownList(ship.readiness.blockers, 'No blockers recorded.')}

### Warnings

${renderMarkdownList(ship.readiness.warnings, 'No warnings recorded.')}

### Next Actions

${renderMarkdownList(ship.readiness.recommendedNextActions, 'Review the diff and open the PR when ready.')}
`;
}

export async function preparePullRequest(options: {
  cwd: string;
  config: AgentLoopConfig;
  timestamp?: string;
  githubComment?: boolean;
  write?: boolean;
}) {
  const ship = await createShipReport({
    cwd: options.cwd,
    config: options.config,
    timestamp: options.timestamp,
  });
  const evidence = await resolveCurrentTaskVerificationEvidence(options);
  const task = evidence.taskPath
    ? await readTaskContract({
        cwd: options.cwd,
        config: options.config,
        taskPath: evidence.taskPath,
      })
    : null;
  const body = buildPrBody({ task, ship });
  const githubComment = options.githubComment ? buildGithubComment(ship) : undefined;
  let writtenPath: string | undefined;

  if (options.write) {
    const timestamp = options.timestamp ?? ship.timestamp;
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
    shipReportPath: ship.shipReportPath,
    handoffPath: ship.handoffPath,
    ...(writtenPath ? { writtenPath } : {}),
    readiness: ship.readiness,
    changedFiles: ship.changedFiles,
  } satisfies PreparePrResult;
}
