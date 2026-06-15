import { Command } from 'commander';
import { ArtifactPathError, OutputPathError } from '../../core/artifacts.js';
import { formatTimestamp } from '../../core/dates.js';
import { AgentLoopError } from '../../core/errors.js';
import { inlineCode } from '../../core/markdown-format.js';
import { summarizeRepository } from '../../core/pr-summary.js';
import { writeHandoffRun } from '../../core/runs.js';
import { readTaskMetadata } from '../../core/task-state.js';
import { toSafeDisplayPath } from '../../core/display-path.js';
import { loadWorkspaceForJsonCommand, printOutputPathJsonError } from '../json-errors.js';

const SUPPORTED_OUTPUT_FORMATS = ['markdown', 'json'] as const;
type OutputFormat = (typeof SUPPORTED_OUTPUT_FORMATS)[number];

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

function printOutputFormatJsonError(requestedFormat: string) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: 'UNSUPPORTED_OUTPUT_FORMAT',
          message: `Unsupported output format "${requestedFormat}".`,
          requestedFormat,
          supportedFormats: SUPPORTED_OUTPUT_FORMATS,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

function resolveOutputFormat(options: Record<string, unknown>): OutputFormat | undefined {
  const requestedFormat = typeof options.format === 'string' ? options.format.trim() : 'markdown';
  if ((SUPPORTED_OUTPUT_FORMATS as readonly string[]).includes(requestedFormat)) {
    return requestedFormat as OutputFormat;
  }

  const wantsJson = options.json === true;
  if (wantsJson) {
    printOutputFormatJsonError(requestedFormat);
    return undefined;
  }

  throw new AgentLoopError(
    `Unsupported output format "${requestedFormat}". Use one of: ${SUPPORTED_OUTPUT_FORMATS.join(', ')}.`,
    'UNSUPPORTED_OUTPUT_FORMAT',
  );
}

function publicSummaryResult<T extends Awaited<ReturnType<typeof summarizeRepository>>>(
  cwd: string,
  result: T,
): T {
  return {
    ...result,
    outPath: toSafeDisplayPath(cwd, result.outPath),
    ...(result.reportPath ? { reportPath: toSafeDisplayPath(cwd, result.reportPath) } : {}),
    ...(result.taskPath ? { taskPath: toSafeDisplayPath(cwd, result.taskPath) } : {}),
  };
}

async function runSummaryCommand(options: Record<string, unknown>, defaultWrite: boolean) {
  const format = resolveOutputFormat(options);
  if (!format) return;
  const json = options.json === true || format === 'json';
  const workspace = await loadWorkspaceForJsonCommand(process.cwd(), json);
  if (!workspace) return;
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
      cwd: workspace.cwd,
      config: workspace.config,
      taskPath: typeof options.task === 'string' ? options.task : undefined,
      reportPath,
      write: writeOption,
      redactPaths: options.redactPaths === true,
    });
  } catch (error) {
    if (json && error instanceof ArtifactPathError) {
      printArtifactPathJsonError(error);
      return;
    }
    if (json && error instanceof OutputPathError) {
      printOutputPathJsonError(error);
      return;
    }
    throw error;
  }
  let run: Awaited<ReturnType<typeof writeHandoffRun>> | undefined;
  if (options.writeRun === true) {
    run = await writeHandoffRun({
      cwd: workspace.cwd,
      timestamp: formatTimestamp(),
      task: result.taskPath ? await readTaskMetadata(workspace.cwd, result.taskPath) : null,
      verificationReportPath: result.reportPath,
      handoffPath: writeOption ? result.outPath : undefined,
      changedFiles: result.changedFiles,
      diffStat: result.diffStat,
      markdown: result.markdown,
    });
  }
  const publicResult = publicSummaryResult(workspace.cwd, result);
  const publicRun = run
    ? {
        ...run,
        path: toSafeDisplayPath(workspace.cwd, run.path),
      }
    : undefined;
  const output = publicRun ? { ...publicResult, run: publicRun } : publicResult;
  if (json) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(result.markdown);
    if (writeOption) console.log(`\nSummary written: ${inlineCode(publicResult.outPath)}`);
    if (publicRun) console.log(`Run written: ${inlineCode(publicRun.path)}`);
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
    .option('--write-run', 'write a local run ledger entry under .agentloop/runs')
    .option('--json', 'print JSON output')
    .option('--redact-paths', 'redact local absolute paths in public output')
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
    .option('--write-run', 'write a local run ledger entry under .agentloop/runs')
    .option('--json', 'print JSON output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action((options: Record<string, unknown>) => runSummaryCommand(options, true));
}
