import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import { getCiSummary } from '../../core/ci-summary.js';
import {
  loadConfigForJsonCommand,
  printOutputPathJsonError,
  validateOutRequiresWrite,
} from '../json-errors.js';

export function ciSummaryCommand() {
  return new Command('ci-summary')
    .description('Summarize CI context and AgentLoop evidence')
    .option('--write', 'write summary to .agentloop/reports')
    .option('--out <path>', 'output Markdown path when using --write')
    .option('--json', 'print machine-readable output')
    .action(async (options: { write?: boolean; out?: string; json?: boolean }) => {
      if (!validateOutRequiresWrite(options)) return;
      const config = await loadConfigForJsonCommand(process.cwd(), options.json);
      if (!config) return;
      let result: Awaited<ReturnType<typeof getCiSummary>>;
      try {
        result = await getCiSummary({
          cwd: process.cwd(),
          config,
          write: options.write,
          outPath: options.out,
        });
      } catch (error) {
        if (options.json && error instanceof OutputPathError) {
          printOutputPathJsonError(error);
          return;
        }
        throw error;
      }

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
        if (result.writtenPath) console.log(`\nCI summary written: ${result.writtenPath}`);
      }
    });
}
