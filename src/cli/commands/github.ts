import { Command } from 'commander';
import { importGithubMetadata } from '../../core/github-metadata.js';
import { inlineCode } from '../../core/markdown-format.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

function printImport(
  result: Awaited<ReturnType<typeof importGithubMetadata>>,
  options: { json?: boolean },
) {
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log('# AgentLoopKit GitHub Metadata Import');
  console.log('');
  console.log(`- Status: ${inlineCode(result.status)}`);
  console.log(`- Dry run: ${inlineCode(String(result.dryRun))}`);
  console.log(`- Writes files: ${inlineCode(String(result.writesFiles))}`);
  console.log(`- Output: ${inlineCode(result.outputPath)}`);
  if (result.issue) {
    console.log(`- Issue: ${inlineCode(`#${result.issue.number ?? ''} ${result.issue.title}`)}`);
  }
  if (result.pullRequest) {
    console.log(
      `- Pull request: ${inlineCode(`#${result.pullRequest.number ?? ''} ${result.pullRequest.title}`)}`,
    );
  }
  console.log('');
  console.log(
    'Safety: this command reads only the JSON files you pass. It does not call GitHub APIs or read tokens.',
  );
}

export function githubCommand() {
  const command = new Command('github').description(
    'Import explicit local GitHub issue or PR metadata',
  );

  command
    .command('import')
    .description('Import GitHub issue or PR metadata from local JSON files')
    .option('--issue-json <path>', 'local JSON file from gh issue view or GitHub API output')
    .option('--pr-json <path>', 'local JSON file from gh pr view or GitHub API output')
    .option(
      '--output <path>',
      'repo-relative output path under .agentloop/github',
      '.agentloop/github/context.json',
    )
    .option('--dry-run', 'read and normalize metadata without writing the context file')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: {
        issueJson?: string;
        prJson?: string;
        output?: string;
        dryRun?: boolean;
        json?: boolean;
      }) => {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        const result = await importGithubMetadata({
          cwd: workspace.cwd,
          config: workspace.config,
          issueJsonPath: options.issueJson,
          prJsonPath: options.prJson,
          outputPath: options.output,
          dryRun: options.dryRun,
        });
        printImport(result, options);
      },
    );

  return command;
}
