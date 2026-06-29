import { Command } from 'commander';
import { AgentLoopError } from '../../core/errors.js';
import {
  createLoop,
  getLoopReport,
  getLoopStatus,
  runLoop,
  scoreLoop,
  tickLoop,
} from '../../core/loop-contract.js';
import { redactLocalRoots } from '../../core/redaction.js';
import {
  loadWorkspaceForJsonCommand,
  printAgentLoopJsonError,
} from '../json-errors.js';

function parsePositiveInteger(value: string) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AgentLoopError(`Expected a positive integer: ${value}`, 'LOOP_NUMERIC_OPTION_INVALID');
  }
  return parsed;
}

function printJsonErrorIfNeeded(error: unknown, json: boolean | undefined) {
  if (json && error instanceof AgentLoopError) {
    printAgentLoopJsonError(error);
    return true;
  }
  return false;
}

function printOutput(value: unknown, markdown: string, options: { json?: boolean; redactPaths?: boolean }, cwd: string) {
  const output = options.json ? JSON.stringify(value, null, 2) : markdown;
  console.log(options.redactPaths === true ? redactLocalRoots(output, [cwd]) : output);
}

export function loopCommand() {
  const command = new Command('loop').description(
    'Create and inspect local low-token agent loop contracts',
  );

  command
    .command('create')
    .description('Create a local loop contract and native AgentLoop task')
    .option('--goal <goal>', 'loop goal')
    .option('--preset <preset>', 'preset: agentloopkit-maintenance, docs-drift, release-readiness, or baseframe-integration')
    .option('--cadence <cadence>', 'cadence: manual', 'manual')
    .option('--budget-tokens <count>', 'maximum estimated loop tokens', parsePositiveInteger)
    .option('--max-iterations <count>', 'maximum loop iterations', parsePositiveInteger)
    .option('--runner-command <command>', 'explicit local runner command for loop run')
    .option('--runner-name <name>', 'display name for the configured runner')
    .option('--runner-timeout-ms <ms>', 'runner timeout in milliseconds', parsePositiveInteger)
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(
      async (options: {
        goal?: string;
        preset?: string;
        cadence?: string;
        budgetTokens?: number;
        maxIterations?: number;
        runnerCommand?: string;
        runnerName?: string;
        runnerTimeoutMs?: number;
        json?: boolean;
        redactPaths?: boolean;
      }) => {
        try {
          const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
          if (!workspace) return;
          const result = await createLoop({
            cwd: workspace.cwd,
            config: workspace.config,
            goal: options.goal,
            preset: options.preset,
            cadence: options.cadence,
            budgetTokens: options.budgetTokens,
            maxIterations: options.maxIterations,
            runnerCommand: options.runnerCommand,
            runnerName: options.runnerName,
            runnerTimeoutMs: options.runnerTimeoutMs,
          });
          printOutput(result, result.markdown, options, workspace.cwd);
        } catch (error) {
          if (printJsonErrorIfNeeded(error, options.json)) return;
          throw error;
        }
      },
    );

  command
    .command('tick')
    .description('Record one local loop iteration decision without running an external agent')
    .option('--id <id>', 'loop id; defaults to newest loop')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { id?: string; json?: boolean; redactPaths?: boolean }) => {
      try {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        const result = await tickLoop({
          cwd: workspace.cwd,
          config: workspace.config,
          id: options.id,
        });
        printOutput(result, result.markdown, options, workspace.cwd);
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }
    });

  command
    .command('run')
    .description('Run one configured local runner iteration and record the loop decision')
    .option('--id <id>', 'loop id; defaults to newest loop')
    .option('--command <command>', 'must exactly match the configured runner command')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { id?: string; command?: string; json?: boolean; redactPaths?: boolean }) => {
      try {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        const result = await runLoop({
          cwd: workspace.cwd,
          config: workspace.config,
          id: options.id,
          command: options.command,
        });
        printOutput(result, result.markdown, options, workspace.cwd);
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }
    });

  command
    .command('scorecard')
    .description('Score whether a loop can continue, should stop, or needs human review')
    .option('--id <id>', 'loop id; defaults to newest loop')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { id?: string; json?: boolean; redactPaths?: boolean }) => {
      try {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        const result = await scoreLoop({
          cwd: workspace.cwd,
          config: workspace.config,
          id: options.id,
        });
        printOutput(result, result.markdown, options, workspace.cwd);
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }
    });

  command
    .command('status')
    .description('Show loop state, token usage, and next action')
    .option('--id <id>', 'loop id; defaults to newest loop')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { id?: string; json?: boolean; redactPaths?: boolean }) => {
      try {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        const result = await getLoopStatus({
          cwd: workspace.cwd,
          config: workspace.config,
          id: options.id,
        });
        printOutput(result, result.markdown, options, workspace.cwd);
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }
    });

  command
    .command('report')
    .description('Show a reviewable loop report with token ledger and iteration decisions')
    .option('--id <id>', 'loop id; defaults to newest loop')
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (options: { id?: string; json?: boolean; redactPaths?: boolean }) => {
      try {
        const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
        if (!workspace) return;
        const result = await getLoopReport({
          cwd: workspace.cwd,
          config: workspace.config,
          id: options.id,
        });
        printOutput(result, result.markdown, options, workspace.cwd);
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }
    });

  return command;
}
