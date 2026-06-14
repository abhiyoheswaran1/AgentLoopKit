import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { createTaskCommand } from './commands/create-task.js';
import { verifyCommand } from './commands/verify.js';
import { handoffCommand, summarizeCommand } from './commands/summarize.js';
import { installAgentCommand } from './commands/install-agent.js';
import { listTemplatesCommand } from './commands/list-templates.js';
import { versionCommand } from './commands/version.js';
import { statusCommand } from './commands/status.js';
import { nextCommand } from './commands/next.js';
import { taskCommand } from './commands/task.js';
import { completionCommand } from './commands/completion.js';
import { checkGatesCommand } from './commands/check-gates.js';
import { reportCommand } from './commands/report.js';
import { badgeCommand } from './commands/badge.js';
import { artifactsCommand } from './commands/artifacts.js';
import { policyCommand } from './commands/policy.js';
import { ciSummaryCommand } from './commands/ci-summary.js';
import { releaseNotesCommand } from './commands/release-notes.js';
import { releaseCheckCommand } from './commands/release-check.js';
import { npmStatusCommand } from './commands/npm-status.js';
import { mcpServerCommand } from './commands/mcp-server.js';
import { shipCommand } from './commands/ship.js';
import { preparePrCommand } from './commands/prepare-pr.js';
import { intentCommand, runsCommand, showRunCommand } from './commands/runs.js';
import { maintainerCheckCommand } from './commands/maintainer-check.js';
import { reviewContextCommand } from './commands/review-context.js';
import { upgradeHarnessCommand } from './commands/upgrade-harness.js';
import { schemastoreCommand } from './commands/schemastore.js';
import { githubCommand } from './commands/github.js';
import { getPackageVersion } from '../core/version.js';

const program = new Command();

program
  .name('agentloop')
  .description('A drop-in engineering loop for coding agents.')
  .version(getPackageVersion(), '-V, --version', 'print CLI version');

program.addCommand(initCommand());
program.addCommand(doctorCommand());
program.addCommand(createTaskCommand());
program.addCommand(verifyCommand());
program.addCommand(summarizeCommand());
program.addCommand(handoffCommand());
program.addCommand(statusCommand());
program.addCommand(nextCommand());
program.addCommand(reviewContextCommand());
program.addCommand(checkGatesCommand());
program.addCommand(shipCommand());
program.addCommand(preparePrCommand());
program.addCommand(runsCommand());
program.addCommand(showRunCommand());
program.addCommand(intentCommand());
program.addCommand(maintainerCheckCommand());
program.addCommand(reportCommand());
program.addCommand(badgeCommand());
program.addCommand(artifactsCommand());
program.addCommand(upgradeHarnessCommand());
program.addCommand(schemastoreCommand());
program.addCommand(githubCommand());
program.addCommand(ciSummaryCommand());
program.addCommand(releaseNotesCommand());
program.addCommand(releaseCheckCommand());
program.addCommand(npmStatusCommand());
program.addCommand(mcpServerCommand());
program.addCommand(policyCommand());
program.addCommand(taskCommand());
program.addCommand(installAgentCommand());
program.addCommand(listTemplatesCommand());
program.addCommand(completionCommand());
program.addCommand(versionCommand());

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`agentloop: ${message}`);
  process.exitCode = 1;
});
