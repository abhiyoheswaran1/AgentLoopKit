import path from 'node:path';
import { AgentLoopConfig } from './config.js';
import { formatDate } from './dates.js';
import { AgentLoopError } from './errors.js';
import { isInsidePath, normalizeExistingAncestor, pathExists, writeTextFile } from './file-system.js';
import { slugify } from './slug.js';

export type TaskType =
  | 'feature'
  | 'bugfix'
  | 'refactor'
  | 'tests'
  | 'test-generation'
  | 'research'
  | 'docs'
  | 'release'
  | 'security-review'
  | 'dependency-upgrade'
  | 'migration';

export type TaskContractInput = {
  title: string;
  type: TaskType;
  status?: 'proposed' | 'in-progress' | 'blocked' | 'deferred' | 'review' | 'done';
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
  postVerificationCommands?: string[];
  riskNotes?: string[];
  rollbackNotes?: string;
};

export type TaskOutputPathErrorReason = 'outside-tasks-dir' | 'not-markdown';

const PROBLEM_STATEMENT_PLACEHOLDER = 'Describe the problem this task should solve.';
const DESIRED_OUTCOME_PLACEHOLDER = 'Describe the concrete result expected from this task.';
const LIKELY_FILES_PLACEHOLDER = 'None recorded yet.';
const ACCEPTANCE_CRITERIA_PLACEHOLDER = 'Add acceptance criteria before implementation starts.';
const VERIFICATION_COMMANDS_PLACEHOLDER = 'No verification command recorded.';
const ROLLBACK_NOTES_PLACEHOLDER = 'Document how to revert or disable this change.';

export const REVIEW_CRITICAL_TASK_PLACEHOLDERS = [
  {
    heading: 'Problem Statement',
    placeholder: PROBLEM_STATEMENT_PLACEHOLDER,
  },
  {
    heading: 'Desired Outcome',
    placeholder: DESIRED_OUTCOME_PLACEHOLDER,
  },
  {
    heading: 'Likely Files or Areas',
    placeholder: LIKELY_FILES_PLACEHOLDER,
  },
  {
    heading: 'Acceptance Criteria',
    placeholder: ACCEPTANCE_CRITERIA_PLACEHOLDER,
  },
  {
    heading: 'Verification Commands',
    placeholder: VERIFICATION_COMMANDS_PLACEHOLDER,
  },
  {
    heading: 'Rollback Notes',
    placeholder: ROLLBACK_NOTES_PLACEHOLDER,
  },
] as const;

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

// A line that opens or closes a fenced code block (``` or ~~~, optionally
// followed by a language info string, e.g. "```ts"). Section-boundary
// detection and criteria-line filtering both need to agree on this so a
// pasted markdown/API snippet inside a section doesn't get misread as
// document structure.
export function isFenceDelimiterLine(line: string): boolean {
  return /^\s*(```|~~~)/.test(line);
}

// Fence-aware scan for the end (exclusive index) of a `## <heading>` body
// that starts at `bodyStart` within `lines`. A `#{2,}` heading only counts
// as a section boundary when we are NOT inside a fenced code block —
// otherwise a `###`/`##` line pasted inside a fenced snippet (e.g. an
// acceptance criterion quoting an API doc) would wrongly truncate the
// section and drop everything after it.
export function findSectionBodyEnd(lines: string[], bodyStart: number): number {
  let inFence = false;
  let end = bodyStart;
  for (; end < lines.length; end += 1) {
    const line = lines[end];
    if (isFenceDelimiterLine(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^#{2,}\s+/.test(line)) break;
  }
  return end;
}

export function extractMarkdownSectionLines(markdown: string, heading: string) {
  const lines = markdown.split('\n');
  const headingIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (headingIndex === -1) return [];

  const end = findSectionBodyEnd(lines, headingIndex + 1);
  const sectionLines = lines.slice(headingIndex + 1, end);

  return sectionLines.map((line) => line.trim()).filter(Boolean);
}

export function normalizeTaskSectionLine(line: string) {
  return line
    .replace(/^\s*-\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findPlaceholderTaskSections(markdown: string) {
  const sections: string[] = [];

  for (const { heading, placeholder } of REVIEW_CRITICAL_TASK_PLACEHOLDERS) {
    const sectionLines = extractMarkdownSectionLines(markdown, heading);
    if (sectionLines.some((line) => normalizeTaskSectionLine(line) === placeholder)) {
      sections.push(heading);
    }
  }

  return sections;
}

export function generateTaskContract(input: TaskContractInput) {
  const createdDate = input.createdDate ?? formatDate();
  return `# ${input.title}

- Created date: ${createdDate}
- Task type: ${input.type}
- Status: ${input.status ?? 'proposed'}

## Problem Statement
${input.problemStatement || PROBLEM_STATEMENT_PLACEHOLDER}

## Desired Outcome
${input.desiredOutcome || DESIRED_OUTCOME_PLACEHOLDER}

## Constraints
${list(input.constraints)}

## Non-Goals
${list(input.nonGoals)}

## Assumptions
${list(input.assumptions)}

## Likely Files or Areas
${list(input.likelyFiles, LIKELY_FILES_PLACEHOLDER)}

## Files or Areas Not to Touch
${list(input.forbiddenFiles)}

## Acceptance Criteria
${list(input.acceptanceCriteria, ACCEPTANCE_CRITERIA_PLACEHOLDER)}

## Verification Commands
${list(input.verificationCommands, VERIFICATION_COMMANDS_PLACEHOLDER)}

## Post-Verification Gates
${list(
  input.postVerificationCommands,
  'No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.',
)}

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
${input.rollbackNotes || ROLLBACK_NOTES_PLACEHOLDER}

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
`;
}

async function resolveDefaultTaskPath(options: {
  cwd: string;
  tasksDir: string;
  createdDate: string;
  title: string;
}) {
  const slug = slugify(options.title);
  for (let index = 1; index <= 1000; index += 1) {
    const suffix = index === 1 ? '' : `-${index}`;
    const relativePath = path.join(options.tasksDir, `${options.createdDate}-${slug}${suffix}.md`);
    const absolutePath = path.resolve(options.cwd, relativePath);
    if (!(await pathExists(absolutePath))) return { relativePath, absolutePath };
  }

  throw new AgentLoopError(
    `Could not allocate a unique task contract path for "${options.title}".`,
    'TASK_OUTPUT_PATH_COLLISION_LIMIT',
  );
}

export async function createTaskContractFile(options: {
  cwd: string;
  config: AgentLoopConfig;
  input: TaskContractInput;
  out?: string;
}) {
  const createdDate = options.input.createdDate ?? formatDate();
  const defaultPath = options.out
    ? null
    : await resolveDefaultTaskPath({
        cwd: options.cwd,
        tasksDir: options.config.paths.tasksDir,
        createdDate,
        title: options.input.title,
      });
  const relativePath = options.out ?? defaultPath?.relativePath ?? '';
  const absolutePath =
    defaultPath?.absolutePath ??
    (path.isAbsolute(relativePath)
      ? path.resolve(relativePath)
      : path.resolve(options.cwd, relativePath));
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
