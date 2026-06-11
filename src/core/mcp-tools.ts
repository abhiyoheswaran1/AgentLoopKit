import path from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import { loadAgentLoopConfig } from './config.js';
import { latestMarkdownFile, prSummaryPattern, verificationReportPattern } from './artifacts.js';
import { AgentLoopError } from './errors.js';
import { pathExists, resolvesInsidePath } from './file-system.js';
import { getAgentLoopStatus } from './status.js';
import { getActiveTask, listTasks, readTaskContract } from './task-state.js';
import { listPolicies, readPolicy } from './policy.js';

export type McpToolDefinition = {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties: boolean;
  };
};

export type McpToolResult = {
  payload: Record<string, unknown>;
  content: Array<{
    type: 'text';
    text: string;
  }>;
};

type CallMcpToolOptions = {
  cwd: string;
  name: string;
  arguments?: Record<string, unknown>;
};

type HandoffSummary = {
  path: string;
  title: string;
  modifiedAt: string;
};

const emptyInputSchema = {
  type: 'object' as const,
  properties: {},
  additionalProperties: false,
};

const tools: McpToolDefinition[] = [
  {
    name: 'agentloop_status',
    description: 'Read AgentLoopKit status, active task, latest verification, git state, and next action.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_next',
    description: 'Read only the next recommended AgentLoopKit action and reason.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_list_tasks',
    description: 'List local task contracts under the configured AgentLoopKit task directory.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_show_active_task',
    description: 'Read the active task contract content when one is pinned.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_list_policies',
    description: 'List local AgentLoopKit safety policy files.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_read_policy',
    description: 'Read one local AgentLoopKit policy by policy name.',
    inputSchema: {
      type: 'object',
      properties: {
        policyName: {
          type: 'string',
          description: 'Policy name, for example "security" or "security-policy.md".',
        },
      },
      required: ['policyName'],
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_latest_verification_report',
    description: 'Read the latest local verification report metadata and Markdown content.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_list_handoffs',
    description: 'List recent local reviewer handoff summaries.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          minimum: 1,
          maximum: 50,
          description: 'Maximum handoff summaries to return. Defaults to 20.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_latest_handoff',
    description: 'Read the latest local reviewer handoff summary Markdown content.',
    inputSchema: emptyInputSchema,
  },
];

export function listMcpTools() {
  return [...tools];
}

function textResult(payload: Record<string, unknown>): McpToolResult {
  return {
    payload,
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function toStoredPath(cwd: string, absolutePath: string) {
  return path.relative(cwd, absolutePath).split(path.sep).join('/');
}

async function readMarkdownArtifact(cwd: string, filePath: string | undefined, key: string) {
  if (!filePath) return { [key]: null };
  const content = await readFile(filePath, 'utf8');
  const fileStat = await stat(filePath);
  return {
    [key]: {
      path: toStoredPath(cwd, filePath),
      title: extractHeading(content, path.basename(filePath, '.md')),
      modifiedAt: fileStat.mtime.toISOString(),
      content,
    },
  };
}

async function listHandoffs(cwd: string, handoffsDir: string, limit: number) {
  if (!resolvesInsidePath(cwd, handoffsDir)) return [];
  if (!(await pathExists(handoffsDir))) return [];
  const entries = await readdir(handoffsDir, { withFileTypes: true });
  const handoffs = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && prSummaryPattern.test(entry.name))
      .map(async (entry): Promise<HandoffWithSort> => {
        const filePath = path.join(handoffsDir, entry.name);
        const [content, fileStat] = await Promise.all([readFile(filePath, 'utf8'), stat(filePath)]);
        return {
          path: toStoredPath(cwd, filePath),
          title: extractHeading(content, path.basename(filePath, '.md')),
          modifiedAt: fileStat.mtime.toISOString(),
          modifiedMs: fileStat.mtimeMs,
        };
      }),
  );

  return handoffs
    .sort((left, right) => {
      if (left.modifiedMs !== right.modifiedMs) return right.modifiedMs - left.modifiedMs;
      return left.path.localeCompare(right.path);
    })
    .slice(0, limit)
    .map((handoff) => ({
      path: handoff.path,
      title: handoff.title,
      modifiedAt: handoff.modifiedAt,
    }));
}

type HandoffWithSort = HandoffSummary & {
  modifiedMs: number;
};

function readStringArgument(args: Record<string, unknown> | undefined, key: string) {
  const value = args?.[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new AgentLoopError(`MCP tool argument "${key}" must be a non-empty string.`);
  }
  return value;
}

function readLimitArgument(args: Record<string, unknown> | undefined) {
  const value = args?.limit;
  if (value === undefined) return 20;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 50) {
    throw new AgentLoopError('MCP tool argument "limit" must be an integer from 1 to 50.');
  }
  return value;
}

export async function callMcpTool(options: CallMcpToolOptions): Promise<McpToolResult> {
  const config = await loadAgentLoopConfig(options.cwd);

  switch (options.name) {
    case 'agentloop_status': {
      const status = await getAgentLoopStatus({ cwd: options.cwd, config });
      return textResult(status as unknown as Record<string, unknown>);
    }
    case 'agentloop_next': {
      const status = await getAgentLoopStatus({ cwd: options.cwd, config });
      return textResult(status.nextAction);
    }
    case 'agentloop_list_tasks': {
      return textResult({ tasks: await listTasks({ cwd: options.cwd, config }) });
    }
    case 'agentloop_show_active_task': {
      const activeTask = await getActiveTask({ cwd: options.cwd, config });
      if (!activeTask) return textResult({ task: null });
      const task = await readTaskContract({ cwd: options.cwd, config, taskPath: activeTask.path });
      return textResult({ task });
    }
    case 'agentloop_list_policies': {
      return textResult({ policies: await listPolicies({ cwd: options.cwd, config }) });
    }
    case 'agentloop_read_policy': {
      const policyName = readStringArgument(options.arguments, 'policyName');
      return textResult({
        policy: await readPolicy({ cwd: options.cwd, config, policyName }),
      });
    }
    case 'agentloop_latest_verification_report': {
      const reportPath = await latestMarkdownFile(
        path.join(options.cwd, config.paths.reportsDir),
        {
          pattern: verificationReportPattern,
          rootDir: options.cwd,
        },
      );
      return textResult(await readMarkdownArtifact(options.cwd, reportPath, 'report'));
    }
    case 'agentloop_list_handoffs': {
      const limit = readLimitArgument(options.arguments);
      return textResult({
        handoffs: await listHandoffs(
          options.cwd,
          path.join(options.cwd, config.paths.handoffsDir),
          limit,
        ),
      });
    }
    case 'agentloop_latest_handoff': {
      const handoffPath = await latestMarkdownFile(
        path.join(options.cwd, config.paths.handoffsDir),
        {
          pattern: prSummaryPattern,
          rootDir: options.cwd,
        },
      );
      return textResult(await readMarkdownArtifact(options.cwd, handoffPath, 'handoff'));
    }
    default:
      throw new AgentLoopError(`Unknown MCP tool: ${options.name}`);
  }
}
