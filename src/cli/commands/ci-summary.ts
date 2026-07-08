import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import { getCiSummary } from '../../core/ci-summary.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import {
  loadWorkspaceForJsonCommand,
  printOutputPathJsonError,
  validateOutRequiresWrite,
} from '../json-errors.js';

export function ciSummaryCommand() {
  return new Command('ci-summary')
    .description('Summarize CI context and AgentLoop evidence')
    .option('--write', 'write summary to .agentloop/reports')
    .option('--out <path>', 'output Markdown path when using --write')
    .option(
      '--allow-soft-spots',
      'treat unresolved blocking soft spots as a warning instead of a failure',
    )
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output and written summary')
    .action(
      async (options: {
        write?: boolean;
        out?: string;
        allowSoftSpots?: boolean;
        json?: boolean;
        redactPaths?: boolean;
      }) => {
        if (!validateOutRequiresWrite(options)) return;
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        let result: Awaited<ReturnType<typeof getCiSummary>>;
        try {
          result = await getCiSummary({
            cwd: workspace.cwd,
            config: workspace.config,
            write: options.write,
            outPath: options.out,
            allowSoftSpots: options.allowSoftSpots === true,
            redactPaths: options.redactPaths === true,
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
          if (result.writtenPath)
            console.log(`\nCI summary written: ${inlineCode(result.writtenPath)}`);
        }
      },
    );
}
