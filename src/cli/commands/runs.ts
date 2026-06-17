import { Command } from 'commander';
import { isAgentLoopEvidenceFile } from '../../core/agentloop-evidence.js';
import { AgentLoopError } from '../../core/errors.js';
import { findFileIntent, listRuns, readRun } from '../../core/runs.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import type { GitFileStatus } from '../../core/git.js';
import {
  CliOptionError,
  loadWorkspaceForJsonCommand,
  printAgentLoopJsonError,
} from '../json-errors.js';

function formatChangedFileScope(
  changedFileCount: number,
  changedFiles: GitFileStatus[],
  options: { includeLabel: boolean },
) {
  const count = changedFiles.length > 0 ? changedFiles.length : changedFileCount;
  const prefix = options.includeLabel
    ? `${inlineCode(String(count))} changed files`
    : inlineCode(String(count));
  if (changedFiles.length === 0) return prefix;

  const agentLoopEvidenceCount = changedFiles.filter((file) =>
    isAgentLoopEvidenceFile(file.path),
  ).length;
  if (agentLoopEvidenceCount === 0) return prefix;

  const nonEvidenceCount = changedFiles.length - agentLoopEvidenceCount;
  return `${prefix} (${inlineCode(String(nonEvidenceCount))} non-evidence, ${inlineCode(
    String(agentLoopEvidenceCount),
  )} AgentLoop evidence)`;
}

async function printRuns(cwd: string, runs: Awaited<ReturnType<typeof listRuns>>) {
  if (!runs.length) {
    console.log('No AgentLoopKit runs found.');
    return;
  }
  console.log('AgentLoopKit runs:');
  for (const run of runs) {
    const record = await readRun(cwd, run.id);
    const changedFileScope = formatChangedFileScope(run.changedFileCount, record.changedFiles, {
      includeLabel: true,
    });
    const result =
      run.score === undefined
        ? run.overallStatus
          ? `status ${inlineCode(run.overallStatus)} - ${changedFileScope}`
          : changedFileScope
        : `score ${inlineCode(String(run.score))}/100 - ${changedFileScope}`;
    console.log(`- ${inlineCode(run.id)} ${inlineCode(run.command)} ${result}`);
  }
}

function parseRunsLimit(options: { latest?: boolean; limit?: string }) {
  let parsed: number | undefined;
  if (options.limit !== undefined) {
    parsed = Number.parseInt(options.limit, 10);
    if (!/^\d+$/.test(options.limit) || !Number.isSafeInteger(parsed) || parsed < 1) {
      throw new CliOptionError('--limit must be a positive integer.', 'RUN_LIMIT_INVALID', {
        option: 'limit',
        value: options.limit,
      });
    }
  }
  if (options.latest) return 1;
  return parsed;
}

function limitRuns(runs: Awaited<ReturnType<typeof listRuns>>, limit: number | undefined) {
  return limit === undefined ? runs : runs.slice(0, limit);
}

export function runsCommand() {
  return new Command('runs')
    .description('List local AgentLoopKit run ledger entries')
    .option('--limit <count>', 'show only the newest count run entries')
    .option('--latest', 'show only the newest run entry')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'accept common public-output redaction flag; run ledger paths are already display-safe',
    )
    .action(async (options: { json?: boolean; latest?: boolean; limit?: string }) => {
      let limit: number | undefined;
      try {
        limit = parseRunsLimit(options);
      } catch (error) {
        if (options.json && error instanceof AgentLoopError) {
          printAgentLoopJsonError(error);
          return;
        }
        throw error;
      }
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const runs = limitRuns(await listRuns(workspace.cwd), limit);
      if (options.json) console.log(JSON.stringify({ runs }, null, 2));
      else await printRuns(workspace.cwd, runs);
    });
}

export function showRunCommand() {
  return new Command('show-run')
    .description('Show a local AgentLoopKit run ledger entry')
    .argument('<id>', 'run id')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'accept common public-output redaction flag; run ledger paths are already display-safe',
    )
    .action(async (id: string, options: { json?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      try {
        const run = await readRun(workspace.cwd, id);
        if (options.json) console.log(JSON.stringify({ run }, null, 2));
        else {
          console.log(`# AgentLoopKit Run ${inlineCode(run.metadata.id)}`);
          console.log(`- Command: ${inlineCode(run.metadata.command)}`);
          if (run.metadata.score !== undefined)
            console.log(`- Score: ${inlineCode(String(run.metadata.score))}/100`);
          if (run.metadata.overallStatus)
            console.log(`- Status: ${inlineCode(run.metadata.overallStatus)}`);
          console.log(
            `- Changed files: ${formatChangedFileScope(
              run.metadata.changedFileCount,
              run.changedFiles,
              { includeLabel: false },
            )}`,
          );
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
    .option(
      '--redact-paths',
      'accept common public-output redaction flag; run ledger paths are already display-safe',
    )
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
