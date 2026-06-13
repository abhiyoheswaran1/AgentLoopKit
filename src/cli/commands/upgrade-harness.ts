import { Command } from 'commander';
import { inspectHarnessUpgrade } from '../../core/upgrade-harness.js';
import type { HarnessUpgradeReport } from '../../core/upgrade-harness.js';
import { inlineCode } from '../../core/markdown-format.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

function formatTopics(topics: string[]) {
  return topics.length ? topics.map((topic) => inlineCode(topic)).join(', ') : 'none';
}

function redactReportPaths(report: HarnessUpgradeReport): HarnessUpgradeReport {
  return {
    ...report,
    targetDirectory: '[agentloop-root]',
  };
}

function printReport(report: HarnessUpgradeReport, options: { details?: boolean }) {
  console.log('# AgentLoopKit Harness Upgrade');
  console.log('');
  console.log(`- Overall status: ${inlineCode(report.status)}`);
  console.log(`- Dry run: ${inlineCode(report.dryRun ? 'yes' : 'no')}`);
  console.log(`- Writes files: ${inlineCode('no')}`);
  console.log(`- Target: ${inlineCode(report.targetDirectory)}`);
  console.log('');
  console.log('## Manifest');
  console.log('');
  console.log(`- ${inlineCode(report.manifest.status)}: ${inlineCode(report.manifest.path)}`);
  console.log(
    `- Current template version: ${inlineCode(String(report.manifest.currentTemplateVersion))}`,
  );
  if (report.manifest.templateVersion !== undefined) {
    console.log(`- Local template version: ${inlineCode(String(report.manifest.templateVersion))}`);
  }
  console.log('');
  console.log('## Harness Files');
  console.log('');

  for (const file of report.files) {
    console.log(`- ${inlineCode(file.status)}: ${inlineCode(file.path)}`);
    console.log(`  Present topics: ${formatTopics(file.presentTopics)}`);
    console.log(`  Missing topics: ${formatTopics(file.missingTopics)}`);
  }

  console.log('');
  console.log('## Next Steps');
  console.log('');
  for (const step of report.nextSteps) console.log(`- ${step}`);

  if (options.details || report.suggestions.length > 0) {
    console.log('');
    console.log('## Copyable Guidance');
    console.log('');
    if (!report.suggestions.length) {
      console.log('- No current-loop guidance gaps were detected.');
    }
    for (const suggestion of report.suggestions) {
      console.log(`### ${suggestion.topic}`);
      console.log('');
      console.log(`- ${suggestion.title}`);
      console.log(
        `- Suggested files: ${suggestion.targetFiles.map((file) => inlineCode(file)).join(', ')}`,
      );
      console.log('');
      console.log(suggestion.copyMarkdown);
      console.log('');
    }
  }

  console.log('');
  console.log('## Safety');
  console.log('');
  console.log(
    'This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.',
  );
}

export function upgradeHarnessCommand() {
  return new Command('upgrade-harness')
    .description('Inspect existing AgentLoopKit harness guidance for upgrade gaps')
    .option('--dry-run', 'make the read-only behavior explicit')
    .option('--details', 'include copyable current-loop guidance for stale harness files')
    .option('--suggestions', 'alias for --details')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'replace the absolute AgentLoop root with [agentloop-root]')
    .action(
      async (options: {
        dryRun?: boolean;
        details?: boolean;
        suggestions?: boolean;
        json?: boolean;
        redactPaths?: boolean;
      }) => {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json === true);
        if (!workspace) return;
        const rawReport = await inspectHarnessUpgrade({
          cwd: workspace.cwd,
          dryRun: options.dryRun,
        });
        const report = options.redactPaths ? redactReportPaths(rawReport) : rawReport;
        if (options.json) {
          console.log(JSON.stringify(report, null, 2));
          return;
        }
        printReport(report, { details: options.details === true || options.suggestions === true });
      },
    );
}
