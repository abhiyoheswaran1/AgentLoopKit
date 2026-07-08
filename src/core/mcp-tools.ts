import path from 'node:path';
import { lstat, readdir } from 'node:fs/promises';
import { loadAgentLoopConfig } from './config.js';
import { toSafeDisplayPath } from './display-path.js';
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
import {
  buildContextBudgetContract,
  buildContextHandleInventory,
  buildContextPack,
  CONTEXT_PACK_GOALS,
  RESUME_PACK_TARGETS,
  showContextHandle,
  type ContextPackGoal,
  type ResumePackTarget,
} from './context-contract.js';
import {
  AGENT_START_GOALS,
  buildAgentStart,
  type AgentStartGoal,
} from './agent-start.js';
import { getReviewContext } from './review-context.js';
import { redactLocalRoots } from './redaction.js';
import { readSafeMarkdownFile, SAFE_MARKDOWN_MAX_BYTES } from './safe-markdown-file.js';
import {
  FILE_INTENT_DEFAULT_MATCH_LIMIT,
  FILE_INTENT_DEFAULT_SCAN_LIMIT,
  FILE_INTENT_MAX_MATCH_LIMIT,
  FILE_INTENT_MAX_SCAN_LIMIT,
  findFileIntentWithSearch,
  listRuns,
  normalizeFileIntentPath,
  readRun,
  toPublicChangedFiles,
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

const defaultMcpListLimit = 20;
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
        scanLimit: {
          type: 'number',
          minimum: 1,
          maximum: FILE_INTENT_MAX_SCAN_LIMIT,
          description: `Maximum newest run entries to inspect. Defaults to ${FILE_INTENT_DEFAULT_SCAN_LIMIT}.`,
        },
        matchLimit: {
          type: 'number',
          minimum: 1,
          maximum: FILE_INTENT_MAX_MATCH_LIMIT,
          description: `Maximum matching run entries to return. Defaults to ${FILE_INTENT_DEFAULT_MATCH_LIMIT}.`,
        },
      },
      required: ['file'],
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_maintainer_check',
    description: 'Read local maintainer reviewability checks for agent-assisted changes.',
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
      'Read one local reviewability snapshot for agents, without running commands or returning artifact bodies.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_start',
    description:
      'Read a compact software-agent start briefing with task, evidence, risk, context routing, and impact metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          enum: [...RESUME_PACK_TARGETS],
          description: 'Target reader. Defaults to generic.',
        },
        goal: {
          type: 'string',
          enum: [...AGENT_START_GOALS],
          description: 'Start briefing goal. Defaults to implement.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_context_budget',
    description:
      'Read local context pressure and compact-pack savings guidance without running commands.',
    inputSchema: {
      type: 'object',
      properties: {
        redactPaths: {
          type: 'boolean',
          description: 'Redact the local AgentLoop root from returned budget payloads.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_context_handles',
    description:
      'List local context source handles with availability, reasons, and expansion commands.',
    inputSchema: emptyInputSchema,
  },
  {
    name: 'agentloop_context_pack',
    description:
      'Read an auditable local context pack with receipts, context-budget estimates, and source handles.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          enum: [...RESUME_PACK_TARGETS],
          description: 'Target reader. Defaults to generic.',
        },
        goal: {
          type: 'string',
          enum: [...CONTEXT_PACK_GOALS],
          description: 'Context pack goal. Defaults to continue.',
        },
        redactPaths: {
          type: 'boolean',
          description: 'Redact the local AgentLoop root from returned context pack payloads.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'agentloop_context_show',
    description:
      'Expand one local context source handle, such as task:active or evidence-map:current.',
    inputSchema: {
      type: 'object',
      properties: {
        handle: {
          type: 'string',
          description: 'Source handle to expand.',
        },
        redactPaths: {
          type: 'boolean',
          description: 'Redact the local AgentLoop root from returned handle content.',
        },
      },
      required: ['handle'],
      additionalProperties: false,
    },
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

function redactedTextResult(payload: Record<string, unknown>, cwd: string, redactPaths: boolean) {
  if (!redactPaths) return textResult(payload);
  return textResult(JSON.parse(redactLocalRoots(JSON.stringify(payload), [cwd])) as Record<string, unknown>);
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function compareHandoffCandidates(left: HandoffCandidate, right: HandoffCandidate) {
  if (left.modifiedMs !== right.modifiedMs) return right.modifiedMs - left.modifiedMs;
  return left.path.localeCompare(right.path);
}

function appendHandoffCandidate(
  candidates: HandoffCandidate[],
  candidate: HandoffCandidate,
  limit: number,
) {
  candidates.push(candidate);
  candidates.sort(compareHandoffCandidates);
  if (candidates.length > limit) candidates.pop();
}

function toStoredPath(cwd: string, absolutePath: string) {
  return toSafeDisplayPath(cwd, absolutePath);
}

async function readMarkdownArtifact(cwd: string, filePath: string | undefined, key: string) {
  if (!filePath) return { [key]: null };
  const file = await readSafeMarkdownFile(filePath, {
    required: true,
    codePrefix: 'MCP_MARKDOWN',
  });
  if (!file) return { [key]: null };
  return {
    [key]: {
      path: toStoredPath(cwd, filePath),
      title: extractHeading(file.content, path.basename(filePath, '.md')),
      modifiedAt: file.modifiedAt,
      content: file.content,
    },
  };
}

async function listHandoffs(cwd: string, handoffsDir: string, limit: number) {
  if (!resolvesInsidePath(cwd, handoffsDir)) return [];
  if (!(await pathExists(handoffsDir))) return [];
  const entries = await readdir(handoffsDir, { withFileTypes: true });
  const candidates: HandoffCandidate[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !prSummaryPattern.test(entry.name)) continue;
    const filePath = path.join(handoffsDir, entry.name);
    const fileStat = await lstat(filePath).catch(() => undefined);
    if (
      !fileStat?.isFile() ||
      fileStat.isSymbolicLink() ||
      fileStat.size > SAFE_MARKDOWN_MAX_BYTES
    ) {
      continue;
    }
    appendHandoffCandidate(
      candidates,
      {
        filePath,
        path: toStoredPath(cwd, filePath),
        fallbackTitle: path.basename(filePath, '.md'),
        modifiedAt: fileStat.mtime.toISOString(),
        modifiedMs: fileStat.mtimeMs,
      },
      limit,
    );
  }

  return Promise.all(
    candidates
      .map(async (handoff): Promise<HandoffSummary | undefined> => {
        const file = await readSafeMarkdownFile(handoff.filePath);
        if (!file) return undefined;
        return {
          path: handoff.path,
          title: extractHeading(file.content, handoff.fallbackTitle),
          modifiedAt: file.modifiedAt,
        };
      }),
  ).then((handoffs) => handoffs.filter((handoff): handoff is HandoffSummary => Boolean(handoff)));
}

type HandoffCandidate = {
  filePath: string;
  path: string;
  fallbackTitle: string;
  modifiedAt: string;
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
  if (value === undefined) return defaultMcpListLimit;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 50) {
    throw new AgentLoopError('MCP tool argument "limit" must be an integer from 1 to 50.');
  }
  return value;
}

function readOptionalPositiveIntegerArgument(
  args: Record<string, unknown> | undefined,
  key: string,
  max: number,
) {
  const value = args?.[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > max) {
    throw new AgentLoopError(`MCP tool argument "${key}" must be an integer from 1 to ${max}.`);
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

function readContextTargetArgument(
  args: Record<string, unknown> | undefined,
): ResumePackTarget {
  const value = args?.target;
  if (value === undefined) return 'generic';
  if (typeof value !== 'string' || !(RESUME_PACK_TARGETS as readonly string[]).includes(value)) {
    throw new AgentLoopError(
      `MCP tool argument "target" must be one of: ${RESUME_PACK_TARGETS.join(', ')}.`,
    );
  }
  return value as ResumePackTarget;
}

function readContextGoalArgument(args: Record<string, unknown> | undefined): ContextPackGoal {
  const value = args?.goal;
  if (value === undefined) return 'continue';
  if (typeof value !== 'string' || !(CONTEXT_PACK_GOALS as readonly string[]).includes(value)) {
    throw new AgentLoopError(
      `MCP tool argument "goal" must be one of: ${CONTEXT_PACK_GOALS.join(', ')}.`,
    );
  }
  return value as ContextPackGoal;
}

function readStartGoalArgument(args: Record<string, unknown> | undefined): AgentStartGoal {
  const value = args?.goal;
  if (value === undefined) return 'implement';
  if (typeof value !== 'string' || !(AGENT_START_GOALS as readonly string[]).includes(value)) {
    throw new AgentLoopError(
      `MCP tool argument "goal" must be one of: ${AGENT_START_GOALS.join(', ')}.`,
    );
  }
  return value as AgentStartGoal;
}

export async function callMcpTool(options: CallMcpToolOptions): Promise<McpToolResult> {
  const config = await loadAgentLoopConfig(options.cwd);

  switch (options.name) {
    case 'agentloop_status': {
      const status = await getAgentLoopStatus({ cwd: options.cwd, config, redactPaths: true });
      return textResult(status as unknown as Record<string, unknown>);
    }
    case 'agentloop_next': {
      const status = await getAgentLoopStatus({ cwd: options.cwd, config });
      return textResult({ nextAction: status.nextAction });
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
        runs: await listRuns(options.cwd, { limit }),
      });
    }
    case 'agentloop_show_run': {
      const id = readStringArgument(options.arguments, 'id');
      const run = await readRun(options.cwd, id);
      // Strip the internal content-addressing `hash` before this run record
      // reaches the MCP tool's user-facing JSON result.
      return textResult({ run: { ...run, changedFiles: toPublicChangedFiles(run.changedFiles) } });
    }
    case 'agentloop_file_intent': {
      const file = normalizeFileIntentPath(
        options.cwd,
        readStringArgument(options.arguments, 'file'),
      );
      return textResult(
        await findFileIntentWithSearch(options.cwd, file, {
          scanLimit: readOptionalPositiveIntegerArgument(
            options.arguments,
            'scanLimit',
            FILE_INTENT_MAX_SCAN_LIMIT,
          ),
          matchLimit: readOptionalPositiveIntegerArgument(
            options.arguments,
            'matchLimit',
            FILE_INTENT_MAX_MATCH_LIMIT,
          ),
        }),
      );
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
      const inventory = await getArtifactInventory({
        cwd: options.cwd,
        config,
        ...(latest ? { runLimit: 1 } : {}),
      });
      return textResult(renderArtifactInventoryJson(inventory, { type, latest }));
    }
    case 'agentloop_review_context': {
      return textResult(await getReviewContext({ cwd: options.cwd, config }));
    }
    case 'agentloop_start': {
      const target = readContextTargetArgument(options.arguments);
      const goal = readStartGoalArgument(options.arguments);
      return textResult({
        start: await buildAgentStart({ cwd: options.cwd, config, target, goal }),
      });
    }
    case 'agentloop_context_budget': {
      const redactPaths = readBooleanArgument(options.arguments, 'redactPaths', false);
      const contextBudget = await buildContextBudgetContract({ cwd: options.cwd, config });
      return redactedTextResult({
        evidenceMap: contextBudget.evidenceMap,
        contextBudget: contextBudget.contextBudget,
        markdown: contextBudget.markdown,
        safety: contextBudget.safety,
      }, options.cwd, redactPaths);
    }
    case 'agentloop_context_handles': {
      return textResult({
        contextHandles: await buildContextHandleInventory({ cwd: options.cwd, config }),
      });
    }
    case 'agentloop_context_pack': {
      const target = readContextTargetArgument(options.arguments);
      const goal = readContextGoalArgument(options.arguments);
      const redactPaths = readBooleanArgument(options.arguments, 'redactPaths', false);
      return redactedTextResult({
        contextPack: await buildContextPack({ cwd: options.cwd, config, target, goal }),
      }, options.cwd, redactPaths);
    }
    case 'agentloop_context_show': {
      const handle = readStringArgument(options.arguments, 'handle');
      const redactPaths = readBooleanArgument(options.arguments, 'redactPaths', false);
      return textResult({
        contextHandle: await showContextHandle({
          cwd: options.cwd,
          config,
          handle,
          redactPaths,
        }),
      });
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
