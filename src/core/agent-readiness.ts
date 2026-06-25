import path from 'node:path';
import { lstat } from 'node:fs/promises';
import { AGENTLOOP_DIR, AGENTLOOP_FILE, AGENTS_FILE, SUPPORTED_AGENTS } from './constants.js';
import { readTextIfExists } from './file-system.js';
import { inlineCode } from './markdown-format.js';

export type DoctorAgentReadinessStatus = 'ready' | 'needs-update' | 'missing' | 'documented';

export type DoctorAgentReadinessItem = {
  id: string;
  label: string;
  status: DoctorAgentReadinessStatus;
  required: boolean;
  source: string;
  message: string;
};

export type DoctorAgentReadiness = {
  status: 'pass' | 'warn';
  required: {
    doctorPreflight: boolean;
    startPreflight: boolean;
    contextHandles: boolean;
    broadReadAvoidance: boolean;
    mcpGuidance: boolean;
  };
  matrix: DoctorAgentReadinessItem[];
};

type RequiredReadinessKey = keyof DoctorAgentReadiness['required'];

type RequiredReadinessDefinition = {
  id: string;
  label: string;
  key: RequiredReadinessKey;
  readyMessage: string;
  missingMessage: string;
};

type ReadinessFile = {
  exists: boolean;
  content: string;
};

const MAX_READINESS_FILE_BYTES = 256 * 1024;

const BROAD_READ_AVOIDANCE_PHRASES = [
  'avoid broad',
  'avoids broad',
  'do not broad',
  'do-not-broad',
  'without broad',
  'instead of broad',
  'not to broad',
  'not broad-scan',
  'compact context is enough',
];

const READINESS_HARNESS_FILES = [
  AGENTS_FILE,
  AGENTLOOP_FILE,
  path.posix.join(AGENTLOOP_DIR, 'harness', 'commands.md'),
  path.posix.join(AGENTLOOP_DIR, 'README.md'),
] as const;

const READINESS_AGENT_LABELS: Record<(typeof SUPPORTED_AGENTS)[number], string> = {
  codex: 'Codex guidance',
  'claude-code': 'Claude Code guidance',
  cursor: 'Cursor guidance',
  opencode: 'OpenCode guidance',
  'gemini-cli': 'Gemini CLI guidance',
  'github-copilot-cli': 'GitHub Copilot CLI guidance',
  generic: 'Generic agent guidance',
};

const REQUIRED_READINESS_DEFINITIONS: RequiredReadinessDefinition[] = [
  {
    id: 'doctor-preflight',
    label: 'Doctor readiness check',
    key: 'doctorPreflight',
    readyMessage: 'Generated guidance tells agents to check Doctor before Start.',
    missingMessage: 'Generated guidance should mention agentloop doctor --redact-paths before Start.',
  },
  {
    id: 'start-preflight',
    label: 'Start preflight guidance',
    key: 'startPreflight',
    readyMessage: 'Generated guidance tells agents to run Start before code work.',
    missingMessage: 'Generated guidance should mention agentloop start before broad repo reads.',
  },
  {
    id: 'context-handles',
    label: 'Context handle inventory and expansion',
    key: 'contextHandles',
    readyMessage:
      'Generated guidance tells agents to list context handles and expand source truth only when needed.',
    missingMessage:
      'Generated guidance should mention agentloop context handles and agentloop context show <handle>.',
  },
  {
    id: 'broad-read-avoidance',
    label: 'Broad-read avoidance',
    key: 'broadReadAvoidance',
    readyMessage:
      'Generated guidance tells agents to avoid broad reads when compact context is enough.',
    missingMessage: 'Generated guidance should tell agents not to broad-scan before Start.',
  },
  {
    id: 'mcp',
    label: 'MCP guidance',
    key: 'mcpGuidance',
    readyMessage: 'Generated guidance explains how MCP-capable agents can use agentloop_start.',
    missingMessage: 'Generated guidance should mention agentloop mcp-server and agentloop_start.',
  },
];

function repoRelativePath(cwd: string, relativePath: string) {
  return path.join(cwd, ...relativePath.split('/'));
}

async function readReadinessFile(cwd: string, relativePath: string): Promise<ReadinessFile> {
  const filePath = repoRelativePath(cwd, relativePath);
  try {
    const metadata = await lstat(filePath);
    if (!metadata.isFile() || metadata.size > MAX_READINESS_FILE_BYTES) {
      return { exists: false, content: '' };
    }
    return { exists: true, content: (await readTextIfExists(filePath)) ?? '' };
  } catch {
    return { exists: false, content: '' };
  }
}

function includesNeedle(content: string, needle: string) {
  return content.toLowerCase().includes(needle.toLowerCase());
}

function hasDoctorPreflight(content: string) {
  return includesNeedle(content, 'agentloop doctor');
}

function hasStartPreflight(content: string) {
  return includesNeedle(content, 'agentloop start');
}

function hasContextHandles(content: string) {
  return (
    includesNeedle(content, 'agentloop context handles') &&
    includesNeedle(content, 'agentloop context show')
  );
}

function hasBroadReadAvoidance(content: string) {
  const normalized = content.toLowerCase();
  return BROAD_READ_AVOIDANCE_PHRASES.some((phrase) => normalized.includes(phrase));
}

function hasMcpGuidance(content: string) {
  const mentionsServer =
    includesNeedle(content, 'agentloop mcp-server') ||
    includesNeedle(content, 'agentloopkit@latest mcp-server') ||
    includesNeedle(content, 'mcp-server');
  return mentionsServer && includesNeedle(content, 'agentloop_start');
}

function hasAgentStartGuidance(content: string) {
  return hasStartPreflight(content) && hasContextHandles(content) && hasBroadReadAvoidance(content);
}

async function readHarnessReadinessContent(cwd: string) {
  const files = await Promise.all(
    READINESS_HARNESS_FILES.map((file) => readReadinessFile(cwd, file)),
  );
  return files.map((file) => file.content).join('\n');
}

function buildRequiredReadiness(
  harnessContent: string,
): DoctorAgentReadiness['required'] {
  return {
    doctorPreflight: hasDoctorPreflight(harnessContent),
    startPreflight: hasStartPreflight(harnessContent),
    contextHandles: hasContextHandles(harnessContent),
    broadReadAvoidance: hasBroadReadAvoidance(harnessContent),
    mcpGuidance: hasMcpGuidance(harnessContent),
  };
}

function readinessMessage(isReady: boolean, readyMessage: string, missingMessage: string) {
  return isReady ? readyMessage : missingMessage;
}

function buildRequiredReadinessItems(
  required: DoctorAgentReadiness['required'],
): DoctorAgentReadinessItem[] {
  const harnessSource = READINESS_HARNESS_FILES.join(', ');
  return REQUIRED_READINESS_DEFINITIONS.map((definition) => {
    const isReady = required[definition.key];
    return {
      id: definition.id,
      label: definition.label,
      status: isReady ? 'documented' : 'missing',
      required: true,
      source: harnessSource,
      message: readinessMessage(isReady, definition.readyMessage, definition.missingMessage),
    };
  });
}

function agentReadinessStatus(exists: boolean, ready: boolean): DoctorAgentReadinessStatus {
  if (ready) return 'ready';
  return exists ? 'needs-update' : 'missing';
}

function agentReadinessMessage(
  agent: (typeof SUPPORTED_AGENTS)[number],
  exists: boolean,
  ready: boolean,
) {
  if (ready) {
    return 'Agent-specific guidance tells this agent to run Start before broad reads, list source handles, and expand source truth only when needed.';
  }
  if (exists) {
    return 'Agent-specific guidance should mention agentloop start, agentloop context handles, agentloop context show, and broad-read avoidance.';
  }
  return `Run agentloop install-agent ${agent} when this repo needs that agent-specific guidance.`;
}

async function buildAgentReadinessItem(
  cwd: string,
  agent: (typeof SUPPORTED_AGENTS)[number],
): Promise<DoctorAgentReadinessItem> {
  const source = path.posix.join(AGENTLOOP_DIR, 'agents', `${agent}.md`);
  const file = await readReadinessFile(cwd, source);
  const ready = file.exists && hasAgentStartGuidance(file.content);
  return {
    id: agent,
    label: READINESS_AGENT_LABELS[agent],
    status: agentReadinessStatus(file.exists, ready),
    required: agent === 'codex',
    source,
    message: agentReadinessMessage(agent, file.exists, ready),
  };
}

function requiredRowsReady(matrix: DoctorAgentReadinessItem[]) {
  return matrix
    .filter((item) => item.required)
    .every((item) => item.status === 'ready' || item.status === 'documented');
}

function requiredSignalsReady(required: DoctorAgentReadiness['required']) {
  return Object.values(required).every(Boolean);
}

function installedAgentGuidanceReady(matrix: DoctorAgentReadinessItem[]) {
  return matrix.every((item) => item.status !== 'needs-update');
}

export async function buildAgentReadiness(cwd: string): Promise<DoctorAgentReadiness> {
  const required = buildRequiredReadiness(await readHarnessReadinessContent(cwd));
  const agentItems = await Promise.all(
    SUPPORTED_AGENTS.map((agent) => buildAgentReadinessItem(cwd, agent)),
  );
  const matrix = [...buildRequiredReadinessItems(required), ...agentItems];

  return {
    status:
      requiredRowsReady(matrix) &&
      requiredSignalsReady(required) &&
      installedAgentGuidanceReady(matrix)
        ? 'pass'
        : 'warn',
    required,
    matrix,
  };
}

function readinessInlineCode(value: string) {
  return inlineCode(value.replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
}

export function renderAgentReadiness(readiness: DoctorAgentReadiness) {
  return `## Agent Readiness Matrix

- Status: ${readinessInlineCode(readiness.status)}
${readiness.matrix
  .map(
    (item) =>
      `- [${readinessInlineCode(item.status)}] ${readinessInlineCode(
        item.label,
      )} (${readinessInlineCode(item.source)}): ${readinessInlineCode(item.message)}`,
  )
  .join('\n')}
`;
}
