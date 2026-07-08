import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import { createShipReport, renderShipGithubComment } from '../../core/ship.js';
import { loadWorkspaceForJsonCommand, printOutputPathJsonError } from '../json-errors.js';

function parseTimeoutMs(value: unknown) {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('Timeout must be a positive integer in milliseconds.');
  }
  return parsed;
}

export function shipCommand() {
  return new Command('ship')
    .description('Run the local review-readiness flow for agent-assisted changes')
    .option('--json', 'print machine-readable output')
    .option('--run-verify', 'run verification before scoring instead of reusing current evidence')
    .option('--task-commands', 'when using --run-verify, also run verification commands from the task contract')
    .option('--timeout-ms <ms>', 'per-command verification timeout in milliseconds')
    .option('--strict-gates', 'treat warning gates as readiness gate failures')
    .option(
      '--allow-soft-spots',
      'treat unresolved blocking soft spots as a warning instead of a failure',
    )
    .option('--github-comment', 'include or print GitHub PR comment markdown')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: Record<string, unknown>) => {
      const json = options.json === true;
      const githubComment = options.githubComment === true;
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), json);
      if (!workspace) return;
      let result: Awaited<ReturnType<typeof createShipReport>>;
      try {
        result = await createShipReport({
          cwd: workspace.cwd,
          config: workspace.config,
          runVerify: options.runVerify === true,
          taskCommands: options.taskCommands === true,
          timeoutMs: parseTimeoutMs(options.timeoutMs),
          strictGates: options.strictGates === true,
          allowSoftSpots: options.allowSoftSpots === true,
          redactPaths: options.redactPaths === true,
        });
      } catch (error) {
        if (json && error instanceof OutputPathError) {
          printOutputPathJsonError(error);
          return;
        }
        throw error;
      }

      if (json) {
        console.log(
          JSON.stringify(
            githubComment
              ? { ...result, githubComment: renderShipGithubComment(result, workspace.cwd) }
              : result,
            null,
            2,
          ),
        );
      } else if (githubComment) {
        console.log(renderShipGithubComment(result, workspace.cwd));
      } else {
        console.log(result.markdown);
        console.log(`\nShip report written: ${inlineCode(result.shipReportPath)}`);
      }

      if (result.readiness.blockers.length > 0 || result.gates.overallStatus === 'fail') {
        process.exitCode = 1;
      }
    });
}
