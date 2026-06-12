import { Command } from 'commander';
import { getReviewContext, renderReviewContextMarkdown } from '../../core/review-context.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

export function reviewContextCommand() {
  return new Command('review-context')
    .description('Show one read-only reviewability context snapshot')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const context = await getReviewContext({ cwd: workspace.cwd, config: workspace.config });

      if (options.json) {
        console.log(JSON.stringify(context, null, 2));
      } else {
        console.log(renderReviewContextMarkdown(context));
      }
    });
}
