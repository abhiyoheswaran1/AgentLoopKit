import { Command } from 'commander';
import {
  ArtifactPathError,
  OutputPathError,
  resolveExplicitArtifactPath,
} from '../../core/artifacts.js';
import { runVerification } from '../../core/verification.js';
import { loadConfigForJsonCommand, printOutputPathJsonError } from '../json-errors.js';

function collect(value: string, previous: string[]) {
  previous.push(value);
  return previous;
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

export function verifyCommand() {
  return new Command('verify')
    .description('Run configured verification commands and write a report')
    .option('--task <path>', 'task contract path for humans to cross-reference')
    .option('--task-commands', 'also run verification commands listed in the task contract')
    .option('--json', 'print machine-readable output')
    .option('--no-build', 'skip build command')
    .option('--no-test', 'skip test command')
    .option('--no-lint', 'skip lint command')
    .option('--no-typecheck', 'skip typecheck command')
    .option('--command <command>', 'custom command to run', collect, [])
    .action(async (options: Record<string, unknown>) => {
      const config = await loadConfigForJsonCommand(process.cwd(), options.json === true);
      if (!config) return;
      const taskPath = typeof options.task === 'string' ? options.task : undefined;
      if (options.json && taskPath) {
        try {
          await resolveExplicitArtifactPath({
            cwd: process.cwd(),
            artifactType: 'task',
            requestedPath: taskPath,
            expectedDir: config.paths.tasksDir,
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
          cwd: process.cwd(),
          config,
          taskPath,
          taskCommands: options.taskCommands === true,
          skip: {
            build: options.build === false,
            test: options.test === false,
            lint: options.lint === false,
            typecheck: options.typecheck === false,
          },
          customCommands: options.command as string[],
        });
      } catch (error) {
        if (options.json && error instanceof OutputPathError) {
          printOutputPathJsonError(error);
          return;
        }
        throw error;
      }
      if (options.json) console.log(JSON.stringify(result, null, 2));
      else
        console.log(
          `Verification report written: ${result.reportPath}\nOverall status: ${result.overallStatus}`,
        );
      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
