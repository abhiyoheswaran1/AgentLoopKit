import path from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import { loadAgentLoopConfig } from './config.js';
import {
  latestMarkdownFile,
  prSummaryPattern,
  shipReportPattern,
  verificationReportPattern,
  artifactInventoryTypes,
  getArtifactInventory,
  isArtifactInventoryType,
  renderArtifactInventoryJson,
  type ArtifactInventoryFilterType,
} from './artifacts.js';
import { AgentLoopError } from './errors.js';
import { pathExists, resolvesInsidePath } from './file-system.js';
import { getAgentLoopStatus } from './status.js';
import { getActiveTask, listTasks, readTaskContract } from './task-state.js';
import { getPolicyStatus, listPolicies, readPolicy } from './policy.js';
import { runMaintainerCheck } from './maintainer-check.js';
import { checkGates } from './check-gates.js';
import { getReviewContext } from './review-context.js';
import {
  findFileIntent,
  listRuns,
  readRun,
  type IntentMatch,
  type RunRecord,
  type RunSummary,
} from './runs.js';

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
    description:
      'Read AgentLoopKit status, active task, latest verification, git state, and next action.',
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
    name: 'agentloop_policy_status',
    description:
      'Read local AgentLoopKit policy template status, including current, modified, missing, and extra policies.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_latest_verification_report',
    description: 'Read the latest local verification report metadata and Markdown content.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_latest_ship_report',
    description: 'Read the latest local ship report metadata and Markdown content.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_list_runs',
    description: 'List recent local AgentLoopKit run ledger entries.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          minimum: 1,
          maximum: 50,
          description: 'Maximum run entries to return. Defaults to 20.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_show_run',
    description: 'Read one local AgentLoopKit run ledger entry by run id.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Run id, for example "2026-06-10-12-32-ship".',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_file_intent',
    description: 'Read local run ledger matches for one repo-relative file path.',
    inputSchema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          description: 'Repo-relative file path, for example "src/auth/callback.ts".',
        },
      },
      required: ['file'],
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_maintainer_check',
    description: 'Read local maintainer reviewability checks for AI-assisted changes.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_check_gates',
    description:
      'Read local review gate status for task, verification, handoff, harness, policy, and git evidence.',
    inputSchema: {
      type: 'object',
      properties: {
        strict: {
          type: 'boolean',
          description: 'Treat warning gates as failures. Defaults to false.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_artifacts',
    description: 'Read local AgentLoopKit artifact inventory metadata without artifact contents.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [...artifactInventoryTypes],
          description: 'Optional artifact type filter.',
        },
        latest: {
          type: 'boolean',
          description: 'Return only latest matching artifacts. Defaults to false.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_review_context',
    description:
      'Read one local reviewability snapshot for coding agents, without running commands or returning artifact bodies.',
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
  const repoPath = path.isAbsolute(absolutePath) ? path.relative(cwd, absolutePath) : absolutePath;
  return repoPath.split(path.sep).join('/');
}

function toMcpRunSummary(cwd: string, run: RunSummary) {
  return {
    ...run,
    task: run.task ? { ...run.task, path: toStoredPath(cwd, run.task.path) } : run.task,
    ...(run.verificationReportPath
      ? { verificationReportPath: toStoredPath(cwd, run.verificationReportPath) }
      : {}),
    ...(run.shipReportPath ? { shipReportPath: toStoredPath(cwd, run.shipReportPath) } : {}),
    ...(run.handoffPath ? { handoffPath: toStoredPath(cwd, run.handoffPath) } : {}),
  };
}

function toMcpRunRecord(cwd: string, run: RunRecord) {
  return {
    ...run,
    metadata: {
      ...run.metadata,
      task: run.metadata.task
        ? { ...run.metadata.task, path: toStoredPath(cwd, run.metadata.task.path) }
        : run.metadata.task,
      ...(run.metadata.verificationReportPath
        ? { verificationReportPath: toStoredPath(cwd, run.metadata.verificationReportPath) }
        : {}),
      ...(run.metadata.shipReportPath
        ? { shipReportPath: toStoredPath(cwd, run.metadata.shipReportPath) }
        : {}),
      ...(run.metadata.handoffPath
        ? { handoffPath: toStoredPath(cwd, run.metadata.handoffPath) }
        : {}),
    },
  };
}

function toMcpIntentMatch(cwd: string, match: IntentMatch) {
  return {
    ...toMcpRunSummary(cwd, match),
    file: match.file,
    why: match.why,
  };
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

function readBooleanArgument(
  args: Record<string, unknown> | undefined,
  key: string,
  defaultValue: boolean,
) {
  const value = args?.[key];
  if (value === undefined) return defaultValue;
  if (typeof value !== 'boolean') {
    throw new AgentLoopError(`MCP tool argument "${key}" must be a boolean.`);
  }
  return value;
}

function readArtifactTypeArgument(
  args: Record<string, unknown> | undefined,
): ArtifactInventoryFilterType | undefined {
  const value = args?.type;
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !isArtifactInventoryType(value)) {
    throw new AgentLoopError(
      `MCP tool argument "type" must be one of: ${artifactInventoryTypes.join(', ')}.`,
    );
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
    case 'agentloop_policy_status': {
      return textResult(await getPolicyStatus({ cwd: options.cwd, config }));
    }
    case 'agentloop_latest_verification_report': {
      const reportPath = await latestMarkdownFile(path.join(options.cwd, config.paths.reportsDir), {
        pattern: verificationReportPattern,
        rootDir: options.cwd,
      });
      return textResult(await readMarkdownArtifact(options.cwd, reportPath, 'report'));
    }
    case 'agentloop_latest_ship_report': {
      const shipReportPath = await latestMarkdownFile(
        path.join(options.cwd, config.paths.reportsDir),
        {
          pattern: shipReportPattern,
          rootDir: options.cwd,
        },
      );
      return textResult(await readMarkdownArtifact(options.cwd, shipReportPath, 'shipReport'));
    }
    case 'agentloop_list_runs': {
      const limit = readLimitArgument(options.arguments);
      return textResult({
        runs: (await listRuns(options.cwd))
          .slice(0, limit)
          .map((run) => toMcpRunSummary(options.cwd, run)),
      });
    }
    case 'agentloop_show_run': {
      const id = readStringArgument(options.arguments, 'id');
      return textResult({ run: toMcpRunRecord(options.cwd, await readRun(options.cwd, id)) });
    }
    case 'agentloop_file_intent': {
      const file = readStringArgument(options.arguments, 'file').replace(/\\/g, '/');
      return textResult({
        file,
        runs: (await findFileIntent(options.cwd, file)).map((match) =>
          toMcpIntentMatch(options.cwd, match),
        ),
      });
    }
    case 'agentloop_maintainer_check': {
      return textResult(await runMaintainerCheck({ cwd: options.cwd, config }));
    }
    case 'agentloop_check_gates': {
      const strict = readBooleanArgument(options.arguments, 'strict', false);
      return textResult(await checkGates({ cwd: options.cwd, config, strict }));
    }
    case 'agentloop_artifacts': {
      const type = readArtifactTypeArgument(options.arguments);
      const latest = readBooleanArgument(options.arguments, 'latest', false);
      const inventory = await getArtifactInventory({ cwd: options.cwd, config });
      return textResult(renderArtifactInventoryJson(inventory, { type, latest }));
    }
    case 'agentloop_review_context': {
      return textResult(await getReviewContext({ cwd: options.cwd, config }));
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
