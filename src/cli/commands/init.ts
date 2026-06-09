import { Command } from 'commander';
import { initializeAgentLoop } from '../../core/init.js';
import { consoleLogger as logger } from '../../core/logger.js';

export function initCommand() {
  return new Command('init')
    .description('Initialize AgentLoopKit in the current repository')
    .option('--dry-run', 'show planned changes without writing files')
    .option('--json', 'print machine-readable output')
    .action(async (options: { dryRun?: boolean; json?: boolean }) => {
      const result = await initializeAgentLoop({ cwd: process.cwd(), dryRun: options.dryRun });
      if (options.json) {
        logger.info(JSON.stringify(result, null, 2));
        return;
      }
      logger.info(
        options.dryRun ? 'AgentLoopKit init dry run complete.' : 'AgentLoopKit initialized.',
      );
      logger.info(`Created: ${result.created.length}`);
      logger.info(`Updated: ${result.updated.length}`);
      logger.info(`Skipped: ${result.skipped.length}`);
      if (!options.dryRun) {
        logger.info('\nNext steps:');
        logger.info('- Review AGENTS.md and AGENTLOOP.md');
        logger.info('- Run agentloop doctor');
        logger.info('- Create a task with agentloop create-task');
      }
    });
}
