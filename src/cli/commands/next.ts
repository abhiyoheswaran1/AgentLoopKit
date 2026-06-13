import { Command } from 'commander';
import { loadAgentLoopWorkspace } from '../../core/config.js';
import { ConfigError } from '../../core/errors.js';
import { inlineCode } from '../../core/markdown-format.js';
import { AgentLoopStatusResult, getAgentLoopStatus } from '../../core/status.js';
import { printAgentLoopJsonError } from '../json-errors.js';

type NextActionResult = {
  command: string;
  reason: string;
  activeTask: AgentLoopStatusResult['activeTask'] | null;
  latestTask: AgentLoopStatusResult['latestTask'] | null;
  deferredTasks: AgentLoopStatusResult['deferredTasks'];
  latestReport: AgentLoopStatusResult['latestReport'] | null;
  workingTree: Pick<AgentLoopStatusResult['workingTree'], 'dirty' | 'changedFileCount'>;
  commands: AgentLoopStatusResult['commands'];
};

function formatTask(
  task: AgentLoopStatusResult['activeTask'] | AgentLoopStatusResult['latestTask'],
) {
  if (!task) return 'none';
  return `${inlineCode(task.title)} (${inlineCode(task.status)}) - ${inlineCode(task.path)}`;
}

function formatReport(result: NextActionResult) {
  if (!result.latestReport) return 'none';
  return `${inlineCode(result.latestReport.overallStatus)} - ${inlineCode(result.latestReport.path)}`;
}

function formatDeferredTasks(tasks: AgentLoopStatusResult['deferredTasks']) {
  if (!tasks.length) return 'none';
  const titles = tasks
    .slice(0, 3)
    .map((task) => inlineCode(task.title))
    .join(', ');
  const remaining = tasks.length > 3 ? `, +${tasks.length - 3} more` : '';
  return `${tasks.length} parked - ${titles}${remaining}`;
}

function toNextActionResult(status: AgentLoopStatusResult): NextActionResult {
  return {
    command: status.nextAction.command,
    reason: status.nextAction.reason,
    activeTask: status.activeTask ?? null,
    latestTask: status.latestTask ?? null,
    deferredTasks: status.deferredTasks,
    latestReport: status.latestReport ?? null,
    workingTree: {
      dirty: status.workingTree.dirty,
      changedFileCount: status.workingTree.changedFileCount,
    },
    commands: status.commands,
  };
}

function renderNextAction(result: NextActionResult) {
  const workingTree = result.workingTree.dirty
    ? `dirty (${result.workingTree.changedFileCount} changed file(s))`
    : 'clean';
  const nextAction =
    result.command === 'none'
      ? `No command required.\n\n${result.reason}`
      : `Run ${inlineCode(result.command)}.\n\n${result.reason}`;

  return `# AgentLoopKit Next Action

${nextAction}

- Active task: ${formatTask(result.activeTask)}
- Latest open task: ${formatTask(result.latestTask)}
- Deferred tasks: ${formatDeferredTasks(result.deferredTasks)}
- Latest verification: ${formatReport(result)}
- Working tree: ${inlineCode(workingTree)}
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
