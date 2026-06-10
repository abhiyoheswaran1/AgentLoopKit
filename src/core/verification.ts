import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { execa } from 'execa';
import { AgentLoopConfig } from './config.js';
import { formatTimestamp } from './dates.js';
import { getGitBranch, getGitCommit, getGitStatus } from './git.js';
import { writeTextFile } from './file-system.js';

export type VerificationCommandKey = 'test' | 'lint' | 'typecheck' | 'build' | 'custom' | 'task';

export type VerificationCommandResult = {
  key: VerificationCommandKey;
  command: string;
  exitCode: number;
  passed: boolean;
  output: string;
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

export type VerificationOptions = {
  cwd: string;
  config: AgentLoopConfig;
  reportTimestamp?: string;
  nowIso?: string;
  env?: NodeJS.ProcessEnv;
  taskPath?: string;
  taskCommands?: boolean;
  skip?: Partial<Record<'test' | 'lint' | 'typecheck' | 'build', boolean>>;
  customCommands?: string[];
};

export type VerificationResult = {
  overallStatus: 'pass' | 'fail' | 'not-run';
  commands: VerificationCommandResult[];
  notRun: string[];
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
    (result) => `### ${result.key}: \`${result.command}\`

- Exit code: ${result.exitCode}

\`\`\`text
${failureSnippet(result.output)}
\`\`\``,
  )
  .join('\n\n')}

`;
}

function parseTaskVerificationCommands(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const commands: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (/^##\s+Verification Commands\s*$/.test(line.trim())) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(line.trim())) break;
    if (!inSection) continue;

    const match = line.match(/^\s*-\s+(.+?)\s*$/);
    const command = match?.[1]?.trim();
    if (!command || command === 'No verification command recorded.') continue;
    commands.push(command);
  }

  return commands;
}

function resolveTaskPath(cwd: string, config: AgentLoopConfig, taskPath: string | undefined) {
  if (!taskPath?.trim()) return undefined;
  const cleanPath = taskPath.trim();
  const absolutePath = path.isAbsolute(cleanPath)
    ? path.resolve(cleanPath)
    : path.resolve(cwd, cleanPath);
  const tasksRoot = path.resolve(cwd, config.paths.tasksDir);

  return {
    cleanPath,
    absolutePath,
    safe: isMarkdownTaskPath(cleanPath) && isInside(tasksRoot, absolutePath),
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
};

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
  if (options.taskCommands) {
    const markdown = await readSafeTaskMarkdown(options.cwd, config, options.taskPath);
    const taskCommands = markdown ? parseTaskVerificationCommands(markdown) : [];
    taskCommandsFound = taskCommands.length;
    for (const command of taskCommands) {
      active.push(['task', command]);
    }
  }

  return {
    commands: active,
    taskCommandsRequested: options.taskCommands === true,
    taskCommandsFound,
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
  if (ciContext.workflow) lines.push(`- Workflow: ${ciContext.workflow}`);
  if (ciContext.event) lines.push(`- Event: ${ciContext.event}`);
  if (ciContext.ref) lines.push(`- Ref: ${ciContext.ref}`);
  if (ciContext.commit) lines.push(`- Commit: ${ciContext.commit}`);
  if (ciContext.runUrl) lines.push(`- Run URL: ${ciContext.runUrl}`);
  if (ciContext.runAttempt) lines.push(`- Run attempt: ${ciContext.runAttempt}`);

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

function parseTaskMetadata(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  return {
    title: lines.find((line) => line.startsWith('# '))?.replace(/^#\s+/, '').trim(),
    type: lines.find((line) => line.startsWith('- Task type:'))?.replace('- Task type:', '').trim(),
    status: lines.find((line) => line.startsWith('- Status:'))?.replace('- Status:', '').trim(),
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

function isInside(parent: string, child: string) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
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
- Path: ${taskPath.trim()}
- Status: unavailable
- Note: Task path must point to a Markdown task contract.

`;
  }

  try {
    const markdown = await readFile(resolved.absolutePath, 'utf8');
    const metadata = parseTaskMetadata(markdown);
    const lines = [`- Path: ${resolved.cleanPath}`];
    if (metadata.title) lines.push(`- Title: ${metadata.title}`);
    if (metadata.type) lines.push(`- Task type: ${metadata.type}`);
    if (metadata.status) lines.push(`- Status: ${metadata.status}`);

    return `## Task Context
${lines.join('\n')}

`;
  } catch {
    return `## Task Context
- Path: ${resolved.cleanPath}
- Status: unavailable
- Note: Task file could not be read.

`;
  }
}

export async function runVerification(options: VerificationOptions): Promise<VerificationResult> {
  const timestamp = options.reportTimestamp ?? formatTimestamp();
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
  for (const [key, command] of commands) {
    const result = await execa(command, {
      cwd: options.cwd,
      shell: true,
      all: true,
      reject: false,
      env: { ...env, FORCE_COLOR: '0' },
    });
    results.push({
      key,
      command,
      exitCode: result.exitCode ?? 1,
      passed: result.exitCode === 0,
      output: result.all ?? result.stdout ?? result.stderr ?? '',
    });
  }

  const overallStatus =
    results.length === 0 ? 'not-run' : results.every((result) => result.passed) ? 'pass' : 'fail';
  const reportPath = path.join(
    options.cwd,
    options.config.paths.reportsDir,
    `${timestamp}-verification-report.md`,
  );
  const branch = await getGitBranch(options.cwd);
  const commit = await getGitCommit(options.cwd);
  const status = await getGitStatus(options.cwd);
  const taskContext = await renderTaskContext(options.cwd, options.config, options.taskPath);

  const markdown = `# Verification Report

- Timestamp: ${nowIso}
- Repo: ${path.basename(options.cwd)}
- Git branch: ${branch || 'not available'}
- Git commit: ${commit || 'not available'}
- Working tree: ${status.trim() ? 'dirty' : 'clean or unavailable'}
- Overall status: ${overallStatus}

${renderCiContext(ciContext)}
${taskContext}
${renderTaskCommandContext(commandSelection)}
${renderFailureSummary(results)}
## Commands Run
${
  results.length === 0
    ? 'No verification commands were configured or selected.'
    : results
        .map(
          (result) => `### ${result.key}: \`${result.command}\`

- Exit code: ${result.exitCode}
- Status: ${result.passed ? 'pass' : 'fail'}

\`\`\`text
${excerpt(result.output || '(no output)')}
\`\`\``,
        )
        .join('\n\n')
}

## Not Run
${notRun.length ? notRun.map((item) => `- ${item}`).join('\n') : '- Nothing skipped.'}

## Recommended Next Actions
${
  overallStatus === 'pass'
    ? '- Review the diff and prepare a handoff summary.'
    : overallStatus === 'fail'
      ? '- Fix failing commands before claiming completion.'
      : '- Add test, lint, typecheck, or build commands to agentloop.config.json.'
}
`;

  await writeTextFile(reportPath, markdown);
  return { overallStatus, commands: results, notRun, ciContext, markdown, reportPath };
}
