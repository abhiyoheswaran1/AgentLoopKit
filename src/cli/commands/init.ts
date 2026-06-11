import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import { InitSetupError, initializeAgentLoop } from '../../core/init.js';
import { consoleLogger as logger } from '../../core/logger.js';
import { printOutputPathJsonError } from '../json-errors.js';

function formatList(values: string[]) {
  return values.length ? values.join(', ') : 'none';
}

function printInitSetupJsonError(error: InitSetupError) {
  logger.info(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          mode: error.mode,
          reason: error.reason,
          nextCommand: error.nextCommand,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

export function initCommand() {
  return new Command('init')
    .description('Initialize AgentLoopKit in the current repository')
    .option('--dry-run', 'show planned changes without writing files')
    .option('--json', 'print machine-readable output')
    .option('--force', 'allow initialization when the current directory is your home directory')
    .option(
      '--local-only',
      'keep generated AgentLoopKit files out of git by updating this repo clone .git/info/exclude',
    )
    .action(
      async (options: { dryRun?: boolean; json?: boolean; force?: boolean; localOnly?: boolean }) => {
        let result: Awaited<ReturnType<typeof initializeAgentLoop>>;
        try {
          result = await initializeAgentLoop({
            cwd: process.cwd(),
            dryRun: options.dryRun,
            force: options.force,
            localOnly: options.localOnly,
          });
        } catch (error) {
          if (options.json && error instanceof InitSetupError) {
            printInitSetupJsonError(error);
            return;
          }
          if (options.json && error instanceof OutputPathError) {
            printOutputPathJsonError(error);
            return;
          }
          throw error;
        }
        if (options.json) {
          logger.info(JSON.stringify(result, null, 2));
          return;
        }
        logger.info(
          options.dryRun ? 'AgentLoopKit init dry run complete.' : 'AgentLoopKit initialized.',
        );
        logger.info(`Target: ${result.targetDirectory}`);
        logger.info(
          `Project: ${result.project.name || 'unnamed'} (${result.project.type}, ${result.project.packageManager})`,
        );
        logger.info(`Git: ${result.git.isRepository ? 'detected' : 'not detected'}`);
        if (result.git.isRepository) {
          logger.info(`Git root: ${result.git.root}`);
          logger.info(`Git target: ${result.git.targetIsRoot ? 'root directory' : 'subdirectory'}`);
          if (!result.git.targetIsRoot) {
            logger.info(
              'Warning: target is a Git subdirectory. Files will be written to the target directory, not the Git root.',
            );
          }
        }
        logger.info(`Configured commands: ${formatList(result.commands.configured)}`);
        logger.info(`Missing commands: ${formatList(result.commands.missing)}`);
        logger.info(`Created: ${result.created.length}`);
        logger.info(`Updated: ${result.updated.length}`);
        logger.info(`Skipped: ${result.skipped.length}`);
        if (options.dryRun) {
          logger.info('No files written.');
        }
        if (result.localOnly) {
          logger.info('\nLocal-only mode:');
          logger.info(`- Updated exclude file: ${result.localOnly.excludePath}`);
          logger.info(
            '- AgentLoopKit files stay on disk for local agents but stay out of git status.',
          );
          logger.info('- Undo: remove the agentloopkit:local-only block from .git/info/exclude.');
        }
        if (!options.dryRun) {
          logger.info('\nNext steps:');
          logger.info('- Review AGENTS.md and AGENTLOOP.md');
          logger.info('- Run agentloop doctor');
          logger.info('- Create a task with agentloop create-task');
        }
      },
    );
}
