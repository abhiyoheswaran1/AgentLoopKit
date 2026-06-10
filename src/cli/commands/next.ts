import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { AgentLoopStatusResult, getAgentLoopStatus } from '../../core/status.js';

type NextActionResult = {
  command: string;
  reason: string;
  activeTask: AgentLoopStatusResult['activeTask'] | null;
  latestReport: AgentLoopStatusResult['latestReport'] | null;
  workingTree: Pick<AgentLoopStatusResult['workingTree'], 'dirty' | 'changedFileCount'>;
  commands: AgentLoopStatusResult['commands'];
};

function formatTask(result: NextActionResult) {
  if (!result.activeTask) return 'none';
  return `${result.activeTask.title} (${result.activeTask.status}) - ${result.activeTask.path}`;
}

function formatReport(result: NextActionResult) {
  if (!result.latestReport) return 'none';
  return `${result.latestReport.overallStatus} - ${result.latestReport.path}`;
}

function toNextActionResult(status: AgentLoopStatusResult): NextActionResult {
  return {
    command: status.nextAction.command,
    reason: status.nextAction.reason,
    activeTask: status.activeTask ?? null,
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

  return `# AgentLoopKit Next Action

Run \`${result.command}\`.

${result.reason}

- Active task: ${formatTask(result)}
- Latest verification: ${formatReport(result)}
- Working tree: ${workingTree}
`;
}

export function nextCommand() {
  return new Command('next')
    .description('Show the next recommended loop action')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const status = await getAgentLoopStatus({ cwd: process.cwd(), config });
      const result = toNextActionResult(status);

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(renderNextAction(result));
      }
    });
}
