import path from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import type { AgentLoopConfig } from './config.js';
import { AgentLoopError } from './errors.js';
import { getTemplateRoot } from './template-renderer.js';

export type ListedPolicy = {
  name: string;
  title: string;
  path: string;
};

export type PolicyDocument = ListedPolicy & {
  content: string;
};

export type PolicyStatusValue = 'current' | 'modified' | 'missing' | 'extra';

export type PolicyStatusEntry = ListedPolicy & {
  status: PolicyStatusValue;
  templatePath: string | null;
};

export type PolicyStatusSummary = Record<PolicyStatusValue, number>;

export type PolicyStatusReport = {
  policies: PolicyStatusEntry[];
  summary: PolicyStatusSummary;
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

function normalizeContent(content: string) {
  return content.replace(/\r\n/g, '\n');
}

async function ensurePolicyRoot(root: string) {
  const rootStat = await stat(root).catch(() => undefined);
  if (!rootStat?.isDirectory()) {
    throw new AgentLoopError(
      'No AgentLoopKit policy files found. Run `agentloop init` to generate .agentloop/policies/.',
    );
  }
}

async function readMarkdownFiles(root: string) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const absolutePath = path.join(root, entry.name);
    const content = await readFile(absolutePath, 'utf8');
    files.push({
      name: path.basename(entry.name, '.md'),
      fileName: entry.name,
      absolutePath,
      content,
      title: extractHeading(content, path.basename(entry.name, '.md')),
    });
  }

  return files.sort((left, right) => left.name.localeCompare(right.name));
}

export async function listPolicies(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ListedPolicy[]> {
  const root = policyRoot(options.cwd, options.config);
  await ensurePolicyRoot(root);
  const policies = await readMarkdownFiles(root);

  return policies.map((policy) => ({
    name: policy.name,
    title: policy.title,
    path: toStoredPath(options.cwd, policy.absolutePath),
  }));
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

export async function getPolicyStatus(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<PolicyStatusReport> {
  const root = policyRoot(options.cwd, options.config);
  await ensurePolicyRoot(root);

  const templateRoot = path.join(getTemplateRoot(), 'policies');
  const [localPolicies, templatePolicies] = await Promise.all([
    readMarkdownFiles(root),
    readMarkdownFiles(templateRoot),
  ]);

  const localByName = new Map(localPolicies.map((policy) => [policy.name, policy]));
  const templateByName = new Map(templatePolicies.map((policy) => [policy.name, policy]));
  const names = [...new Set([...templateByName.keys(), ...localByName.keys()])].sort((left, right) =>
    left.localeCompare(right),
  );
  const summary: PolicyStatusSummary = {
    current: 0,
    modified: 0,
    missing: 0,
    extra: 0,
  };
  const policies = names.map((name): PolicyStatusEntry => {
    const local = localByName.get(name);
    const template = templateByName.get(name);
    const status: PolicyStatusValue = !template
      ? 'extra'
      : !local
        ? 'missing'
        : normalizeContent(local.content) === normalizeContent(template.content)
          ? 'current'
          : 'modified';

    summary[status] += 1;

    return {
      name,
      title: local?.title ?? template?.title ?? name,
      path: toStoredPath(options.cwd, path.join(root, `${name}.md`)),
      status,
      templatePath: template ? `templates/policies/${template.fileName}` : null,
    };
  });

  return {
    policies,
    summary,
  };
}
