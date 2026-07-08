import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { Command } from 'commander';
import prompts from 'prompts';
import { createTaskFromProjScan } from '../../core/baseframe.js';
import { AgentLoopConfig } from '../../core/config.js';
import { TASK_TYPES } from '../../core/constants.js';
import { AgentLoopError } from '../../core/errors.js';
import { pathExists } from '../../core/file-system.js';
import { filterNonAgentLoopEvidenceFiles, getGitStatus, parseGitStatus } from '../../core/git.js';
import { analyzeContract, renderSoftSpotsText } from '../../core/harden.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import { findLikelyPostVerificationGates } from '../../core/post-verification-gates.js';
import { redactLocalRoots } from '../../core/redaction.js';
import {
  createTaskContractFile,
  findPlaceholderTaskSections,
  TaskOutputPathError,
  TaskType,
} from '../../core/task-contract.js';
import { getActiveTask, setActiveTask } from '../../core/task-state.js';
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

const DIRTY_WORKTREE_EXAMPLE_LIMIT = 5;

type CreateTaskWarning =
  | {
      code: 'DIRTY_WORKTREE_BEFORE_TASK_CREATION';
      message: string;
      fileCount: number;
      examples: string[];
      suggestion: string;
    }
  | {
      code: 'POST_VERIFICATION_GATE_IN_VERIFICATION_COMMANDS';
      message: string;
      commands: string[];
      suggestion: string;
    }
  | {
      code: 'TASK_CONTRACT_PLACEHOLDER_SECTIONS';
      message: string;
      sections: string[];
      suggestion: string;
    };

async function dirtyWorktreeWarnings(cwd: string): Promise<CreateTaskWarning[]> {
  const changedFiles = filterNonAgentLoopEvidenceFiles(await parseGitStatus(await getGitStatus(cwd)));
  if (changedFiles.length === 0) return [];

  return [
    {
      code: 'DIRTY_WORKTREE_BEFORE_TASK_CREATION',
      message:
        'Git already had dirty non-evidence files before this task was created. Review them before treating the new task as isolated.',
      fileCount: changedFiles.length,
      examples: changedFiles
        .slice(0, DIRTY_WORKTREE_EXAMPLE_LIMIT)
        .map((changedFile) => changedFile.path),
      suggestion:
        'Run `agentloop status --redact-paths` and confirm existing dirty files belong to this task before implementation.',
    },
  ];
}

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

function placeholderSectionWarnings(markdown: string): CreateTaskWarning[] {
  const sections = findPlaceholderTaskSections(markdown);
  if (sections.length === 0) return [];

  return [
    {
      code: 'TASK_CONTRACT_PLACEHOLDER_SECTIONS',
      message:
        'Task contract still contains review-critical placeholder sections. Replace them before implementation or review handoff.',
      sections,
      suggestion: 'Run `agentloop task doctor` or edit the task contract before implementation.',
    },
  ];
}

function printHumanWarning(warning: CreateTaskWarning) {
  console.log(`Warning: ${warning.message}`);
  if (warning.code === 'DIRTY_WORKTREE_BEFORE_TASK_CREATION') {
    console.log(
      `Dirty non-evidence files: ${warning.fileCount} total; examples: ${warning.examples
        .map(inlineCode)
        .join(', ')}`,
    );
    console.log(`Suggestion: ${warning.suggestion}`);
    return;
  }
  if (warning.code === 'POST_VERIFICATION_GATE_IN_VERIFICATION_COMMANDS') {
    console.log(`Move to --post-verification: ${warning.commands.map(inlineCode).join(', ')}`);
    return;
  }
  console.log(`Review-critical placeholders: ${warning.sections.map(inlineCode).join(', ')}`);
  console.log(
    `Suggestion: Run ${inlineCode('agentloop task doctor')} or edit the task contract before implementation.`,
  );
}

function dirtyWorktreeRiskNotes(warnings: CreateTaskWarning[]) {
  const warning = warnings.find(
    (candidate): candidate is Extract<
      CreateTaskWarning,
      { code: 'DIRTY_WORKTREE_BEFORE_TASK_CREATION' }
    > => candidate.code === 'DIRTY_WORKTREE_BEFORE_TASK_CREATION',
  );
  if (!warning) return [];

  return [
    `Pre-existing dirty non-evidence files before task creation: ${warning.fileCount} total; examples: ${warning.examples
      .map(inlineCode)
      .join(', ')}. Confirm they belong to this task before implementation.`,
  ];
}

const BASEFRAME_ACCEPTANCE_WARNING = {
  code: 'BASEFRAME_ACCEPTANCE_CRITERIA_REQUIRED',
  message:
    'ProjScan assessments do not provide complete acceptance criteria. Add human acceptance criteria before treating this task as ready.',
} as const;

function baseframeAcceptanceWarnings(contract: Awaited<ReturnType<typeof createTaskFromProjScan>>) {
  if (!contract.acceptanceCriteria.some((criterion) => criterion.status === 'unknown')) return [];
  return [BASEFRAME_ACCEPTANCE_WARNING];
}

function baseframeContractPath(taskId: string) {
  return `.baseframe/evidence/${taskId}/agentloopkit-task.json`;
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

type LoopGuidance = {
  taskType: TaskType;
  path: string;
};

async function loopGuidanceForTaskType(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskType: TaskType;
}): Promise<LoopGuidance | undefined> {
  const agentloopDir = options.config.paths.agentloopDir.replace(/\\/g, '/');
  const loopPath = path.posix.join(agentloopDir, 'loops', `${options.taskType}.md`);
  if (!(await pathExists(path.resolve(options.cwd, loopPath)))) return undefined;
  return { taskType: options.taskType, path: loopPath };
}

function redactPathValue(value: string, cwd: string, redactPaths: boolean) {
  return redactPaths ? redactLocalRoots(value, [cwd]) : value;
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
    riskNotes: [],
    rollbackNotes: answers.rollbackNotes,
  };
}

export function createTaskCommand() {
  return new Command('create-task')
    .description('Create a task contract for an agentic engineering session')
    .option('--title <title>', 'task title')
    .option('--type <type>', 'task type')
    .option('--from-projscan <path>', 'create a Baseframe task from a ProjScan assessment')
    .option('--out <path>', 'output file path')
    .option('--problem <text>', 'problem statement')
    .option('--problem-statement <text>', 'problem statement')
    .option('--outcome <text>', 'desired outcome')
    .option('--desired-outcome <text>', 'desired outcome')
    .option('--constraint <text>', 'constraint; repeat or use newlines', lines, [])
    .option('--non-goal <text>', 'non-goal; repeat or use newlines', lines, [])
    .option('--assumption <text>', 'assumption; repeat or use newlines', lines, [])
    .option('--likely-file <path>', 'likely file or area; repeat or use newlines', lines, [])
    .option('--allow <path>', 'Baseframe allowed path override; repeat or use newlines', lines, [])
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
    .option('--redact-paths', 'redact local absolute paths in public output')
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
      const redactPaths = options.redactPaths === true;
      const fromProjScan = stringOption(options, 'fromProjscan', 'fromProjScan');
      if (fromProjScan) {
        try {
          const contract = await createTaskFromProjScan({
            cwd: workspace.cwd,
            config: workspace.config,
            assessmentPath: fromProjScan,
            title,
            allowedPaths: listOption(options, 'allow'),
            acceptanceCriteria: listOption(options, 'acceptance'),
          });
          const warnings = baseframeAcceptanceWarnings(contract);
          const activeTask = await getActiveTask({
            cwd: workspace.cwd,
            config: workspace.config,
          });
          const nativeTaskPath = contract.nativeTaskPath
            ? path.resolve(workspace.cwd, contract.nativeTaskPath)
            : undefined;
          const task = nativeTaskPath
            ? {
                path: redactPathValue(nativeTaskPath, workspace.cwd, redactPaths),
                markdown: await readFile(nativeTaskPath, 'utf8'),
              }
            : undefined;

          if (options.json) {
            console.log(
              JSON.stringify(
                {
                  baseframeTask: contract,
                  ...(task ? { task } : {}),
                  activeTask,
                  ...(warnings.length ? { warnings } : {}),
                },
                null,
                2,
              ),
            );
            return;
          }

          const contractPath = baseframeContractPath(contract.taskId);
          console.log(`Baseframe task contract created: ${inlineCode(contractPath)}`);
          if (contract.nativeTaskPath) {
            console.log(`Native task: ${inlineCode(contract.nativeTaskPath)}`);
          }
          if (activeTask) {
            console.log(`Active task set: ${inlineCode(activeTask.path)}`);
          }
          console.log(`AgentFlight should consume: ${inlineCode(contractPath)}`);
          for (const warning of warnings) {
            console.log(`Warning: ${warning.message}`);
          }
          return;
        } catch (error) {
          if (options.json && error instanceof AgentLoopError) {
            printJsonError(error);
            return;
          }
          throw error;
        }
      }
      const preCreateWarnings = await dirtyWorktreeWarnings(workspace.cwd);
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
          input: {
            ...input,
            riskNotes: [...(input.riskNotes ?? []), ...dirtyWorktreeRiskNotes(preCreateWarnings)],
          },
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
      const warnings = [
        ...preCreateWarnings,
        ...postVerificationGateWarnings(input.verificationCommands),
        ...placeholderSectionWarnings(result.markdown),
      ];
      const activeTask = await setActiveTask({
        cwd: workspace.cwd,
        config: workspace.config,
        taskPath: result.path,
      });
      const loopGuidance = await loopGuidanceForTaskType({
        cwd: workspace.cwd,
        config: workspace.config,
        taskType: input.type,
      });
      const displayTaskPath = redactPathValue(result.path, workspace.cwd, redactPaths);
      if (options.json) {
        console.log(
          JSON.stringify(
            {
              task: { ...result, path: displayTaskPath },
              activeTask,
              ...(loopGuidance ? { loopGuidance } : {}),
              ...(warnings.length ? { warnings } : {}),
            },
            null,
            2,
          ),
        );
        return;
      }
      console.log(`Task contract created: ${inlineCode(displayTaskPath)}`);
      console.log(`Active task set: ${inlineCode(activeTask.path)}`);
      if (loopGuidance) {
        console.log(`Loop guidance: ${inlineCode(loopGuidance.path)}`);
      }
      for (const warning of warnings) {
        printHumanWarning(warning);
      }
      const softSpots = analyzeContract(result.markdown);
      console.log(renderSoftSpotsText(softSpots));
      console.log('Run `agentloop harden --resolve <id> --answer "..."` to resolve them.');
    });
}
