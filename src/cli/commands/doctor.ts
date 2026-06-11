import { Command } from 'commander';
import { runDoctor } from '../../core/doctor.js';

export function doctorCommand() {
  return new Command('doctor')
    .description('Check whether this repo is ready for agentic engineering')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warnings as failures')
    .action(async (options: { json?: boolean; strict?: boolean }) => {
      const result = await runDoctor({ cwd: process.cwd(), strict: options.strict });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }
      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
