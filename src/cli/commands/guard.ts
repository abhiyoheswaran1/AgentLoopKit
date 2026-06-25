import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import {
  buildGuardSnapshot,
  compactGuardSnapshot,
  compactGuardWatchResult,
  GuardBaselineError,
  renderGuardMarkdown,
  runGuardWatch,
  writeGuardBaseline,
  writeGuardReport,
  type GuardSnapshot,
} from '../../core/guard.js';
import {
  CliOptionError,
  loadWorkspaceForJsonCommand,
  printAgentLoopJsonError,
  printOutputPathJsonError,
} from '../json-errors.js';
import { redactLocalRoots } from '../../core/redaction.js';

const DEFAULT_INTERVAL_MS = 2000;

function parsePositiveInteger(value: string | undefined, option: string, fallback?: number) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new CliOptionError(`--${option} must be a positive integer.`, 'GUARD_OPTION_INVALID', {
      option,
      value,
    });
  }
  return parsed;
}

function printJsonOrThrow(error: unknown, json: boolean | undefined) {
  if (!json) throw error;
  if (error instanceof OutputPathError) {
    printOutputPathJsonError(error);
    return true;
  }
  if (error instanceof CliOptionError || error instanceof GuardBaselineError) {
    printAgentLoopJsonError(error);
    return true;
  }
  throw error;
}

function shouldFailStrict(snapshot: GuardSnapshot) {
  return snapshot.strict && snapshot.status !== 'pass';
}

function setStrictExitCode(snapshots: GuardSnapshot[]) {
  if (snapshots.some(shouldFailStrict)) process.exitCode = 1;
}

function stringifyGuardJson(value: unknown, cwd: string, redactPaths: boolean | undefined) {
  const output = JSON.stringify(value, null, 2);
  return redactPaths === true ? redactLocalRoots(output, [cwd]) : output;
}

export function guardCommand() {
  return new Command('guard')
    .description('Check local drift, proof debt, and context-budget pressure')
    .option('--strict', 'exit non-zero when Guard status is warn or fail')
    .option('--watch', 'repeat Guard snapshots until interrupted or max iterations is reached')
    .option('--interval-ms <ms>', 'watch interval in milliseconds', String(DEFAULT_INTERVAL_MS))
    .option('--max-iterations <count>', 'maximum watch iterations before exiting')
    .option('--write-report', 'write a local Markdown Guard report')
    .option('--out <path>', 'Guard report output path; requires --write-report')
    .option('--baseline <path>', 'compare current changed files with a Guard baseline')
    .option('--write-baseline <path>', 'write current changed files to a Guard baseline JSON file')
    .option('--json', 'print machine-readable output')
    .option('--compact', 'with --json, omit full changed-file evidence and include an expandable handle')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(
      async (options: {
        strict?: boolean;
        watch?: boolean;
        intervalMs?: string;
        maxIterations?: string;
        writeReport?: boolean;
        out?: string;
        baseline?: string;
        writeBaseline?: string;
        json?: boolean;
        compact?: boolean;
        redactPaths?: boolean;
      }) => {
        let intervalMs: number;
        let maxIterations: number | undefined;
        try {
          intervalMs = parsePositiveInteger(
            options.intervalMs,
            'interval-ms',
            DEFAULT_INTERVAL_MS,
          )!;
          maxIterations = parsePositiveInteger(options.maxIterations, 'max-iterations');
          if (options.out && !options.writeReport) {
            throw new CliOptionError('--out requires --write-report.', 'OUT_REQUIRES_WRITE', {
              option: 'out',
              requiredOption: 'write-report',
              requestedPath: options.out,
            });
          }
        } catch (error) {
          if (printJsonOrThrow(error, options.json)) return;
          return;
        }

        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;

        try {
          if (options.watch) {
            const watch = await runGuardWatch({
              cwd: workspace.cwd,
              config: workspace.config,
              strict: options.strict,
              intervalMs,
              maxIterations,
              onSnapshot: options.json
                ? undefined
                : (snapshot) => {
                    console.log(renderGuardMarkdown(snapshot));
                  },
            });
            if (options.json) {
              console.log(
                stringifyGuardJson(
                  options.compact ? compactGuardWatchResult(watch) : watch,
                  workspace.cwd,
                  options.redactPaths,
                ),
              );
            }
            setStrictExitCode(watch.snapshots);
            return;
          }

          let snapshot = await buildGuardSnapshot({
            cwd: workspace.cwd,
            config: workspace.config,
            strict: options.strict,
            baselinePath: options.baseline,
            writesFiles: Boolean(options.writeReport || options.writeBaseline),
          });

          if (options.writeBaseline) {
            const baseline = await writeGuardBaseline({
              cwd: workspace.cwd,
              baselinePath: options.writeBaseline,
              map: snapshot.evidenceMap,
            });
            snapshot = {
              ...snapshot,
              baseline: {
                ...snapshot.baseline,
                ...baseline,
              },
              safety: {
                ...snapshot.safety,
                writesFiles: true,
              },
            };
          }

          if (options.writeReport) {
            const report = await writeGuardReport({
              cwd: workspace.cwd,
              config: workspace.config,
              snapshot,
              outPath: options.out,
            });
            snapshot = {
              ...snapshot,
              report,
              safety: {
                ...snapshot.safety,
                writesFiles: true,
              },
            };
          }

          if (options.json) {
            console.log(
              stringifyGuardJson(
                options.compact ? compactGuardSnapshot(snapshot) : snapshot,
                workspace.cwd,
                options.redactPaths,
              ),
            );
          }
          else console.log(renderGuardMarkdown(snapshot));
          setStrictExitCode([snapshot]);
        } catch (error) {
          if (printJsonOrThrow(error, options.json)) return;
          throw error;
        }
      },
    );
}
