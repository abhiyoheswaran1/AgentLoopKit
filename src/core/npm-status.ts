import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import { AgentLoopError } from './errors.js';
import { pathExists } from './file-system.js';
import { inlineCode } from './markdown-format.js';

export type NpmCatchUpStatus = 'current' | 'catch-up-needed' | 'unknown';

export type NpmRegistryMetadata = {
  latest?: string;
  versions: string[];
};

export type NpmStatusResult = {
  packageName: string;
  localVersion: string;
  status: NpmCatchUpStatus;
  registry: NpmRegistryMetadata & {
    hasLocalVersion: boolean;
  };
  source: {
    command: string;
    exitCode: number;
    error?: string;
  };
  recommendation: string;
  safety: {
    does: string[];
    doesNot: string[];
  };
  markdown: string;
};

type PackageMetadata = {
  name: string;
  version: string;
};

type NpmViewRunner = (packageName: string) => Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}>;

const NPM_UNSCOPED_NAME_PATTERN = /^[a-z0-9][a-z0-9._~-]*$/;
const NPM_SCOPED_NAME_PATTERN = /^@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*$/;

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function valueAsString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function isString(value: string | undefined): value is string {
  return typeof value === 'string';
}

export function validateNpmPackageName(packageName: string) {
  const name = packageName.trim();
  if (
    !name ||
    name.length > 214 ||
    name.startsWith('-') ||
    /^(npm:|file:|link:|git\+|https?:)/i.test(name) ||
    name.includes('://') ||
    (!NPM_UNSCOPED_NAME_PATTERN.test(name) && !NPM_SCOPED_NAME_PATTERN.test(name))
  ) {
    throw new AgentLoopError(
      `Invalid npm package name: ${packageName}. Use a registry package name such as agentloopkit or @scope/name.`,
      'NPM_PACKAGE_NAME_INVALID',
    );
  }
  return name;
}

function valueAsVersions(value: unknown) {
  if (Array.isArray(value)) return uniqueStrings(value.map(valueAsString).filter(isString));
  const single = valueAsString(value);
  return single ? [single] : [];
}

export function parseNpmViewJson(json: string): NpmRegistryMetadata {
  const parsed = JSON.parse(json) as unknown;
  if (typeof parsed === 'string') return { latest: parsed, versions: [parsed] };
  if (!parsed || typeof parsed !== 'object') {
    throw new AgentLoopError('npm view JSON must be an object or string.');
  }

  const record = parsed as Record<string, unknown>;
  const versions = valueAsVersions(record.versions);
  const latest = valueAsString(record.version) ?? versions.at(-1);
  if (!latest) throw new AgentLoopError('npm view JSON did not include a version.');

  return {
    latest,
    versions: versions.includes(latest) ? versions : uniqueStrings([...versions, latest]),
  };
}

async function readPackageMetadata(cwd: string): Promise<PackageMetadata> {
  const packagePath = path.join(cwd, 'package.json');
  if (!(await pathExists(packagePath))) {
    return { name: path.basename(cwd), version: '0.0.0' };
  }

  const parsed = JSON.parse(await readFile(packagePath, 'utf8')) as Partial<PackageMetadata>;
  return {
    name: typeof parsed.name === 'string' && parsed.name ? parsed.name : path.basename(cwd),
    version: typeof parsed.version === 'string' && parsed.version ? parsed.version : '0.0.0',
  };
}

async function readAgentLoopKitPackageVersion() {
  const packagePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../package.json',
  );
  const parsed = JSON.parse(await readFile(packagePath, 'utf8')) as Partial<PackageMetadata>;
  if (typeof parsed.version !== 'string' || !parsed.version.trim()) {
    throw new AgentLoopError('AgentLoopKit package version could not be read.');
  }
  return parsed.version;
}

function defaultNpmViewRunner(cwd: string, timeoutMs: number): NpmViewRunner {
  return async (packageName) => {
    const result = await execa('npm', ['view', '--json', packageName, 'version', 'versions'], {
      cwd,
      reject: false,
      timeout: timeoutMs,
    });
    return {
      exitCode: result.exitCode ?? 1,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  };
}

function statusLabel(status: NpmCatchUpStatus) {
  switch (status) {
    case 'current':
      return 'npm latest matches local package version';
    case 'catch-up-needed':
      return 'npm latest differs from local package version';
    case 'unknown':
      return 'npm status could not be determined';
  }
}

function recommendation(status: NpmCatchUpStatus) {
  switch (status) {
    case 'current':
      return 'npm has caught up. Remove temporary GitHub tarball fallback docs if they are still present.';
    case 'catch-up-needed':
      return 'Publish the current source version after npm authentication or trusted publishing works. Do not backfill stale intermediate versions from the current checkout.';
    case 'unknown':
      return 'Fix the npm registry check and rerun this command before claiming npm availability.';
  }
}

function renderVersions(versions: string[]) {
  return versions.length
    ? versions.map((version) => inlineCode(version)).join(', ')
    : 'not available';
}

function renderMarkdown(result: Omit<NpmStatusResult, 'markdown'>) {
  const latest = result.registry.latest ? inlineCode(result.registry.latest) : 'not available';
  const errorLine = result.source.error ? `\n- Registry error: ${result.source.error}` : '';

  return `# npm Status

- Package: ${inlineCode(result.packageName)}
- Local version: ${inlineCode(result.localVersion)}
- npm latest: ${latest}
- Registry contains local version: ${result.registry.hasLocalVersion ? 'yes' : 'no'}
- Registry versions: ${renderVersions(result.registry.versions)}
- Status: ${statusLabel(result.status)}${errorLine}

## Recommendation

${result.recommendation}

## Safety

This command only runs \`npm view --json ${result.packageName} version versions\` unless \`--registry-json\` is provided. AgentLoopKit does not read npm token files directly, but npm may use normal npm configuration when the live registry check runs. It does not publish packages, create tags, create GitHub releases, read .env files, upload files, or change package metadata.
`;
}

export async function checkNpmStatus(options: {
  cwd: string;
  agentloopkit?: boolean;
  packageName?: string;
  localVersion?: string;
  registryJson?: string;
  npmView?: NpmViewRunner;
  timeoutMs?: number;
}): Promise<NpmStatusResult> {
  const packageMetadata = await readPackageMetadata(options.cwd);
  const packageName = validateNpmPackageName(
    options.agentloopkit
      ? (options.packageName ?? 'agentloopkit')
      : (options.packageName ?? packageMetadata.name),
  );
  const localVersion =
    options.localVersion ??
    (options.agentloopkit ? await readAgentLoopKitPackageVersion() : packageMetadata.version);
  const source: NpmStatusResult['source'] = options.registryJson
    ? {
        command: 'captured npm view JSON',
        exitCode: 0,
      }
    : {
        command: `npm view ${packageName} version versions --json`,
        exitCode: 0,
      };
  const runner = options.npmView ?? defaultNpmViewRunner(options.cwd, options.timeoutMs ?? 15000);

  let registry: NpmRegistryMetadata = { versions: [] };
  let sourceResult: NpmStatusResult['source'] = source;
  try {
    if (options.registryJson) {
      registry = parseNpmViewJson(options.registryJson);
    } else {
      const result = await runner(packageName);
      sourceResult = {
        ...source,
        exitCode: result.exitCode,
        ...(result.exitCode === 0
          ? {}
          : { error: result.stderr || result.stdout || 'npm view failed' }),
      };
      if (result.exitCode === 0) registry = parseNpmViewJson(result.stdout);
    }
  } catch (error) {
    sourceResult = {
      ...source,
      exitCode: source.exitCode || 1,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  const hasLocalVersion = registry.versions.includes(localVersion);
  const status: NpmCatchUpStatus = sourceResult.error
    ? 'unknown'
    : registry.latest === localVersion
      ? 'current'
      : 'catch-up-needed';
  const withoutMarkdown = {
    packageName,
    localVersion,
    status,
    registry: {
      ...registry,
      hasLocalVersion,
    },
    source: sourceResult,
    recommendation: recommendation(status),
    safety: {
      does: ['runs npm view when no captured registry JSON is provided'],
      doesNot: [
        'publish packages',
        'create tags',
        'create GitHub releases',
        'read npm token files directly',
        'read .env files',
        'upload files',
        'change package metadata',
      ],
    },
  };

  return {
    ...withoutMarkdown,
    markdown: renderMarkdown(withoutMarkdown),
  };
}

export function shouldFailNpmStatusExpectation(result: NpmStatusResult) {
  return result.status !== 'current';
}
