import { readFile, readdir } from 'node:fs/promises';
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
  workspaces?: string[] | { packages?: string[] };
};

export type MonorepoInfo = {
  detected: boolean;
  markers: string[];
};

const MONOREPO_FILE_MARKERS = [
  'pnpm-workspace.yaml',
  'turbo.json',
  'nx.json',
  'lerna.json',
  'rush.json',
] as const;

const MONOREPO_PACKAGE_COLLECTION_DIRS = [
  'apps',
  'packages',
  'services',
  'libs',
  'workspaces',
] as const;

const MONOREPO_DIRECT_PACKAGE_DIRS = [
  'functions',
  'firestore-tests',
  'web',
  'api',
  'server',
  'client',
  'backend',
  'frontend',
  'mobile',
  'worker',
  'workers',
  'e2e',
] as const;

const MONOREPO_NESTED_PACKAGE_MARKER_LIMIT = 5;

const FALLBACK_PROJECT_DETECTION_MAX_DEPTH = 2;
const FALLBACK_PROJECT_DETECTION_MAX_ENTRIES = 500;

async function listDirectoryNames(directory: string) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

async function hasPackageJson(cwd: string, ...segments: string[]) {
  return pathExists(path.join(cwd, ...segments, 'package.json'));
}

function packageJsonMarker(...segments: string[]) {
  return path.posix.join(...segments, 'package.json');
}

function formatNestedPackageManifestMarker(input: { markers: string[]; total: number }) {
  const extra = input.total - input.markers.length;
  const suffix = extra > 0 ? ` (+${extra} more)` : '';
  return `nested package manifests: ${input.markers.join(', ')}${suffix}`;
}

async function detectNestedPackageManifestMarkers(cwd: string) {
  const markers: string[] = [];
  let total = 0;

  for (const collection of MONOREPO_PACKAGE_COLLECTION_DIRS) {
    for (const packageDir of await listDirectoryNames(path.join(cwd, collection))) {
      if (!(await hasPackageJson(cwd, collection, packageDir))) continue;
      total += 1;
      if (markers.length < MONOREPO_NESTED_PACKAGE_MARKER_LIMIT) {
        markers.push(packageJsonMarker(collection, packageDir));
      }
    }
  }

  for (const packageDir of MONOREPO_DIRECT_PACKAGE_DIRS) {
    if (!(await hasPackageJson(cwd, packageDir))) continue;
    total += 1;
    if (markers.length < MONOREPO_NESTED_PACKAGE_MARKER_LIMIT) {
      markers.push(packageJsonMarker(packageDir));
    }
  }

  return { markers, total };
}

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

  const files = await listFilesRecursive(cwd, {
    maxDepth: FALLBACK_PROJECT_DETECTION_MAX_DEPTH,
    maxEntries: FALLBACK_PROJECT_DETECTION_MAX_ENTRIES,
  });
  const relativeFiles = files.map((file) => path.relative(cwd, file));
  const hasCode = relativeFiles.some((file) =>
    /\.(ts|tsx|js|jsx|py|go|rs|java|rb|php|cs)$/.test(file),
  );
  const hasDocs = relativeFiles.some((file) => file.endsWith('.md') || file.startsWith('docs/'));
  if (hasDocs && !hasCode) return 'docs-only';

  return 'generic';
}

export async function detectMonorepo(cwd: string): Promise<MonorepoInfo> {
  const markers: string[] = [];
  const packageJson = await readPackageJson(cwd);
  if (packageJson?.workspaces) {
    markers.push('package.json workspaces');
  }

  for (const marker of MONOREPO_FILE_MARKERS) {
    if (await pathExists(path.join(cwd, marker))) {
      markers.push(marker);
    }
  }

  const nestedPackageManifests = await detectNestedPackageManifestMarkers(cwd);
  if (nestedPackageManifests.total > 0) {
    markers.push(formatNestedPackageManifestMarker(nestedPackageManifests));
  }

  return { detected: markers.length > 0, markers };
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
