import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { AgentLoopConfig } from './config.js';
import { buildContextBudget } from './context-budget.js';
import { getCurrentWorkTaskPath } from './evidence.js';
import {
  buildEvidenceMap,
  compactEvidenceMap,
  type CompactEvidenceMap,
  type EvidenceMap,
} from './evidence-map.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import { findPlaceholderTaskSections } from './task-contract.js';
import {
  buildTokenReceipt,
  renderTokenReceiptMarkdown,
  type AgentLoopTokenReceipt,
} from './token-receipt.js';

export type ReadyGateStatus = 'pass' | 'warn' | 'fail';
export type ReadyStatus = 'ready' | 'blocked';

export type ReadyGate = {
  id:
    | 'task-contract'
    | 'acceptance-criteria'
    | 'verification'
    | 'scope-drift'
    | 'forbidden-files'
    | 'context-budget';
  name: string;
  status: ReadyGateStatus;
  message: string;
  path?: string;
};

export type ReadyNextAction = {
  command: string;
  reason: string;
};

export type ReadyResult = {
  status: ReadyStatus;
  gates: ReadyGate[];
  evidenceMap: CompactEvidenceMap;
  tokenReceipt: AgentLoopTokenReceipt;
  nextAction: ReadyNextAction;
  markdown: string;
  safety: {
    readOnly: true;
    localEvidenceOnly: true;
    localGitStatus: true;
    runsVerification: false;
    executesExternalAgents: false;
  };
};

const READY_SAFETY = {
  readOnly: true,
  localEvidenceOnly: true,
  localGitStatus: true,
  runsVerification: false,
  executesExternalAgents: false,
} as const;

function gate(
  id: ReadyGate['id'],
  name: string,
  status: ReadyGateStatus,
  message: string,
  filePath?: string,
): ReadyGate {
  return { id, name, status, message, ...(filePath ? { path: filePath } : {}) };
}

function verificationMessage(map: EvidenceMap) {
  if (map.verification.label === 'fresh') return 'Verification evidence is fresh.';
  if (map.verification.label === 'missing') return 'No verification report was found.';
  if (map.verification.label === 'failed') return 'Latest verification report failed.';
  if (map.verification.label === 'stale') {
    return map.verification.staleReason
      ? `Verification evidence is stale: ${map.verification.staleReason}`
      : 'Verification evidence is stale.';
  }
  return 'Verification evidence exists, but AgentLoopKit could not classify its status.';
}

function acceptanceGate(input: {
  taskPath?: string;
  taskMarkdown?: string;
}): ReadyGate {
  if (!input.taskPath || input.taskMarkdown === undefined) {
    return gate(
      'acceptance-criteria',
      'Acceptance criteria',
      'fail',
      'No task contract is available to check acceptance criteria.',
    );
  }
  const placeholders = findPlaceholderTaskSections(input.taskMarkdown);
  if (placeholders.includes('Acceptance Criteria')) {
    return gate(
      'acceptance-criteria',
      'Acceptance criteria',
      'fail',
      'Acceptance Criteria still contains placeholder text.',
      input.taskPath,
    );
  }
  return gate(
    'acceptance-criteria',
    'Acceptance criteria',
    'pass',
    'Task acceptance criteria are task-specific.',
    input.taskPath,
  );
}

function buildReadyGates(input: {
  cwd: string;
  map: EvidenceMap;
  taskPath?: string;
  taskMarkdown?: string;
  tokenReceipt: AgentLoopTokenReceipt;
}) {
  const taskPath = input.taskPath
    ? path.relative(input.cwd, input.taskPath).split(path.sep).join('/')
    : undefined;
  const gates: ReadyGate[] = [];

  gates.push(
    input.map.task
      ? gate('task-contract', 'Task contract', 'pass', input.map.task.title, input.map.task.path)
      : gate('task-contract', 'Task contract', 'fail', 'No current task contract found.'),
  );
  gates.push(acceptanceGate({ taskPath, taskMarkdown: input.taskMarkdown }));
  gates.push(
    gate(
      'verification',
      'Verification',
      input.map.verification.label === 'fresh' ? 'pass' : 'fail',
      verificationMessage(input.map),
      input.map.verification.path,
    ),
  );
  gates.push(
    gate(
      'scope-drift',
      'Scope drift',
      input.map.coverage.unexplainedFileCount === 0 ? 'pass' : 'fail',
      input.map.coverage.unexplainedFileCount === 0
        ? 'No changed non-evidence files are outside task or run evidence.'
        : `${input.map.coverage.unexplainedFileCount} changed non-evidence file(s) are outside task or run evidence.`,
    ),
  );
  gates.push(
    gate(
      'forbidden-files',
      'Forbidden files',
      input.map.coverage.forbiddenFileCount === 0 ? 'pass' : 'fail',
      input.map.coverage.forbiddenFileCount === 0
        ? 'No changed files match task files-not-to-touch scope.'
        : `${input.map.coverage.forbiddenFileCount} changed file(s) match task files-not-to-touch scope.`,
    ),
  );
  gates.push(
    gate(
      'context-budget',
      'Context budget',
      input.tokenReceipt.estimatedNetContextReductionTokens > 0 ? 'pass' : 'warn',
      input.tokenReceipt.warning,
    ),
  );

  return gates;
}

function statusFromGates(gates: ReadyGate[]): ReadyStatus {
  return gates.some((item) => item.status === 'fail') ? 'blocked' : 'ready';
}

function chooseReadyNextAction(gates: ReadyGate[]): ReadyNextAction {
  const failed = gates.find((item) => item.status === 'fail');
  if (!failed) {
    return {
      command: 'agentloop ship',
      reason: 'Task, acceptance, scope, and verification gates are ready for review evidence.',
    };
  }
  if (failed.id === 'task-contract') {
    return {
      command: 'agentloop create-task',
      reason: 'Create or pin a task contract before reviewing agent work.',
    };
  }
  if (failed.id === 'acceptance-criteria') {
    return {
      command: 'agentloop task doctor',
      reason: 'Replace placeholder acceptance criteria before continuing agent work.',
    };
  }
  if (failed.id === 'verification') {
    return {
      command: 'agentloop verify --task-commands --progress',
      reason: 'Run or refresh verification before review.',
    };
  }
  return {
    command: 'agentloop guard --redact-paths',
    reason: 'Review local scope drift and risk evidence before continuing.',
  };
}

function renderGates(gates: ReadyGate[]) {
  return gates
    .map((item) => {
      const suffix = item.path ? ` Path: ${inlineCode(item.path)}.` : '';
      return `- ${inlineCode(item.status)} ${inlineCode(item.name)} - ${escapeMarkdownProse(
        item.message,
      )}${suffix}`;
    })
    .join('\n');
}

export function renderReadyMarkdown(result: Omit<ReadyResult, 'markdown'>) {
  return `# AgentLoopKit Ready

- Status: ${inlineCode(result.status)}
- Next action: ${inlineCode(result.nextAction.command)}

## Gates

${renderGates(result.gates)}

${renderTokenReceiptMarkdown(result.tokenReceipt)}
## Next Action

- ${inlineCode(result.nextAction.command)} - ${escapeMarkdownProse(result.nextAction.reason)}

## Safety

- Read-only: ${inlineCode(String(result.safety.readOnly))}
- Local evidence only: ${inlineCode(String(result.safety.localEvidenceOnly))}
- Runs verification: ${inlineCode(String(result.safety.runsVerification))}
- Executes external agents: ${inlineCode(String(result.safety.executesExternalAgents))}
`;
}

export async function evaluateReady(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ReadyResult> {
  const [map, taskPath] = await Promise.all([
    buildEvidenceMap({
      cwd: options.cwd,
      config: options.config,
      taskEvidenceMode: 'current-work',
    }),
    getCurrentWorkTaskPath({
      cwd: options.cwd,
      config: options.config,
    }),
  ]);
  const taskMarkdown = taskPath ? await readFile(taskPath, 'utf8') : undefined;
  const contextBudget = buildContextBudget({
    evidenceMap: map,
    savingsCommand: 'agentloop context pack --for codex --goal review --redact-paths',
  });
  const tokenReceipt = buildTokenReceipt({
    contextBudget,
    agentLoopOutput: JSON.stringify({
      task: map.task,
      verification: map.verification,
      coverage: map.coverage,
      risk: map.risk,
      nextActions: map.nextActions,
    }),
  });
  const gates = buildReadyGates({
    cwd: options.cwd,
    map,
    taskPath,
    taskMarkdown,
    tokenReceipt,
  });
  const status = statusFromGates(gates);
  const nextAction = chooseReadyNextAction(gates);
  const withoutMarkdown = {
    status,
    gates,
    evidenceMap: compactEvidenceMap(map),
    tokenReceipt,
    nextAction,
    safety: READY_SAFETY,
  };
  return {
    ...withoutMarkdown,
    markdown: renderReadyMarkdown(withoutMarkdown),
  };
}
