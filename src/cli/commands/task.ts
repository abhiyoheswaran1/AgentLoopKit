import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import type { AgentLoopConfig } from '../../core/config.js';
import { AgentLoopError } from '../../core/errors.js';
import {
  archiveTask,
  archiveTasksByStatus,
  clearActiveTask,
  getActiveTask,
  inspectTaskDirectory,
  listTasks,
  readTaskContract,
  setActiveTask,
  TaskPathError,
  TASK_STATUSES,
  updateTaskStatus,
} from '../../core/task-state.js';
import type {
  ActiveTask,
  ArchivedTask,
  BulkTaskArchiveResult,
  ListedTask,
  TaskContract,
  TaskDoctorResult,
} from '../../core/task-state.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import { redactLocalRoots } from '../../core/redaction.js';
import { loadWorkspaceForJsonCommand, printOutputPathJsonError } from '../json-errors.js';

const TASK_DONE_NEXT_STEP =
  'Next step: run `agentloop status --redact-paths`; if it asks for handoff, run `agentloop handoff --write-run`, then archive the task.';
const TASK_ARCHIVE_NEXT_STEP =
  'Next step: run `agentloop status --redact-paths`; if it asks for handoff, run `agentloop handoff --write-run`.';
const BULK_TASK_ARCHIVE_NEXT_STEP =
  'Next step: run `agentloop status --redact-paths`; if it asks for handoff, run `agentloop handoff --write-run`.';
const AGENTFLIGHT_PLACEHOLDER_HUMAN_LIMIT = 5;
const TASK_LIST_BRIEF_JSON_LIMIT = 3;

type TaskListSummary = {
  count: number;
  hiddenCount: number;
  preview: ListedTask[];
};

type TaskListOptions = {
  json?: boolean;
  brief?: boolean;
  status?: string;
  redactPaths?: boolean;
};

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
  console.log(`Active task: ${inlineCode(task.title)} (${inlineCode(task.status)})`);
  console.log(inlineCode(task.path));
}

function summarizeTaskList(tasks: ListedTask[]): TaskListSummary {
  const preview = tasks.slice(0, TASK_LIST_BRIEF_JSON_LIMIT);
  return {
    count: tasks.length,
    hiddenCount: tasks.length - preview.length,
    preview,
  };
}

function briefTaskListPayload(input: {
  tasks: ListedTask[];
  ordinaryTasks: ListedTask[];
  placeholderTasks: ListedTask[];
  statusFilter?: string;
}) {
  return {
    statusFilter: input.statusFilter ?? null,
    totalCount: input.tasks.length,
    taskContracts: summarizeTaskList(input.ordinaryTasks),
    agentFlightPlaceholders: summarizeTaskList(input.placeholderTasks),
    brief: `AgentLoopKit tasks: total=${input.tasks.length}, taskContracts=${input.ordinaryTasks.length}, agentFlightPlaceholders=${input.placeholderTasks.length}`,
  };
}

function printTasks(tasks: ListedTask[], options: TaskListOptions) {
  const placeholderTasks = tasks.filter((task) => task.source === 'agentflight-placeholder');
  const ordinaryTasks = tasks.filter((task) => task.source !== 'agentflight-placeholder');

  if (options.json) {
    if (options.brief) {
      console.log(
        JSON.stringify(
          briefTaskListPayload({
            tasks,
            ordinaryTasks,
            placeholderTasks,
            statusFilter: options.status,
          }),
          null,
          2,
        ),
      );
      return;
    }
    console.log(
      JSON.stringify(
        {
          tasks,
          taskContracts: ordinaryTasks,
          agentFlightPlaceholders: placeholderTasks,
        },
        null,
        2,
      ),
    );
    return;
  }
  if (tasks.length === 0) {
    console.log('No task contracts found.');
    console.log('Run `agentloop create-task --title "Your task"` to create one.');
    return;
  }

  if (ordinaryTasks.length > 0) {
    console.log('Task contracts:');
    for (const task of ordinaryTasks) {
      printTaskListItem(task);
    }
  }

  if (placeholderTasks.length > 0) {
    if (ordinaryTasks.length > 0) console.log('');
    console.log('AgentFlight placeholders:');
    const shownTasks = placeholderTasks.slice(0, AGENTFLIGHT_PLACEHOLDER_HUMAN_LIMIT);
    for (const task of shownTasks) {
      printTaskListItem(task);
    }
    const hiddenCount = placeholderTasks.length - shownTasks.length;
    if (hiddenCount > 0) {
      console.log(
        `... ${hiddenCount} more AgentFlight placeholder task(s) hidden from human output.`,
      );
      console.log('Run `agentloop task list --json` to inspect all placeholders.');
    }
  }
}

function printTaskListItem(task: ListedTask) {
  const marker = task.active ? '*' : '-';
  const activeLabel = task.active ? ' active' : '';
  const statusLabel =
    task.source === 'agentflight-placeholder'
      ? `${inlineCode(task.status)}, ${inlineCode('AgentFlight placeholder')}`
      : inlineCode(task.status);
  console.log(`${marker} ${inlineCode(task.title)} (${statusLabel})${activeLabel}`);
  console.log(`  ${inlineCode(task.path)}`);
}

function taskContractForOutput(
  task: TaskContract,
  options: { cwd: string; redactPaths?: boolean },
) {
  if (!options.redactPaths) return task;
  return {
    ...task,
    content: redactLocalRoots(task.content, [options.cwd]),
  };
}

function printTaskContract(
  task: TaskContract,
  options: { json?: boolean; cwd: string; redactPaths?: boolean },
) {
  const outputTask = taskContractForOutput(task, options);
  if (options.json) {
    console.log(JSON.stringify({ task: outputTask }, null, 2));
    return;
  }
  process.stdout.write(outputTask.content);
}

function printUpdatedTask(task: ActiveTask, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ task }, null, 2));
    return;
  }
  console.log(`Updated task status: ${inlineCode(task.title)} (${inlineCode(task.status)})`);
  console.log(inlineCode(task.path));
  if (task.status.trim().toLowerCase() === 'done') {
    console.log(TASK_DONE_NEXT_STEP);
  }
}

function printArchivedTask(task: ArchivedTask, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ task }, null, 2));
    return;
  }
  console.log(`Archived task: ${inlineCode(task.title)} (${inlineCode(task.status)})`);
  console.log(`${inlineCode(task.previousPath)} -> ${inlineCode(task.path)}`);
  console.log(TASK_ARCHIVE_NEXT_STEP);
}

function printBulkTaskArchive(result: BulkTaskArchiveResult, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ taskArchive: result }, null, 2));
    return;
  }

  const action = result.dryRun ? 'would archive' : 'archived';
  console.log(
    `Bulk task archive ${result.dryRun ? 'dry run' : 'complete'}: ${action} ${inlineCode(
      String(result.count),
    )} task contract(s) with status ${inlineCode(result.status)}.`,
  );
  for (const task of result.tasks) {
    console.log(`- ${inlineCode(task.title)}`);
    console.log(`  ${inlineCode(task.previousPath)} -> ${inlineCode(task.path)}`);
  }
  if (!result.dryRun) {
    console.log(BULK_TASK_ARCHIVE_NEXT_STEP);
  }
}

function printTaskDoctor(result: TaskDoctorResult, options: { json?: boolean }) {
  if (options.json) {
    console.log(JSON.stringify({ taskDoctor: result }, null, 2));
    return;
  }

  console.log('# AgentLoopKit Task Doctor');
  console.log('');
  console.log(`Status: ${inlineCode(result.overallStatus)}`);
  console.log(`Checked: ${inlineCode(String(result.counts.checked))}`);
  console.log(`Diagnostics: ${inlineCode(String(result.counts.diagnostics))}`);

  if (result.diagnostics.length === 0) {
    console.log('');
    console.log('No task folder hygiene issues found.');
    return;
  }

  console.log('');
  for (const diagnostic of result.diagnostics) {
    console.log(
      `- [${inlineCode(diagnostic.severity)}] ${inlineCode(diagnostic.id)}: ${inlineCode(
        diagnostic.title,
      )}`,
    );
    console.log(`  Path: ${inlineCode(diagnostic.path)}`);
    console.log(`  Status: ${inlineCode(diagnostic.status)}`);
    console.log(`  ${inlineCode(diagnostic.message)}`);
    if (diagnostic.commands?.length) {
      console.log(`  Commands: ${diagnostic.commands.map(inlineCode).join(', ')}`);
    }
    if (diagnostic.evidence?.length) {
      console.log(`  Evidence: ${diagnostic.evidence.map(inlineCode).join(', ')}`);
    }
    if (diagnostic.sections?.length) {
      console.log(`  Sections: ${diagnostic.sections.map(inlineCode).join(', ')}`);
    }
    console.log(`  Recommendation: ${inlineCode(diagnostic.recommendation)}`);
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

function printTaskPathJsonError(error: unknown, options: { json?: boolean }) {
  if (options.json && error instanceof TaskPathError) {
    printJsonError(error, {
      requestedTask: error.requestedTask,
      tasksDir: error.tasksDir,
      reason: error.reason,
    });
    return true;
  }
  return false;
}

function printTaskOutputPathJsonError(error: unknown, options: { json?: boolean }) {
  if (options.json && error instanceof OutputPathError) {
    printOutputPathJsonError(error);
    return true;
  }
  return false;
}

async function updateDoneTask(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath?: string;
}) {
  const taskPath = options.taskPath ?? (await getActiveTask(options))?.path;
  if (!taskPath) {
    throw new AgentLoopError(
      'No active task set. Run `agentloop task set <path>` or pass a task path.',
      'ACTIVE_TASK_NOT_SET',
    );
  }
  return updateTaskStatus({
    cwd: options.cwd,
    config: options.config,
    taskPath,
    status: 'done',
  });
}

export function taskCommand() {
  const command = new Command('task').description(
    'List, inspect, update, complete, or archive task contracts',
  );

  command
    .command('list')
    .option('--json', 'print machine-readable output')
    .option('--brief', 'print compact machine-readable output when combined with --json')
    .option('--status <status>', 'filter task contracts by status')
    .option(
      '--redact-paths',
      'accepted for consistency with shareable evidence commands; task paths are already repo-relative',
    )
    .description('List task contracts')
    .action(async (options: TaskListOptions) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let tasks: ListedTask[];
      try {
        tasks = await listTasks({
          cwd: workspace.cwd,
          config: workspace.config,
          status: options.status,
        });
      } catch (error) {
        if (
          options.json &&
          error instanceof AgentLoopError &&
          error.code === 'UNSUPPORTED_TASK_STATUS'
        ) {
          printJsonError(error, {
            message: `Unsupported task status "${options.status}".`,
            requestedStatus: options.status,
            supportedStatuses: TASK_STATUSES,
          });
          return;
        }
        throw error;
      }
      printTasks(tasks, options);
    });

  command
    .command('show')
    .argument('<path>', 'task contract path under .agentloop/tasks')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .description('Show a task contract')
    .action(async (taskPath: string, options: { json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let task: TaskContract;
      try {
        task = await readTaskContract({ cwd: workspace.cwd, config: workspace.config, taskPath });
      } catch (error) {
        if (printTaskPathJsonError(error, options)) return;
        throw error;
      }
      printTaskContract(task, { ...options, cwd: workspace.cwd });
    });

  command
    .command('set')
    .argument('<path>', 'task contract path under .agentloop/tasks')
    .option('--json', 'print machine-readable output')
    .description('Set the active task contract')
    .action(async (taskPath: string, options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let activeTask: ActiveTask;
      try {
        activeTask = await setActiveTask({
          cwd: workspace.cwd,
          config: workspace.config,
          taskPath,
        });
      } catch (error) {
        if (printTaskPathJsonError(error, options)) return;
        if (printTaskOutputPathJsonError(error, options)) return;
        throw error;
      }
      printTask(activeTask, options);
    });

  command
    .command('status')
    .argument('<path>', 'task contract path under .agentloop/tasks')
    .argument('<status>', 'one of: proposed, in-progress, blocked, deferred, review, done')
    .option('--json', 'print machine-readable output')
    .description('Update a task contract status')
    .action(async (taskPath: string, status: string, options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let task: ActiveTask;
      try {
        task = await updateTaskStatus({
          cwd: workspace.cwd,
          config: workspace.config,
          taskPath,
          status,
        });
      } catch (error) {
        if (printTaskPathJsonError(error, options)) return;
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
    .command('done')
    .argument('[path]', 'task contract path under .agentloop/tasks; defaults to active task')
    .option('--json', 'print machine-readable output')
    .description('Mark a task contract done')
    .action(async (taskPath: string | undefined, options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      let task: ActiveTask;
      try {
        task = await updateDoneTask({
          cwd: workspace.cwd,
          config: workspace.config,
          taskPath,
        });
      } catch (error) {
        if (printTaskPathJsonError(error, options)) return;
        if (options.json && error instanceof AgentLoopError) {
          printJsonError(error);
          return;
        }
        throw error;
      }
      printUpdatedTask(task, options);
    });

  command
    .command('archive')
    .argument('[path]', 'task contract path under .agentloop/tasks')
    .option('--status <status>', 'bulk archive task contracts with this status')
    .option('--dry-run', 'preview bulk archive output without moving task contracts')
    .option('--json', 'print machine-readable output')
    .description('Archive a task contract')
    .action(
      async (
        taskPath: string | undefined,
        options: { status?: string; dryRun?: boolean; json?: boolean },
      ) => {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;

        if (!taskPath && !options.status) {
          const error = new AgentLoopError(
            'Pass a task path or --status <status> to archive task contracts.',
            'TASK_ARCHIVE_TARGET_REQUIRED',
          );
          if (options.json) {
            printJsonError(error);
            return;
          }
          throw error;
        }

        if (taskPath && options.status) {
          const error = new AgentLoopError(
            'Pass either a task path or --status <status>, not both.',
            'TASK_ARCHIVE_AMBIGUOUS_TARGET',
          );
          if (options.json) {
            printJsonError(error);
            return;
          }
          throw error;
        }

        if (taskPath && options.dryRun) {
          const error = new AgentLoopError(
            '--dry-run is only supported with --status bulk archive mode.',
            'TASK_ARCHIVE_DRY_RUN_REQUIRES_STATUS',
          );
          if (options.json) {
            printJsonError(error);
            return;
          }
          throw error;
        }

        if (options.status) {
          let result: BulkTaskArchiveResult;
          try {
            result = await archiveTasksByStatus({
              cwd: workspace.cwd,
              config: workspace.config,
              status: options.status,
              dryRun: options.dryRun,
            });
          } catch (error) {
            if (
              options.json &&
              error instanceof AgentLoopError &&
              (error.code === 'UNSUPPORTED_TASK_STATUS' ||
                error.code === 'TASK_ARCHIVE_STATUS_NOT_TERMINAL')
            ) {
              printJsonError(error, {
                requestedStatus: options.status,
                supportedStatuses: TASK_STATUSES,
              });
              return;
            }
            if (printTaskOutputPathJsonError(error, options)) return;
            throw error;
          }
          printBulkTaskArchive(result, options);
          return;
        }

        const singleTaskPath = taskPath;
        if (!singleTaskPath) {
          throw new AgentLoopError(
            'Pass a task path or --status <status> to archive task contracts.',
            'TASK_ARCHIVE_TARGET_REQUIRED',
          );
        }

        let task: ArchivedTask;
        try {
          task = await archiveTask({
            cwd: workspace.cwd,
            config: workspace.config,
            taskPath: singleTaskPath,
          });
        } catch (error) {
          if (printTaskPathJsonError(error, options)) return;
          if (printTaskOutputPathJsonError(error, options)) return;
          throw error;
        }
        printArchivedTask(task, options);
      },
    );

  command
    .command('doctor')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'accepted for consistency with shareable evidence commands; task paths are already repo-relative',
    )
    .description('Check task folder hygiene')
    .action(async (options: { json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await inspectTaskDirectory({ cwd: workspace.cwd, config: workspace.config });
      printTaskDoctor(result, options);
    });

  command
    .command('current')
    .option('--json', 'print machine-readable output')
    .description('Print the active task contract')
    .action(async (options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const activeTask = await getActiveTask({ cwd: workspace.cwd, config: workspace.config });
      printTask(activeTask ?? null, options);
    });

  command
    .command('clear')
    .option('--json', 'print machine-readable output')
    .description('Clear the active task pointer')
    .action(async (options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      try {
        await clearActiveTask({ cwd: workspace.cwd, config: workspace.config });
      } catch (error) {
        if (printTaskOutputPathJsonError(error, options)) return;
        throw error;
      }
      printTask(null, options);
    });

  return command;
}
