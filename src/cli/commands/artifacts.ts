import { Command } from 'commander';
import { getArtifactInventory, renderArtifactInventoryMarkdown } from '../../core/artifacts.js';
import { loadConfigForJsonCommand } from '../json-errors.js';

export function artifactsCommand() {
  return new Command('artifacts')
    .description('Show local AgentLoop evidence artifacts without writing files')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const config = await loadConfigForJsonCommand(process.cwd(), options.json);
      if (!config) return;
      const inventory = await getArtifactInventory({ cwd: process.cwd(), config });

      if (options.json) {
        console.log(JSON.stringify(inventory, null, 2));
      } else {
        console.log(renderArtifactInventoryMarkdown(inventory));
      }
    });
}
