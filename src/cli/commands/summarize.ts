import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { summarizeRepository } from '../../core/pr-summary.js';

async function runSummaryCommand(options: Record<string, unknown>, defaultWrite: boolean) {
  const config = await loadAgentLoopConfig(process.cwd());
  const writeOption = typeof options.write === 'boolean' ? options.write : defaultWrite;
  const result = await summarizeRepository({
    cwd: process.cwd(),
    config,
    taskPath: typeof options.task === 'string' ? options.task : undefined,
    reportPath: typeof options.report === 'string' ? options.report : undefined,
    write: writeOption,
  });
  if (options.json || options.format === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.markdown);
    if (writeOption) console.log(`\nSummary written: ${result.outPath}`);
  }
}

export function summarizeCommand() {
  return new Command('summarize')
    .description('Generate a deterministic PR/reviewer summary')
    .option('--task <path>', 'task contract path')
    .option('--report <path>', 'verification report path')
    .option('--format <format>', 'markdown or json', 'markdown')
    .option('--write', 'write summary to .agentloop/handoffs')
    .option('--json', 'print JSON output')
    .action((options: Record<string, unknown>) => runSummaryCommand(options, false));
}

export function handoffCommand() {
  return new Command('handoff')
    .description('Generate and write a deterministic reviewer handoff')
    .option('--task <path>', 'task contract path')
    .option('--report <path>', 'verification report path')
    .option('--format <format>', 'markdown or json', 'markdown')
    .option('--no-write', 'print handoff without writing a file')
    .option('--json', 'print JSON output')
    .action((options: Record<string, unknown>) => runSummaryCommand(options, true));
}
