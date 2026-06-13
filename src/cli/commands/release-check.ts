import { Command } from 'commander';
import { checkReleaseReadiness } from '../../core/release-check.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

export function releaseCheckCommand() {
  return new Command('release-check')
    .description('Check local release readiness without publishing')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warning checks as failures')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { json?: boolean; strict?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await checkReleaseReadiness({
        cwd: workspace.cwd,
        config: workspace.config,
        strict: options.strict,
        redactPaths: options.redactPaths === true,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result.markdown);
      }

      if (result.overallStatus === 'fail') process.exitCode = 1;
    });
}
