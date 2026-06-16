import { Command } from 'commander';
import { buildSchemaStoreCatalogEntry } from '../../core/schemastore.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';

export function schemastoreCommand() {
  return new Command('schemastore')
    .description('Print the SchemaStore catalog entry for agentloop.config.json')
    .option('--json', 'print machine-readable output')
    .action((options: { json?: boolean }) => {
      const entry = buildSchemaStoreCatalogEntry();
      const result = {
        entry,
        safety: {
          writesFiles: false,
          callsNetwork: false,
        },
      };

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      console.log('# AgentLoopKit SchemaStore Entry');
      console.log('');
      console.log(`- Name: ${inlineCode(entry.name)}`);
      console.log(`- File match: ${entry.fileMatch.map((file) => inlineCode(file)).join(', ')}`);
      console.log(`- Schema URL: ${inlineCode(entry.url)}`);
      console.log('');
      console.log(
        'This command prints the catalog entry only. It does not write files or call a network service.',
      );
    });
}
