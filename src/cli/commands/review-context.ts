import { Command } from 'commander';
import { getReviewContext, renderReviewContextMarkdown } from '../../core/review-context.js';
import { readRun } from '../../core/runs.js';
import type { GitFileStatus } from '../../core/git.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

async function readRecentRunChangedFiles(
  cwd: string,
  recentRuns: Awaited<ReturnType<typeof getReviewContext>>['recentRuns'],
) {
  const changedFiles = new Map<string, GitFileStatus[]>();
  await Promise.all(
    recentRuns.slice(0, 3).map(async (run) => {
      try {
        changedFiles.set(run.id, (await readRun(cwd, run.id)).changedFiles);
      } catch {
        changedFiles.set(run.id, []);
      }
    }),
  );
  return changedFiles;
}

export function reviewContextCommand() {
  return new Command('review-context')
    .description('Show one read-only reviewability context snapshot')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const context = await getReviewContext({
        cwd: workspace.cwd,
        config: workspace.config,
        redactPaths: options.redactPaths === true,
      });

      if (options.json) {
        console.log(JSON.stringify(context, null, 2));
      } else {
        console.log(
          renderReviewContextMarkdown(context, {
            recentRunChangedFiles: await readRecentRunChangedFiles(
              workspace.cwd,
              context.recentRuns,
            ),
          }),
        );
      }
    });
}
