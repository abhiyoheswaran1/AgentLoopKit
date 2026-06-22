import { Command } from 'commander';
import { buildEvidenceMap, renderEvidenceMapMarkdown } from '../../core/evidence-map.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

export function explainDiffCommand() {
  return new Command('explain-diff')
    .description('Explain the current diff using local AgentLoopKit evidence')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'redact local absolute paths in public output; evidence-map paths are repo-relative by default',
    )
    .action(async (options: { json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const map = await buildEvidenceMap({
        cwd: workspace.cwd,
        config: workspace.config,
      });

      if (options.json) console.log(JSON.stringify(map, null, 2));
      else console.log(renderEvidenceMapMarkdown(map));
    });
}
