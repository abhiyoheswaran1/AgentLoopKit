import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { resolveUniqueOutputArtifactPath } from './artifacts.js';
import { renderCompactChangedFiles } from './change-areas.js';
import { checkGates } from './check-gates.js';
import { formatTimestamp } from './dates.js';
import {
  resolveCurrentOrLatestRunTaskVerificationEvidence,
  resolveCurrentVerificationEvidence,
} from './evidence.js';
import {
  appendUntrackedFilesToDiffStat,
  getGitDiffStat,
  getGitStatus,
  parseGitStatus,
} from './git.js';
import { writeTextFile } from './file-system.js';
import {
  escapeMarkdownProse,
  fencedCodeBlock,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import { listItems, sectionContent } from './markdown-sections.js';
import { summarizeRepository } from './pr-summary.js';
import { toSafeDisplayPath } from './display-path.js';
import { renderVerificationNotRun } from './verification-report-sections.js';
import {
  buildEvidenceMap,
  renderEvidenceMapCompactMarkdown,
  type EvidenceMap,
} from './evidence-map.js';
import {
  evaluateReviewReadiness,
  ReadinessVerificationInput,
  ReviewReadinessResult,
} from './readiness-score.js';
import { writeShipRun } from './runs.js';
import { readTaskContract, TaskContract } from './task-state.js';
import { runVerification } from './verification.js';

export type ShipResult = {
  timestamp: string;
  readiness: ReviewReadinessResult;
  task: Pick<TaskContract, 'path' | 'title' | 'status'> | null;
  verification: ReadinessVerificationInput;
  verificationReportPath?: string;
  gates: Awaited<ReturnType<typeof checkGates>>;
  evidenceMap: EvidenceMap;
  handoffPath?: string;
  changedFiles: Awaited<ReturnType<typeof parseGitStatus>>;
  diffStat: string;
  markdown: string;
  shipReportPath: string;
  run: Awaited<ReturnType<typeof writeShipRun>>;
};

type ShipRenderInput = Omit<ShipResult, 'markdown' | 'run'>;
type ShipMarkdownInput = ShipRenderInput & {
  cwd: string;
  taskRiskNotes: string[];
  verificationMarkdown?: string;
};

function relativePath(cwd: string | undefined, filePath: string | undefined) {
  if (!filePath) return undefined;
  if (!cwd) return filePath.split(path.sep).join('/');
  const repoPath = path.isAbsolute(filePath) ? path.relative(cwd, filePath) : filePath;
  return repoPath.split(path.sep).join('/') || '.';
}

function extractOverallStatus(markdown: string | undefined): ReadinessVerificationInput['status'] {
  const status = markdown?.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim().toLowerCase();
  if (status === 'pass' || status === 'fail') return status;
  if (status) return 'unknown';
  return 'missing';
}

function renderDimensionLines(readiness: ReviewReadinessResult) {
  return readiness.dimensions
    .map(
      (dimension) =>
        `- ${inlineCode(dimension.label)}: ${inlineCode(String(dimension.score))}/100 (weight ${inlineCode(
          String(dimension.weight),
        )}) - ${inlineCode(dimension.reason)}`,
    )
    .join('\n');
}

function escapeSingleLineMarkdownProse(value: string) {
  return escapeMarkdownProse(value).replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

function renderList(values: string[], fallback: string) {
  return values.length
    ? values.map((value) => `- ${escapeSingleLineMarkdownProse(value)}`).join('\n')
    : `- ${escapeSingleLineMarkdownProse(fallback)}`;
}

function inheritedDirtyBaselineCount(taskRiskNotes: string[]) {
  for (const note of taskRiskNotes) {
    const match = note.match(
      /^Pre-existing dirty non-evidence files before task creation:\s*(\d+)\s+total\b/i,
    );
    if (!match) continue;
    return Number.parseInt(match[1], 10);
  }
  return undefined;
}

function renderInheritedDirtyWorkSection(input: ShipMarkdownInput) {
  const baselineCount = inheritedDirtyBaselineCount(input.taskRiskNotes);
  if (baselineCount === undefined) return '\n';

  const currentCount = input.changedFiles.filter(
    (file) => !isAgentLoopEvidenceFile(file.path),
  ).length;
  const delta = currentCount - baselineCount;
  const deltaLabel = delta > 0 ? `+${delta}` : String(delta);

  return `
## Inherited Dirty Work

- Task started with ${inlineCode(String(baselineCount))} dirty non-evidence file(s); current non-evidence changed files: ${inlineCode(
    String(currentCount),
  )} (net ${inlineCode(deltaLabel)}).
`;
}

export function renderShipGithubComment(input: ShipResult, cwd?: string) {
  const task = input.task
    ? `${inlineCode(input.task.title)} (${inlineCode(input.task.status)})`
    : 'No task contract found.';
  const verificationReportPath = relativePath(cwd, input.verificationReportPath);
  const shipReportPath = relativePath(cwd, input.shipReportPath) ?? input.shipReportPath;

  return `## AgentLoopKit Review Readiness

- Score: ${input.readiness.totalScore}/100
- Task: ${task}
- Verification: ${inlineCode(input.verification.status)}${
    verificationReportPath ? ` - ${inlineCode(verificationReportPath)}` : ''
  }
- Gates: ${inlineCode(input.gates.overallStatus)}
- Ship report: ${inlineCode(shipReportPath)}
- ${input.readiness.claims[0]}

### Blockers

${renderList(input.readiness.blockers, 'No blockers recorded.')}

### Warnings

${renderList(input.readiness.warnings, 'No warnings recorded.')}

### Next Actions

${renderList(input.readiness.recommendedNextActions, 'Review the diff and open the PR when ready.')}
`;
}

function renderShipMarkdown(input: ShipMarkdownInput) {
  const verificationReportPath = relativePath(input.cwd, input.verificationReportPath);
  const handoffPath = relativePath(input.cwd, input.handoffPath);

  return `# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: ${inlineCode(input.timestamp)}
- Review readiness score: ${inlineCode(String(input.readiness.totalScore))}/100
- Task: ${
    input.task
      ? `${inlineCode(input.task.title)} (${inlineCode(input.task.status)}) - ${inlineCode(input.task.path)}`
      : 'No task contract found.'
  }
- Verification: ${inlineCode(input.verification.status)}${
    verificationReportPath ? ` - ${inlineCode(verificationReportPath)}` : ''
  }
- Handoff: ${handoffPath ? inlineCode(handoffPath) : 'No handoff generated.'}
- Gates: ${inlineCode(input.gates.overallStatus)}

## Verification Not Run

${renderVerificationNotRun(input.verificationMarkdown)}

## Score Boundary

${input.readiness.claims.map((claim) => `- ${claim}`).join('\n')}

## Dimensions

${renderDimensionLines(input.readiness)}

## Strengths

${renderList(input.readiness.strengths, 'No strengths recorded from current evidence.')}

## Warnings

${renderList(input.readiness.warnings, 'No warnings recorded.')}

## Blockers

${renderList(input.readiness.blockers, 'No blockers recorded.')}

## Recommended Next Actions

${renderList(input.readiness.recommendedNextActions, 'Review the diff and open the PR when ready.')}

## Evidence Map

${renderEvidenceMapCompactMarkdown(input.evidenceMap)}
${renderInheritedDirtyWorkSection(input)}
## Task Risk Notes

${renderList(input.taskRiskNotes, 'No task risk notes were recorded.')}

## Changed Files

${renderCompactChangedFiles(input.changedFiles)}

## Diff Stat

${input.diffStat.trim() ? fencedCodeBlock('text', input.diffStat.trim()) : 'No diff stats available.'}

## Gate Summary

${input.gates.gates
  .map((gate) => `- [${inlineCode(gate.status)}] ${inlineCode(gate.name)}: ${inlineCode(gate.message)}`)
  .join('\n')}
`;
}

export async function createShipReport(options: {
  cwd: string;
  config: AgentLoopConfig;
  timestamp?: string;
  runVerify?: boolean;
  taskCommands?: boolean;
  timeoutMs?: number;
  strictGates?: boolean;
  allowSoftSpots?: boolean;
  redactPaths?: boolean;
}): Promise<ShipResult> {
  const timestamp = options.timestamp ?? formatTimestamp();
  const gitStatus = await getGitStatus(options.cwd);
  const changedFiles = await parseGitStatus(gitStatus);
  const diffStat = appendUntrackedFilesToDiffStat(await getGitDiffStat(options.cwd), changedFiles);
  let evidence = await resolveCurrentOrLatestRunTaskVerificationEvidence(options);
  const task = evidence.taskPath
    ? await readTaskContract({
        cwd: options.cwd,
        config: options.config,
        taskPath: evidence.taskPath,
      })
    : null;
  const taskRiskNotes = task ? listItems(sectionContent(task.content, 'Risk Notes')) : [];

  let verificationReportPath = evidence.currentReportPath;
  let verificationMarkdown =
    verificationReportPath && (await readFile(verificationReportPath, 'utf8'));

  if (options.runVerify) {
    const verification = await runVerification({
      cwd: options.cwd,
      config: options.config,
      taskPath: evidence.taskPath ? relativePath(options.cwd, evidence.taskPath) : undefined,
      taskCommands: options.taskCommands,
      timeoutMs: options.timeoutMs,
      redactPaths: options.redactPaths,
    });
    verificationReportPath = verification.reportPath;
    verificationMarkdown = verification.markdown;
    evidence = {
      taskPath: evidence.taskPath,
      ...(await resolveCurrentVerificationEvidence({
        cwd: options.cwd,
        taskPath: evidence.taskPath,
        reportPath: verification.reportPath,
        reportsDir: options.config.paths.reportsDir,
        handoffsDir: options.config.paths.handoffsDir,
      })),
    };
  } else if (!verificationReportPath && evidence.latestReportPath) {
    verificationReportPath = evidence.latestReportPath;
    verificationMarkdown = await readFile(evidence.latestReportPath, 'utf8');
  }

  const evidenceMap = await buildEvidenceMap({
    cwd: options.cwd,
    config: options.config,
    changedFiles,
  });

  const verification: ReadinessVerificationInput = {
    status: extractOverallStatus(verificationMarkdown),
    fresh: Boolean(verificationReportPath && !evidence.staleReport),
    ...(verificationReportPath ? { path: relativePath(options.cwd, verificationReportPath) } : {}),
  };

  const handoff = await summarizeRepository({
    cwd: options.cwd,
    config: options.config,
    taskPath: evidence.taskPath ? relativePath(options.cwd, evidence.taskPath) : undefined,
    reportPath: verificationReportPath,
    timestamp,
    write: true,
    redactPaths: options.redactPaths,
  });
  const handoffPath = handoff.outPath;
  const shipReportPath = await resolveUniqueOutputArtifactPath({
    cwd: options.cwd,
    artifactType: 'report',
    requestedPath: path.join(options.config.paths.reportsDir, `${timestamp}-ship-report.md`),
    expectedDir: options.config.paths.reportsDir,
    expectedExtension: '.md',
  });
  const gates = await checkGates({
    cwd: options.cwd,
    config: options.config,
    strict: options.strictGates,
    allowSoftSpots: options.allowSoftSpots,
    redactPaths: options.redactPaths,
    projectedReviewEvidenceRun: {
      id: `${timestamp}-ship`,
      command: 'ship',
      createdAt: timestamp,
      task: task ? { path: task.path, title: task.title, status: task.status } : null,
      ...(verificationReportPath
        ? { verificationReportPath: relativePath(options.cwd, verificationReportPath) }
        : {}),
      shipReportPath: relativePath(options.cwd, shipReportPath) ?? shipReportPath,
      ...(handoffPath ? { handoffPath: relativePath(options.cwd, handoffPath) } : {}),
      changedFileCount: changedFiles.length,
      changedFiles,
    },
  });
  const readiness = evaluateReviewReadiness({
    task: task
      ? {
          path: task.path,
          title: task.title,
          status: task.status,
          content: task.content,
        }
      : null,
    changedFiles,
    verification,
    gates: {
      overallStatus: gates.overallStatus,
      gates: gates.gates,
    },
    handoff: {
      path: relativePath(options.cwd, handoffPath) ?? handoffPath,
    },
  });

  const withoutMarkdown = {
    timestamp,
    readiness,
    task: task ? { path: task.path, title: task.title, status: task.status } : null,
    verification,
    verificationReportPath,
    gates,
    evidenceMap,
    handoffPath,
    changedFiles,
    diffStat,
    shipReportPath,
  };
  const markdown = renderShipMarkdown({
    ...withoutMarkdown,
    cwd: options.cwd,
    taskRiskNotes,
    verificationMarkdown,
  });
  await writeTextFile(shipReportPath, markdown);
  const run = await writeShipRun({
    cwd: options.cwd,
    timestamp,
    task: withoutMarkdown.task,
    verificationReportPath,
    shipReportPath,
    handoffPath,
    score: readiness,
    changedFiles,
    diffStat,
    shipMarkdown: markdown,
  });
  return {
    ...withoutMarkdown,
    ...(verificationReportPath
      ? { verificationReportPath: toSafeDisplayPath(options.cwd, verificationReportPath) }
      : {}),
    ...(handoffPath ? { handoffPath: toSafeDisplayPath(options.cwd, handoffPath) } : {}),
    shipReportPath: toSafeDisplayPath(options.cwd, shipReportPath),
    markdown,
    run: {
      ...run,
      path: toSafeDisplayPath(options.cwd, run.path),
    },
  };
}
