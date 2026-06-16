import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { execa } from 'execa';
import { AgentLoopConfig } from './config.js';
import { resolveUniqueOutputArtifactPath } from './artifacts.js';
import { formatTimestamp } from './dates.js';
import { getGitBranch, getGitCommit, getGitStatus } from './git.js';
import { isInsidePath, normalizeExistingAncestor, writeTextFile } from './file-system.js';
import { fencedCodeBlock, inlineCode } from './markdown-format.js';
import { redactLocalRoots } from './redaction.js';

export type VerificationCommandKey =
  | 'test'
  | 'lint'
  | 'typecheck'
  | 'build'
  | 'custom'
  | 'task'
  | 'post-verification';

export type VerificationCommandResult = {
  key: VerificationCommandKey;
  command: string;
  exitCode: number;
  passed: boolean;
  output: string;
  timedOut?: boolean;
};

export type SkippedDuplicateCommand = {
  command: string;
  originalKey: VerificationCommandKey;
  duplicateKey: VerificationCommandKey;
};

export type VerificationCiContext = {
  provider: 'github-actions' | 'gitlab-ci' | 'buildkite' | 'generic-ci';
  providerName: string;
  workflow?: string;
  event?: string;
  ref?: string;
  commit?: string;
  runUrl?: string;
  runAttempt?: string;
};

export type VerificationProgressEvent =
  | {
      event: 'start';
      index: number;
      total: number;
      key: VerificationCommandKey;
      command: string;
    }
  | {
      event: 'finish';
      index: number;
      total: number;
      key: VerificationCommandKey;
      command: string;
      status: 'pass' | 'fail' | 'timeout';
      exitCode: number;
      durationMs: number;
      timedOut?: boolean;
    };

export type VerificationOptions = {
  cwd: string;
  config: AgentLoopConfig;
  reportTimestamp?: string;
  nowIso?: string;
  env?: NodeJS.ProcessEnv;
  taskPath?: string;
  taskCommands?: boolean;
  postVerificationGates?: boolean;
  skip?: Partial<Record<'test' | 'lint' | 'typecheck' | 'build', boolean>>;
  customCommands?: string[];
  timeoutMs?: number;
  onProgress?: (event: VerificationProgressEvent) => void;
  redactPaths?: boolean;
};

export type VerificationResult = {
  overallStatus: 'pass' | 'fail' | 'not-run';
  commands: VerificationCommandResult[];
  notRun: string[];
  taskCommands: {
    requested: boolean;
    foundCount: number;
    commands: string[];
  };
  postVerificationGates: {
    requested: boolean;
    foundCount: number;
    commands: string[];
    results: VerificationCommandResult[];
  };
  skippedDuplicateCommands: SkippedDuplicateCommand[];
  ciContext?: VerificationCiContext;
  markdown: string;
  reportPath: string;
};

function excerpt(output: string, limit = 5000) {
  if (output.length <= limit) return output;
  const headLimit = Math.ceil(limit / 2);
  const tailLimit = Math.floor(limit / 2);
  return `${output.slice(0, headLimit)}

[output truncated: showing first ${headLimit} and last ${tailLimit} characters of ${
    output.length
  } total]

${output.slice(-tailLimit)}`;
}

function failureSnippet(output: string, maxLines = 12, maxChars = 2000) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim());
  const tail = lines.slice(-maxLines).join('\n') || '(no output)';
  if (tail.length <= maxChars) return tail;
  return `${tail.slice(0, maxChars)}
[failure summary truncated]`;
}

function renderFailureSummary(results: VerificationCommandResult[]) {
  const failures = results.filter((result) => !result.passed);
  if (!failures.length) return '';

  return `## Failure Summary
${failures
  .map(
    (result) => `### ${result.key}: ${inlineCode(result.command)}

- Exit code: ${result.exitCode}

${fencedCodeBlock('text', failureSnippet(result.output))}`,
  )
  .join('\n\n')}

`;
}

function isTimeoutError(error: unknown) {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'timedOut' in error &&
    (error as { timedOut?: unknown }).timedOut === true,
  );
}

async function runVerificationCommand(options: {
  key: VerificationCommandKey;
  command: string;
  cwd: string;
  env: NodeJS.ProcessEnv;
  timeoutMs?: number;
}): Promise<VerificationCommandResult> {
  try {
    const result = await execa(options.command, {
      cwd: options.cwd,
      shell: true,
      all: true,
      reject: false,
      env: { ...options.env, FORCE_COLOR: '0' },
      ...(options.timeoutMs ? { timeout: options.timeoutMs } : {}),
    });
    const timedOut = 'timedOut' in result && (result as { timedOut?: unknown }).timedOut === true;
    const output = result.all ?? result.stdout ?? result.stderr ?? '';
    return {
      key: options.key,
      command: options.command,
      exitCode: result.exitCode ?? (timedOut ? 1 : 1),
      passed: result.exitCode === 0 && !timedOut,
      output: timedOut
        ? `${output}${output ? '\n' : ''}Command timed out after ${options.timeoutMs}ms.`
        : output,
      ...(timedOut ? { timedOut: true } : {}),
    };
  } catch (error) {
    if (!isTimeoutError(error)) throw error;
    const output =
      error && typeof error === 'object' && 'all' in error && typeof error.all === 'string'
        ? error.all
        : '';
    return {
      key: options.key,
      command: options.command,
      exitCode: 1,
      passed: false,
      output: `${output}${output ? '\n' : ''}Command timed out after ${options.timeoutMs}ms.`,
      timedOut: true,
    };
  }
}

function parseTaskSectionCommands(markdown: string, sectionName: string, emptyMessage: string) {
  const lines = markdown.split(/\r?\n/);
  const commands: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (line.trim().replace(/\s+/g, ' ') === `## ${sectionName}`) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(line.trim())) break;
    if (!inSection) continue;

    const match = line.match(/^\s*-\s+(.+?)\s*$/);
    const command = normalizeTaskVerificationCommand(match?.[1]);
    if (!command || command === emptyMessage) continue;
    commands.push(command);
  }

  return commands;
}

function parseTaskVerificationCommands(markdown: string) {
  return parseTaskSectionCommands(
    markdown,
    'Verification Commands',
    'No verification command recorded.',
  );
}

function parseTaskPostVerificationGates(markdown: string) {
  return parseTaskSectionCommands(
    markdown,
    'Post-Verification Gates',
    'No post-verification gate recorded.',
  );
}

function normalizeTaskVerificationCommand(raw: string | undefined) {
  const command = raw?.trim();
  if (!command) return undefined;

  const inlineCodeMatch = command.match(/^(`+)([\s\S]*?)\1$/);
  return inlineCodeMatch?.[2]?.trim() || command;
}

function resolveTaskPath(cwd: string, config: AgentLoopConfig, taskPath: string | undefined) {
  if (!taskPath?.trim()) return undefined;
  const cleanPath = taskPath.trim();
  const absolutePath = path.isAbsolute(cleanPath)
    ? path.resolve(cleanPath)
    : path.resolve(cwd, cleanPath);
  const repoRoot = normalizeExistingAncestor(path.resolve(cwd));
  const tasksRoot = normalizeExistingAncestor(path.resolve(cwd, config.paths.tasksDir));

  return {
    cleanPath,
    absolutePath,
    safe:
      isMarkdownTaskPath(cleanPath) &&
      isInsidePath(repoRoot, tasksRoot) &&
      isInsidePath(tasksRoot, normalizeExistingAncestor(absolutePath)),
  };
}

async function readSafeTaskMarkdown(
  cwd: string,
  config: AgentLoopConfig,
  taskPath: string | undefined,
) {
  const resolved = resolveTaskPath(cwd, config, taskPath);
  if (!resolved?.safe) return undefined;

  try {
    return await readFile(resolved.absolutePath, 'utf8');
  } catch {
    return undefined;
  }
}

type VerificationCommandSelection = {
  commands: Array<[VerificationCommandKey, string]>;
  taskCommandsRequested: boolean;
  taskCommandsFound: number;
  taskCommands: string[];
  skippedDuplicateCommands: SkippedDuplicateCommand[];
};

function uniqueCommandEntries(entries: Array<[VerificationCommandKey, string]>) {
  const seen = new Map<string, VerificationCommandKey>();
  const result: Array<[VerificationCommandKey, string]> = [];
  const skippedDuplicateCommands: SkippedDuplicateCommand[] = [];
  for (const [key, command] of entries) {
    const clean = command.trim();
    if (!clean) continue;
    const originalKey = seen.get(clean);
    if (originalKey) {
      skippedDuplicateCommands.push({
        command: clean,
        originalKey,
        duplicateKey: key,
      });
      continue;
    }
    seen.set(clean, key);
    result.push([key, clean]);
  }
  return { commands: result, skippedDuplicateCommands };
}

async function commandEntries(
  config: AgentLoopConfig,
  options: VerificationOptions,
): Promise<VerificationCommandSelection> {
  const configured: Array<[VerificationCommandKey, string]> = [
    ['test', config.commands.test],
    ['lint', config.commands.lint],
    ['typecheck', config.commands.typecheck],
    ['build', config.commands.build],
  ];

  const active = configured.filter(([key, command]) => {
    if (key === 'custom') return false;
    return command && !options.skip?.[key as 'test' | 'lint' | 'typecheck' | 'build'];
  });

  for (const command of options.customCommands ?? []) {
    if (command.trim()) active.push(['custom', command.trim()]);
  }
  let taskCommandsFound = 0;
  let taskCommands: string[] = [];
  if (options.taskCommands) {
    const markdown = await readSafeTaskMarkdown(options.cwd, config, options.taskPath);
    taskCommands = markdown ? parseTaskVerificationCommands(markdown) : [];
    taskCommandsFound = taskCommands.length;
    for (const command of taskCommands) {
      active.push(['task', command]);
    }
  }

  const selectedCommands = uniqueCommandEntries(active);

  return {
    commands: selectedCommands.commands,
    taskCommandsRequested: options.taskCommands === true,
    taskCommandsFound,
    taskCommands,
    skippedDuplicateCommands: selectedCommands.skippedDuplicateCommands,
  };
}

function singleLine(value: string | undefined, limit = 300) {
  const clean = value?.replace(/\s+/g, ' ').trim();
  if (!clean) return undefined;
  return clean.length > limit ? `${clean.slice(0, limit)}...` : clean;
}

function withoutTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function isEnabledCi(value: string | undefined) {
  const clean = value?.trim().toLowerCase();
  return clean === 'true' || clean === '1';
}

export function detectCiContext(env: NodeJS.ProcessEnv): VerificationCiContext | undefined {
  if (env.GITHUB_ACTIONS === 'true') {
    const serverUrl = withoutTrailingSlash(
      singleLine(env.GITHUB_SERVER_URL) ?? 'https://github.com',
    );
    const repository = singleLine(env.GITHUB_REPOSITORY);
    const runId = singleLine(env.GITHUB_RUN_ID);
    const runUrl =
      repository && runId ? `${serverUrl}/${repository}/actions/runs/${runId}` : undefined;

    return {
      provider: 'github-actions',
      providerName: 'GitHub Actions',
      workflow: singleLine(env.GITHUB_WORKFLOW),
      event: singleLine(env.GITHUB_EVENT_NAME),
      ref: singleLine(env.GITHUB_REF),
      commit: singleLine(env.GITHUB_SHA),
      runUrl,
      runAttempt: singleLine(env.GITHUB_RUN_ATTEMPT),
    };
  }

  if (env.GITLAB_CI === 'true') {
    return {
      provider: 'gitlab-ci',
      providerName: 'GitLab CI',
      workflow: singleLine(env.CI_PROJECT_PATH),
      event: singleLine(env.CI_PIPELINE_SOURCE),
      ref: singleLine(env.CI_COMMIT_REF_NAME),
      commit: singleLine(env.CI_COMMIT_SHA),
      runUrl: singleLine(env.CI_PIPELINE_URL),
    };
  }

  if (env.BUILDKITE === 'true') {
    return {
      provider: 'buildkite',
      providerName: 'Buildkite',
      workflow: singleLine(env.BUILDKITE_PIPELINE_SLUG),
      event: singleLine(env.BUILDKITE_SOURCE),
      ref: singleLine(env.BUILDKITE_BRANCH),
      commit: singleLine(env.BUILDKITE_COMMIT),
      runUrl: singleLine(env.BUILDKITE_BUILD_URL),
    };
  }

  if (isEnabledCi(env.CI)) {
    return {
      provider: 'generic-ci',
      providerName: 'Generic CI',
    };
  }

  return undefined;
}

function renderCiContext(ciContext: VerificationCiContext | undefined) {
  if (!ciContext) return '';

  const lines = [`- Provider: ${ciContext.providerName}`];
  if (ciContext.workflow) lines.push(`- Workflow: ${inlineCode(ciContext.workflow)}`);
  if (ciContext.event) lines.push(`- Event: ${inlineCode(ciContext.event)}`);
  if (ciContext.ref) lines.push(`- Ref: ${inlineCode(ciContext.ref)}`);
  if (ciContext.commit) lines.push(`- Commit: ${inlineCode(ciContext.commit)}`);
  if (ciContext.runUrl) lines.push(`- Run URL: ${inlineCode(ciContext.runUrl)}`);
  if (ciContext.runAttempt) lines.push(`- Run attempt: ${inlineCode(ciContext.runAttempt)}`);

  return `## CI Context
${lines.join('\n')}

`;
}

function renderTaskCommandContext(selection: VerificationCommandSelection) {
  if (!selection.taskCommandsRequested || selection.taskCommandsFound > 0) return '';

  return `## Task Commands
- Task verification commands were requested, but none were found in the task contract.

`;
}

function renderDuplicateCommandContext(selection: VerificationCommandSelection) {
  if (selection.skippedDuplicateCommands.length === 0) return '';

  return `## Duplicate Commands
${selection.skippedDuplicateCommands
  .map(
    (duplicate) =>
      `- Skipped duplicate ${inlineCode(duplicate.duplicateKey)} command ${inlineCode(
        duplicate.command,
      )}; already selected as ${inlineCode(duplicate.originalKey)}.`,
  )
  .join('\n')}

`;
}

function renderCommandEvidence(result: VerificationCommandResult) {
  return `### ${result.key}: ${inlineCode(result.command)}

- Exit code: ${result.exitCode}
- Status: ${result.passed ? 'pass' : 'fail'}
${result.timedOut ? '- Timed out: yes\n' : ''}

${fencedCodeBlock('text', excerpt(result.output || '(no output)'))}`;
}

function renderPostVerificationGatesContext(options: {
  requested: boolean;
  foundCount: number;
  results: VerificationCommandResult[];
}) {
  if (!options.requested) return '';

  if (options.foundCount === 0) {
    return `## Post-Verification Gates
- Post-verification gates were requested, but none were found in the task contract.

`;
  }

  return `## Post-Verification Gates
${options.results.map(renderCommandEvidence).join('\n\n')}

`;
}

function parseTaskMetadata(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  return {
    title: lines
      .find((line) => line.startsWith('# '))
      ?.replace(/^#\s+/, '')
      .trim(),
    type: lines
      .find((line) => line.startsWith('- Task type:'))
      ?.replace('- Task type:', '')
      .trim(),
    status: lines
      .find((line) => line.startsWith('- Status:'))
      ?.replace('- Status:', '')
      .trim(),
  };
}

function isMarkdownTaskPath(taskPath: string) {
  const normalized = taskPath.replace(/\\/g, '/').toLowerCase();
  const segments = normalized.split('/').filter(Boolean);
  return (
    normalized.endsWith('.md') &&
    !segments.some((segment) => segment === '.env' || segment.startsWith('.env.'))
  );
}

async function renderTaskContext(
  cwd: string,
  config: AgentLoopConfig,
  taskPath: string | undefined,
) {
  if (!taskPath?.trim()) return '';

  const resolved = resolveTaskPath(cwd, config, taskPath);
  if (!resolved?.safe) {
    return `## Task Context
- Path: ${inlineCode(taskPath.trim())}
- Status: ${inlineCode('unavailable')}
- Note: Task path must point to a Markdown task contract.

`;
  }

  try {
    const markdown = await readFile(resolved.absolutePath, 'utf8');
    const metadata = parseTaskMetadata(markdown);
    const lines = [`- Path: ${inlineCode(resolved.cleanPath)}`];
    if (metadata.title) lines.push(`- Title: ${inlineCode(metadata.title)}`);
    if (metadata.type) lines.push(`- Task type: ${inlineCode(metadata.type)}`);
    if (metadata.status) lines.push(`- Status: ${inlineCode(metadata.status)}`);

    return `## Task Context
${lines.join('\n')}

`;
  } catch {
    return `## Task Context
- Path: ${inlineCode(resolved.cleanPath)}
- Status: ${inlineCode('unavailable')}
- Note: Task file could not be read.

`;
  }
}

export async function runVerification(options: VerificationOptions): Promise<VerificationResult> {
  const timestamp = options.reportTimestamp ?? formatTimestamp();
  const reportPath = await resolveUniqueOutputArtifactPath({
    cwd: options.cwd,
    artifactType: 'report',
    requestedPath: path.join(
      options.config.paths.reportsDir,
      `${timestamp}-verification-report.md`,
    ),
    expectedDir: options.config.paths.reportsDir,
    expectedExtension: '.md',
  });
  const nowIso = options.nowIso ?? new Date().toISOString();
  const env = options.env ?? process.env;
  const ciContext = detectCiContext(env);
  const commandSelection = await commandEntries(options.config, options);
  const commands = commandSelection.commands;
  const notRun = [
    ...(['test', 'lint', 'typecheck', 'build'] as const).filter((key) => {
      if (options.skip?.[key]) return true;
      return !options.config.commands[key];
    }),
  ];

  const results: VerificationCommandResult[] = [];
  const totalCommands = commands.length;
  for (const [commandIndex, [key, command]] of commands.entries()) {
    const index = commandIndex + 1;
    options.onProgress?.({ event: 'start', index, total: totalCommands, key, command });
    const startedAt = Date.now();
    const result = await runVerificationCommand({
      key,
      command,
      cwd: options.cwd,
      env,
      timeoutMs: options.timeoutMs,
    });
    const durationMs = Math.max(0, Date.now() - startedAt);
    options.onProgress?.({
      event: 'finish',
      index,
      total: totalCommands,
      key,
      command,
      status: result.timedOut ? 'timeout' : result.passed ? 'pass' : 'fail',
      exitCode: result.exitCode,
      durationMs,
      ...(result.timedOut ? { timedOut: true } : {}),
    });
    results.push(result);
  }

  const redactionRoots = options.redactPaths
    ? [options.cwd, await realpath(options.cwd).catch(() => options.cwd)]
    : [];
  const redactValue = (value: string) =>
    redactionRoots.length ? redactLocalRoots(value, redactionRoots) : value;
  const reportResults = results.map((result) => ({
    ...result,
    output: redactValue(result.output),
  }));

  const statusForResults = (selectedResults: VerificationCommandResult[]) =>
    selectedResults.length === 0
      ? 'not-run'
      : selectedResults.every((result) => result.passed)
        ? 'pass'
        : 'fail';
  const baseOverallStatus = statusForResults(results);
  const branch = await getGitBranch(options.cwd);
  const commit = await getGitCommit(options.cwd);
  const status = await getGitStatus(options.cwd);
  const taskContext = await renderTaskContext(options.cwd, options.config, options.taskPath);
  const workingTreeStatus = status.trim() ? 'dirty' : 'clean or unavailable';
  const renderMarkdown = (renderOptions: {
    overallStatus: 'pass' | 'fail' | 'not-run';
    allResults: VerificationCommandResult[];
    postVerificationGates: {
      requested: boolean;
      foundCount: number;
      results: VerificationCommandResult[];
    };
  }) => `# Verification Report

- Timestamp: ${inlineCode(nowIso)}
- Repo: ${inlineCode(path.basename(options.cwd))}
- Git branch: ${inlineCode(branch || 'not available')}
- Git commit: ${inlineCode(commit || 'not available')}
- Working tree: ${inlineCode(workingTreeStatus)}
- Overall status: ${renderOptions.overallStatus}

${renderCiContext(ciContext)}
${taskContext}
${renderTaskCommandContext(commandSelection)}
${renderDuplicateCommandContext(commandSelection)}
${renderFailureSummary(renderOptions.allResults)}
## Commands Run
${
  reportResults.length === 0
    ? 'No verification commands were configured or selected.'
    : reportResults.map(renderCommandEvidence).join('\n\n')
}

${renderPostVerificationGatesContext(renderOptions.postVerificationGates)}
## Not Run
${notRun.length ? notRun.map((item) => `- ${item}`).join('\n') : '- Nothing skipped.'}

## Recommended Next Actions
${
  renderOptions.overallStatus === 'pass'
    ? '- Review the diff and prepare a handoff summary.'
    : renderOptions.overallStatus === 'fail'
      ? '- Fix failing commands before claiming completion.'
      : '- Add test, lint, typecheck, or build commands to agentloop.config.json.'
}
`;

  const initialPostVerificationGates = {
    requested: options.postVerificationGates === true,
    foundCount: 0,
    results: [],
  };
  const initialMarkdown = renderMarkdown({
    overallStatus: baseOverallStatus,
    allResults: reportResults,
    postVerificationGates: initialPostVerificationGates,
  });
  await writeTextFile(reportPath, initialMarkdown);

  const postVerificationGateCommands = options.postVerificationGates
    ? parseTaskPostVerificationGates(
        (await readSafeTaskMarkdown(options.cwd, options.config, options.taskPath)) ?? '',
      )
    : [];
  const postVerificationGateResults: VerificationCommandResult[] = [];
  for (const [gateIndex, command] of postVerificationGateCommands.entries()) {
    const index = gateIndex + 1;
    options.onProgress?.({
      event: 'start',
      index,
      total: postVerificationGateCommands.length,
      key: 'post-verification',
      command,
    });
    const startedAt = Date.now();
    const result = await runVerificationCommand({
      key: 'post-verification',
      command,
      cwd: options.cwd,
      env,
      timeoutMs: options.timeoutMs,
    });
    const durationMs = Math.max(0, Date.now() - startedAt);
    options.onProgress?.({
      event: 'finish',
      index,
      total: postVerificationGateCommands.length,
      key: 'post-verification',
      command,
      status: result.timedOut ? 'timeout' : result.passed ? 'pass' : 'fail',
      exitCode: result.exitCode,
      durationMs,
      ...(result.timedOut ? { timedOut: true } : {}),
    });
    postVerificationGateResults.push(result);
  }
  const redactedPostVerificationGateResults = postVerificationGateResults.map((result) => ({
    ...result,
    output: redactValue(result.output),
  }));
  const allReportResults = [...reportResults, ...redactedPostVerificationGateResults];
  const overallStatus = statusForResults(allReportResults);
  const postVerificationGates = {
    requested: options.postVerificationGates === true,
    foundCount: postVerificationGateCommands.length,
    commands: postVerificationGateCommands,
    results: redactedPostVerificationGateResults,
  };
  const markdown = renderMarkdown({
    overallStatus,
    allResults: allReportResults,
    postVerificationGates,
  });

  if (options.postVerificationGates === true) await writeTextFile(reportPath, markdown);

  return {
    overallStatus,
    commands: reportResults,
    notRun,
    taskCommands: {
      requested: commandSelection.taskCommandsRequested,
      foundCount: commandSelection.taskCommandsFound,
      commands: commandSelection.taskCommands,
    },
    postVerificationGates,
    skippedDuplicateCommands: commandSelection.skippedDuplicateCommands,
    ciContext,
    markdown,
    reportPath,
  };
}
