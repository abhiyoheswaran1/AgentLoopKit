import { mkdir, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { AgentLoopConfig } from './config.js';
import { AgentLoopError } from './errors.js';
import { pathExists, resolvesInsidePath, writeFileIfMissing } from './file-system.js';
import { getTemplateRoot } from './template-renderer.js';

export type PolicyPackSource = 'bundled' | 'local';

export type PolicyPackSummary = {
  name: string;
  title: string;
  description: string;
  source: PolicyPackSource;
  path: string;
  policyCount: number;
};

export type PolicyPackPolicy = {
  fileName: string;
  title: string;
  path: string;
  content: string;
};

export type PolicyPack = PolicyPackSummary & {
  policies: PolicyPackPolicy[];
};

export type PolicyPackApplyResult = {
  pack: PolicyPackSummary;
  dryRun: boolean;
  writesFiles: boolean;
  created: string[];
  skipped: string[];
  targetDirectory: string;
  safety: {
    overwritesExistingPolicies: false;
    callsNetwork: false;
    readsEnvFiles: false;
  };
};

type PolicyPackManifest = {
  name: string;
  title: string;
  description: string;
  policies: string[];
};

export class PolicyPackNotFoundError extends AgentLoopError {
  constructor(
    public readonly requestedPack: string,
    public readonly availablePacks: string[],
  ) {
    super(`Policy pack not found: ${requestedPack}`, 'POLICY_PACK_NOT_FOUND');
    this.name = 'PolicyPackNotFoundError';
  }
}

export class PolicyPackManifestError extends AgentLoopError {
  constructor(
    public readonly manifestPath: string,
    message: string,
  ) {
    super(
      `Invalid policy pack manifest at ${manifestPath}: ${message}`,
      'POLICY_PACK_MANIFEST_INVALID',
    );
    this.name = 'PolicyPackManifestError';
  }
}

function toStoredPath(cwd: string, absolutePath: string) {
  return path.relative(cwd, absolutePath).split(path.sep).join('/');
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function normalizePackName(name: string) {
  return name.trim().toLowerCase();
}

function summarizePolicyPack(pack: PolicyPack): PolicyPackSummary {
  return {
    name: pack.name,
    title: pack.title,
    description: pack.description,
    source: pack.source,
    path: pack.path,
    policyCount: pack.policyCount,
  };
}

function bundledPolicyPackRoot() {
  return path.join(getTemplateRoot(), 'policy-packs');
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

function stringField(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function validatePolicyFileName(fileName: unknown, manifestPath: string) {
  if (typeof fileName !== 'string') {
    throw new PolicyPackManifestError(manifestPath, 'policy entries must be strings.');
  }
  const normalized = fileName.replace(/\\/g, '/');
  if (
    fileName.trim() !== fileName ||
    normalized.includes('/') ||
    normalized.includes('..') ||
    path.isAbsolute(fileName) ||
    fileName.includes('\0') ||
    !fileName.endsWith('.md')
  ) {
    throw new PolicyPackManifestError(
      manifestPath,
      `policy entry must be a simple Markdown filename: ${fileName}`,
    );
  }
  return fileName;
}

function normalizeManifest(raw: unknown, manifestPath: string): PolicyPackManifest {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new PolicyPackManifestError(manifestPath, 'manifest must be a JSON object.');
  }
  const record = raw as Record<string, unknown>;
  const policies = record.policies;
  if (!Array.isArray(policies)) {
    throw new PolicyPackManifestError(manifestPath, 'policies must be an array.');
  }
  return {
    name: stringField(record.name),
    title: stringField(record.title),
    description: stringField(record.description),
    policies: policies.map((fileName) => validatePolicyFileName(fileName, manifestPath)),
  };
}

async function readPackAt(options: {
  cwd: string;
  packRoot: string;
  displayPath: string;
  source: PolicyPackSource;
}): Promise<PolicyPack> {
  const manifestPath = path.join(options.packRoot, 'manifest.json');
  const manifest = normalizeManifest(await readJsonFile<unknown>(manifestPath), manifestPath);
  const policyDirectory = path.join(options.packRoot, 'policies');
  if (options.source === 'local' && !resolvesInsidePath(options.cwd, policyDirectory)) {
    throw new PolicyPackManifestError(
      manifestPath,
      'policies directory must stay inside the repository.',
    );
  }
  const policies = await Promise.all(
    [...manifest.policies].sort().map(async (fileName) => {
      const policyPath = path.join(policyDirectory, fileName);
      if (
        !resolvesInsidePath(policyDirectory, policyPath) ||
        (options.source === 'local' && !resolvesInsidePath(options.cwd, policyPath))
      ) {
        throw new PolicyPackManifestError(
          manifestPath,
          `policy file must stay inside the pack policies directory: ${fileName}`,
        );
      }
      const content = await readFile(policyPath, 'utf8');
      return {
        fileName,
        title: extractHeading(content, path.basename(fileName, '.md')),
        path:
          options.source === 'local'
            ? toStoredPath(options.cwd, policyPath)
            : `templates/policy-packs/${manifest.name}/policies/${fileName}`,
        content,
      };
    }),
  );

  return {
    name: manifest.name,
    title: manifest.title,
    description: manifest.description,
    source: options.source,
    path: options.displayPath,
    policyCount: policies.length,
    policies,
  };
}

async function listBundledPolicyPacks(cwd: string) {
  const root = bundledPolicyPackRoot();
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const packs = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        readPackAt({
          cwd,
          packRoot: path.join(root, entry.name),
          displayPath: `templates/policy-packs/${entry.name}`,
          source: 'bundled',
        }),
      ),
  );
  return packs;
}

async function listLocalPolicyPacks(options: { cwd: string; config: AgentLoopConfig }) {
  const configured = options.config.policies?.packs ?? [];
  const packs = [];
  for (const pack of configured) {
    if (!pack.path) continue;
    const root = path.resolve(options.cwd, pack.path);
    if (!resolvesInsidePath(options.cwd, root)) continue;
    if (!(await pathExists(path.join(root, 'manifest.json')))) continue;
    packs.push(
      await readPackAt({
        cwd: options.cwd,
        packRoot: root,
        displayPath: pack.path,
        source: 'local',
      }),
    );
  }
  return packs;
}

export async function listPolicyPacks(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<PolicyPackSummary[]> {
  const packs = [
    ...(await listBundledPolicyPacks(options.cwd)),
    ...(await listLocalPolicyPacks(options)),
  ];
  return packs
    .map((pack) => summarizePolicyPack(pack))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function readPolicyPack(options: {
  cwd: string;
  config: AgentLoopConfig;
  packName: string;
}): Promise<PolicyPack> {
  const packs = [
    ...(await listBundledPolicyPacks(options.cwd)),
    ...(await listLocalPolicyPacks(options)),
  ].sort((left, right) => left.name.localeCompare(right.name));
  const requested = normalizePackName(options.packName);
  const pack = packs.find((candidate) => normalizePackName(candidate.name) === requested);
  if (!pack) {
    throw new PolicyPackNotFoundError(
      options.packName,
      packs.map((candidate) => candidate.name),
    );
  }
  return pack;
}

export async function applyPolicyPack(options: {
  cwd: string;
  config: AgentLoopConfig;
  packName: string;
  dryRun?: boolean;
}): Promise<PolicyPackApplyResult> {
  const pack = await readPolicyPack(options);
  const targetDir = path.resolve(options.cwd, options.config.paths.agentloopDir, 'policies');
  if (!resolvesInsidePath(options.cwd, targetDir)) {
    throw new AgentLoopError('Policy pack target directory must stay inside the repository.');
  }
  const created: string[] = [];
  const skipped: string[] = [];

  for (const policy of pack.policies) {
    const targetPath = path.join(targetDir, policy.fileName);
    const displayPath = toStoredPath(options.cwd, targetPath);
    if (await pathExists(targetPath)) {
      skipped.push(displayPath);
      continue;
    }
    created.push(displayPath);
    if (!options.dryRun) {
      await mkdir(targetDir, { recursive: true });
      await writeFileIfMissing(targetPath, policy.content);
    }
  }

  return {
    pack: summarizePolicyPack(pack),
    dryRun: options.dryRun === true,
    writesFiles: options.dryRun === true ? false : created.length > 0,
    created,
    skipped,
    targetDirectory: toStoredPath(options.cwd, targetDir),
    safety: {
      overwritesExistingPolicies: false,
      callsNetwork: false,
      readsEnvFiles: false,
    },
  };
}
