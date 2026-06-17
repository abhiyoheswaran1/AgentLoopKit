import { Command } from 'commander';
import { ArtifactPathError, OutputPathError } from '../../core/artifacts.js';
import { writeHtmlReport } from '../../core/html-report.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import { redactLocalRoots } from '../../core/redaction.js';
import { loadWorkspaceForJsonCommand, printOutputPathJsonError } from '../json-errors.js';

function printArtifactPathJsonError(error: ArtifactPathError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          artifactType: error.artifactType,
          requestedPath: error.requestedPath,
          expectedDir: error.expectedDir,
          reason: error.reason,
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

export function reportCommand() {
  return new Command('report')
    .description('Generate a local static HTML evidence report')
    .option('--task <path>', 'task contract path')
    .option('--report <path>', 'verification report path')
    .option('--verification <path>', 'alias for --report')
    .option('--handoff <path>', 'handoff summary path')
    .option('--out <path>', 'output HTML path')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(
      async (options: {
        task?: string;
        report?: string;
        verification?: string;
        handoff?: string;
        out?: string;
        json?: boolean;
        redactPaths?: boolean;
      }) => {
        const reportPath = options.report ?? options.verification;
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        let result: Awaited<ReturnType<typeof writeHtmlReport>>;
        try {
          result = await writeHtmlReport({
            cwd: workspace.cwd,
            config: workspace.config,
            taskPath: options.task,
            reportPath,
            handoffPath: options.handoff,
            outPath: options.out,
          });
        } catch (error) {
          if (options.json && error instanceof ArtifactPathError) {
            printArtifactPathJsonError(error);
            return;
          }
          if (options.json && error instanceof OutputPathError) {
            printOutputPathJsonError(error);
            return;
          }
          throw error;
        }

        if (options.json) {
          const sourcePaths = {
            task: redactOptionalText(result.sourcePaths.task, workspace.cwd, options.redactPaths),
            verification: redactOptionalText(
              result.sourcePaths.verification,
              workspace.cwd,
              options.redactPaths,
            ),
            handoff: redactOptionalText(
              result.sourcePaths.handoff,
              workspace.cwd,
              options.redactPaths,
            ),
          };
          console.log(
            JSON.stringify(
              {
                outPath: redactText(result.outPath, workspace.cwd, options.redactPaths),
                metadata: result.metadata,
                sourcePaths,
              },
              null,
              2,
            ),
          );
        } else {
          console.log(`# AgentLoopKit HTML Report

Report written: ${inlineCode(redactText(result.outPath, workspace.cwd, options.redactPaths))}
Task: ${inlineCode(redactText(result.metadata.taskTitle, workspace.cwd, options.redactPaths))}
Verification: ${inlineCode(
            redactText(result.metadata.verificationStatus, workspace.cwd, options.redactPaths),
          )}
Changed files: ${inlineCode(String(result.metadata.changedFileCount))}

Next step: open the HTML file locally or attach it as a CI/PR artifact.`);
        }
      },
    );
}
