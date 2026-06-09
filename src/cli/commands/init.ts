import { Command } from 'commander';
import { initializeAgentLoop } from '../../core/init.js';
import { consoleLogger as logger } from '../../core/logger.js';

export function initCommand() {
  return new Command('init')
    .description('Initialize AgentLoopKit in the current repository')
    .action(async () => {
      const result = await initializeAgentLoop({ cwd: process.cwd() });
      logger.info('AgentLoopKit initialized.');
      logger.info(`Created: ${result.created.length}`);
      logger.info(`Updated: ${result.updated.length}`);
      logger.info(`Skipped: ${result.skipped.length}`);
      logger.info('\nNext steps:');
      logger.info('- Review AGENTS.md and AGENTLOOP.md');
      logger.info('- Run agentloop doctor');
      logger.info('- Create a task with agentloop create-task');
    });
}
