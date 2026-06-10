import { Command } from 'commander';
import { listTemplateFiles } from '../../core/template-renderer.js';

export function listTemplatesCommand() {
  return new Command('list-templates')
    .description('List available AgentLoopKit templates')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const templates = await listTemplateFiles();
      if (options.json) {
        console.log(JSON.stringify({ templates }, null, 2));
        return;
      }

      for (const [group, files] of Object.entries(templates)) {
        console.log(`${group}:`);
        for (const file of files) console.log(`  - ${file}`);
      }
    });
}
