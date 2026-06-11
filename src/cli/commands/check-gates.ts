import { Command } from 'commander';
import { loadAgentLoopWorkspace } from '../../core/config.js';
import { ConfigError } from '../../core/errors.js';
import { checkGates } from '../../core/check-gates.js';
import { printAgentLoopJsonError } from '../json-errors.js';

export function checkGatesCommand() {
  return new Command('check-gates')
    .description('Check whether task, verification, handoff, harness, policy, and git gates pass')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warning gates as failures')
    .action(async (options: { json?: boolean; strict?: boolean }) => {
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
      const result = await checkGates({
        cwd: workspace.cwd,
        config: workspace.config,
        strict: options.strict,
      });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }
      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
