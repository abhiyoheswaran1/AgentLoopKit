import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { resolveUniqueOutputArtifactPath } from './artifacts.js';
import { checkGates } from './check-gates.js';
import { formatTimestamp } from './dates.js';
import { resolveCurrentOrLatestRunTaskVerificationEvidence } from './evidence.js';
import { getGitDiffStat, getGitStatus, parseGitStatus } from './git.js';
import { writeTextFile } from './file-system.js';
import { fencedCodeBlock, inlineCode } from './markdown-format.js';
import { summarizeRepository } from './pr-summary.js';
import { toSafeDisplayPath } from './display-path.js';
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
  handoffPath?: string;
  changedFiles: Awaited<ReturnType<typeof parseGitStatus>>;
  diffStat: string;
  markdown: string;
  shipReportPath: string;
  run: Awaited<ReturnType<typeof writeShipRun>>;
};

type ShipRenderInput = Omit<ShipResult, 'markdown' | 'run'>;
type ShipMarkdownInput = ShipRenderInput & { cwd: string };

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

function renderList(values: string[], fallback: string) {
  return values.length ? values.map((value) => `- ${value}`).join('\n') : `- ${fallback}`;
}

function renderChangedFiles(changedFiles: ShipRenderInput['changedFiles']) {
  return changedFiles.length
    ? changedFiles.map((file) => `- ${file.status} ${inlineCode(file.path)}`).join('\n')
    : '- No changed files detected.';
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

Make agent-generated code reviewable, verifiable, and merge-ready.

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

## Changed Files

${renderChangedFiles(input.changedFiles)}

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
  redactPaths?: boolean;
}): Promise<ShipResult> {
  const timestamp = options.timestamp ?? formatTimestamp();
  const gitStatus = await getGitStatus(options.cwd);
  const changedFiles = await parseGitStatus(gitStatus);
  const diffStat = await getGitDiffStat(options.cwd);
  const evidence = await resolveCurrentOrLatestRunTaskVerificationEvidence(options);
  const task = evidence.taskPath
    ? await readTaskContract({
        cwd: options.cwd,
        config: options.config,
        taskPath: evidence.taskPath,
      })
    : null;

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
    });
    verificationReportPath = verification.reportPath;
    verificationMarkdown = verification.markdown;
  } else if (!verificationReportPath && evidence.latestReportPath) {
    verificationReportPath = evidence.latestReportPath;
    verificationMarkdown = await readFile(evidence.latestReportPath, 'utf8');
  }

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
    handoffPath,
    changedFiles,
    diffStat,
    shipReportPath,
  };
  const markdown = renderShipMarkdown({ ...withoutMarkdown, cwd: options.cwd });
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
