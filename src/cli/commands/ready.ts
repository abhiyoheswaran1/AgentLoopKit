import { Command } from 'commander';
import { evaluateReady } from '../../core/ready.js';
import { redactLocalRoots } from '../../core/redaction.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

export function readyCommand() {
  return new Command('ready')
    .description('Check whether local agent work is ready for review')
    .option('--strict', 'exit non-zero when readiness is blocked')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { strict?: boolean; json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await evaluateReady({
        cwd: workspace.cwd,
        config: workspace.config,
      });
      const output = options.json ? JSON.stringify(result, null, 2) : result.markdown;
      console.log(
        options.redactPaths === true ? redactLocalRoots(output, [workspace.cwd]) : output,
      );
      if (options.strict && result.status !== 'ready') {
        process.exitCode = 1;
      }
    });
}
