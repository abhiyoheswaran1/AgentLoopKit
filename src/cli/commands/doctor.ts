import { Command } from 'commander';
import { runDoctor } from '../../core/doctor.js';

export function doctorCommand() {
  return new Command('doctor')
    .description('Check whether this repo is ready for agentic engineering')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const result = await runDoctor({ cwd: process.cwd() });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }
      if (result.serious.length > 0) process.exitCode = 1;
    });
}
