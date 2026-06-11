import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import { inlineCode } from '../../core/markdown-format.js';
import { generateReleaseNotes } from '../../core/release-notes.js';
import {
  loadWorkspaceForJsonCommand,
  printOutputPathJsonError,
  validateOutRequiresWrite,
} from '../json-errors.js';

export function releaseNotesCommand() {
  return new Command('release-notes')
    .description('Generate deterministic release notes')
    .option('--from <ref>', 'git ref to compare from')
    .option('--to <ref>', 'git ref to compare to', 'HEAD')
    .option('--release-version <version>', 'release version; defaults to package.json version')
    .option('--write', 'write notes to .agentloop/handoffs')
    .option('--out <path>', 'output Markdown path when using --write')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: {
        from?: string;
        to?: string;
        releaseVersion?: string;
        write?: boolean;
        out?: string;
        json?: boolean;
      }) => {
        if (!validateOutRequiresWrite(options)) return;
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        let result: Awaited<ReturnType<typeof generateReleaseNotes>>;
        try {
          result = await generateReleaseNotes({
            cwd: workspace.cwd,
            config: workspace.config,
            from: options.from,
            to: options.to,
            version: options.releaseVersion,
            write: options.write,
            outPath: options.out,
          });
        } catch (error) {
          if (options.json && error instanceof OutputPathError) {
            printOutputPathJsonError(error);
            return;
          }
          throw error;
        }

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
          return;
        }

        console.log(result.markdown);
        if (result.writtenPath) {
          console.log(`\nRelease notes written: ${inlineCode(result.writtenPath)}`);
        } else {
          console.log('\nNo release notes file was written. Use --write to create one.');
        }
      },
    );
}
