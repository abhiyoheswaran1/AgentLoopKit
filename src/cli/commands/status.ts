import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { getAgentLoopStatus } from '../../core/status.js';

export function statusCommand() {
  return new Command('status')
    .description('Show active task, latest verification, dirty files, and next action')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const result = await getAgentLoopStatus({ cwd: process.cwd(), config });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }
    });
}
