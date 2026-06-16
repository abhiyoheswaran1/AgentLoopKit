import type { AgentLoopConfig } from './config.js';
import {
  getArtifactInventory,
  renderArtifactInventoryJson,
  type ArtifactInventory,
} from './artifacts.js';
import { checkGates } from './check-gates.js';
import { singleLineInlineCode as inlineCode } from './markdown-format.js';
import { readGithubMetadataContext, type GithubMetadataContext } from './github-metadata.js';
import { getPolicyStatus } from './policy.js';
import { listRuns } from './runs.js';
import { getAgentLoopStatus } from './status.js';

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
  const recentRuns = runs.slice(0, 5);
  const latestShip =
    recentRuns.find((run) => run.command === 'ship' && run.score !== undefined) ?? null;

  return {
    status: {
      project: status.project,
      workingTree: status.workingTree,
      activeTask: status.activeTask,
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

function formatLatestVerification(
  report: Awaited<ReturnType<typeof getReviewContext>>['status']['latestVerification'],
) {
  if (!report) return 'missing';
  return `${inlineCode(report.overallStatus)} - ${inlineCode(report.path)}`;
}

function formatLatestShip(ship: Awaited<ReturnType<typeof getReviewContext>>['latestShip']) {
  if (!ship?.score) return 'none';
  const report = ship.shipReportPath ? ` - ${inlineCode(ship.shipReportPath)}` : '';
  return `${inlineCode(String(ship.score))}/100${report}`;
}

function formatRecentRuns(runs: Awaited<ReturnType<typeof getReviewContext>>['recentRuns']) {
  if (!runs.length) return 'none';
  return runs
    .slice(0, 3)
    .map((run) => {
      const result =
        run.score === undefined
          ? run.overallStatus
            ? inlineCode(run.overallStatus)
            : `${inlineCode(String(run.changedFileCount))} changed file(s)`
          : `${inlineCode(String(run.score))}/100`;
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

export function renderReviewContextMarkdown(context: Awaited<ReturnType<typeof getReviewContext>>) {
  const policy = context.policies.summary;
  const artifacts = context.artifacts;

  return `# AgentLoopKit Review Context

- Active task: ${formatTask(context.status.activeTask)}
- Latest verification: ${formatLatestVerification(context.status.latestVerification)}
- Gates: ${inlineCode(context.gates.overallStatus)}
- Policy status: ${inlineCode(String(policy.current))} current, ${inlineCode(
    String(policy.modified),
  )} modified, ${inlineCode(String(policy.missing))} missing, ${inlineCode(
    String(policy.extra),
  )} extra
- Artifacts: ${inlineCode(String(artifacts.tasks.count))} task(s), ${inlineCode(
    String(artifacts.verificationReports.count),
  )} verification report(s), ${inlineCode(String(artifacts.handoffs.count))} handoff(s)
- Latest ship score: ${formatLatestShip(context.latestShip)}
- GitHub metadata: ${formatGithubMetadata(context.githubMetadata)}
- Working tree: ${inlineCode(
    context.status.workingTree.dirty
      ? `dirty (${context.status.workingTree.changedFileCount})`
      : 'clean',
  )}

## Recent Runs

${formatRecentRuns(context.recentRuns)}

## Next Action

Run ${inlineCode(context.status.nextAction.command)}.

${context.status.nextAction.reason}

## Safety

This snapshot is read-only. It does not run commands, write files, include full Markdown artifact bodies, read ${inlineCode(
    '.env',
  )} contents, or call external APIs.
`;
}
