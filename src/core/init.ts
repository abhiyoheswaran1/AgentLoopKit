import path from 'node:path';
import { readdir, realpath } from 'node:fs/promises';
import { homedir } from 'node:os';
import {
  AGENTLOOP_DIR,
  AGENTLOOP_FILE,
  AGENTLOOP_MANIFEST_FILE,
  AGENTS_FILE,
  CONFIG_FILE,
  CURRENT_TEMPLATE_VERSION,
  DEFAULT_COMMAND_KEYS,
  PACKAGE_NAME,
  TEMPLATE_GROUPS,
} from './constants.js';
import { resolveOutputArtifactPath } from './artifacts.js';
import { AgentLoopConfig, createDefaultConfig } from './config.js';
import { pathExists, readTextIfExists, writeTextFile } from './file-system.js';
import { getGitAbsoluteDir, getGitRoot, isInsideGitRepo } from './git.js';
import { detectPackageManager } from './package-manager.js';
import { detectPackageScripts, detectProjectName, detectProjectType } from './project-detection.js';
import { getTemplateRoot, readTemplate, TemplateValues } from './template-renderer.js';

export type InitResult = {
  created: string[];
  updated: string[];
  skipped: string[];
  warnings: InitWarning[];
  dryRun: boolean;
  targetDirectory: string;
  project: AgentLoopConfig['project'];
  commands: {
    configured: string[];
    missing: string[];
  };
  git: {
    isRepository: boolean;
    root: string;
    targetIsRoot: boolean;
  };
  localOnly?: {
    excludePath: string;
    patterns: string[];
  };
};

export type InitWarning = {
  id: 'home-directory-target';
  message: string;
  targetDirectory: string;
};

export type InitSetupErrorReason = 'home-directory-refused' | 'git-repository-required';

export class InitSetupError extends Error {
  public readonly code = 'INIT_SETUP_ERROR';

  constructor(
    message: string,
    public readonly mode: 'init' | 'local-only',
    public readonly reason: InitSetupErrorReason,
    public readonly nextCommand: string,
  ) {
    super(message);
    this.name = 'InitSetupError';
  }
}

const LOCAL_ONLY_EXCLUDE_START = '# agentloopkit:local-only:start';
const LOCAL_ONLY_EXCLUDE_END = '# agentloopkit:local-only:end';
const LOCAL_ONLY_NOTICE_START = '<!-- agentloopkit:local-only:start -->';
const LOCAL_ONLY_NOTICE_END = '<!-- agentloopkit:local-only:end -->';
const LOCAL_ONLY_EXCLUDE_PATTERNS = [`${AGENTLOOP_DIR}/`, AGENTS_FILE, AGENTLOOP_FILE, CONFIG_FILE];

const LOCAL_ONLY_NOTICE = `${LOCAL_ONLY_NOTICE_START}
## Local-only AgentLoopKit harness

This AgentLoopKit setup is excluded by this clone's \`.git/info/exclude\`. Use these files for local agent work. Do not commit these AgentLoopKit files unless a maintainer intentionally converts the repo to a shared harness.
${LOCAL_ONLY_NOTICE_END}`;
const HOME_DIRECTORY_WARNING =
  'Target directory is your home directory. AgentLoopKit can write repository harness files there when --force is used.';

function repoPath(...segments: string[]) {
  return segments.join('/');
}

function resolveInitFilePath(options: {
  cwd: string;
  requestedPath: string;
  expectedDir: string;
  expectedExtension: string;
}) {
  return resolveOutputArtifactPath({
    cwd: options.cwd,
    artifactType: options.requestedPath === AGENTS_FILE ? 'agents-md' : 'init-file',
    requestedPath: options.requestedPath,
    expectedDir: options.expectedDir,
    expectedExtension: options.expectedExtension,
  });
}

async function listTemplateEntries(group: string) {
  const templateDir = path.join(getTemplateRoot(), group);
  return (await readdir(templateDir, { withFileTypes: true })).filter((entry) => entry.isFile());
}

async function validateInitOutputTargets(cwd: string) {
  for (const group of TEMPLATE_GROUPS) {
    if (group === 'tasks') continue;
    for (const entry of await listTemplateEntries(group)) {
      resolveInitFilePath({
        cwd,
        requestedPath: repoPath(AGENTLOOP_DIR, group, entry.name),
        expectedDir: repoPath(AGENTLOOP_DIR, group),
        expectedExtension: path.extname(entry.name),
      });
    }
  }

  const rootTargets = [
    {
      requestedPath: repoPath(AGENTLOOP_DIR, 'README.md'),
      expectedDir: AGENTLOOP_DIR,
      expectedExtension: '.md',
    },
    {
      requestedPath: AGENTLOOP_MANIFEST_FILE,
      expectedDir: AGENTLOOP_DIR,
      expectedExtension: '.json',
    },
    {
      requestedPath: repoPath(AGENTLOOP_DIR, 'tasks', 'README.md'),
      expectedDir: repoPath(AGENTLOOP_DIR, 'tasks'),
      expectedExtension: '.md',
    },
    {
      requestedPath: repoPath(AGENTLOOP_DIR, 'reports', 'README.md'),
      expectedDir: repoPath(AGENTLOOP_DIR, 'reports'),
      expectedExtension: '.md',
    },
    { requestedPath: AGENTS_FILE, expectedDir: '.', expectedExtension: '.md' },
    { requestedPath: AGENTLOOP_FILE, expectedDir: '.', expectedExtension: '.md' },
    { requestedPath: CONFIG_FILE, expectedDir: '.', expectedExtension: '.json' },
  ];

  for (const target of rootTargets) {
    resolveInitFilePath({ cwd, ...target });
  }
}

async function writeGeneratedFile(
  cwd: string,
  requestedPath: string,
  expectedDir: string,
  expectedExtension: string,
  content: string,
  result: InitResult,
) {
  const filePath = resolveInitFilePath({ cwd, requestedPath, expectedDir, expectedExtension });
  if (await pathExists(filePath)) {
    result.skipped.push(filePath);
    return;
  }
  if (result.dryRun) {
    result.created.push(filePath);
    return;
  }
  await writeTextFile(filePath, content);
  result.created.push(filePath);
}

async function writeRenderedTemplateGroup(
  cwd: string,
  group: string,
  values: TemplateValues,
  result: InitResult,
) {
  for (const entry of await listTemplateEntries(group)) {
    const relative = `${group}/${entry.name}`;
    await writeGeneratedFile(
      cwd,
      repoPath(AGENTLOOP_DIR, group, entry.name),
      repoPath(AGENTLOOP_DIR, group),
      path.extname(entry.name),
      await readTemplate(relative, values),
      result,
    );
  }
}

async function upsertAgentsFile(cwd: string, content: string, result: InitResult) {
  const filePath = resolveInitFilePath({
    cwd,
    requestedPath: AGENTS_FILE,
    expectedDir: '.',
    expectedExtension: '.md',
  });
  const existing = await readTextIfExists(filePath);
  const marker = '<!-- agentloopkit:start -->';
  if (!existing) {
    if (result.dryRun) {
      result.created.push(filePath);
      return;
    }
    await writeTextFile(filePath, content);
    result.created.push(filePath);
    return;
  }
  if (existing.includes(marker)) {
    result.skipped.push(filePath);
    return;
  }
  const section = content
    .replace(/^# AGENTS\s*/i, '## AgentLoopKit\n\n')
    .replace('<!-- agentloopkit:start -->', marker);
  if (result.dryRun) {
    result.updated.push(filePath);
    return;
  }
  await writeTextFile(filePath, `${existing.trimEnd()}\n\n${section.trim()}\n`);
  result.updated.push(filePath);
}

async function resolveGitInfoExcludePath(cwd: string) {
  if (!(await isInsideGitRepo(cwd))) return undefined;
  const gitDir = await getGitAbsoluteDir(cwd);
  if (!gitDir) return undefined;
  return path.join(await resolveComparablePath(gitDir), 'info', 'exclude');
}

async function upsertLocalOnlyGitExclude(cwd: string, result: InitResult) {
  const excludePath = await resolveGitInfoExcludePath(cwd);
  if (!excludePath) {
    throw new InitSetupError(
      'Local-only mode requires a Git repository because it writes to .git/info/exclude. Run git init first, or run agentloop init without --local-only.',
      'local-only',
      'git-repository-required',
      'git init',
    );
  }

  result.localOnly = {
    excludePath,
    patterns: [...LOCAL_ONLY_EXCLUDE_PATTERNS],
  };

  const excludeExists = await pathExists(excludePath);
  const existing = await readTextIfExists(excludePath);
  if (existing.includes(LOCAL_ONLY_EXCLUDE_START)) return;

  const block = [
    LOCAL_ONLY_EXCLUDE_START,
    '# AgentLoopKit local-only harness files for this clone.',
    ...LOCAL_ONLY_EXCLUDE_PATTERNS,
    LOCAL_ONLY_EXCLUDE_END,
  ].join('\n');

  if (result.dryRun) {
    (excludeExists ? result.updated : result.created).push(excludePath);
    return;
  }

  const prefix = existing.trimEnd();
  await writeTextFile(excludePath, `${prefix ? `${prefix}\n\n` : ''}${block}\n`);
  (excludeExists ? result.updated : result.created).push(excludePath);
}

async function upsertLocalOnlyNotice(cwd: string, requestedPath: string, result: InitResult) {
  const filePath = resolveInitFilePath({
    cwd,
    requestedPath,
    expectedDir: '.',
    expectedExtension: '.md',
  });
  const existing = await readTextIfExists(filePath);
  if (existing.includes(LOCAL_ONLY_NOTICE_START)) return;
  if (result.dryRun) {
    (existing ? result.updated : result.created).push(filePath);
    return;
  }
  await writeTextFile(filePath, `${existing.trimEnd()}\n\n${LOCAL_ONLY_NOTICE}\n`);
  (existing ? result.updated : result.created).push(filePath);
}

async function resolveComparablePath(filePath: string) {
  try {
    return await realpath(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

export async function initializeAgentLoop(options: {
  cwd: string;
  dryRun?: boolean;
  force?: boolean;
  homeDirectory?: string;
  localOnly?: boolean;
}): Promise<InitResult> {
  const cwd = path.resolve(options.cwd);
  const result: InitResult = {
    created: [],
    updated: [],
    skipped: [],
    warnings: [],
    dryRun: Boolean(options.dryRun),
    targetDirectory: cwd,
    project: {
      name: '',
      type: 'generic',
      packageManager: 'npm',
    },
    commands: {
      configured: [],
      missing: [],
    },
    git: {
      isRepository: false,
      root: '',
      targetIsRoot: false,
    },
  };
  const homeDirectory = options.homeDirectory ?? homedir();
  const [resolvedCwd, resolvedHomeDirectory] = await Promise.all([
    resolveComparablePath(cwd),
    resolveComparablePath(homeDirectory),
  ]);
  const targetIsHomeDirectory = resolvedCwd === resolvedHomeDirectory;
  if (!options.force && targetIsHomeDirectory) {
    throw new InitSetupError(
      'Refusing to initialize your home directory. Run this inside a project repository, or pass --force if you intentionally want AgentLoopKit files in your home directory.',
      'init',
      'home-directory-refused',
      'cd <project-directory>',
    );
  }
  if (targetIsHomeDirectory) {
    result.warnings.push({
      id: 'home-directory-target',
      message: HOME_DIRECTORY_WARNING,
      targetDirectory: cwd,
    });
  }
  await validateInitOutputTargets(cwd);
  if (options.localOnly) {
    await upsertLocalOnlyGitExclude(cwd, result);
  }
  const packageManager = await detectPackageManager(cwd);
  const projectType = await detectProjectType(cwd);
  const projectName = await detectProjectName(cwd);
  const commands = await detectPackageScripts(cwd, packageManager);
  const gitRoot = await getGitRoot(cwd);
  const gitTargetIsRoot = gitRoot
    ? (await resolveComparablePath(gitRoot)) === (await resolveComparablePath(cwd))
    : false;
  result.git = {
    isRepository: await isInsideGitRepo(cwd),
    root: gitRoot ? await resolveComparablePath(gitRoot) : '',
    targetIsRoot: gitTargetIsRoot,
  };
  result.project = {
    name: projectName,
    type: projectType,
    packageManager,
  };
  result.commands = {
    configured: DEFAULT_COMMAND_KEYS.filter((key) => commands[key]),
    missing: DEFAULT_COMMAND_KEYS.filter((key) => !commands[key]),
  };
  const config = createDefaultConfig({
    name: projectName,
    type: projectType,
    packageManager,
    commands,
  });
  const values = {
    projectName,
    projectType,
    packageManager,
    testCommand: commands.test || 'not configured',
    lintCommand: commands.lint || 'not configured',
    typecheckCommand: commands.typecheck || 'not configured',
    buildCommand: commands.build || 'not configured',
    formatCommand: commands.format || 'not configured',
    localOnlyInstructions: options.localOnly ? LOCAL_ONLY_NOTICE : '',
  };

  for (const group of TEMPLATE_GROUPS) {
    if (group === 'tasks') continue;
    await writeRenderedTemplateGroup(cwd, group, values, result);
  }

  await writeGeneratedFile(
    cwd,
    repoPath(AGENTLOOP_DIR, 'README.md'),
    AGENTLOOP_DIR,
    '.md',
    await readTemplate('root/agentloop-directory-readme.md', values),
    result,
  );
  await writeGeneratedFile(
    cwd,
    AGENTLOOP_MANIFEST_FILE,
    AGENTLOOP_DIR,
    '.json',
    `${JSON.stringify(
      {
        version: 1,
        templateVersion: CURRENT_TEMPLATE_VERSION,
        generatedBy: PACKAGE_NAME,
      },
      null,
      2,
    )}\n`,
    result,
  );
  await writeGeneratedFile(
    cwd,
    repoPath(AGENTLOOP_DIR, 'tasks', 'README.md'),
    repoPath(AGENTLOOP_DIR, 'tasks'),
    '.md',
    await readTemplate('tasks/README.md', values),
    result,
  );
  await writeGeneratedFile(
    cwd,
    repoPath(AGENTLOOP_DIR, 'reports', 'README.md'),
    repoPath(AGENTLOOP_DIR, 'reports'),
    '.md',
    '# Verification Reports\n\nAgentLoopKit writes verification reports here when you run `agentloop verify`.\n',
    result,
  );

  const agentsContent = await readTemplate('root/AGENTS.md', values);
  await upsertAgentsFile(cwd, agentsContent, result);
  await writeGeneratedFile(
    cwd,
    AGENTLOOP_FILE,
    '.',
    '.md',
    await readTemplate('root/AGENTLOOP.md', values),
    result,
  );
  if (options.localOnly) {
    await upsertLocalOnlyNotice(cwd, AGENTS_FILE, result);
    await upsertLocalOnlyNotice(cwd, AGENTLOOP_FILE, result);
  }

  const configPath = resolveInitFilePath({
    cwd,
    requestedPath: CONFIG_FILE,
    expectedDir: '.',
    expectedExtension: '.json',
  });
  if (await pathExists(configPath)) {
    result.skipped.push(configPath);
  } else if (result.dryRun) {
    result.created.push(configPath);
  } else {
    await writeTextFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
    result.created.push(configPath);
  }

  return result;
}
