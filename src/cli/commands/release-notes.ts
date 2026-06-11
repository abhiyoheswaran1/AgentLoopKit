import { Command } from 'commander';
import { generateReleaseNotes } from '../../core/release-notes.js';
import { loadConfigForJsonCommand, validateOutRequiresWrite } from '../json-errors.js';

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
        const config = await loadConfigForJsonCommand(process.cwd(), options.json);
        if (!config) return;
        const result = await generateReleaseNotes({
          cwd: process.cwd(),
          config,
          from: options.from,
          to: options.to,
          version: options.releaseVersion,
          write: options.write,
          outPath: options.out,
        });

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
          return;
        }

        console.log(result.markdown);
        if (result.writtenPath) {
          console.log(`\nRelease notes written: ${result.writtenPath}`);
        } else {
          console.log('\nNo release notes file was written. Use --write to create one.');
        }
      },
    );
}
