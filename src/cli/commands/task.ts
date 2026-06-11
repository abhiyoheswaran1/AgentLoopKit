import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { AgentLoopError } from '../../core/errors.js';
import {
  archiveTask,
  clearActiveTask,
  getActiveTask,
  inspectTaskDirectory,
  listTasks,
  readTaskContract,
  setActiveTask,
  TASK_STATUSES,
  updateTaskStatus,
} from '../../core/task-state.js';
import type {
  ActiveTask,
  ArchivedTask,
  ListedTask,
  TaskContract,
  TaskDoctorResult,
} from '../../core/task-state.js';

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

function printTaskContract(task: TaskContract, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ task }, null, 2));
    return;
  }
  process.stdout.write(task.content);
}

function printUpdatedTask(task: ActiveTask, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ task }, null, 2));
    return;
  }
  console.log(`Updated task status: ${task.title} (${task.status})`);
  console.log(task.path);
}

function printArchivedTask(task: ArchivedTask, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ task }, null, 2));
    return;
  }
  console.log(`Archived task: ${task.title} (${task.status})`);
  console.log(`${task.previousPath} -> ${task.path}`);
}

function printTaskDoctor(result: TaskDoctorResult, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ taskDoctor: result }, null, 2));
    return;
  }

  console.log('# AgentLoopKit Task Doctor');
  console.log('');
  console.log(`Status: ${result.overallStatus}`);
  console.log(`Checked: ${result.counts.checked}`);
  console.log(`Diagnostics: ${result.counts.diagnostics}`);

  if (result.diagnostics.length === 0) {
    console.log('');
    console.log('No task folder hygiene issues found.');
    return;
  }

  console.log('');
  for (const diagnostic of result.diagnostics) {
    console.log(`- [${diagnostic.severity}] ${diagnostic.id}: ${diagnostic.title}`);
    console.log(`  Path: ${diagnostic.path}`);
    console.log(`  Status: ${diagnostic.status}`);
    console.log(`  ${diagnostic.message}`);
    console.log(`  Recommendation: ${diagnostic.recommendation}`);
  }

  console.log('');
  console.log('Next steps:');
  console.log('- Archive terminal task contracts after verification and handoff.');
  console.log(
    '- Normalize missing or legacy status lines before relying on fallback task selection.',
  );
}

function printJsonError(error: AgentLoopError, details: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          ...details,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

export function taskCommand() {
  const command = new Command('task').description(
    'List, inspect, update, or archive task contracts',
  );

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
    .command('show')
    .argument('<path>', 'task contract path under .agentloop/tasks')
    .option('--json', 'print machine-readable output')
    .description('Show a task contract')
    .action(async (taskPath: string, options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const task = await readTaskContract({ cwd: process.cwd(), config, taskPath });
      printTaskContract(task, options);
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
    .command('status')
    .argument('<path>', 'task contract path under .agentloop/tasks')
    .argument('<status>', 'one of: proposed, in-progress, blocked, deferred, review, done')
    .option('--json', 'print machine-readable output')
    .description('Update a task contract status')
    .action(async (taskPath: string, status: string, options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      let task: ActiveTask;
      try {
        task = await updateTaskStatus({ cwd: process.cwd(), config, taskPath, status });
      } catch (error) {
        if (
          options.json &&
          error instanceof AgentLoopError &&
          error.code === 'UNSUPPORTED_TASK_STATUS'
        ) {
          printJsonError(error, {
            message: `Unsupported task status "${status}".`,
            requestedStatus: status,
            supportedStatuses: TASK_STATUSES,
          });
          return;
        }
        throw error;
      }
      printUpdatedTask(task, options);
    });

  command
    .command('archive')
    .argument('<path>', 'task contract path under .agentloop/tasks')
    .option('--json', 'print machine-readable output')
    .description('Archive a task contract')
    .action(async (taskPath: string, options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const task = await archiveTask({ cwd: process.cwd(), config, taskPath });
      printArchivedTask(task, options);
    });

  command
    .command('doctor')
    .option('--json', 'print machine-readable output')
    .description('Check task folder hygiene')
    .action(async (options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const result = await inspectTaskDirectory({ cwd: process.cwd(), config });
      printTaskDoctor(result, options);
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
