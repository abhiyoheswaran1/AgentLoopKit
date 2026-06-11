import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { formatTimestamp } from './dates.js';
import { writeTextFile, pathExists } from './file-system.js';
import {
  latestMarkdownFile,
  prSummaryPattern,
  resolveOutputArtifactPath,
  verificationReportPattern,
} from './artifacts.js';
import { checkGates, CheckGatesResult } from './check-gates.js';
import { getActiveTaskPath, getFallbackTaskPath } from './task-state.js';
import { detectCiContext, VerificationCiContext } from './verification.js';

export type CiSummaryCiContext =
  | VerificationCiContext
  | {
      provider: 'none';
      providerName: 'No CI detected';
    };

export type CiSummaryArtifact = {
  path: string;
  title: string;
};

export type CiSummaryTask = CiSummaryArtifact & {
  status: string;
};

export type CiSummaryVerification = CiSummaryArtifact & {
  overallStatus: string;
};

export type CiSummaryResult = {
  timestamp: string;
  ci: CiSummaryCiContext;
  evidence: {
    task?: CiSummaryTask;
    verification?: CiSummaryVerification;
    handoff?: CiSummaryArtifact;
  };
  gates: Pick<CheckGatesResult, 'overallStatus' | 'gates'>;
  nextAction: {
    command: string;
    reason: string;
  };
  markdown: string;
  writtenPath?: string;
};

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

function displayPath(cwd: string, filePath: string | undefined) {
  if (!filePath) return undefined;
  return path.relative(cwd, filePath).split(path.sep).join('/') || '.';
}

async function readTask(
  cwd: string,
  filePath: string | undefined,
): Promise<CiSummaryTask | undefined> {
  if (!filePath || !(await pathExists(filePath))) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: displayPath(cwd, filePath) ?? filePath,
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    status: extractTaskStatus(markdown),
  };
}

async function readVerification(
  cwd: string,
  filePath: string | undefined,
): Promise<CiSummaryVerification | undefined> {
  if (!filePath || !(await pathExists(filePath))) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: displayPath(cwd, filePath) ?? filePath,
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    overallStatus: extractOverallStatus(markdown),
  };
}

async function readHandoff(
  cwd: string,
  filePath: string | undefined,
): Promise<CiSummaryArtifact | undefined> {
  if (!filePath || !(await pathExists(filePath))) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: displayPath(cwd, filePath) ?? filePath,
    title: extractHeading(markdown, path.basename(filePath, '.md')),
  };
}

function chooseNextAction(input: {
  verification?: CiSummaryVerification;
  gates: CheckGatesResult;
}) {
  if (!input.verification) {
    return {
      command: 'agentloop verify',
      reason: 'No verification report was found for this CI summary.',
    };
  }

  if (input.verification.overallStatus === 'fail') {
    return {
      command: 'agentloop verify',
      reason: 'The latest verification report failed. Fix failures and rerun verification.',
    };
  }

  return {
    command: 'agentloop check-gates --strict',
    reason: 'Use strict gates in CI after verification and handoff artifacts exist.',
  };
}

function renderCiLines(ci: CiSummaryCiContext) {
  const lines = [`- Provider: ${ci.providerName}`];
  if ('workflow' in ci && ci.workflow) lines.push(`- Workflow: ${ci.workflow}`);
  if ('event' in ci && ci.event) lines.push(`- Event: ${ci.event}`);
  if ('ref' in ci && ci.ref) lines.push(`- Ref: ${ci.ref}`);
  if ('commit' in ci && ci.commit) lines.push(`- Commit: ${ci.commit}`);
  if ('runUrl' in ci && ci.runUrl) lines.push(`- Run URL: ${ci.runUrl}`);
  if ('runAttempt' in ci && ci.runAttempt) lines.push(`- Run attempt: ${ci.runAttempt}`);
  return lines.join('\n');
}

function renderArtifactLine(label: string, artifact: CiSummaryArtifact | undefined) {
  return artifact ? `- ${label}: ${artifact.title} - ${artifact.path}` : `- ${label}: not found`;
}

function renderMarkdown(result: Omit<CiSummaryResult, 'markdown' | 'writtenPath'>) {
  return `# AgentLoopKit CI Summary

- Generated: ${result.timestamp}
- Overall status: ${result.gates.overallStatus}

## CI Context
${renderCiLines(result.ci)}

## AgentLoop Evidence
${renderArtifactLine('Task', result.evidence.task)}
- Verification: ${
    result.evidence.verification
      ? `${result.evidence.verification.overallStatus} - ${result.evidence.verification.path}`
      : 'not found'
  }
${renderArtifactLine('Handoff', result.evidence.handoff)}
- Gates: ${result.gates.overallStatus}

## Gate Details
${result.gates.gates
  .map((gate) => `- [${gate.status}] ${gate.name}: ${gate.message}`)
  .join('\n')}

## Next Action

Run \`${result.nextAction.command}\`.

${result.nextAction.reason}

## Safety

This command reads allowlisted CI metadata and local AgentLoop artifacts only. It does not call CI provider APIs, read secrets, upload files, run verification commands, or inspect environment variables beyond supported CI provenance fields.
`;
}

export async function getCiSummary(options: {
  cwd: string;
  config: AgentLoopConfig;
  env?: NodeJS.ProcessEnv;
  timestamp?: string;
  nowIso?: string;
  write?: boolean;
  outPath?: string;
}): Promise<CiSummaryResult> {
  const timestamp = options.timestamp ?? formatTimestamp();
  const nowIso = options.nowIso ?? new Date().toISOString();
  const reportsDir = path.join(options.cwd, options.config.paths.reportsDir);
  const handoffsDir = path.join(options.cwd, options.config.paths.handoffsDir);
  const taskPath =
    (await getActiveTaskPath(options)) ?? (await getFallbackTaskPath(options));
  const verificationPath = await latestMarkdownFile(reportsDir, {
    pattern: verificationReportPattern,
  });
  const handoffPath = await latestMarkdownFile(handoffsDir, { pattern: prSummaryPattern });
  const [task, verification, handoff, gates] = await Promise.all([
    readTask(options.cwd, taskPath),
    readVerification(options.cwd, verificationPath),
    readHandoff(options.cwd, handoffPath),
    checkGates({ cwd: options.cwd, config: options.config }),
  ]);
  const ci: CiSummaryCiContext = detectCiContext(options.env ?? process.env) ?? {
    provider: 'none',
    providerName: 'No CI detected',
  };
  const withoutMarkdown = {
    timestamp: nowIso,
    ci,
    evidence: {
      task,
      verification,
      handoff,
    },
    gates: {
      overallStatus: gates.overallStatus,
      gates: gates.gates,
    },
    nextAction: chooseNextAction({ verification, gates }),
  };
  const markdown = renderMarkdown(withoutMarkdown);
  const writtenPath = options.write
    ? ((options.outPath
        ? resolveOutputArtifactPath({
            cwd: options.cwd,
            artifactType: 'ci-summary',
            requestedPath: options.outPath,
            expectedDir: options.config.paths.reportsDir,
            expectedExtension: '.md',
          })
        : undefined) ??
      resolveOutputArtifactPath({
        cwd: options.cwd,
        artifactType: 'ci-summary',
        requestedPath: path.join(options.config.paths.reportsDir, `${timestamp}-ci-summary.md`),
        expectedDir: options.config.paths.reportsDir,
        expectedExtension: '.md',
      }))
    : undefined;

  if (writtenPath) await writeTextFile(writtenPath, markdown);

  return {
    ...withoutMarkdown,
    markdown,
    writtenPath,
  };
}
