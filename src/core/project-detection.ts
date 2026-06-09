import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { CommandConfig, PackageManager, ProjectType } from './config.js';
import { DEFAULT_COMMAND_KEYS } from './constants.js';
import { listFilesRecursive, pathExists } from './file-system.js';
import { packageManagerRunCommand } from './package-manager.js';

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function readPackageJson(cwd: string): Promise<PackageJson | undefined> {
  const filePath = path.join(cwd, 'package.json');
  if (!(await pathExists(filePath))) return undefined;
  return JSON.parse(await readFile(filePath, 'utf8')) as PackageJson;
}

export async function detectProjectName(cwd: string) {
  const packageJson = await readPackageJson(cwd);
  if (packageJson?.name) return packageJson.name;
  return path.basename(cwd);
}

export async function detectProjectType(cwd: string): Promise<ProjectType> {
  const packageJson = await readPackageJson(cwd);
  const deps = { ...packageJson?.dependencies, ...packageJson?.devDependencies };

  if (deps.next) return 'nextjs';
  if (deps.vite && deps.react) return 'react-vite';
  if (deps.typescript && packageJson) return 'typescript-package';
  if (packageJson) return 'node';
  if (
    (await pathExists(path.join(cwd, 'pyproject.toml'))) ||
    (await pathExists(path.join(cwd, 'requirements.txt')))
  ) {
    return 'python';
  }

  const files = await listFilesRecursive(cwd);
  const relativeFiles = files.map((file) => path.relative(cwd, file));
  const hasCode = relativeFiles.some((file) =>
    /\.(ts|tsx|js|jsx|py|go|rs|java|rb|php|cs)$/.test(file),
  );
  const hasDocs = relativeFiles.some((file) => file.endsWith('.md') || file.startsWith('docs/'));
  if (hasDocs && !hasCode) return 'docs-only';

  return 'generic';
}

export async function detectPackageScripts(
  cwd: string,
  packageManager: PackageManager,
): Promise<CommandConfig> {
  const packageJson = await readPackageJson(cwd);
  const commands: CommandConfig = { test: '', lint: '', typecheck: '', build: '', format: '' };
  for (const key of DEFAULT_COMMAND_KEYS) {
    if (packageJson?.scripts?.[key]) {
      commands[key] = packageManagerRunCommand(packageManager, key);
    }
  }
  return commands;
}
