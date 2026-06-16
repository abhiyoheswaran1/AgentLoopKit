import { Command } from 'commander';
import { ArtifactPathError, OutputPathError } from '../../core/artifacts.js';
import { writeHtmlReport } from '../../core/html-report.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
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

export function reportCommand() {
  return new Command('report')
    .description('Generate a local static HTML evidence report')
    .option('--task <path>', 'task contract path')
    .option('--report <path>', 'verification report path')
    .option('--verification <path>', 'alias for --report')
    .option('--handoff <path>', 'handoff summary path')
    .option('--out <path>', 'output HTML path')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: {
        task?: string;
        report?: string;
        verification?: string;
        handoff?: string;
        out?: string;
        json?: boolean;
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
          console.log(
            JSON.stringify(
              {
                outPath: result.outPath,
                metadata: result.metadata,
                sourcePaths: result.sourcePaths,
              },
              null,
              2,
            ),
          );
        } else {
          console.log(`# AgentLoopKit HTML Report

Report written: ${inlineCode(result.outPath)}
Task: ${inlineCode(result.metadata.taskTitle)}
Verification: ${inlineCode(result.metadata.verificationStatus)}
Changed files: ${inlineCode(String(result.metadata.changedFileCount))}

Next step: open the HTML file locally or attach it as a CI/PR artifact.`);
        }
      },
    );
}
