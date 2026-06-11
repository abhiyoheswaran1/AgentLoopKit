import { Command } from 'commander';
import { getCiSummary } from '../../core/ci-summary.js';
import { loadConfigForJsonCommand } from '../json-errors.js';

export function ciSummaryCommand() {
  return new Command('ci-summary')
    .description('Summarize CI context and AgentLoop evidence')
    .option('--write', 'write summary to .agentloop/reports')
    .option('--out <path>', 'output Markdown path when using --write')
    .option('--json', 'print machine-readable output')
    .action(async (options: { write?: boolean; out?: string; json?: boolean }) => {
      const config = await loadConfigForJsonCommand(process.cwd(), options.json);
      if (!config) return;
      const result = await getCiSummary({
        cwd: process.cwd(),
        config,
        write: options.write,
        outPath: options.out,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
        if (result.writtenPath) console.log(`\nCI summary written: ${result.writtenPath}`);
      }
    });
}
