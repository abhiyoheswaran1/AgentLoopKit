import { Command } from 'commander';
import { getPackageVersion } from '../../core/version.js';

export function versionCommand() {
  return new Command('version').description('Print CLI version').action(() => {
    console.log(getPackageVersion());
  });
}
