import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { checkGates } from '../../core/check-gates.js';

export function checkGatesCommand() {
  return new Command('check-gates')
    .description('Check whether task, verification, handoff, harness, policy, and git gates pass')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warning gates as failures')
    .action(async (options: { json?: boolean; strict?: boolean }) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const result = await checkGates({ cwd: process.cwd(), config, strict: options.strict });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }
      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
