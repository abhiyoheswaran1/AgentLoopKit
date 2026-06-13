import { Command } from 'commander';
import { inlineCode } from '../../core/markdown-format.js';
import { runMaintainerCheck } from '../../core/maintainer-check.js';
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
        console.log('# AgentLoopKit Maintainer Check');
        console.log(`\nStatus: ${inlineCode(result.status)}\n`);
        for (const check of result.checks) {
          console.log(`- [${inlineCode(check.status)}] ${inlineCode(check.id)}: ${inlineCode(check.message)}`);
        }
        console.log('\n## Maintainer Checklist\n');
        for (const item of result.maintainerChecklist) console.log(`- [ ] ${item}`);
        console.log('\n## Suggested Contributor Request\n');
        console.log(result.suggestedContributorRequest);
      }
      if (result.status === 'fail') process.exitCode = 1;
    });
}
