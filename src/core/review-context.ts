import type { AgentLoopConfig } from './config.js';
import {
  getArtifactInventory,
  renderArtifactInventoryJson,
  type ArtifactInventory,
} from './artifacts.js';
import { checkGates } from './check-gates.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { singleLineInlineCode as inlineCode } from './markdown-format.js';
import { readGithubMetadataContext, type GithubMetadataContext } from './github-metadata.js';
import { getPolicyStatus } from './policy.js';
import { listRuns } from './runs.js';
import { getAgentLoopStatus } from './status.js';
import { readTaskContract } from './task-state.js';
import type { GitFileStatus } from './git.js';
import { listItems, sectionContent } from './markdown-sections.js';
import {
  buildEvidenceMap,
  renderEvidenceMapCompactMarkdown,
  type EvidenceMap,
} from './evidence-map.js';
import {
  buildContextBudget,
  renderContextBudgetCompactMarkdown,
  type ContextBudgetSummary,
} from './context-budget.js';

async function readActiveTaskRiskNoteCount(options: {
  cwd: string;
  config: AgentLoopConfig;
  activeTaskPath?: string;
}) {
  if (!options.activeTaskPath) return null;
  try {
    const task = await readTaskContract({
      cwd: options.cwd,
      config: options.config,
      taskPath: options.activeTaskPath,
    });
    return { count: listItems(sectionContent(task.content, 'Risk Notes')).length };
  } catch {
    return null;
  }
}

export async function getReviewContext(options: {
  cwd: string;
  config: AgentLoopConfig;
  redactPaths?: boolean;
}) {
  const [status, gates, policies, inventory, runs, githubMetadata] = await Promise.all([
    getAgentLoopStatus({
      cwd: options.cwd,
      config: options.config,
      redactPaths: options.redactPaths,
    }),
    checkGates({ cwd: options.cwd, config: options.config, redactPaths: options.redactPaths }),
    getPolicyStatus({ cwd: options.cwd, config: options.config }),
    getArtifactInventory({ cwd: options.cwd, config: options.config }),
    listRuns(options.cwd),
    readGithubMetadataContext({ cwd: options.cwd, config: options.config }),
  ]);
  const evidenceMap = await buildEvidenceMap({ cwd: options.cwd, config: options.config });
  const contextBudget = buildContextBudget({ evidenceMap });
  const recentRuns = runs.slice(0, 5);
  const latestShip =
    recentRuns.find((run) => run.command === 'ship' && run.score !== undefined) ?? null;
  const activeTaskRiskNotes = await readActiveTaskRiskNoteCount({
    cwd: options.cwd,
    config: options.config,
    activeTaskPath: status.activeTask?.path,
  });

  return {
    status: {
      project: status.project,
      workingTree: status.workingTree,
      activeTask: status.activeTask,
      activeTaskRiskNotes,
      latestTask: status.latestTask,
      latestVerification: status.latestReport
        ? {
            path: status.latestReport.path,
            title: status.latestReport.title,
            overallStatus: status.latestReport.overallStatus,
          }
        : null,
      latestRun: status.latestRun,
      nextAction: status.nextAction,
    },
    gates: {
      strict: gates.strict,
      overallStatus: gates.overallStatus,
      gates: gates.gates,
      nextAction: gates.nextAction,
    },
    policies,
    artifacts: renderArtifactInventoryJson(inventory) as ArtifactInventory,
    evidenceMap,
    contextBudget,
    recentRuns,
    latestShip: latestShip
      ? {
          id: latestShip.id,
          score: latestShip.score,
          shipReportPath: latestShip.shipReportPath,
        }
      : null,
    githubMetadata,
    safety: {
      readOnly: true,
      includesMarkdownContent: false,
      commandsRun: [],
    },
  };
}

function formatTask(task: Awaited<ReturnType<typeof getReviewContext>>['status']['activeTask']) {
  if (!task) return 'none';
  return `${inlineCode(task.title)} (${inlineCode(task.status)}) - ${inlineCode(task.path)}`;
}

function formatActiveTaskRiskNotes(
  status: Awaited<ReturnType<typeof getReviewContext>>['status'],
) {
  if (!status.activeTask) return '';
  const count = status.activeTaskRiskNotes?.count ?? 0;
  return `- Active task risk notes: ${inlineCode(String(count))} recorded\n`;
}

function formatLatestVerification(
  report: Awaited<ReturnType<typeof getReviewContext>>['status']['latestVerification'],
) {
  if (!report) return 'missing';
  return `${inlineCode(report.overallStatus)} - ${inlineCode(report.path)}`;
}

function formatLatestVerificationLabel(
  status: Awaited<ReturnType<typeof getReviewContext>>['status'],
) {
  return status.activeTask || status.latestTask
    ? 'Latest verification'
    : 'Latest previous verification';
}

function formatGateSummary(context: Awaited<ReturnType<typeof getReviewContext>>) {
  const taskGate = context.gates.gates.find((item) => item.id === 'task-contract');
  const source = formatTaskGateEvidenceSource(context, taskGate);
  const suffix = source ? ` (task evidence: ${inlineCode(source)})` : '';
  return `${inlineCode(context.gates.overallStatus)}${suffix}`;
}

function formatTaskGateEvidenceSource(
  context: Awaited<ReturnType<typeof getReviewContext>>,
  taskGate: Awaited<ReturnType<typeof getReviewContext>>['gates']['gates'][number] | undefined,
) {
  if (!taskGate) return undefined;
  if (taskGate.status === 'fail' || !taskGate.path) return 'Missing task evidence';
  if (context.status.activeTask?.path === taskGate.path) return 'Active task evidence';
  if (context.status.latestTask?.path === taskGate.path) return 'Latest open task evidence';
  if (/(^|[\\/])archive[\\/]/.test(taskGate.path)) return 'Archived task evidence';
  return 'Task evidence';
}

function formatLatestShip(ship: Awaited<ReturnType<typeof getReviewContext>>['latestShip']) {
  if (!ship?.score) return 'none';
  const report = ship.shipReportPath ? ` - ${inlineCode(ship.shipReportPath)}` : '';
  return `${inlineCode(String(ship.score))}/100${report}`;
}

function formatArtifactSummary(
  artifacts: Awaited<ReturnType<typeof getReviewContext>>['artifacts'],
) {
  const placeholderCount = artifacts.tasks.agentFlightPlaceholders?.count ?? 0;
  const placeholderPart =
    placeholderCount > 0
      ? `, ${inlineCode(String(placeholderCount))} AgentFlight placeholder task(s)`
      : '';
  return `${inlineCode(String(artifacts.tasks.count))} task(s)${placeholderPart}, ${inlineCode(
    String(artifacts.verificationReports.count),
  )} verification report(s), ${inlineCode(String(artifacts.handoffs.count))} handoff(s)`;
}

function formatChangedFileScope(
  run: Awaited<ReturnType<typeof getReviewContext>>['recentRuns'][number],
  recentRunChangedFiles: Map<string, GitFileStatus[]> | undefined,
) {
  if (!recentRunChangedFiles?.has(run.id)) return undefined;
  const changedFiles = recentRunChangedFiles.get(run.id) ?? [];
  const count = changedFiles.length > 0 ? changedFiles.length : run.changedFileCount;
  const prefix = `${inlineCode(String(count))} changed file(s)`;
  if (changedFiles.length === 0) return prefix;

  const agentLoopEvidenceCount = changedFiles.filter((file) =>
    isAgentLoopEvidenceFile(file.path),
  ).length;
  if (agentLoopEvidenceCount === 0) return prefix;

  const nonEvidenceCount = changedFiles.length - agentLoopEvidenceCount;
  return `${prefix} (${inlineCode(String(nonEvidenceCount))} non-evidence, ${inlineCode(
    String(agentLoopEvidenceCount),
  )} AgentLoop evidence)`;
}

function formatRecentRuns(
  runs: Awaited<ReturnType<typeof getReviewContext>>['recentRuns'],
  recentRunChangedFiles?: Map<string, GitFileStatus[]>,
) {
  if (!runs.length) return 'none';
  return runs
    .slice(0, 3)
    .map((run) => {
      const changedFileScope = formatChangedFileScope(run, recentRunChangedFiles);
      const result =
        run.score === undefined
          ? run.overallStatus
            ? [inlineCode(run.overallStatus), changedFileScope].filter(Boolean).join(' - ')
            : changedFileScope ?? `${inlineCode(String(run.changedFileCount))} changed file(s)`
          : [`${inlineCode(String(run.score))}/100`, changedFileScope].filter(Boolean).join(' - ');
      return `- ${inlineCode(run.command)} ${result} - ${inlineCode(run.id)}`;
    })
    .join('\n');
}

function formatGithubMetadata(metadata: GithubMetadataContext) {
  if (metadata.status === 'missing') return `missing - ${inlineCode(metadata.path)}`;
  if (metadata.status === 'invalid') {
    return `invalid - ${inlineCode(metadata.path)}: ${inlineCode(metadata.message)}`;
  }

  const parts: string[] = [];
  if (metadata.issue) {
    const number = metadata.issue.number === null ? 'unknown' : `#${metadata.issue.number}`;
    parts.push(`issue ${inlineCode(number)} ${inlineCode(metadata.issue.state || 'unknown')}`);
  }
  if (metadata.pullRequest) {
    const number =
      metadata.pullRequest.number === null ? 'unknown' : `#${metadata.pullRequest.number}`;
    parts.push(`PR ${inlineCode(number)} ${inlineCode(metadata.pullRequest.state || 'unknown')}`);
  }
  return parts.length
    ? `${parts.join(', ')} - ${inlineCode(metadata.path)}`
    : `present - ${inlineCode(metadata.path)}`;
}

function formatWorkingTree(context: Awaited<ReturnType<typeof getReviewContext>>['status']) {
  const workingTree = context.workingTree;
  if (!workingTree.dirty) return 'clean';
  return `dirty (${workingTree.changedFileCount}; ${workingTree.nonEvidenceChangedFileCount} non-evidence, ${workingTree.agentLoopEvidenceChangedFileCount} AgentLoop evidence)`;
}

function formatEvidenceMap(context: { evidenceMap?: EvidenceMap }) {
  if (!context.evidenceMap) return '';
  return `${renderEvidenceMapCompactMarkdown(context.evidenceMap)}\n`;
}

function formatContextBudget(context: { contextBudget?: ContextBudgetSummary }) {
  if (!context.contextBudget) return '';
  return `${renderContextBudgetCompactMarkdown(context.contextBudget)}\n`;
}

export function renderReviewContextMarkdown(
  context: Awaited<ReturnType<typeof getReviewContext>>,
  options?: { recentRunChangedFiles?: Map<string, GitFileStatus[]> },
) {
  const policy = context.policies.summary;
  const artifacts = context.artifacts;

  return `# AgentLoopKit Review Context

- Active task: ${formatTask(context.status.activeTask)}
${formatActiveTaskRiskNotes(context.status)}${formatEvidenceMap(context)}${formatContextBudget(
    context,
  )}- ${formatLatestVerificationLabel(context.status)}: ${formatLatestVerification(context.status.latestVerification)}
- Gates: ${formatGateSummary(context)}
- Policy status: ${inlineCode(String(policy.current))} current, ${inlineCode(
    String(policy.modified),
  )} modified, ${inlineCode(String(policy.missing))} missing, ${inlineCode(
    String(policy.extra),
  )} extra
- Artifacts: ${formatArtifactSummary(artifacts)}
- Latest ship score: ${formatLatestShip(context.latestShip)}
- GitHub metadata: ${formatGithubMetadata(context.githubMetadata)}
- Working tree: ${inlineCode(formatWorkingTree(context.status))}

## Recent Runs

${formatRecentRuns(context.recentRuns, options?.recentRunChangedFiles)}

## Next Action

Run ${inlineCode(context.status.nextAction.command)}.

${context.status.nextAction.reason}

## Safety

This snapshot is read-only. It does not run commands, write files, include full Markdown artifact bodies, read ${inlineCode(
    '.env',
  )} contents, or call external APIs.
`;
}
