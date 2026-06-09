import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { createTaskCommand } from './commands/create-task.js';
import { verifyCommand } from './commands/verify.js';
import { summarizeCommand } from './commands/summarize.js';
import { installAgentCommand } from './commands/install-agent.js';
import { listTemplatesCommand } from './commands/list-templates.js';
import { versionCommand } from './commands/version.js';

const program = new Command();

program
  .name('agentloop')
  .description('A drop-in engineering loop for coding agents.')
  .version('0.1.0', '-V, --version', 'print CLI version');

program.addCommand(initCommand());
program.addCommand(doctorCommand());
program.addCommand(createTaskCommand());
program.addCommand(verifyCommand());
program.addCommand(summarizeCommand());
program.addCommand(installAgentCommand());
program.addCommand(listTemplatesCommand());
program.addCommand(versionCommand());

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`agentloop: ${message}`);
  process.exitCode = 1;
});
