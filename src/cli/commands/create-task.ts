import { Command } from 'commander';
import prompts from 'prompts';
import { TASK_TYPES } from '../../core/constants.js';
import { loadAgentLoopConfig } from '../../core/config.js';
import { createTaskContractFile, TaskType } from '../../core/task-contract.js';

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
    .option('--forbidden-file <path>', 'file or area not to touch; repeat or use newlines', lines, [])
    .option('--acceptance <text>', 'acceptance criterion; repeat or use newlines', lines, [])
    .option('--verify-command <command>', 'verification command; repeat or use newlines', lines, [])
    .option('--verification <command>', 'verification command; repeat or use newlines', lines, [])
    .option('--rollback <text>', 'rollback notes')
    .action(async (options: Record<string, unknown>) => {
      const type =
        typeof options.type === 'string' && TASK_TYPES.includes(options.type as TaskType)
          ? (options.type as TaskType)
          : undefined;
      const title = typeof options.title === 'string' ? options.title : undefined;
      const config = await loadAgentLoopConfig(process.cwd());
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
              verificationCommands: listOption(options, 'verifyCommand', 'verification'),
              rollbackNotes: stringOption(options, 'rollback'),
            }
          : await collectInteractive({ title, type });
      const result = await createTaskContractFile({
        cwd: process.cwd(),
        config,
        input,
        out: typeof options.out === 'string' ? options.out : undefined,
      });
      console.log(`Task contract created: ${result.path}`);
    });
}
