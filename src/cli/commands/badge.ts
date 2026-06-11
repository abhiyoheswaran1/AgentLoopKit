import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { BADGE_SOURCES, writeEvidenceBadge } from '../../core/badge.js';
import { AgentLoopError } from '../../core/errors.js';

function printJsonError(error: AgentLoopError, details: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          ...details,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

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
        let result: Awaited<ReturnType<typeof writeEvidenceBadge>>;
        try {
          result = await writeEvidenceBadge({
            cwd: process.cwd(),
            config,
            source: options.source,
            outPath: options.out,
            strict: options.strict,
          });
        } catch (error) {
          if (
            options.json &&
            error instanceof AgentLoopError &&
            error.code === 'UNSUPPORTED_BADGE_SOURCE'
          ) {
            printJsonError(error, {
              message: `Unsupported badge source "${options.source ?? ''}".`,
              requestedSource: options.source ?? '',
              supportedSources: BADGE_SOURCES,
            });
            return;
          }
          throw error;
        }

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
