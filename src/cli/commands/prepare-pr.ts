import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import { inlineCode } from '../../core/markdown-format.js';
import { preparePullRequest } from '../../core/prepare-pr.js';
import { loadWorkspaceForJsonCommand, printOutputPathJsonError } from '../json-errors.js';

export function preparePrCommand() {
  return new Command('prepare-pr')
    .description('Generate a PR description from local AgentLoopKit evidence')
    .option('--write', 'write PR body to .agentloop/handoffs')
    .option('--json', 'print machine-readable output')
    .option('--stdout', 'print the PR body to stdout')
    .option('--github-comment', 'include or print GitHub PR comment markdown')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: Record<string, unknown>) => {
      const json = options.json === true;
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), json);
      if (!workspace) return;
      let result: Awaited<ReturnType<typeof preparePullRequest>>;
      try {
        result = await preparePullRequest({
          cwd: workspace.cwd,
          config: workspace.config,
          write: options.write === true,
          githubComment: options.githubComment === true,
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
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      if (options.githubComment === true && options.stdout !== true) {
        console.log(result.githubComment ?? '');
      } else {
        console.log(result.body);
      }

      if (result.writtenPath) {
        console.log(`\nPR description written: ${inlineCode(result.writtenPath)}`);
      }
    });
}
