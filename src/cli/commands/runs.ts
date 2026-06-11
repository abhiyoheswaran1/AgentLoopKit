import { Command } from 'commander';
import { AgentLoopError } from '../../core/errors.js';
import { findFileIntent, listRuns, readRun } from '../../core/runs.js';
import { inlineCode } from '../../core/markdown-format.js';
import { loadWorkspaceForJsonCommand, printAgentLoopJsonError } from '../json-errors.js';

function printRuns(runs: Awaited<ReturnType<typeof listRuns>>) {
  if (!runs.length) {
    console.log('No AgentLoopKit runs found.');
    return;
  }
  console.log('AgentLoopKit runs:');
  for (const run of runs) {
    console.log(
      `- ${inlineCode(run.id)} ${inlineCode(run.command)} score ${inlineCode(String(run.score))}/100`,
    );
  }
}

export function runsCommand() {
  return new Command('runs')
    .description('List local AgentLoopKit run ledger entries')
    .option('--json', 'print machine-readable output')
    .action(async (options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const runs = await listRuns(workspace.cwd);
      if (options.json) console.log(JSON.stringify({ runs }, null, 2));
      else printRuns(runs);
    });
}

export function showRunCommand() {
  return new Command('show-run')
    .description('Show a local AgentLoopKit run ledger entry')
    .argument('<id>', 'run id')
    .option('--json', 'print machine-readable output')
    .action(async (id: string, options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      try {
        const run = await readRun(workspace.cwd, id);
        if (options.json) console.log(JSON.stringify({ run }, null, 2));
        else {
          console.log(`# AgentLoopKit Run ${inlineCode(run.metadata.id)}`);
          console.log(`- Command: ${inlineCode(run.metadata.command)}`);
          console.log(`- Score: ${inlineCode(String(run.metadata.score))}/100`);
          console.log(`- Changed files: ${inlineCode(String(run.metadata.changedFileCount))}`);
        }
      } catch (error) {
        if (options.json && error instanceof AgentLoopError) {
          printAgentLoopJsonError(error);
          return;
        }
        throw error;
      }
    });
}

export function intentCommand() {
  return new Command('intent')
    .description('Show which local AgentLoopKit runs touched a file')
    .argument('<file>', 'repo-relative file path')
    .option('--json', 'print machine-readable output')
    .action(async (file: string, options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const runs = await findFileIntent(workspace.cwd, file);
      if (options.json) {
        console.log(JSON.stringify({ file: file.replace(/\\/g, '/'), runs }, null, 2));
        return;
      }
      if (!runs.length) {
        console.log(`No AgentLoopKit run intent found for ${inlineCode(file)}.`);
        return;
      }
      console.log(`AgentLoopKit intent for ${inlineCode(file)}:`);
      for (const run of runs) console.log(`- ${inlineCode(run.id)}: ${inlineCode(run.why)}`);
    });
}
