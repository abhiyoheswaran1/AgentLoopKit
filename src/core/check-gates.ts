import path from 'node:path';
import { readFile, readdir, stat } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { latestMarkdownFile } from './artifacts.js';
import { pathExists } from './file-system.js';
import { getGitBranch, getGitCommit, getGitStatus, isInsideGitRepo, parseGitStatus } from './git.js';
import { getActiveTaskPath } from './task-state.js';

export type GateStatus = 'pass' | 'warn' | 'fail';

export type GateCheck = {
  id: string;
  name: string;
  status: GateStatus;
  message: string;
  path?: string;
};

export type CheckGatesResult = {
  overallStatus: GateStatus;
  gates: GateCheck[];
  git: {
    isRepository: boolean;
    branch: string;
    commit: string;
    changedFileCount: number;
  };
  nextAction: {
    command: string;
    reason: string;
  };
  markdown: string;
};

const generatedArtifactPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-.+\.md$/;

const requiredRootFiles = ['AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json'];
const requiredHarnessFiles = [
  '.agentloop/harness/commands.md',
  '.agentloop/harness/definition-of-done.md',
  '.agentloop/harness/review-checklist.md',
  '.agentloop/harness/autonomous-work-rules.md',
];
const requiredPolicyFiles = [
  '.agentloop/policies/no-destructive-actions.md',
  '.agentloop/policies/git-policy.md',
  '.agentloop/policies/secrets-policy.md',
];

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

function relativePath(cwd: string, filePath: string) {
  return path.relative(cwd, filePath) || '.';
}

async function latestGeneratedMarkdownFile(dir: string) {
  if (!(await pathExists(dir))) return undefined;
  const entries = await Promise.all(
    (
      await readdir(dir, { withFileTypes: true })
    )
      .filter((entry) => entry.isFile() && generatedArtifactPattern.test(entry.name))
      .map(async (entry) => {
        const filePath = path.join(dir, entry.name);
        const fileStat = await stat(filePath);
        return { filePath, name: entry.name, mtimeMs: fileStat.mtimeMs };
      }),
  );
  entries.sort((left, right) => {
    if (left.mtimeMs !== right.mtimeMs) return left.mtimeMs - right.mtimeMs;
    return left.name.localeCompare(right.name);
  });
  return entries.at(-1)?.filePath;
}

async function missingFiles(cwd: string, files: string[]) {
  const missing: string[] = [];
  for (const file of files) {
    if (!(await pathExists(path.join(cwd, file)))) missing.push(file);
  }
  return missing;
}

function gate(id: string, name: string, status: GateStatus, message: string, filePath?: string) {
  return { id, name, status, message, ...(filePath ? { path: filePath } : {}) };
}

function overallStatus(gates: GateCheck[]): GateStatus {
  if (gates.some((item) => item.status === 'fail')) return 'fail';
  if (gates.some((item) => item.status === 'warn')) return 'warn';
  return 'pass';
}

function chooseNextAction(gates: GateCheck[]) {
  const task = gates.find((item) => item.id === 'task-contract');
  const report = gates.find((item) => item.id === 'verification-report');
  const handoff = gates.find((item) => item.id === 'handoff-summary');
  if (task?.status === 'fail') {
    return {
      command: 'agentloop create-task',
      reason: 'Create a task contract before review gates can pass.',
    };
  }
  if (report?.status === 'fail') {
    return {
      command: 'agentloop verify',
      reason: 'Run verification and fix failures before review.',
    };
  }
  if (handoff?.status !== 'pass') {
    return {
      command: 'agentloop handoff',
      reason: 'Write a reviewer handoff after verification.',
    };
  }
  return {
    command: 'agentloop handoff',
    reason: 'Gate evidence is present. Refresh the reviewer handoff if the diff changed.',
  };
}

function renderMarkdown(result: Omit<CheckGatesResult, 'markdown'>) {
  const gateLines = result.gates
    .map((item) => {
      const suffix = item.path ? ` - ${item.path}` : '';
      return `- [${item.status}] ${item.name}: ${item.message}${suffix}`;
    })
    .join('\n');
  const gitLine = result.git.isRepository
    ? `${result.git.branch || 'unknown branch'}${result.git.commit ? ` @ ${result.git.commit}` : ''}`
    : 'not inside a git repository';

  return `# AgentLoopKit Gates

- Overall status: ${result.overallStatus}
- Git: ${gitLine}
- Changed files: ${result.git.changedFileCount}

## Gates

${gateLines}

## Next Action

Run \`${result.nextAction.command}\`.

${result.nextAction.reason}
`;
}

export async function checkGates(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<CheckGatesResult> {
  const taskPath =
    (await getActiveTaskPath(options)) ??
    (await latestMarkdownFile(path.join(options.cwd, options.config.paths.tasksDir)));
  const reportPath = await latestGeneratedMarkdownFile(
    path.join(options.cwd, options.config.paths.reportsDir),
  );
  const handoffPath = await latestGeneratedMarkdownFile(
    path.join(options.cwd, options.config.paths.handoffsDir),
  );
  const gates: GateCheck[] = [];

  if (taskPath) {
    const taskMarkdown = await readFile(taskPath, 'utf8');
    gates.push(
      gate(
        'task-contract',
        'Task contract',
        'pass',
        extractHeading(taskMarkdown, path.basename(taskPath, '.md')),
        relativePath(options.cwd, taskPath),
      ),
    );
  } else {
    gates.push(gate('task-contract', 'Task contract', 'fail', 'No task contract found.'));
  }

  if (reportPath) {
    const reportMarkdown = await readFile(reportPath, 'utf8');
    const status = extractOverallStatus(reportMarkdown);
    gates.push(
      gate(
        'verification-report',
        'Verification report',
        status === 'pass' ? 'pass' : 'fail',
        `Overall status: ${status}`,
        relativePath(options.cwd, reportPath),
      ),
    );
  } else {
    gates.push(
      gate('verification-report', 'Verification report', 'fail', 'No verification report found.'),
    );
  }

  if (handoffPath) {
    gates.push(
      gate(
        'handoff-summary',
        'Handoff summary',
        'pass',
        'Reviewer handoff found.',
        relativePath(options.cwd, handoffPath),
      ),
    );
  } else {
    gates.push(gate('handoff-summary', 'Handoff summary', 'warn', 'No handoff summary found.'));
  }

  const missingHarness = await missingFiles(options.cwd, [
    ...requiredRootFiles,
    ...requiredHarnessFiles,
  ]);
  gates.push(
    gate(
      'repo-harness',
      'Repo harness',
      missingHarness.length ? 'warn' : 'pass',
      missingHarness.length
        ? `Missing harness files: ${missingHarness.join(', ')}.`
        : 'Required repo and harness files exist.',
    ),
  );

  const missingPolicies = await missingFiles(options.cwd, requiredPolicyFiles);
  gates.push(
    gate(
      'safety-policies',
      'Safety policies',
      missingPolicies.length ? 'warn' : 'pass',
      missingPolicies.length
        ? `Missing policy files: ${missingPolicies.join(', ')}.`
        : 'Core safety policy files exist.',
    ),
  );

  const inGit = await isInsideGitRepo(options.cwd);
  const changedFiles = inGit ? await parseGitStatus(await getGitStatus(options.cwd)) : [];
  gates.push(
    gate(
      'git-context',
      'Git context',
      !inGit || changedFiles.length === 0 ? 'warn' : 'pass',
      !inGit
        ? 'Not inside a git repository.'
        : changedFiles.length === 0
          ? 'No changed files detected.'
          : `${changedFiles.length} changed file(s) detected.`,
    ),
  );

  const withoutMarkdown = {
    overallStatus: overallStatus(gates),
    gates,
    git: {
      isRepository: inGit,
      branch: inGit ? await getGitBranch(options.cwd) : '',
      commit: inGit ? await getGitCommit(options.cwd) : '',
      changedFileCount: changedFiles.length,
    },
    nextAction: chooseNextAction(gates),
  };
  return { ...withoutMarkdown, markdown: renderMarkdown(withoutMarkdown) };
}
