import { Command } from 'commander';
import { AgentLoopError } from '../../core/errors.js';
import { redactLocalRoots } from '../../core/redaction.js';
import {
  buildContextBudgetContract,
  buildContextHandleInventory,
  buildContextPack,
  CONTEXT_PACK_GOALS,
  RESUME_PACK_TARGETS,
  showContextHandle,
  type ContextPackGoal,
  type ResumePackTarget,
} from '../../core/context-contract.js';
import {
  CliOptionError,
  loadWorkspaceForJsonCommand,
  printAgentLoopJsonError,
} from '../json-errors.js';

function parseTarget(value: unknown): ResumePackTarget {
  const target = typeof value === 'string' && value.trim() ? value.trim() : 'generic';
  if ((RESUME_PACK_TARGETS as readonly string[]).includes(target)) {
    return target as ResumePackTarget;
  }
  throw new CliOptionError(`Unsupported context pack target: ${target}.`, 'CONTEXT_TARGET_INVALID', {
    option: 'for',
    value: target,
    supportedTargets: [...RESUME_PACK_TARGETS],
  });
}

function parseGoal(value: unknown): ContextPackGoal {
  const goal = typeof value === 'string' && value.trim() ? value.trim() : 'continue';
  if ((CONTEXT_PACK_GOALS as readonly string[]).includes(goal)) {
    return goal as ContextPackGoal;
  }
  throw new CliOptionError(`Unsupported context pack goal: ${goal}.`, 'CONTEXT_GOAL_INVALID', {
    option: 'goal',
    value: goal,
    supportedGoals: [...CONTEXT_PACK_GOALS],
  });
}

function printJsonErrorIfNeeded(error: unknown, json: boolean | undefined) {
  if (json && error instanceof AgentLoopError) {
    printAgentLoopJsonError(error);
    return true;
  }
  return false;
}

function stringifyContextOutput(value: unknown, cwd: string, redactPaths: boolean | undefined) {
  const output = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return redactPaths === true ? redactLocalRoots(output, [cwd]) : output;
}

export function contextCommand() {
  const command = new Command('context').description(
    'Measure and package local AgentLoopKit context for software agents',
  );

  command
    .command('budget')
    .description('Show local context pressure and compact-pack savings guidance')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'redact local absolute paths in public output; context paths are repo-relative by default',
    )
    .action(async (options: { json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await buildContextBudgetContract({
        cwd: workspace.cwd,
        config: workspace.config,
      });

      if (options.json) console.log(stringifyContextOutput(result, workspace.cwd, options.redactPaths));
      else console.log(stringifyContextOutput(result.markdown, workspace.cwd, options.redactPaths));
    });

  command
    .command('handles')
    .description('List local context source handles with availability and expansion commands')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'redact local absolute paths in public output; context paths are repo-relative by default',
    )
    .action(async (options: { json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await buildContextHandleInventory({
        cwd: workspace.cwd,
        config: workspace.config,
      });

      if (options.json) console.log(stringifyContextOutput(result, workspace.cwd, options.redactPaths));
      else console.log(stringifyContextOutput(result.markdown, workspace.cwd, options.redactPaths));
    });

  command
    .command('pack')
    .description('Build an auditable context pack with receipts and source handles')
    .option('--for <target>', 'target reader: codex, claude, cursor, generic, or human', 'generic')
    .option('--goal <goal>', 'goal: continue, review, debug, handoff, or research', 'continue')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'redact local absolute paths in public output; context paths are repo-relative by default',
    )
    .action(async (options: { for?: string; goal?: string; json?: boolean; redactPaths?: boolean }) => {
      let target: ResumePackTarget;
      let goal: ContextPackGoal;
      try {
        target = parseTarget(options.for);
        goal = parseGoal(options.goal);
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }

      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await buildContextPack({
        cwd: workspace.cwd,
        config: workspace.config,
        target,
        goal,
      });

      if (options.json) console.log(stringifyContextOutput(result, workspace.cwd, options.redactPaths));
      else console.log(stringifyContextOutput(result.markdown, workspace.cwd, options.redactPaths));
    });

  command
    .command('show')
    .description('Expand a local context source handle')
    .argument('<handle>', 'source handle, for example task:active or evidence-map:current')
    .option('--since <digest>', 'omit content when the handle digest has not changed')
    .option('--full', 'print content even when --since matches')
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'redact local absolute paths in public output; context paths are repo-relative by default',
    )
    .action(async (handle: string, options: { since?: string; full?: boolean; json?: boolean; redactPaths?: boolean }) => {
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      try {
        const result = await showContextHandle({
          cwd: workspace.cwd,
          config: workspace.config,
          handle,
          redactPaths: options.redactPaths === true,
          since: options.since,
          full: options.full === true,
        });
        if (options.json) console.log(JSON.stringify(result, null, 2));
        else console.log(result.content ?? result.message ?? '');
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }
    });

  return command;
}
