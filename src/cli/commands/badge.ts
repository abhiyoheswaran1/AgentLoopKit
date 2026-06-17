import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import { BADGE_SOURCES, writeEvidenceBadge } from '../../core/badge.js';
import { AgentLoopError } from '../../core/errors.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import { redactLocalRoots } from '../../core/redaction.js';
import { loadWorkspaceForJsonCommand, printOutputPathJsonError } from '../json-errors.js';

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

function redactText(value: string, cwd: string, redactPaths: boolean | undefined) {
  return redactPaths ? redactLocalRoots(value, [cwd]) : value;
}

function redactOptionalText(
  value: string | undefined,
  cwd: string,
  redactPaths: boolean | undefined,
) {
  return value === undefined ? undefined : redactText(value, cwd, redactPaths);
}

export function badgeCommand() {
  return new Command('badge')
    .description('Generate a local SVG evidence badge')
    .option('--source <source>', 'badge source: verification or gates', 'verification')
    .option('--out <path>', 'output SVG path')
    .option('--strict', 'use strict gate status when source is gates')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(
      async (options: {
        source?: string;
        out?: string;
        strict?: boolean;
        json?: boolean;
        redactPaths?: boolean;
      }) => {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        let result: Awaited<ReturnType<typeof writeEvidenceBadge>>;
        try {
          result = await writeEvidenceBadge({
            cwd: workspace.cwd,
            config: workspace.config,
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
          if (options.json && error instanceof OutputPathError) {
            printOutputPathJsonError(error);
            return;
          }
          throw error;
        }

        if (options.json) {
          console.log(
            JSON.stringify(
              {
                outPath: redactText(result.outPath, workspace.cwd, options.redactPaths),
                source: result.source,
                status: result.status,
                label: result.label,
                message: result.message,
                sourcePath: redactOptionalText(
                  result.sourcePath,
                  workspace.cwd,
                  options.redactPaths,
                ),
              },
              null,
              2,
            ),
          );
        } else {
          console.log(`# AgentLoopKit Badge

Badge written: ${inlineCode(redactText(result.outPath, workspace.cwd, options.redactPaths))}
Source: ${inlineCode(redactText(result.source, workspace.cwd, options.redactPaths))}
Status: ${inlineCode(redactText(result.status, workspace.cwd, options.redactPaths))}
Message: ${inlineCode(redactText(result.message, workspace.cwd, options.redactPaths))}`);
        }
      },
    );
}
