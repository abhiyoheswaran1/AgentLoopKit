import { Command } from 'commander';
import { loadAgentLoopConfig } from '../../core/config.js';
import { writeHtmlReport } from '../../core/html-report.js';

export function reportCommand() {
  return new Command('report')
    .description('Generate a local static HTML evidence report')
    .option('--task <path>', 'task contract path')
    .option('--report <path>', 'verification report path')
    .option('--handoff <path>', 'handoff summary path')
    .option('--out <path>', 'output HTML path')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: {
        task?: string;
        report?: string;
        handoff?: string;
        out?: string;
        json?: boolean;
      }) => {
        const config = await loadAgentLoopConfig(process.cwd());
        const result = await writeHtmlReport({
          cwd: process.cwd(),
          config,
          taskPath: options.task,
          reportPath: options.report,
          handoffPath: options.handoff,
          outPath: options.out,
        });

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
