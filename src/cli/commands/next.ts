import { Command } from 'commander';
import { loadAgentLoopWorkspace } from '../../core/config.js';
import { ConfigError } from '../../core/errors.js';
import { singleLineInlineCode } from '../../core/markdown-format.js';
import { AgentLoopStatusResult, getAgentLoopStatus } from '../../core/status.js';
import { printAgentLoopJsonError } from '../json-errors.js';

type NextActionResult = {
  command: string;
  reason: string;
  activeTask: AgentLoopStatusResult['activeTask'] | null;
  staleTaskState?: AgentLoopStatusResult['staleTaskState'];
  latestTask: AgentLoopStatusResult['latestTask'] | null;
  loopGuidance?: AgentLoopStatusResult['loopGuidance'];
  deferredTasks: AgentLoopStatusResult['deferredTasks'];
  agentFlightPlaceholderTasks: AgentLoopStatusResult['agentFlightPlaceholderTasks'];
  latestReport: AgentLoopStatusResult['latestReport'] | null;
  workingTree: Pick<
    AgentLoopStatusResult['workingTree'],
    'dirty' | 'changedFileCount' | 'nonEvidenceChangedFileCount' | 'agentLoopEvidenceChangedFileCount'
  >;
  commands: AgentLoopStatusResult['commands'];
};

function formatTask(
  task: AgentLoopStatusResult['activeTask'] | AgentLoopStatusResult['latestTask'],
) {
  if (!task) return 'none';
  return `${singleLineInlineCode(task.title)} (${singleLineInlineCode(task.status)}) - ${singleLineInlineCode(task.path)}`;
}

function formatActiveTask(result: NextActionResult) {
  if (result.staleTaskState) {
    return `stale pointer - ${singleLineInlineCode(result.staleTaskState.path)}`;
  }
  return formatTask(result.activeTask);
}

function formatReport(result: NextActionResult) {
  if (!result.latestReport) return 'none';
  return `${singleLineInlineCode(result.latestReport.overallStatus)} - ${singleLineInlineCode(result.latestReport.path)}`;
}

function formatLatestVerificationLabel(result: NextActionResult) {
  return result.activeTask || result.latestTask
    ? 'Latest verification'
    : 'Latest previous verification';
}

function formatDeferredTasks(tasks: AgentLoopStatusResult['deferredTasks']) {
  if (!tasks.length) return 'none';
  const titles = tasks
    .slice(0, 3)
    .map((task) => singleLineInlineCode(task.title))
    .join(', ');
  const remaining = tasks.length > 3 ? `, +${tasks.length - 3} more` : '';
  return `${tasks.length} parked - ${titles}${remaining}`;
}

function formatAgentFlightPlaceholderTasks(
  tasks: AgentLoopStatusResult['agentFlightPlaceholderTasks'],
) {
  if (!tasks.length) return 'none';
  const titles = tasks
    .slice(0, 3)
    .map((task) => singleLineInlineCode(task.title))
    .join(', ');
  const remaining = tasks.length > 3 ? `, +${tasks.length - 3} more` : '';
  return `${tasks.length} preserved - ${titles}${remaining}`;
}

function toNextActionResult(status: AgentLoopStatusResult): NextActionResult {
  return {
    command: status.nextAction.command,
    reason: status.nextAction.reason,
    activeTask: status.activeTask ?? null,
    ...(status.staleTaskState ? { staleTaskState: status.staleTaskState } : {}),
    latestTask: status.latestTask ?? null,
    ...(status.loopGuidance ? { loopGuidance: status.loopGuidance } : {}),
    deferredTasks: status.deferredTasks,
    agentFlightPlaceholderTasks: status.agentFlightPlaceholderTasks,
    latestReport: status.latestReport ?? null,
    workingTree: {
      dirty: status.workingTree.dirty,
      changedFileCount: status.workingTree.changedFileCount,
      nonEvidenceChangedFileCount: status.workingTree.nonEvidenceChangedFileCount,
      agentLoopEvidenceChangedFileCount: status.workingTree.agentLoopEvidenceChangedFileCount,
    },
    commands: status.commands,
  };
}

function formatWorkingTree(workingTree: NextActionResult['workingTree']) {
  if (!workingTree.dirty) return 'clean';
  return `dirty (${workingTree.changedFileCount}; ${workingTree.nonEvidenceChangedFileCount} non-evidence, ${workingTree.agentLoopEvidenceChangedFileCount} AgentLoop evidence)`;
}

function renderNextAction(result: NextActionResult) {
  const workingTree = formatWorkingTree(result.workingTree);
  const loopGuidance = result.loopGuidance
    ? `- Loop guidance: ${singleLineInlineCode(result.loopGuidance.path)}\n`
    : '';
  const nextAction =
    result.command === 'none'
      ? `No command required.\n\n${result.reason}`
      : `Run ${singleLineInlineCode(result.command)}.\n\n${result.reason}`;

  return `# AgentLoopKit Next Action

${nextAction}

- Active task: ${formatActiveTask(result)}
- Latest open task: ${formatTask(result.latestTask)}
${loopGuidance}- Deferred tasks: ${formatDeferredTasks(result.deferredTasks)}
- AgentFlight placeholders: ${formatAgentFlightPlaceholderTasks(result.agentFlightPlaceholderTasks)}
- ${formatLatestVerificationLabel(result)}: ${formatReport(result)}
- Working tree: ${singleLineInlineCode(workingTree)}
`;
}

export function nextCommand() {
  return new Command('next')
    .description('Show the next recommended loop action')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { json?: boolean; redactPaths?: boolean }) => {
      let workspace: Awaited<ReturnType<typeof loadAgentLoopWorkspace>>;
      try {
        workspace = await loadAgentLoopWorkspace(process.cwd());
      } catch (error) {
        if (options.json && error instanceof ConfigError) {
          printAgentLoopJsonError(error);
          return;
        }
        throw error;
      }
      const status = await getAgentLoopStatus({
        cwd: workspace.cwd,
        config: workspace.config,
        redactPaths: options.redactPaths === true,
      });
      const result = toNextActionResult(status);

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(renderNextAction(result));
      }
    });
}
