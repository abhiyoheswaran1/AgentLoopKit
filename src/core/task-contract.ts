import path from 'node:path';
import { AgentLoopConfig } from './config.js';
import { formatDate } from './dates.js';
import { AgentLoopError } from './errors.js';
import { isInsidePath, normalizeExistingAncestor, writeTextFile } from './file-system.js';
import { slugify } from './slug.js';

export type TaskType =
  | 'feature'
  | 'bugfix'
  | 'refactor'
  | 'tests'
  | 'test-generation'
  | 'docs'
  | 'release'
  | 'security-review'
  | 'dependency-upgrade'
  | 'migration';

export type TaskContractInput = {
  title: string;
  type: TaskType;
  createdDate?: string;
  problemStatement?: string;
  desiredOutcome?: string;
  constraints?: string[];
  nonGoals?: string[];
  assumptions?: string[];
  likelyFiles?: string[];
  forbiddenFiles?: string[];
  acceptanceCriteria?: string[];
  verificationCommands?: string[];
  riskNotes?: string[];
  rollbackNotes?: string;
};

export type TaskOutputPathErrorReason = 'outside-tasks-dir' | 'not-markdown';

export class TaskOutputPathError extends AgentLoopError {
  constructor(
    message: string,
    code: string,
    public readonly requestedOut: string,
    public readonly tasksDir: string,
    public readonly reason: TaskOutputPathErrorReason,
  ) {
    super(message, code);
    this.name = 'TaskOutputPathError';
  }
}

function list(values: string[] | undefined, fallback = 'None recorded yet.') {
  const clean = values?.map((value) => value.trim()).filter(Boolean) ?? [];
  if (clean.length === 0) return `- ${fallback}`;
  return clean.map((value) => `- ${value}`).join('\n');
}

export function generateTaskContract(input: TaskContractInput) {
  const createdDate = input.createdDate ?? formatDate();
  return `# ${input.title}

- Created date: ${createdDate}
- Task type: ${input.type}
- Status: proposed

## Problem Statement
${input.problemStatement || 'Describe the problem this task should solve.'}

## Desired Outcome
${input.desiredOutcome || 'Describe the concrete result expected from this task.'}

## Constraints
${list(input.constraints)}

## Non-Goals
${list(input.nonGoals)}

## Assumptions
${list(input.assumptions)}

## Likely Files or Areas
${list(input.likelyFiles)}

## Files or Areas Not to Touch
${list(input.forbiddenFiles)}

## Acceptance Criteria
${list(input.acceptanceCriteria, 'Add acceptance criteria before implementation starts.')}

## Verification Commands
${list(input.verificationCommands, 'No verification command recorded.')}

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
${list(
  input.riskNotes,
  'Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.',
)}

## Rollback Notes
${input.rollbackNotes || 'Document how to revert or disable this change.'}

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
`;
}

export async function createTaskContractFile(options: {
  cwd: string;
  config: AgentLoopConfig;
  input: TaskContractInput;
  out?: string;
}) {
  const createdDate = options.input.createdDate ?? formatDate();
  const relativePath =
    options.out ??
    path.join(options.config.paths.tasksDir, `${createdDate}-${slugify(options.input.title)}.md`);
  const absolutePath = path.isAbsolute(relativePath)
    ? path.resolve(relativePath)
    : path.resolve(options.cwd, relativePath);
  const repoRoot = normalizeExistingAncestor(path.resolve(options.cwd));
  const tasksRoot = normalizeExistingAncestor(
    path.resolve(options.cwd, options.config.paths.tasksDir),
  );

  if (
    !isInsidePath(repoRoot, tasksRoot) ||
    !isInsidePath(tasksRoot, normalizeExistingAncestor(absolutePath))
  ) {
    throw new TaskOutputPathError(
      `Task output path must stay inside ${options.config.paths.tasksDir}.`,
      'TASK_OUTPUT_PATH_OUTSIDE_TASKS_DIR',
      relativePath,
      options.config.paths.tasksDir,
      'outside-tasks-dir',
    );
  }
  if (!absolutePath.endsWith('.md')) {
    throw new TaskOutputPathError(
      'Task output path must be a Markdown file.',
      'TASK_OUTPUT_PATH_NOT_MARKDOWN',
      relativePath,
      options.config.paths.tasksDir,
      'not-markdown',
    );
  }

  const markdown = generateTaskContract({ ...options.input, createdDate });
  await writeTextFile(absolutePath, markdown);
  return { path: absolutePath, markdown };
}
