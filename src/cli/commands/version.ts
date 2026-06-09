import { Command } from 'commander';

export function versionCommand() {
  return new Command('version').description('Print CLI version').action(() => {
    console.log('0.1.0');
  });
}
