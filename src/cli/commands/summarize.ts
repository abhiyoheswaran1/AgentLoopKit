import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { summarizeRepository } from '../../core/pr-summary.js';

export function summarizeCommand() {
  return new Command('summarize')
    .description('Generate a deterministic PR/reviewer summary')
    .option('--task <path>', 'task contract path')
    .option('--report <path>', 'verification report path')
    .option('--format <format>', 'markdown or json', 'markdown')
    .option('--write', 'write summary to .agentloop/handoffs')
    .option('--json', 'print JSON output')
    .action(async (options: Record<string, unknown>) => {
      const config = await loadAgentLoopConfig(process.cwd());
      const result = await summarizeRepository({
        cwd: process.cwd(),
        config,
        taskPath: typeof options.task === 'string' ? options.task : undefined,
        reportPath: typeof options.report === 'string' ? options.report : undefined,
        write: Boolean(options.write),
      });
      if (options.json || options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
        if (options.write) console.log(`\nSummary written: ${result.outPath}`);
      }
    });
}
