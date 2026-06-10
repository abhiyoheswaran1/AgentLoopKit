import { Command } from 'commander';
import { getPackageVersion } from '../../core/version.js';

export function versionCommand() {
  return new Command('version')
    .description('Print CLI version')
    .option('--json', 'print machine-readable output')
    .action((options: { json?: boolean }) => {
      const version = getPackageVersion();
      if (options.json) {
        console.log(JSON.stringify({ version }, null, 2));
        return;
      }
      console.log(version);
    });
}
