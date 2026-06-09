import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { runVerification } from '../../core/verification.js';

function collect(value: string, previous: string[]) {
  previous.push(value);
  return previous;
}

export function verifyCommand() {
  return new Command('verify')
    .description('Run configured verification commands and write a report')
    .option('--task <path>', 'task contract path for humans to cross-reference')
    .option('--json', 'print machine-readable output')
    .option('--no-build', 'skip build command')
    .option('--no-test', 'skip test command')
    .option('--no-lint', 'skip lint command')
    .option('--no-typecheck', 'skip typecheck command')
    .option('--command <command>', 'custom command to run', collect, [])
    .action(async (options: Record<string, unknown>) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const result = await runVerification({
        cwd: process.cwd(),
        config,
        skip: {
          build: options.build === false,
          test: options.test === false,
          lint: options.lint === false,
          typecheck: options.typecheck === false,
        },
        customCommands: options.command as string[],
      });
      if (options.json) console.log(JSON.stringify(result, null, 2));
      else
        console.log(
          `Verification report written: ${result.reportPath}\nOverall status: ${result.overallStatus}`,
        );
      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
