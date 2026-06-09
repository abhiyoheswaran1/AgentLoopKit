import { Command } from 'commander';
import { renderCompletionScript } from '../../core/completions.js';

export function completionCommand() {
  return new Command('completion')
    .description('Print shell completion scripts')
    .argument('<shell>', 'one of: bash, zsh, fish')
    .action((shell: string) => {
      process.stdout.write(renderCompletionScript(shell));
    });
}
