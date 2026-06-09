import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { clearActiveTask, getActiveTask, setActiveTask } from '../../core/task-state.js';

function printTask(
  task: Awaited<ReturnType<typeof getActiveTask>> | null,
  options: { json?: boolean },
) {
  if (options.json) {
    console.log(JSON.stringify({ activeTask: task ?? null }, null, 2));
    return;
  }
  if (!task) {
    console.log('No active task set.');
    console.log('Run `agentloop task set <path>` to pin one.');
    return;
  }
  console.log(`Active task: ${task.title} (${task.status})`);
  console.log(task.path);
}

export function taskCommand() {
  const command = new Command('task').description('Set, inspect, or clear the active task');

  command
    .command('set')
    .argument('<path>', 'task contract path under .agentloop/tasks')
    .option('--json', 'print machine-readable output')
    .description('Set the active task contract')
    .action(async (taskPath: string, options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const activeTask = await setActiveTask({ cwd: process.cwd(), config, taskPath });
      printTask(activeTask, options);
    });

  command
    .command('current')
    .option('--json', 'print machine-readable output')
    .description('Print the active task contract')
    .action(async (options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const activeTask = await getActiveTask({ cwd: process.cwd(), config });
      printTask(activeTask ?? null, options);
    });

  command
    .command('clear')
    .option('--json', 'print machine-readable output')
    .description('Clear the active task pointer')
    .action(async (options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      await clearActiveTask({ cwd: process.cwd(), config });
      printTask(null, options);
    });

  return command;
}
