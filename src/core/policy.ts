import path from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import type { AgentLoopConfig } from './config.js';
import { AgentLoopError } from './errors.js';

export type ListedPolicy = {
  name: string;
  title: string;
  path: string;
};

export type PolicyDocument = ListedPolicy & {
  content: string;
};

function policyRoot(cwd: string, config: AgentLoopConfig) {
  return path.resolve(cwd, config.paths.agentloopDir, 'policies');
}

function toStoredPath(cwd: string, absolutePath: string) {
  return path.relative(cwd, absolutePath).split(path.sep).join('/');
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function normalizePolicyName(policyName: string) {
  return policyName
    .trim()
    .replace(/\.md$/i, '')
    .replace(/-policy$/i, '')
    .toLowerCase();
}

async function ensurePolicyRoot(root: string) {
  const rootStat = await stat(root).catch(() => undefined);
  if (!rootStat?.isDirectory()) {
    throw new AgentLoopError(
      'No AgentLoopKit policy files found. Run `agentloop init` to generate .agentloop/policies/.',
    );
  }
}

export async function listPolicies(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ListedPolicy[]> {
  const root = policyRoot(options.cwd, options.config);
  await ensurePolicyRoot(root);
  const entries = await readdir(root, { withFileTypes: true });
  const policies: ListedPolicy[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const absolutePath = path.join(root, entry.name);
    const content = await readFile(absolutePath, 'utf8');
    policies.push({
      name: path.basename(entry.name, '.md'),
      title: extractHeading(content, path.basename(entry.name, '.md')),
      path: toStoredPath(options.cwd, absolutePath),
    });
  }

  return policies.sort((left, right) => left.name.localeCompare(right.name));
}

export async function readPolicy(options: {
  cwd: string;
  config: AgentLoopConfig;
  policyName: string;
}): Promise<PolicyDocument> {
  const policies = await listPolicies(options);
  const requested = normalizePolicyName(options.policyName);
  const policy = policies.find((candidate) => normalizePolicyName(candidate.name) === requested);

  if (!policy) {
    throw new AgentLoopError(`Policy not found: ${options.policyName}`);
  }

  const root = policyRoot(options.cwd, options.config);
  const absolutePath = path.join(root, path.basename(policy.path));
  const content = await readFile(absolutePath, 'utf8');

  return {
    ...policy,
    content,
  };
}
