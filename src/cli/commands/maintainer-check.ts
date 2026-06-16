import { Command } from 'commander';
import {
  renderMaintainerCheckMarkdown,
  runMaintainerCheck,
} from '../../core/maintainer-check.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

export function maintainerCheckCommand() {
  return new Command('maintainer-check')
    .description('Check whether an AI-assisted PR is ready for maintainer review')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await runMaintainerCheck({
        cwd: workspace.cwd,
        config: workspace.config,
        redactPaths: options.redactPaths === true,
      });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(renderMaintainerCheckMarkdown(result));
      }
      if (result.status === 'fail') process.exitCode = 1;
    });
}
