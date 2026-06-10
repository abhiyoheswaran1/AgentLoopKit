import path from 'node:path';
import { readdir, realpath, stat } from 'node:fs/promises';
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
import { AgentLoopConfig, createDefaultConfig } from './config.js';
import { pathExists, readTextIfExists, writeTextFile } from './file-system.js';
import { isInsideGitRepo } from './git.js';
import { detectPackageManager } from './package-manager.js';
import { detectPackageScripts, detectProjectName, detectProjectType } from './project-detection.js';
import { getTemplateRoot, readTemplate, TemplateValues } from './template-renderer.js';

export type InitResult = {
  created: string[];
  updated: string[];
  skipped: string[];
  dryRun: boolean;
  targetDirectory: string;
  project: AgentLoopConfig['project'];
  commands: {
    configured: string[];
    missing: string[];
  };
  git: {
    isRepository: boolean;
  };
  localOnly?: {
    excludePath: string;
    patterns: string[];
  };
};

const LOCAL_ONLY_EXCLUDE_START = '# agentloopkit:local-only:start';
const LOCAL_ONLY_EXCLUDE_END = '# agentloopkit:local-only:end';
const LOCAL_ONLY_NOTICE_START = '<!-- agentloopkit:local-only:start -->';
const LOCAL_ONLY_NOTICE_END = '<!-- agentloopkit:local-only:end -->';
const LOCAL_ONLY_EXCLUDE_PATTERNS = [
  `${AGENTLOOP_DIR}/`,
  AGENTS_FILE,
  AGENTLOOP_FILE,
  CONFIG_FILE,
];

const LOCAL_ONLY_NOTICE = `${LOCAL_ONLY_NOTICE_START}
## Local-only AgentLoopKit harness

This AgentLoopKit setup is excluded by this clone's \`.git/info/exclude\`. Use these files for local agent work. Do not commit these AgentLoopKit files unless a maintainer intentionally converts the repo to a shared harness.
${LOCAL_ONLY_NOTICE_END}`;

async function writeGeneratedFile(filePath: string, content: string, result: InitResult) {
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
  const templateDir = path.join(getTemplateRoot(), group);
  const entries = await readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const relative = `${group}/${entry.name}`;
    await writeGeneratedFile(
      path.join(cwd, AGENTLOOP_DIR, group, entry.name),
      await readTemplate(relative, values),
      result,
    );
  }
}

async function upsertAgentsFile(cwd: string, content: string, result: InitResult) {
  const filePath = path.join(cwd, AGENTS_FILE);
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
  const dotGitPath = path.join(cwd, '.git');
  const dotGitStat = await stat(dotGitPath).catch(() => undefined);
  if (!dotGitStat) return undefined;
  if (dotGitStat.isDirectory()) {
    return path.join(dotGitPath, 'info', 'exclude');
  }
  if (!dotGitStat.isFile()) return undefined;

  const gitFile = await readTextIfExists(dotGitPath);
  const match = /^gitdir:\s*(.+)\s*$/m.exec(gitFile);
  if (!match) return undefined;

  const gitDir = match[1].trim();
  const resolvedGitDir = path.isAbsolute(gitDir) ? gitDir : path.resolve(cwd, gitDir);
  return path.join(resolvedGitDir, 'info', 'exclude');
}

async function upsertLocalOnlyGitExclude(cwd: string, result: InitResult) {
  const excludePath = await resolveGitInfoExcludePath(cwd);
  if (!excludePath) {
    throw new Error(
      'Local-only mode requires a Git repository because it writes to .git/info/exclude. Run git init first, or run agentloop init without --local-only.',
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

async function upsertLocalOnlyNotice(filePath: string, result: InitResult) {
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
    },
  };
  const homeDirectory = options.homeDirectory ?? homedir();
  const [resolvedCwd, resolvedHomeDirectory] = await Promise.all([
    resolveComparablePath(cwd),
    resolveComparablePath(homeDirectory),
  ]);
  if (!options.force && resolvedCwd === resolvedHomeDirectory) {
    throw new Error(
      'Refusing to initialize your home directory. Run this inside a project repository, or pass --force if you intentionally want AgentLoopKit files in your home directory.',
    );
  }
  if (options.localOnly) {
    await upsertLocalOnlyGitExclude(cwd, result);
  }
  const packageManager = await detectPackageManager(cwd);
  const projectType = await detectProjectType(cwd);
  const projectName = await detectProjectName(cwd);
  const commands = await detectPackageScripts(cwd, packageManager);
  result.git = {
    isRepository: await isInsideGitRepo(cwd),
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
    path.join(cwd, AGENTLOOP_DIR, 'README.md'),
    await readTemplate('root/agentloop-directory-readme.md', values),
    result,
  );
  await writeGeneratedFile(
    path.join(cwd, AGENTLOOP_MANIFEST_FILE),
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
    path.join(cwd, AGENTLOOP_DIR, 'tasks', 'README.md'),
    await readTemplate('tasks/README.md', values),
    result,
  );
  await writeGeneratedFile(
    path.join(cwd, AGENTLOOP_DIR, 'reports', 'README.md'),
    '# Verification Reports\n\nAgentLoopKit writes verification reports here when you run `agentloop verify`.\n',
    result,
  );

  const agentsContent = await readTemplate('root/AGENTS.md', values);
  await upsertAgentsFile(cwd, agentsContent, result);
  await writeGeneratedFile(
    path.join(cwd, AGENTLOOP_FILE),
    await readTemplate('root/AGENTLOOP.md', values),
    result,
  );
  if (options.localOnly) {
    await upsertLocalOnlyNotice(path.join(cwd, AGENTS_FILE), result);
    await upsertLocalOnlyNotice(path.join(cwd, AGENTLOOP_FILE), result);
  }

  const configPath = path.join(cwd, CONFIG_FILE);
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
