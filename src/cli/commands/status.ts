import { Command } from 'commander';
import { loadAgentLoopWorkspace } from '../../core/config.js';
import { ConfigError } from '../../core/errors.js';
import { getAgentLoopStatus } from '../../core/status.js';
import { printAgentLoopJsonError } from '../json-errors.js';

export function statusCommand() {
  return new Command('status')
    .description('Show active task, latest verification, dirty files, and next action')
    .option('--json', 'print machine-readable output')
    .option('--brief', 'print compact human-readable output')
    .action(async (options: { json?: boolean; brief?: boolean }) => {
      let workspace: Awaited<ReturnType<typeof loadAgentLoopWorkspace>>;
      try {
        workspace = await loadAgentLoopWorkspace(process.cwd());
      } catch (error) {
        if (options.json && error instanceof ConfigError) {
          printAgentLoopJsonError(error);
          return;
        }
        throw error;
      }
      const result = await getAgentLoopStatus({ cwd: workspace.cwd, config: workspace.config });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else if (options.brief) {
        console.log(result.brief);
      } else {
        console.log(result.markdown);
      }
    });
}
