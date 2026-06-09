import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { writeEvidenceBadge } from '../../core/badge.js';

export function badgeCommand() {
  return new Command('badge')
    .description('Generate a local SVG evidence badge')
    .option('--source <source>', 'badge source: verification or gates', 'verification')
    .option('--out <path>', 'output SVG path')
    .option('--strict', 'use strict gate status when source is gates')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: { source?: string; out?: string; strict?: boolean; json?: boolean }) => {
        const config = await loadAgentLoopConfig(process.cwd());
        const result = await writeEvidenceBadge({
          cwd: process.cwd(),
          config,
          source: options.source,
          outPath: options.out,
          strict: options.strict,
        });

        if (options.json) {
          console.log(
            JSON.stringify(
              {
                outPath: result.outPath,
                source: result.source,
                status: result.status,
                label: result.label,
                message: result.message,
                sourcePath: result.sourcePath,
              },
              null,
              2,
            ),
          );
        } else {
          console.log(`# AgentLoopKit Badge

Badge written: ${result.outPath}
Source: ${result.source}
Status: ${result.status}
Message: ${result.message}`);
        }
      },
    );
}
