import { Command } from 'commander';
import { initializeAgentLoop } from '../../core/init.js';
import { consoleLogger as logger } from '../../core/logger.js';

function formatList(values: string[]) {
  return values.length ? values.join(', ') : 'none';
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
        const result = await initializeAgentLoop({
          cwd: process.cwd(),
          dryRun: options.dryRun,
          force: options.force,
          localOnly: options.localOnly,
        });
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
