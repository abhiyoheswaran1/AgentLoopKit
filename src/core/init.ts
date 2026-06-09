import path from 'node:path';
import { readdir } from 'node:fs/promises';
import {
  AGENTLOOP_DIR,
  AGENTLOOP_FILE,
  AGENTLOOP_MANIFEST_FILE,
  AGENTS_FILE,
  CONFIG_FILE,
  CURRENT_TEMPLATE_VERSION,
  PACKAGE_NAME,
  TEMPLATE_GROUPS,
} from './constants.js';
import { createDefaultConfig } from './config.js';
import { pathExists, readTextIfExists, writeTextFile } from './file-system.js';
import { detectPackageManager } from './package-manager.js';
import { detectPackageScripts, detectProjectName, detectProjectType } from './project-detection.js';
import { getTemplateRoot, readTemplate, TemplateValues } from './template-renderer.js';

export type InitResult = {
  created: string[];
  updated: string[];
  skipped: string[];
  dryRun: boolean;
};

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

export async function initializeAgentLoop(options: {
  cwd: string;
  dryRun?: boolean;
}): Promise<InitResult> {
  const result: InitResult = {
    created: [],
    updated: [],
    skipped: [],
    dryRun: Boolean(options.dryRun),
  };
  const cwd = options.cwd;
  const packageManager = await detectPackageManager(cwd);
  const projectType = await detectProjectType(cwd);
  const projectName = await detectProjectName(cwd);
  const commands = await detectPackageScripts(cwd, packageManager);
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
