import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { clearActiveTask, getActiveTask, listTasks, setActiveTask } from '../../core/task-state.js';
import type { ListedTask } from '../../core/task-state.js';

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

function printTasks(tasks: ListedTask[], options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ tasks }, null, 2));
    return;
  }
  if (tasks.length === 0) {
    console.log('No task contracts found.');
    console.log('Run `agentloop create-task --title "Your task"` to create one.');
    return;
  }
  console.log('Task contracts:');
  for (const task of tasks) {
    const marker = task.active ? '*' : '-';
    const activeLabel = task.active ? ' active' : '';
    console.log(`${marker} ${task.title} (${task.status})${activeLabel}`);
    console.log(`  ${task.path}`);
  }
}

export function taskCommand() {
  const command = new Command('task').description('List, set, inspect, or clear task contracts');

  command
    .command('list')
    .option('--json', 'print machine-readable output')
    .description('List task contracts')
    .action(async (options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const tasks = await listTasks({ cwd: process.cwd(), config });
      printTasks(tasks, options);
    });

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
