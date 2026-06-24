import { Command } from 'commander';
import {
  AGENT_START_GOALS,
  buildAgentStart,
  RESUME_PACK_TARGETS,
  type AgentStartGoal,
  type ResumePackTarget,
} from '../../core/agent-start.js';
import { AgentLoopError } from '../../core/errors.js';
import { redactLocalRoots } from '../../core/redaction.js';
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
  throw new CliOptionError(`Unsupported start target: ${target}.`, 'START_TARGET_INVALID', {
    option: 'for',
    value: target,
    supportedTargets: [...RESUME_PACK_TARGETS],
  });
}

function parseGoal(value: unknown): AgentStartGoal {
  const goal = typeof value === 'string' && value.trim() ? value.trim() : 'implement';
  if ((AGENT_START_GOALS as readonly string[]).includes(goal)) {
    return goal as AgentStartGoal;
  }
  throw new CliOptionError(`Unsupported start goal: ${goal}.`, 'START_GOAL_INVALID', {
    option: 'goal',
    value: goal,
    supportedGoals: [...AGENT_START_GOALS],
  });
}

function printJsonErrorIfNeeded(error: unknown, json: boolean | undefined) {
  if (json && error instanceof AgentLoopError) {
    printAgentLoopJsonError(error);
    return true;
  }
  return false;
}

export function startCommand() {
  return new Command('start')
    .description('Brief a software agent with current task, evidence, risk, and context routing')
    .option('--for <target>', 'target reader: codex, claude, cursor, generic, or human', 'generic')
    .option(
      '--goal <goal>',
      'goal: implement, continue, review, debug, handoff, or research',
      'implement',
    )
    .option('--json', 'print machine-readable output')
    .option(
      '--redact-paths',
      'redact local absolute paths in public output; start output uses repo-relative paths by default',
    )
    .action(async (options: { for?: string; goal?: string; json?: boolean; redactPaths?: boolean }) => {
      let target: ResumePackTarget;
      let goal: AgentStartGoal;
      try {
        target = parseTarget(options.for);
        goal = parseGoal(options.goal);
      } catch (error) {
        if (printJsonErrorIfNeeded(error, options.json)) return;
        throw error;
      }

      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const result = await buildAgentStart({
        cwd: workspace.cwd,
        config: workspace.config,
        target,
        goal,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      const markdown =
        options.redactPaths === true
          ? redactLocalRoots(result.markdown, [workspace.cwd])
          : result.markdown;
      console.log(markdown);
    });
}
