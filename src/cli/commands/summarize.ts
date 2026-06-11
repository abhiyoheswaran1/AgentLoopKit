import { Command } from 'commander';
import { ArtifactPathError } from '../../core/artifacts.js';
import { summarizeRepository } from '../../core/pr-summary.js';
import { loadConfigForJsonCommand } from '../json-errors.js';

function printArtifactPathJsonError(error: ArtifactPathError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          artifactType: error.artifactType,
          requestedPath: error.requestedPath,
          expectedDir: error.expectedDir,
          reason: error.reason,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

async function runSummaryCommand(options: Record<string, unknown>, defaultWrite: boolean) {
  const json = options.json === true || options.format === 'json';
  const config = await loadConfigForJsonCommand(process.cwd(), json);
  if (!config) return;
  const writeOption = typeof options.write === 'boolean' ? options.write : defaultWrite;
  const reportPath =
    typeof options.report === 'string'
      ? options.report
      : typeof options.verification === 'string'
        ? options.verification
        : undefined;
  let result: Awaited<ReturnType<typeof summarizeRepository>>;
  try {
    result = await summarizeRepository({
      cwd: process.cwd(),
      config,
      taskPath: typeof options.task === 'string' ? options.task : undefined,
      reportPath,
      write: writeOption,
    });
  } catch (error) {
    if (json && error instanceof ArtifactPathError) {
      printArtifactPathJsonError(error);
      return;
    }
    throw error;
  }
  if (json) {
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
    .option('--verification <path>', 'alias for --report')
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
    .option('--verification <path>', 'alias for --report')
    .option('--format <format>', 'markdown or json', 'markdown')
    .option('--no-write', 'print handoff without writing a file')
    .option('--json', 'print JSON output')
    .action((options: Record<string, unknown>) => runSummaryCommand(options, true));
}
