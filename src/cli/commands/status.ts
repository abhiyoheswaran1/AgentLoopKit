import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { ConfigError } from '../../core/errors.js';
import { getAgentLoopStatus } from '../../core/status.js';
import { printAgentLoopJsonError } from '../json-errors.js';

export function statusCommand() {
  return new Command('status')
    .description('Show active task, latest verification, dirty files, and next action')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      let config: Awaited<ReturnType<typeof loadAgentLoopConfig>>;
      try {
        config = await loadAgentLoopConfig(process.cwd());
      } catch (error) {
        if (options.json && error instanceof ConfigError) {
          printAgentLoopJsonError(error);
          return;
        }
        throw error;
      }
      const result = await getAgentLoopStatus({ cwd: process.cwd(), config });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }
    });
}
