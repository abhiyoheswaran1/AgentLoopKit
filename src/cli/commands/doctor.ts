import { Command } from 'commander';
import { resolveAgentLoopWorkspaceCwd } from '../../core/config.js';
import { runDoctor } from '../../core/doctor.js';
import { CliOptionError, printAgentLoopJsonError } from '../json-errors.js';

const MAX_RISK_SCAN_DEPTH = 64;
const MAX_RISK_SCAN_ENTRIES = 100000;

function parsePositiveInteger(
  value: string | undefined,
  option: string,
  max: number,
): number | undefined {
  if (value === undefined) return undefined;
  const flagName = `--${option}`;
  if (!/^[1-9]\d*$/.test(value)) {
    throw new CliOptionError(
      `${flagName} must be a positive integer <= ${max}.`,
      'DOCTOR_OPTION_INVALID',
      { option, value, max },
    );
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed > max) {
    throw new CliOptionError(
      `${flagName} must be a positive integer <= ${max}.`,
      'DOCTOR_OPTION_INVALID',
      { option, value, max },
    );
  }
  return parsed;
}

function printJsonErrorIfNeeded(error: unknown, json: boolean | undefined) {
  if (json && error instanceof CliOptionError) {
    printAgentLoopJsonError(error);
    return true;
  }
  return false;
}

export function doctorCommand() {
  return new Command('doctor')
    .description('Check whether this repo is ready for agentic engineering')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warnings as failures')
    .option('--advisory', 'print diagnostics without failing the process')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .option(
      '--risk-scan-max-depth <number>',
      'limit how deep doctor scans for risk-sensitive files',
    )
    .option(
      '--risk-scan-max-entries <number>',
      'limit how many filesystem entries doctor scans for risk-sensitive files',
    )
    .action(
      async (options: {
        json?: boolean;
        strict?: boolean;
        advisory?: boolean;
        redactPaths?: boolean;
        riskScanMaxDepth?: string;
        riskScanMaxEntries?: string;
      }) => {
        let riskScanMaxDepth: number | undefined;
        let riskScanMaxEntries: number | undefined;
        try {
          riskScanMaxDepth = parsePositiveInteger(
            options.riskScanMaxDepth,
            'risk-scan-max-depth',
            MAX_RISK_SCAN_DEPTH,
          );
          riskScanMaxEntries = parsePositiveInteger(
            options.riskScanMaxEntries,
            'risk-scan-max-entries',
            MAX_RISK_SCAN_ENTRIES,
          );
        } catch (error) {
          if (printJsonErrorIfNeeded(error, options.json)) return;
          throw error;
        }
        const cwd = await resolveAgentLoopWorkspaceCwd(process.cwd());
        const result = await runDoctor({
          cwd,
          strict: options.strict,
          advisory: options.advisory === true,
          redactPaths: options.redactPaths === true,
          riskScanMaxDepth,
          riskScanMaxEntries,
        });
        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(result.markdown);
        }
        if (!options.advisory && result.overallStatus === 'fail') process.exitCode = 1;
      },
    );
}
