import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { execa } from 'execa';
import { AgentLoopError } from './errors.js';
import { pathExists } from './file-system.js';
import { inlineCode } from './markdown-format.js';
import { checkNpmStatus } from './npm-status.js';

export type ReleaseProofStatus = 'pass' | 'warn' | 'fail';

export type ReleaseProofChannelId = 'npm' | 'github-release' | 'ghcr' | 'mcp-registry';

export type ReleaseProofChannel = {
  id: ReleaseProofChannelId;
  name: string;
  status: ReleaseProofStatus;
  message: string;
  url?: string;
};

export type ReleaseProofSource = {
  command: string;
  exitCode: number;
  error?: string;
};

export type ReleaseProofResult = {
  overallStatus: ReleaseProofStatus;
  package: {
    name: string;
    version: string;
  };
  git: {
    tag: string;
    tagExists: boolean;
    commit: string;
  };
  channels: ReleaseProofChannel[];
  sources: {
    npm: ReleaseProofSource;
    githubRelease: ReleaseProofSource;
    ghcr: ReleaseProofSource;
    mcpRegistry: ReleaseProofSource;
  };
  nextAction: {
    command: string;
    reason: string;
  };
  safety: {
    does: string[];
    doesNot: string[];
  };
  markdown: string;
};

type PackageMetadata = {
  name: string;
  version: string;
  repositoryUrl?: string;
  mcpName?: string;
};

type HttpJsonResult = {
  source: ReleaseProofSource;
  value?: unknown;
};

const DEFAULT_TIMEOUT_MS = 15_000;

function valueAsRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function valueAsString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function valueAsBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function valueAsStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map(valueAsString).filter((item): item is string => Boolean(item))
    : [];
}

async function readPackageMetadata(cwd: string): Promise<PackageMetadata> {
  const packagePath = path.join(cwd, 'package.json');
  if (!(await pathExists(packagePath))) {
    return { name: path.basename(cwd), version: '0.0.0' };
  }

  const parsed = JSON.parse(await readFile(packagePath, 'utf8')) as {
    name?: unknown;
    version?: unknown;
    repository?: unknown;
    mcpName?: unknown;
  };
  const repository = valueAsRecord(parsed.repository);
  return {
    name: valueAsString(parsed.name) ?? path.basename(cwd),
    version: valueAsString(parsed.version) ?? '0.0.0',
    repositoryUrl: valueAsString(repository?.url),
    mcpName: valueAsString(parsed.mcpName),
  };
}

async function readServerMcpName(cwd: string) {
  const serverPath = path.join(cwd, 'server.json');
  if (!(await pathExists(serverPath))) return undefined;
  const parsed = JSON.parse(await readFile(serverPath, 'utf8')) as { name?: unknown };
  return valueAsString(parsed.name);
}

function githubRepoFromUrl(repositoryUrl: string | undefined) {
  if (!repositoryUrl) return undefined;
  const match = repositoryUrl.match(/github\.com[:/]+([^/]+)\/([^/.#]+)(?:\.git)?/i);
  if (!match) return undefined;
  return {
    owner: match[1],
    repo: match[2],
  };
}

async function gitTagExists(cwd: string, version: string) {
  const result = await execa('git', ['rev-parse', '--verify', '--quiet', `v${version}^{commit}`], {
    cwd,
    reject: false,
  });
  return result.exitCode === 0;
}

async function gitCommit(cwd: string) {
  const result = await execa('git', ['rev-parse', '--short', 'HEAD'], {
    cwd,
    reject: false,
  });
  return result.exitCode === 0 ? result.stdout.trim() : '';
}

function sourceFromFixture(command: string): ReleaseProofSource {
  return { command, exitCode: 0 };
}

function sourceFromError(command: string, error: string): ReleaseProofSource {
  return { command, exitCode: 1, error };
}

function parseCapturedJson(json: string, command: string): HttpJsonResult {
  try {
    return {
      source: sourceFromFixture(command),
      value: JSON.parse(json) as unknown,
    };
  } catch (error) {
    return {
      source: sourceFromError(
        command,
        error instanceof Error ? error.message : 'captured JSON could not be parsed',
      ),
    };
  }
}

async function fetchJson(url: string, timeoutMs: number): Promise<HttpJsonResult> {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent': 'agentloopkit-release-proof',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await response.text();
    if (!response.ok) {
      return {
        source: sourceFromError(`GET ${url}`, `HTTP ${response.status}: ${body.slice(0, 200)}`),
      };
    }
    return {
      source: { command: `GET ${url}`, exitCode: 0 },
      value: JSON.parse(body) as unknown,
    };
  } catch (error) {
    return {
      source: sourceFromError(`GET ${url}`, error instanceof Error ? error.message : String(error)),
    };
  }
}

function bearerChallengeParams(header: string | null) {
  if (!header || !/^Bearer\s+/i.test(header)) return undefined;
  const params = new Map<string, string>();
  for (const match of header.matchAll(/(\w+)="([^"]+)"/g)) {
    params.set(match[1], match[2]);
  }
  const realm = params.get('realm');
  if (!realm) return undefined;
  return {
    realm,
    service: params.get('service'),
    scope: params.get('scope'),
  };
}

async function fetchGhcrTagsJson(url: string, timeoutMs: number): Promise<HttpJsonResult> {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent': 'agentloopkit-release-proof',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await response.text();
    if (response.ok) {
      return {
        source: { command: `GET ${url}`, exitCode: 0 },
        value: JSON.parse(body) as unknown,
      };
    }

    const challenge = bearerChallengeParams(response.headers.get('www-authenticate'));
    if (response.status !== 401 || !challenge) {
      return {
        source: sourceFromError(`GET ${url}`, `HTTP ${response.status}: ${body.slice(0, 200)}`),
      };
    }

    const tokenUrl = new URL(challenge.realm);
    if (challenge.service) tokenUrl.searchParams.set('service', challenge.service);
    if (challenge.scope) tokenUrl.searchParams.set('scope', challenge.scope);
    const tokenResponse = await fetch(tokenUrl, {
      headers: {
        accept: 'application/json',
        'user-agent': 'agentloopkit-release-proof',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const tokenBody = await tokenResponse.text();
    if (!tokenResponse.ok) {
      return {
        source: sourceFromError(
          `GET ${url}`,
          `anonymous GHCR token request failed with HTTP ${tokenResponse.status}: ${tokenBody.slice(
            0,
            200,
          )}`,
        ),
      };
    }
    const tokenJson = JSON.parse(tokenBody) as { token?: unknown };
    const token = valueAsString(tokenJson.token);
    if (!token) {
      return {
        source: sourceFromError(`GET ${url}`, 'anonymous GHCR token response did not include a token'),
      };
    }

    const retry = await fetch(url, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'user-agent': 'agentloopkit-release-proof',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const retryBody = await retry.text();
    if (!retry.ok) {
      return {
        source: sourceFromError(
          `GET ${url}`,
          `HTTP ${retry.status}: ${retryBody.slice(0, 200)}`,
        ),
      };
    }
    return {
      source: { command: `GET ${url} with anonymous GHCR bearer challenge`, exitCode: 0 },
      value: JSON.parse(retryBody) as unknown,
    };
  } catch (error) {
    return {
      source: sourceFromError(`GET ${url}`, error instanceof Error ? error.message : String(error)),
    };
  }
}

function githubReleaseProof(value: unknown, version: string) {
  const release = valueAsRecord(value);
  const tagName = valueAsString(release?.tag_name);
  const htmlUrl = valueAsString(release?.html_url);
  const draft = valueAsBoolean(release?.draft) ?? false;
  const prerelease = valueAsBoolean(release?.prerelease) ?? false;
  const assets = Array.isArray(release?.assets)
    ? release.assets.map(valueAsRecord).filter((item): item is Record<string, unknown> => !!item)
    : [];
  const assetNames = assets.map((asset) => valueAsString(asset.name)).filter(Boolean);
  const expectedAsset = `agentloopkit-${version}.tgz`;
  const matchingTag = tagName === `v${version}`;
  const matchingAsset = assetNames.includes(expectedAsset);

  return {
    status: matchingTag && matchingAsset && !draft ? ('pass' as const) : ('warn' as const),
    message:
      matchingTag && matchingAsset && !draft
        ? `GitHub release v${version} is public with ${expectedAsset}.`
        : `GitHub release proof is missing v${version}, ${expectedAsset}, or public release state.`,
    url: htmlUrl,
    prerelease,
  };
}

function ghcrProof(value: unknown, version: string) {
  const record = valueAsRecord(value);
  const tags = valueAsStringArray(record?.tags);
  const hasVersion = tags.includes(version);
  return {
    status: hasVersion ? ('pass' as const) : ('warn' as const),
    message: hasVersion
      ? `GHCR image tag found for ${version}.`
      : `GHCR tag list does not include ${version}.`,
  };
}

function mcpServerRecord(value: unknown) {
  const record = valueAsRecord(value);
  if (!record) return undefined;
  const directServer = valueAsRecord(record.server);
  if (directServer) return directServer;
  if (valueAsString(record.name)) return record;
  const servers = Array.isArray(record.servers)
    ? record.servers.map(valueAsRecord).filter((item): item is Record<string, unknown> => !!item)
    : [];
  return servers.map((item) => valueAsRecord(item.server) ?? item).find((item) => valueAsString(item.name));
}

function mcpRegistryProof(value: unknown, options: { version: string; packageName: string; mcpName: string }) {
  const server = mcpServerRecord(value);
  const packages = Array.isArray(server?.packages)
    ? server.packages.map(valueAsRecord).filter((item): item is Record<string, unknown> => !!item)
    : [];
  const serverName = valueAsString(server?.name);
  const serverVersion = valueAsString(server?.version);
  const matchingPackage = packages.some(
    (item) =>
      valueAsString(item.registryType) === 'npm' &&
      valueAsString(item.identifier) === options.packageName &&
      valueAsString(item.version) === options.version,
  );
  const matches = serverName === options.mcpName && serverVersion === options.version && matchingPackage;

  return {
    status: matches ? ('pass' as const) : ('warn' as const),
    message: matches
      ? `MCP Registry metadata points at ${options.packageName}@${options.version}.`
      : `MCP Registry proof does not match ${options.mcpName} ${options.packageName}@${options.version}.`,
  };
}

function channel(
  id: ReleaseProofChannelId,
  name: string,
  status: ReleaseProofStatus,
  message: string,
  url?: string,
): ReleaseProofChannel {
  return { id, name, status, message, ...(url ? { url } : {}) };
}

function overallStatus(
  channels: ReleaseProofChannel[],
  strict: boolean,
  gitTagExists: boolean,
): ReleaseProofStatus {
  if (channels.some((item) => item.status === 'fail')) return 'fail';
  if (!gitTagExists && strict) return 'fail';
  if (strict && channels.some((item) => item.status === 'warn')) return 'fail';
  if (!gitTagExists) return 'warn';
  if (channels.some((item) => item.status === 'warn')) return 'warn';
  return 'pass';
}

function chooseNextAction(result: {
  gitTagExists: boolean;
  channels: ReleaseProofChannel[];
  status: ReleaseProofStatus;
}) {
  if (!result.gitTagExists) {
    return {
      command: 'verify release tag',
      reason: 'The local git tag for this package version was not found.',
    };
  }
  const missing = result.channels.filter((item) => item.status !== 'pass');
  if (missing.length > 0) {
    return {
      command: 'fix release channel proof',
      reason: `Missing or mismatched proof: ${missing.map((item) => item.name).join(', ')}.`,
    };
  }
  return {
    command: 'record release proof',
    reason: 'All checked release channels match the local package version.',
  };
}

function renderMarkdown(result: Omit<ReleaseProofResult, 'markdown'>) {
  const channels = result.channels
    .map(
      (item) =>
        `- [${inlineCode(item.status)}] ${inlineCode(item.name)}: ${inlineCode(item.message)}${
          item.url ? ` - ${item.url}` : ''
        }`,
    )
    .join('\n');
  return `# AgentLoopKit Release Proof

- Overall status: ${inlineCode(result.overallStatus)}
- Package: ${inlineCode(`${result.package.name}@${result.package.version}`)}
- Git tag: ${inlineCode(result.git.tag)} (${result.git.tagExists ? 'found' : 'missing'})
- Commit: ${inlineCode(result.git.commit || 'unknown')}

## Channels

${channels}

## Next Action

Run ${inlineCode(result.nextAction.command)}.

${result.nextAction.reason}

## Safety

This command checks release evidence only. Live mode queries public package, release, container, and MCP registry metadata with a timeout. Captured JSON mode reads only the files passed with explicit flags.

It does not publish packages, create tags, create GitHub releases, read npm tokens, read GitHub tokens, read .env files, upload files, post comments, or change package metadata.
`;
}

export async function checkReleaseProof(options: {
  cwd: string;
  strict?: boolean;
  npmRegistryJson?: string;
  githubReleaseJson?: string;
  ghcrTagsJson?: string;
  mcpRegistryJson?: string;
  timeoutMs?: number;
}): Promise<ReleaseProofResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const packageMetadata = await readPackageMetadata(options.cwd);
  const version = packageMetadata.version;
  const gitTag = `v${version}`;
  const gitTagFound = await gitTagExists(options.cwd, version);
  const commit = await gitCommit(options.cwd);
  const repo = githubRepoFromUrl(packageMetadata.repositoryUrl);
  const mcpName = packageMetadata.mcpName ?? (await readServerMcpName(options.cwd));

  if (!mcpName) {
    throw new AgentLoopError(
      'Release proof requires package.json mcpName or server.json name for MCP Registry proof.',
      'RELEASE_PROOF_MCP_NAME_MISSING',
    );
  }

  const npmStatus = await checkNpmStatus({
    cwd: options.cwd,
    packageName: packageMetadata.name,
    localVersion: version,
    registryJson: options.npmRegistryJson,
    timeoutMs,
  });
  const npmChannel = channel(
    'npm',
    'npm',
    npmStatus.status === 'current' ? 'pass' : 'warn',
    npmStatus.status === 'current'
      ? `npm latest matches ${packageMetadata.name}@${version}.`
      : `npm latest does not match ${packageMetadata.name}@${version}.`,
  );

  const githubUrl = repo
    ? `https://api.github.com/repos/${repo.owner}/${repo.repo}/releases/tags/${encodeURIComponent(gitTag)}`
    : undefined;
  const githubResult = options.githubReleaseJson
    ? parseCapturedJson(options.githubReleaseJson, 'captured GitHub release JSON')
    : githubUrl
      ? await fetchJson(githubUrl, timeoutMs)
      : {
          source: sourceFromError(
            'GitHub release proof',
            'package.json repository is not a GitHub repository URL',
          ),
        };
  const githubProof = githubResult.value
    ? githubReleaseProof(githubResult.value, version)
    : {
        status: 'warn' as const,
        message: `GitHub release proof could not be read: ${githubResult.source.error ?? 'unknown error'}.`,
        url: undefined,
      };

  const owner = repo?.owner.toLowerCase();
  const imageName = packageMetadata.name.toLowerCase();
  const ghcrUrl = owner ? `https://ghcr.io/v2/${owner}/${imageName}/tags/list` : undefined;
  const ghcrResult = options.ghcrTagsJson
    ? parseCapturedJson(options.ghcrTagsJson, 'captured GHCR tag JSON')
    : ghcrUrl
      ? await fetchGhcrTagsJson(ghcrUrl, timeoutMs)
      : {
          source: sourceFromError('GHCR tag proof', 'package.json repository owner was not found'),
        };
  const ghcr = ghcrResult.value
    ? ghcrProof(ghcrResult.value, version)
    : {
        status: 'warn' as const,
        message: `GHCR proof could not be read: ${ghcrResult.source.error ?? 'unknown error'}.`,
      };

  const mcpUrl = `https://registry.modelcontextprotocol.io/v0.1/servers/${encodeURIComponent(
    mcpName,
  )}/versions/latest`;
  const mcpResult = options.mcpRegistryJson
    ? parseCapturedJson(options.mcpRegistryJson, 'captured MCP Registry JSON')
    : await fetchJson(mcpUrl, timeoutMs);
  const mcp = mcpResult.value
    ? mcpRegistryProof(mcpResult.value, {
        version,
        packageName: packageMetadata.name,
        mcpName,
      })
    : {
        status: 'warn' as const,
        message: `MCP Registry proof could not be read: ${mcpResult.source.error ?? 'unknown error'}.`,
      };

  const channels = [
    npmChannel,
    channel('github-release', 'GitHub release', githubProof.status, githubProof.message, githubProof.url),
    channel('ghcr', 'GHCR', ghcr.status, ghcr.message),
    channel('mcp-registry', 'MCP Registry', mcp.status, mcp.message),
  ];
  const status = overallStatus(channels, options.strict ?? false, gitTagFound);
  const withoutMarkdown = {
    overallStatus: status,
    package: {
      name: packageMetadata.name,
      version,
    },
    git: {
      tag: gitTag,
      tagExists: gitTagFound,
      commit,
    },
    channels,
    sources: {
      npm: npmStatus.source,
      githubRelease: githubResult.source,
      ghcr: ghcrResult.source,
      mcpRegistry: mcpResult.source,
    },
    nextAction: chooseNextAction({ gitTagExists: gitTagFound, channels, status }),
    safety: {
      does: [
        'reads local package metadata',
        'checks local git tag state',
        'queries public release metadata when captured JSON is not provided',
        'requests an anonymous GHCR bearer token when public tag listing requires it',
        'reads only explicit captured JSON files when fixture flags are provided',
      ],
      doesNot: [
        'publish packages',
        'create tags',
        'create GitHub releases',
        'read npm tokens',
        'read GitHub tokens',
        'read .env files',
        'upload files',
        'post comments',
        'change package metadata',
      ],
    },
  };

  return {
    ...withoutMarkdown,
    markdown: renderMarkdown(withoutMarkdown),
  };
}
