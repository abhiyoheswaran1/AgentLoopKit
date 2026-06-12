import { Command } from 'commander';
import {
  ArtifactPathError,
  OutputPathError,
  resolveExplicitArtifactPath,
} from '../../core/artifacts.js';
import { AgentLoopConfig } from '../../core/config.js';
import { formatTimestamp } from '../../core/dates.js';
import { getCurrentTaskPath } from '../../core/evidence.js';
import { getGitStatus, parseGitStatus } from '../../core/git.js';
import { inlineCode } from '../../core/markdown-format.js';
import { writeVerificationRun } from '../../core/runs.js';
import { readTaskMetadata } from '../../core/task-state.js';
import { runVerification, VerificationProgressEvent } from '../../core/verification.js';
import { toSafeDisplayPath } from '../../core/display-path.js';
import {
  CliOptionError,
  loadWorkspaceForJsonCommand,
  printAgentLoopJsonError,
  printOutputPathJsonError,
} from '../json-errors.js';

function collect(value: string, previous: string[]) {
  previous.push(value);
  return previous;
}

function parseTimeoutMs(value: unknown) {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('Timeout must be a positive integer in milliseconds.');
  }
  return parsed;
}

function formatProgressStatus(event: Extract<VerificationProgressEvent, { event: 'finish' }>) {
  if (event.status === 'pass') return 'passed';
  if (event.status === 'timeout') return 'timed out';
  return 'failed';
}

function printVerificationProgress(event: VerificationProgressEvent) {
  if (event.event === 'start') {
    console.log(
      `[${event.index}/${event.total}] ${event.key} started: ${inlineCode(event.command)}`,
    );
    return;
  }

  const exitSuffix = event.status === 'pass' ? '' : ` (exit ${event.exitCode})`;
  console.log(
    `[${event.index}/${event.total}] ${event.key} ${formatProgressStatus(event)} in ${
      event.durationMs
    }ms${exitSuffix}`,
  );
}

function printArtifactPathJsonError(error: ArtifactPathError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          artifactType: error.artifactType,
          requestedPath: error.requestedPath,
          expectedDir: error.expectedDir,
          reason: error.reason,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

function validateOnlyTaskCommands(options: {
  onlyTaskCommands?: boolean;
  taskCommands?: boolean;
  taskPath?: string;
  json?: boolean;
}) {
  if (!options.onlyTaskCommands) return true;

  const error = !options.taskPath
    ? new CliOptionError(
        '--only-task-commands requires --task.',
        'ONLY_TASK_COMMANDS_REQUIRES_TASK',
        {
          option: 'only-task-commands',
          requiredOption: 'task',
        },
      )
    : options.taskCommands !== true
      ? new CliOptionError(
          '--only-task-commands requires --task-commands.',
          'ONLY_TASK_COMMANDS_REQUIRES_TASK_COMMANDS',
          {
            option: 'only-task-commands',
            requiredOption: 'task-commands',
          },
        )
      : undefined;

  if (!error) return true;
  if (options.json) {
    printAgentLoopJsonError(error);
    return false;
  }

  throw error;
}

async function resolveTaskForRun(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath?: string;
}) {
  const taskPath = options.taskPath
    ? await resolveExplicitArtifactPath({
        cwd: options.cwd,
        artifactType: 'task',
        requestedPath: options.taskPath,
        expectedDir: options.config.paths.tasksDir,
      })
    : await getCurrentTaskPath({ cwd: options.cwd, config: options.config });

  if (!taskPath) return null;
  try {
    return await readTaskMetadata(options.cwd, taskPath);
  } catch {
    return null;
  }
}

export function verifyCommand() {
  return new Command('verify')
    .description('Run configured verification commands and write a report')
    .option('--task <path>', 'task contract path for humans to cross-reference')
    .option('--task-commands', 'also run verification commands listed in the task contract')
    .option(
      '--only-task-commands',
      'run only task contract verification commands; requires --task and --task-commands',
    )
    .option('--json', 'print machine-readable output')
    .option('--no-build', 'skip build command')
    .option('--no-test', 'skip test command')
    .option('--no-lint', 'skip lint command')
    .option('--no-typecheck', 'skip typecheck command')
    .option('--command <command>', 'custom command to run', collect, [])
    .option('--timeout-ms <ms>', 'per-command timeout in milliseconds')
    .option('--progress', 'print bounded per-command progress in human output')
    .option('--write-run', 'write a local run ledger entry under .agentloop/runs')
    .action(async (options: Record<string, unknown>) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json === true);
      if (!workspace) return;
      const taskPath = typeof options.task === 'string' ? options.task : undefined;
      if (
        !validateOnlyTaskCommands({
          onlyTaskCommands: options.onlyTaskCommands === true,
          taskCommands: options.taskCommands === true,
          taskPath,
          json: options.json === true,
        })
      ) {
        return;
      }
      if (options.json && taskPath) {
        try {
          await resolveExplicitArtifactPath({
            cwd: workspace.cwd,
            artifactType: 'task',
            requestedPath: taskPath,
            expectedDir: workspace.config.paths.tasksDir,
          });
        } catch (error) {
          if (error instanceof ArtifactPathError) {
            printArtifactPathJsonError(error);
            return;
          }
          throw error;
        }
      }
      let result: Awaited<ReturnType<typeof runVerification>>;
      try {
        result = await runVerification({
          cwd: workspace.cwd,
          config: workspace.config,
          taskPath,
          taskCommands: options.taskCommands === true,
          skip: {
            build: options.onlyTaskCommands === true || options.build === false,
            test: options.onlyTaskCommands === true || options.test === false,
            lint: options.onlyTaskCommands === true || options.lint === false,
            typecheck: options.onlyTaskCommands === true || options.typecheck === false,
          },
          customCommands: options.command as string[],
          timeoutMs: parseTimeoutMs(options.timeoutMs),
          onProgress:
            options.progress === true && options.json !== true ? printVerificationProgress : undefined,
        });
      } catch (error) {
        if (options.json && error instanceof OutputPathError) {
          printOutputPathJsonError(error);
          return;
        }
        throw error;
      }
      let run: Awaited<ReturnType<typeof writeVerificationRun>> | undefined;
      if (options.writeRun === true) {
        const changedFiles = await parseGitStatus(await getGitStatus(workspace.cwd));
        run = await writeVerificationRun({
          cwd: workspace.cwd,
          timestamp: formatTimestamp(),
          task: await resolveTaskForRun({
            cwd: workspace.cwd,
            config: workspace.config,
            taskPath,
          }),
          verificationReportPath: result.reportPath,
          overallStatus: result.overallStatus,
          changedFiles,
          markdown: result.markdown,
        });
      }

      const publicResult = {
        ...result,
        reportPath: toSafeDisplayPath(workspace.cwd, result.reportPath),
      };
      const publicRun = run
        ? {
            ...run,
            path: toSafeDisplayPath(workspace.cwd, run.path),
          }
        : undefined;
      const output = publicRun ? { ...publicResult, run: publicRun } : publicResult;
      if (options.json) console.log(JSON.stringify(output, null, 2));
      else {
        console.log(
          `Verification report written: ${inlineCode(
            publicResult.reportPath,
          )}\nOverall status: ${inlineCode(result.overallStatus)}`,
        );
        if (publicRun) console.log(`Run written: ${inlineCode(publicRun.path)}`);
      }
      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
