import { Command } from 'commander';
import prompts from 'prompts';
import { AgentLoopConfig } from '../../core/config.js';
import { TASK_TYPES } from '../../core/constants.js';
import { AgentLoopError } from '../../core/errors.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import { findLikelyPostVerificationGates } from '../../core/post-verification-gates.js';
import { createTaskContractFile, TaskOutputPathError, TaskType } from '../../core/task-contract.js';
import { setActiveTask } from '../../core/task-state.js';
import { loadWorkspaceForJsonCommand } from '../json-errors.js';

function lines(value: string | undefined, previous: string[]) {
  const current = value
    ? value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
  return [...previous, ...current];
}

function stringOption(options: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (typeof options[key] === 'string') return options[key] as string;
  }
  return '';
}

function listOption(options: Record<string, unknown>, ...keys: string[]) {
  return keys.flatMap((key) => (Array.isArray(options[key]) ? (options[key] as string[]) : []));
}

function uniqueCommands(commands: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const command of commands) {
    const clean = command.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    result.push(clean);
  }
  return result;
}

function configuredVerificationCommands(config: AgentLoopConfig) {
  return uniqueCommands([
    config.commands.test,
    config.commands.lint,
    config.commands.typecheck,
    config.commands.build,
  ]);
}

function verificationCommandsFromOptions(
  options: Record<string, unknown>,
  config: AgentLoopConfig,
) {
  const explicitCommands = listOption(options, 'verifyCommand', 'verification');
  if (options.includeConfigCommands !== true) return uniqueCommands(explicitCommands);
  return uniqueCommands([...configuredVerificationCommands(config), ...explicitCommands]);
}

type CreateTaskWarning = {
  code: 'POST_VERIFICATION_GATE_IN_VERIFICATION_COMMANDS';
  message: string;
  commands: string[];
  suggestion: string;
};

function postVerificationGateWarnings(commands: string[] | undefined): CreateTaskWarning[] {
  const flaggedCommands = findLikelyPostVerificationGates(commands);
  if (flaggedCommands.length === 0) return [];

  const suggestion =
    flaggedCommands.length === 1
      ? `Use --post-verification "${flaggedCommands[0]}".`
      : 'Use --post-verification for each listed command that needs a fresh AgentLoop report.';

  return [
    {
      code: 'POST_VERIFICATION_GATE_IN_VERIFICATION_COMMANDS',
      message:
        'Some verification commands look like post-verification gates. Move them to --post-verification if they need a fresh AgentLoop report.',
      commands: flaggedCommands,
      suggestion,
    },
  ];
}

function resolveTaskType(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const type = value.trim();
  if (TASK_TYPES.includes(type as TaskType)) return type as TaskType;
  throw new AgentLoopError(
    `Unsupported task type "${type}". Supported task types: ${TASK_TYPES.join(', ')}`,
    'UNSUPPORTED_TASK_TYPE',
  );
}

function supportedTaskTypesHelp() {
  return `\nSupported task types:\n${TASK_TYPES.map((type) => `  - ${type}`).join('\n')}\n`;
}

function printJsonError(error: AgentLoopError, details: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          ...details,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

async function collectInteractive(initial: { title?: string; type?: TaskType }) {
  const answers = await prompts([
    {
      type: initial.title ? null : 'text',
      name: 'title',
      message: 'Task title',
    },
    {
      type: initial.type ? null : 'select',
      name: 'type',
      message: 'Task type',
      choices: TASK_TYPES.map((type) => ({ title: type, value: type })),
    },
    { type: 'text', name: 'problemStatement', message: 'Problem statement' },
    { type: 'text', name: 'desiredOutcome', message: 'Desired outcome' },
    { type: 'text', name: 'constraints', message: 'Constraints (separate with semicolons)' },
    { type: 'text', name: 'nonGoals', message: 'Non-goals (separate with semicolons)' },
    {
      type: 'text',
      name: 'likelyFiles',
      message: 'Likely files or areas (separate with semicolons)',
    },
    {
      type: 'text',
      name: 'forbiddenFiles',
      message: 'Files or areas not to touch (separate with semicolons)',
    },
    {
      type: 'text',
      name: 'acceptanceCriteria',
      message: 'Acceptance criteria (separate with semicolons)',
    },
    {
      type: 'text',
      name: 'verificationCommands',
      message: 'Verification commands (separate with semicolons)',
    },
    {
      type: 'text',
      name: 'postVerificationCommands',
      message: 'Post-verification gates (separate with semicolons)',
    },
    { type: 'text', name: 'rollbackNotes', message: 'Rollback notes' },
  ]);

  return {
    title: initial.title ?? answers.title,
    type: initial.type ?? answers.type,
    problemStatement: answers.problemStatement,
    desiredOutcome: answers.desiredOutcome,
    constraints: String(answers.constraints ?? '')
      .split(';')
      .filter(Boolean),
    nonGoals: String(answers.nonGoals ?? '')
      .split(';')
      .filter(Boolean),
    likelyFiles: String(answers.likelyFiles ?? '')
      .split(';')
      .filter(Boolean),
    forbiddenFiles: String(answers.forbiddenFiles ?? '')
      .split(';')
      .filter(Boolean),
    acceptanceCriteria: String(answers.acceptanceCriteria ?? '')
      .split(';')
      .filter(Boolean),
    verificationCommands: String(answers.verificationCommands ?? '')
      .split(';')
      .filter(Boolean),
    postVerificationCommands: String(answers.postVerificationCommands ?? '')
      .split(';')
      .filter(Boolean),
    rollbackNotes: answers.rollbackNotes,
  };
}

export function createTaskCommand() {
  return new Command('create-task')
    .description('Create a task contract for an agentic coding session')
    .option('--title <title>', 'task title')
    .option('--type <type>', 'task type')
    .option('--out <path>', 'output file path')
    .option('--problem <text>', 'problem statement')
    .option('--problem-statement <text>', 'problem statement')
    .option('--outcome <text>', 'desired outcome')
    .option('--desired-outcome <text>', 'desired outcome')
    .option('--constraint <text>', 'constraint; repeat or use newlines', lines, [])
    .option('--non-goal <text>', 'non-goal; repeat or use newlines', lines, [])
    .option('--assumption <text>', 'assumption; repeat or use newlines', lines, [])
    .option('--likely-file <path>', 'likely file or area; repeat or use newlines', lines, [])
    .option(
      '--forbidden-file <path>',
      'file or area not to touch; repeat or use newlines',
      lines,
      [],
    )
    .option('--acceptance <text>', 'acceptance criterion; repeat or use newlines', lines, [])
    .option('--verify-command <command>', 'verification command; repeat or use newlines', lines, [])
    .option('--verification <command>', 'verification command; repeat or use newlines', lines, [])
    .option(
      '--include-config-commands',
      'copy configured test, lint, typecheck, and build commands into the task contract',
    )
    .option(
      '--post-verification <command>',
      'post-verification gate; repeat or use newlines',
      lines,
      [],
    )
    .option('--risk <text>', 'risk note; repeat or use newlines', lines, [])
    .option('--risk-note <text>', 'risk note; repeat or use newlines', lines, [])
    .option('--rollback <text>', 'rollback notes')
    .option('--json', 'print machine-readable output')
    .addHelpText('after', supportedTaskTypesHelp())
    .action(async (options: Record<string, unknown>) => {
      let type: TaskType | undefined;
      try {
        type = resolveTaskType(options.type);
      } catch (error) {
        if (
          options.json &&
          error instanceof AgentLoopError &&
          error.code === 'UNSUPPORTED_TASK_TYPE'
        ) {
          const requestedType = typeof options.type === 'string' ? options.type.trim() : '';
          printJsonError(error, {
            message: `Unsupported task type "${requestedType}".`,
            supportedTaskTypes: TASK_TYPES,
          });
          return;
        }
        throw error;
      }
      const title = typeof options.title === 'string' ? options.title : undefined;
      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json === true);
      if (!workspace) return;
      const input =
        title && type
          ? {
              title,
              type,
              problemStatement: stringOption(options, 'problemStatement', 'problem'),
              desiredOutcome: stringOption(options, 'desiredOutcome', 'outcome'),
              constraints: listOption(options, 'constraint'),
              nonGoals: listOption(options, 'nonGoal'),
              assumptions: listOption(options, 'assumption'),
              likelyFiles: listOption(options, 'likelyFile'),
              forbiddenFiles: listOption(options, 'forbiddenFile'),
              acceptanceCriteria: listOption(options, 'acceptance'),
              verificationCommands: verificationCommandsFromOptions(options, workspace.config),
              postVerificationCommands: listOption(options, 'postVerification'),
              riskNotes: listOption(options, 'risk', 'riskNote'),
              rollbackNotes: stringOption(options, 'rollback'),
            }
          : await collectInteractive({ title, type });
      let result: Awaited<ReturnType<typeof createTaskContractFile>>;
      try {
        result = await createTaskContractFile({
          cwd: workspace.cwd,
          config: workspace.config,
          input,
          out: typeof options.out === 'string' ? options.out : undefined,
        });
      } catch (error) {
        if (options.json && error instanceof TaskOutputPathError) {
          printJsonError(error, {
            requestedOut: error.requestedOut,
            tasksDir: error.tasksDir,
            reason: error.reason,
          });
          return;
        }
        throw error;
      }
      const warnings = postVerificationGateWarnings(input.verificationCommands);
      const activeTask = await setActiveTask({
        cwd: workspace.cwd,
        config: workspace.config,
        taskPath: result.path,
      });
      if (options.json) {
        console.log(
          JSON.stringify(
            warnings.length ? { task: result, activeTask, warnings } : { task: result, activeTask },
            null,
            2,
          ),
        );
        return;
      }
      console.log(`Task contract created: ${inlineCode(result.path)}`);
      console.log(`Active task set: ${inlineCode(activeTask.path)}`);
      for (const warning of warnings) {
        console.log(`Warning: ${warning.message}`);
        console.log(`Move to --post-verification: ${warning.commands.map(inlineCode).join(', ')}`);
      }
    });
}
