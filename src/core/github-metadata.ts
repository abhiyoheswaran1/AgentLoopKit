import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { AgentLoopConfig } from './config.js';
import { AgentLoopError } from './errors.js';
import { resolvesInsidePath, writeTextFile } from './file-system.js';

export type NormalizedGithubItem = {
  number: number | null;
  title: string;
  state: string;
  url: string;
  author: string;
  labels: string[];
  bodyExcerpt: string;
};

export type NormalizedGithubPullRequest = NormalizedGithubItem & {
  isDraft: boolean;
  baseRefName: string;
  headRefName: string;
  changedFiles: number | null;
  additions: number | null;
  deletions: number | null;
};

export type GithubMetadataImportResult = {
  status: 'pass';
  dryRun: boolean;
  writesFiles: boolean;
  outputPath: string;
  issue?: NormalizedGithubItem;
  pullRequest?: NormalizedGithubPullRequest;
  safety: {
    readsOnlyExplicitJson: true;
    callsGithubApi: false;
    readsTokens: false;
    readsEnvFiles: false;
  };
};

type JsonRecord = Record<string, unknown>;

function toStoredPath(cwd: string, absolutePath: string) {
  return path.relative(cwd, absolutePath).split(path.sep).join('/');
}

function isEnvFilePath(filePath: string) {
  const basename = path.basename(filePath.replace(/\\/g, '/')).toLowerCase();
  return basename === '.env' || basename.startsWith('.env.');
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function booleanValue(value: unknown) {
  return typeof value === 'boolean' ? value : false;
}

function authorLogin(value: unknown) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'login' in value) {
    return stringValue((value as { login?: unknown }).login);
  }
  return '';
}

function labels(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((label) => {
      if (typeof label === 'string') return label;
      if (label && typeof label === 'object' && 'name' in label) {
        return stringValue((label as { name?: unknown }).name);
      }
      return '';
    })
    .filter(Boolean);
}

function bodyExcerpt(value: unknown) {
  const body = stringValue(value).replace(/\r\n/g, '\n').trim();
  return body.length <= 500 ? body : `${body.slice(0, 500).trimEnd()}\n[truncated]`;
}

function normalizeGithubItem(raw: JsonRecord): NormalizedGithubItem {
  return {
    number: numberValue(raw.number),
    title: stringValue(raw.title),
    state: stringValue(raw.state),
    url: stringValue(raw.url),
    author: authorLogin(raw.author),
    labels: labels(raw.labels),
    bodyExcerpt: bodyExcerpt(raw.body),
  };
}

function normalizeGithubPullRequest(raw: JsonRecord): NormalizedGithubPullRequest {
  return {
    ...normalizeGithubItem(raw),
    isDraft: booleanValue(raw.isDraft),
    baseRefName: stringValue(raw.baseRefName),
    headRefName: stringValue(raw.headRefName),
    changedFiles: numberValue(raw.changedFiles),
    additions: numberValue(raw.additions),
    deletions: numberValue(raw.deletions),
  };
}

async function readExplicitJson(options: { cwd: string; requestedPath: string }) {
  if (isEnvFilePath(options.requestedPath)) {
    throw new AgentLoopError(
      `GitHub metadata import refuses env files: ${options.requestedPath}`,
      'GITHUB_METADATA_ENV_FILE',
    );
  }
  const absolutePath = path.resolve(options.cwd, options.requestedPath);
  if (!resolvesInsidePath(options.cwd, absolutePath)) {
    throw new AgentLoopError(
      `GitHub metadata JSON path must stay inside the repository: ${options.requestedPath}`,
      'GITHUB_METADATA_OUTSIDE_REPO',
    );
  }
  const parsed = JSON.parse(await readFile(absolutePath, 'utf8')) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new AgentLoopError(
      `GitHub metadata JSON must be an object: ${options.requestedPath}`,
      'GITHUB_METADATA_INVALID_JSON',
    );
  }
  return parsed as JsonRecord;
}

export async function importGithubMetadata(options: {
  cwd: string;
  config: AgentLoopConfig;
  issueJsonPath?: string;
  prJsonPath?: string;
  outputPath?: string;
  dryRun?: boolean;
}): Promise<GithubMetadataImportResult> {
  if (!options.issueJsonPath && !options.prJsonPath) {
    throw new AgentLoopError(
      'Provide --issue-json, --pr-json, or both for GitHub metadata import.',
      'GITHUB_METADATA_INPUT_MISSING',
    );
  }

  const outputPath =
    options.outputPath ?? `${options.config.paths.agentloopDir}/github/context.json`;
  if (isEnvFilePath(outputPath)) {
    throw new AgentLoopError(
      `GitHub metadata import refuses env files: ${outputPath}`,
      'GITHUB_METADATA_ENV_FILE',
    );
  }
  const absoluteOutputPath = path.resolve(options.cwd, outputPath);
  const metadataRoot = path.resolve(options.cwd, options.config.paths.agentloopDir, 'github');
  if (!resolvesInsidePath(options.cwd, metadataRoot)) {
    throw new AgentLoopError(
      'GitHub metadata root must stay inside the repository.',
      'GITHUB_METADATA_OUTPUT_OUTSIDE_REPO',
    );
  }
  if (!resolvesInsidePath(options.cwd, absoluteOutputPath)) {
    throw new AgentLoopError(
      `GitHub metadata output path must stay inside the repository: ${outputPath}`,
      'GITHUB_METADATA_OUTPUT_OUTSIDE_REPO',
    );
  }
  if (!resolvesInsidePath(metadataRoot, absoluteOutputPath)) {
    throw new AgentLoopError(
      `GitHub metadata output path must stay under ${options.config.paths.agentloopDir}/github: ${outputPath}`,
      'GITHUB_METADATA_OUTPUT_OUTSIDE_AGENTLOOP',
    );
  }

  const issue = options.issueJsonPath
    ? normalizeGithubItem(
        await readExplicitJson({ cwd: options.cwd, requestedPath: options.issueJsonPath }),
      )
    : undefined;
  const pullRequest = options.prJsonPath
    ? normalizeGithubPullRequest(
        await readExplicitJson({ cwd: options.cwd, requestedPath: options.prJsonPath }),
      )
    : undefined;

  const result: GithubMetadataImportResult = {
    status: 'pass',
    dryRun: options.dryRun === true,
    writesFiles: options.dryRun === true ? false : true,
    outputPath: toStoredPath(options.cwd, absoluteOutputPath),
    ...(issue ? { issue } : {}),
    ...(pullRequest ? { pullRequest } : {}),
    safety: {
      readsOnlyExplicitJson: true,
      callsGithubApi: false,
      readsTokens: false,
      readsEnvFiles: false,
    },
  };

  if (!options.dryRun) {
    await writeTextFile(absoluteOutputPath, `${JSON.stringify(result, null, 2)}\n`);
  }

  return result;
}
