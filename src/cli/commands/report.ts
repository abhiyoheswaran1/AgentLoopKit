import { Command } from 'commander';
import { ArtifactPathError } from '../../core/artifacts.js';
import { loadAgentLoopConfig } from '../../core/config.js';
import { writeHtmlReport } from '../../core/html-report.js';

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
        const config = await loadAgentLoopConfig(process.cwd());
        let result: Awaited<ReturnType<typeof writeHtmlReport>>;
        try {
          result = await writeHtmlReport({
            cwd: process.cwd(),
            config,
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

Report written: ${result.outPath}
Task: ${result.metadata.taskTitle}
Verification: ${result.metadata.verificationStatus}
Changed files: ${result.metadata.changedFileCount}

Next step: open the HTML file locally or attach it as a CI/PR artifact.`);
        }
      },
    );
}
