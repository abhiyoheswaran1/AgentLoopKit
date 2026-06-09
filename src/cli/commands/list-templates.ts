import { Command } from 'commander';
import { listTemplateFiles } from '../../core/template-renderer.js';

export function listTemplatesCommand() {
  return new Command('list-templates')
    .description('List available AgentLoopKit templates')
    .action(async () => {
      const templates = await listTemplateFiles();
      for (const [group, files] of Object.entries(templates)) {
        console.log(`${group}:`);
        for (const file of files) console.log(`  - ${file}`);
      }
    });
}
