import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { DEFAULT_COMMAND_KEYS } from './constants.js';
import {
  getGitBranch,
  getGitCommit,
  getGitStatus,
  isInsideGitRepo,
  parseGitStatus,
  GitFileStatus,
} from './git.js';
import { latestMarkdownFile } from './artifacts.js';

export type StatusArtifact = {
  path: string;
  title: string;
};

export type StatusTask = StatusArtifact & {
  status: string;
};

export type StatusReport = StatusArtifact & {
  overallStatus: string;
};

export type AgentLoopStatusResult = {
  project: AgentLoopConfig['project'];
  git: {
    isRepository: boolean;
    branch: string;
    commit: string;
  };
  workingTree: {
    dirty: boolean;
    changedFileCount: number;
    changedFiles: GitFileStatus[];
  };
  activeTask?: StatusTask;
  latestReport?: StatusReport;
  commands: {
    configured: string[];
    missing: string[];
  };
  nextAction: {
    command: string;
    reason: string;
  };
  markdown: string;
};

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

async function readTask(
  cwd: string,
  filePath: string | undefined,
): Promise<StatusTask | undefined> {
  if (!filePath) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: path.relative(cwd, filePath),
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    status: extractTaskStatus(markdown),
  };
}

async function readReport(
  cwd: string,
  filePath: string | undefined,
): Promise<StatusReport | undefined> {
  if (!filePath) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: path.relative(cwd, filePath),
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    overallStatus: extractOverallStatus(markdown),
  };
}

function chooseNextAction(input: {
  activeTask?: StatusTask;
  latestReport?: StatusReport;
  dirty: boolean;
}) {
  if (!input.activeTask) {
    return {
      command: 'agentloop create-task',
      reason: 'No task contract was found.',
    };
  }
  if (!input.latestReport) {
    return {
      command: 'agentloop verify',
      reason: 'A task exists, but no verification report was found.',
    };
  }
  if (input.latestReport.overallStatus === 'fail') {
    return {
      command: 'agentloop verify',
      reason: 'The latest verification report failed. Fix the failures and rerun verification.',
    };
  }
  if (input.dirty) {
    return {
      command: 'agentloop handoff',
      reason: 'Task and verification evidence exist, and the working tree has changes.',
    };
  }
  return {
    command: 'agentloop create-task',
    reason: 'The repo is clean. Start the next task contract when ready.',
  };
}

function formatList(values: string[]) {
  return values.length ? values.join(', ') : 'none';
}

function renderMarkdown(result: Omit<AgentLoopStatusResult, 'markdown'>) {
  const gitLine = result.git.isRepository
    ? `${result.git.branch || 'unknown branch'}${result.git.commit ? ` @ ${result.git.commit}` : ''}`
    : 'not inside a git repository';
  const workingTree = result.workingTree.dirty
    ? `dirty (${result.workingTree.changedFileCount} changed file(s))`
    : 'clean';
  const activeTask = result.activeTask
    ? `${result.activeTask.title} (${result.activeTask.status}) - ${result.activeTask.path}`
    : 'No task contract found.';
  const latestReport = result.latestReport
    ? `${result.latestReport.overallStatus} - ${result.latestReport.path}`
    : 'No verification report found.';

  return `# AgentLoopKit Status

- Project: ${result.project.name || 'unnamed'} (${result.project.type})
- Package manager: ${result.project.packageManager}
- Git: ${gitLine}
- Working tree: ${workingTree}
- Active task: ${activeTask}
- Latest verification: ${latestReport}
- Configured commands: ${formatList(result.commands.configured)}
- Missing commands: ${formatList(result.commands.missing)}

## Next Action

Run \`${result.nextAction.command}\`.

${result.nextAction.reason}
`;
}

export async function getAgentLoopStatus(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<AgentLoopStatusResult> {
  const inGit = await isInsideGitRepo(options.cwd);
  const rawStatus = inGit ? await getGitStatus(options.cwd) : '';
  const changedFiles = await parseGitStatus(rawStatus);
  const activeTask = await readTask(
    options.cwd,
    await latestMarkdownFile(path.join(options.cwd, options.config.paths.tasksDir)),
  );
  const latestReport = await readReport(
    options.cwd,
    await latestMarkdownFile(path.join(options.cwd, options.config.paths.reportsDir)),
  );
  const configured = DEFAULT_COMMAND_KEYS.filter((key) => options.config.commands[key]);
  const missing = DEFAULT_COMMAND_KEYS.filter((key) => !options.config.commands[key]);
  const nextAction = chooseNextAction({
    activeTask,
    latestReport,
    dirty: changedFiles.length > 0,
  });
  const withoutMarkdown = {
    project: options.config.project,
    git: {
      isRepository: inGit,
      branch: inGit ? await getGitBranch(options.cwd) : '',
      commit: inGit ? await getGitCommit(options.cwd) : '',
    },
    workingTree: {
      dirty: changedFiles.length > 0,
      changedFileCount: changedFiles.length,
      changedFiles,
    },
    activeTask,
    latestReport,
    commands: {
      configured,
      missing,
    },
    nextAction,
  };

  return {
    ...withoutMarkdown,
    markdown: renderMarkdown(withoutMarkdown),
  };
}
