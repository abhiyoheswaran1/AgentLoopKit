import { readFile } from 'node:fs/promises';
import { Command } from 'commander';
import { checkNpmStatus, shouldFailNpmStatusExpectation } from '../../core/npm-status.js';

function parseTimeout(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('timeout must be a positive integer');
  }
  return parsed;
}

export function npmStatusCommand() {
  return new Command('npm-status')
    .description('Check npm registry catch-up status')
    .option('--package-name <name>', 'package name; defaults to package.json name')
    .option('--local-version <version>', 'local version; defaults to package.json version')
    .option(
      '--registry-json <path>',
      'read captured `npm view <package> version versions --json` output instead of running npm',
    )
    .option('--timeout-ms <ms>', 'npm view timeout in milliseconds', parseTimeout, 15000)
    .option('--expect-current', 'exit 1 unless npm latest matches the local version')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: {
        packageName?: string;
        localVersion?: string;
        registryJson?: string;
        timeoutMs: number;
        expectCurrent?: boolean;
        json?: boolean;
      }) => {
        const registryJson = options.registryJson
          ? await readFile(options.registryJson, 'utf8')
          : undefined;
        const result = await checkNpmStatus({
          cwd: process.cwd(),
          packageName: options.packageName,
          localVersion: options.localVersion,
          registryJson,
          timeoutMs: options.timeoutMs,
        });

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(result.markdown);
        }

        if (options.expectCurrent && shouldFailNpmStatusExpectation(result)) {
          process.exitCode = 1;
        }
      },
    );
}
