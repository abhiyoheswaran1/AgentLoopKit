import path from 'node:path';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { z } from 'zod';
import { AgentLoopConfig } from './config.js';
import { AgentLoopError } from './errors.js';
import { isInsidePath, normalizeExistingAncestor, pathExists } from './file-system.js';
import { getPackageVersion } from './version.js';
import { createTaskContractFile, TaskContractInput } from './task-contract.js';
import { setActiveTask } from './task-state.js';

const verdictSchema = z.enum(['proceed', 'caution', 'block', 'unknown']);
const riskSeveritySchema = z.enum(['info', 'warning', 'blocking']);
const prioritySchema = z.enum(['high', 'medium', 'low']);
const taskContractStatusSchema = z.enum(['draft', 'active', 'blocked', 'complete']);
const acceptanceStatusSchema = z.enum(['pending', 'satisfied', 'failed', 'unknown']);
const verificationGateStatusSchema = z.enum(['pending', 'passed', 'failed', 'skipped']);
const workflowToolStatusSchema = z.enum(['created', 'completed', 'failed']);
const agentFlightReadinessSchema = z.enum([
  'ready_for_review',
  'not_ready_for_review',
  'needs_verification',
  'blocked_by_failed_verification',
  'unknown',
]);

const producerSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
});

const reviewFocusSchema = z.object({
  path: z.string().min(1),
  priority: prioritySchema,
  reasons: z.array(z.string().min(1)),
});

const riskSchema = z.object({
  id: z.string().min(1),
  severity: riskSeveritySchema,
  category: z.string().min(1),
  message: z.string().min(1),
  files: z.array(z.string().min(1)).optional(),
  suggestedAction: z.string().min(1).optional(),
});

export const ProjScanAssessmentV1Schema = z
  .object({
    schemaVersion: z.literal('1.0'),
    kind: z.literal('projscan-assessment'),
    producer: producerSchema.extend({ name: z.literal('projscan') }),
    taskId: z.string().min(1),
    intent: z.string().min(1),
    generatedAt: z.string().min(1),
    repository: z.object({
      root: z.string().min(1),
      branch: z.string().optional(),
      commit: z.string().optional(),
    }),
    verdict: verdictSchema,
    summary: z.string().min(1),
    repositoryType: z.string().min(1).optional(),
    impactedAreas: z.array(
      z.object({
        name: z.string().min(1),
        paths: z.array(z.string().min(1)),
        reason: z.string().min(1),
      }),
    ),
    reviewFocus: z.array(reviewFocusSchema),
    risks: z.array(riskSchema),
    suggestedChecks: z.array(
      z.object({
        command: z.string().min(1),
        reason: z.string().min(1),
        required: z.boolean(),
      }),
    ),
    artifacts: z
      .array(
        z.object({
          kind: z.enum(['report', 'scan', 'log']),
          path: z.string().min(1),
        }),
      )
      .optional(),
  })
  .strict();

export type ProjScanAssessmentV1 = z.infer<typeof ProjScanAssessmentV1Schema>;

export const AgentLoopKitTaskContractV1Schema = z
  .object({
    schemaVersion: z.literal('1.0'),
    kind: z.literal('agentloopkit-task'),
    producer: producerSchema.extend({ name: z.literal('agentloopkit') }),
    taskId: z.string().min(1),
    intent: z.string().min(1),
    title: z.string().min(1),
    createdAt: z.string().min(1),
    sourceAssessment: z.object({
      path: z.string().min(1),
      producerVersion: z.string().min(1),
      verdict: verdictSchema,
    }),
    scope: z.object({
      allowedPaths: z.array(z.string().min(1)),
      reviewFirst: z.array(
        z.object({
          path: z.string().min(1),
          reasons: z.array(z.string().min(1)),
        }),
      ),
      excludedPaths: z.array(z.string().min(1)),
    }),
    acceptanceCriteria: z.array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1),
        status: acceptanceStatusSchema,
      }),
    ),
    verificationGates: z.array(
      z.object({
        id: z.string().min(1),
        command: z.string().min(1),
        reason: z.string().min(1),
        required: z.boolean(),
        status: verificationGateStatusSchema,
      }),
    ),
    risks: z.array(
      z.object({
        id: z.string().min(1),
        severity: riskSeveritySchema,
        message: z.string().min(1),
        files: z.array(z.string().min(1)).optional(),
      }),
    ),
    status: taskContractStatusSchema,
    nativeTaskPath: z.string().min(1).optional(),
  })
  .strict();

export type AgentLoopKitTaskContractV1 = z.infer<typeof AgentLoopKitTaskContractV1Schema>;

export const AgentFlightResultV1Schema = z
  .object({
    schemaVersion: z.literal('1.0'),
    kind: z.literal('agentflight-result'),
    producer: producerSchema.extend({ name: z.literal('agentflight') }),
    taskId: z.string().min(1),
    generatedAt: z.string().min(1),
    readiness: agentFlightReadinessSchema,
    changedFiles: z.array(z.string().min(1)),
    scopeDrift: z.array(
      z.object({
        path: z.string().min(1),
        reason: z.string().min(1),
      }),
    ),
    verification: z.array(
      z.object({
        command: z.string().min(1),
        status: z.enum(['passed', 'failed', 'incomplete']),
        exitCode: z.number().int().optional(),
      }),
    ),
    proofGaps: z.array(
      z.object({
        severity: riskSeveritySchema,
        message: z.string().min(1),
        suggestedCommand: z.string().min(1).optional(),
      }),
    ),
    reviewFocus: z.array(reviewFocusSchema),
    artifacts: z.array(
      z.object({
        kind: z.enum(['report', 'replay', 'resume', 'log']),
        path: z.string().min(1),
      }),
    ),
  })
  .strict();

export type AgentFlightResultV1 = z.infer<typeof AgentFlightResultV1Schema>;

const BaseframeAgentWorkflowV1Schema = z
  .object({
    schemaVersion: z.literal('1.0'),
    taskId: z.string().min(1),
    intent: z.string().min(1),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    tools: z.object({
      projscan: z
        .object({
          status: workflowToolStatusSchema,
          assessmentPath: z.string().min(1),
          version: z.string().min(1),
        })
        .optional(),
      agentloopkit: z
        .object({
          status: workflowToolStatusSchema,
          taskPath: z.string().min(1).optional(),
          version: z.string().min(1).optional(),
        })
        .optional(),
      agentflight: z
        .object({
          status: workflowToolStatusSchema,
          resultPath: z.string().min(1).optional(),
          version: z.string().min(1).optional(),
        })
        .optional(),
    }),
  })
  .strict();

export type BaseframeAgentWorkflowV1 = z.infer<typeof BaseframeAgentWorkflowV1Schema>;

export class BaseframeArtifactError extends AgentLoopError {
  constructor(
    message: string,
    code: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message, code);
    this.name = 'BaseframeArtifactError';
  }
}

export type CreateTaskFromProjScanOptions = {
  cwd: string;
  config: AgentLoopConfig;
  assessmentPath: string;
  title?: string;
  allowedPaths?: string[];
  acceptanceCriteria?: string[];
  now?: string;
};

export type EvaluateAgentFlightResultOptions = {
  cwd: string;
  taskId: string;
  resultPath: string;
};

const ACCEPTANCE_PLACEHOLDER =
  'Human must define task-specific acceptance criteria before implementation is marked ready.';

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/');
}

function repoRelative(root: string, filePath: string) {
  return toPosixPath(path.relative(root, filePath)) || '.';
}

function hasPathTraversal(value: string) {
  return value.split(/[\\/]/).some((segment) => segment === '..');
}

function pathSafetyIssue(value: string) {
  if (!value.trim()) return 'empty';
  if (value.includes('\0')) return 'null-byte';
  if (/\r|\n/.test(value)) return 'line-break';
  if (
    path.isAbsolute(value) ||
    path.posix.isAbsolute(value) ||
    path.win32.isAbsolute(value) ||
    /^[A-Za-z]:/.test(value)
  ) {
    return 'absolute';
  }
  if (hasPathTraversal(value)) return 'parent-traversal';
  return undefined;
}

function assertSafeTaskId(taskId: string) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(taskId) || taskId.includes('..')) {
    throw new BaseframeArtifactError(
      `Baseframe task ID must be a safe single path segment: ${taskId}`,
      'BASEFRAME_UNSAFE_TASK_ID',
      { taskId },
    );
  }
}

function assertSafeRelativePath(value: string, label: string) {
  const issue = pathSafetyIssue(value);
  if (!issue) return;
  throw new BaseframeArtifactError(
    `Unsafe ${label} path "${value}": ${issue}. Paths must be repo-relative and must not traverse outside the repository.`,
    'BASEFRAME_UNSAFE_PATH',
    { path: value, label, reason: issue },
  );
}

function assertSafeRelativePaths(values: string[] | undefined, label: string) {
  for (const value of values ?? []) assertSafeRelativePath(value, label);
}

function assertAssessmentPathSafety(assessment: ProjScanAssessmentV1) {
  assertSafeTaskId(assessment.taskId);
  for (const area of assessment.impactedAreas) {
    assertSafeRelativePaths(area.paths, `impacted area "${area.name}"`);
  }
  for (const focus of assessment.reviewFocus) {
    assertSafeRelativePath(focus.path, 'review focus');
  }
  for (const risk of assessment.risks) {
    assertSafeRelativePaths(risk.files, `risk "${risk.id}"`);
  }
  for (const artifact of assessment.artifacts ?? []) {
    assertSafeRelativePath(artifact.path, `ProjScan artifact "${artifact.kind}"`);
  }
}

function assertAgentFlightPathSafety(result: AgentFlightResultV1) {
  assertSafeTaskId(result.taskId);
  assertSafeRelativePaths(result.changedFiles, 'AgentFlight changed file');
  for (const drift of result.scopeDrift) {
    assertSafeRelativePath(drift.path, 'AgentFlight scope drift');
  }
  for (const focus of result.reviewFocus) {
    assertSafeRelativePath(focus.path, 'AgentFlight review focus');
  }
  for (const artifact of result.artifacts) {
    assertSafeRelativePath(artifact.path, `AgentFlight artifact "${artifact.kind}"`);
  }
}

function resolveRepoFile(cwd: string, inputPath: string, label: string) {
  if (inputPath.includes('\0')) {
    throw new BaseframeArtifactError(
      `${label} path must not contain null bytes.`,
      'BASEFRAME_UNSAFE_PATH',
      { path: inputPath, label, reason: 'null-byte' },
    );
  }
  const absolutePath = path.isAbsolute(inputPath)
    ? path.resolve(inputPath)
    : path.resolve(cwd, inputPath);
  const repoRoot = normalizeExistingAncestor(path.resolve(cwd));
  const normalizedTarget = normalizeExistingAncestor(absolutePath);
  if (!isInsidePath(repoRoot, normalizedTarget)) {
    throw new BaseframeArtifactError(
      `${label} path must stay inside the repository.`,
      'BASEFRAME_UNSAFE_PATH',
      { path: inputPath, label, reason: 'outside-repository' },
    );
  }
  return {
    absolutePath,
    relativePath: repoRelative(repoRoot, normalizedTarget),
  };
}

function expectedEvidenceRelativePath(taskId: string, fileName: string) {
  return `.baseframe/evidence/${taskId}/${fileName}`;
}

function taskIdFromEvidencePath(relativePath: string, fileName: string) {
  const parts = relativePath.split('/');
  if (
    parts.length !== 4 ||
    parts[0] !== '.baseframe' ||
    parts[1] !== 'evidence' ||
    parts[3] !== fileName
  ) {
    throw new BaseframeArtifactError(
      `Expected ${fileName} under .baseframe/evidence/<task-id>/.`,
      'BASEFRAME_INVALID_ARTIFACT_PATH',
      { path: relativePath },
    );
  }
  return parts[2];
}

function parseJsonWithSchema<T>(
  raw: string,
  schema: z.ZodType<T>,
  code: string,
  artifactName: string,
) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new BaseframeArtifactError(
      `Invalid ${artifactName} JSON: ${detail}`,
      code,
      { reason: 'invalid-json' },
    );
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new BaseframeArtifactError(
      `Invalid ${artifactName}: ${z.prettifyError(result.error)}`,
      code,
      { issues: result.error.issues },
    );
  }
  return result.data;
}

async function readJsonFileWithSchema<T>(
  filePath: string,
  schema: z.ZodType<T>,
  code: string,
  artifactName: string,
) {
  return parseJsonWithSchema(await readFile(filePath, 'utf8'), schema, code, artifactName);
}

async function writeJsonFileAtomic(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  try {
    await writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`);
    await rename(tmpPath, filePath);
  } catch (error) {
    await rm(tmpPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

function uniqueValues(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const clean = value.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    result.push(clean);
  }
  return result;
}

function acceptanceCriteria(values: string[] | undefined) {
  const clean = uniqueValues(values ?? []);
  if (clean.length === 0) {
    return [{ id: 'AC-1', text: ACCEPTANCE_PLACEHOLDER, status: 'unknown' as const }];
  }
  return clean.map((text, index) => ({
    id: `AC-${index + 1}`,
    text,
    status: 'pending' as const,
  }));
}

function verificationGates(assessment: ProjScanAssessmentV1) {
  return assessment.suggestedChecks.map((check, index) => ({
    id: `VG-${index + 1}`,
    command: check.command.trim(),
    reason: check.reason,
    required: check.required,
    status: 'pending' as const,
  }));
}

function mappedRisks(assessment: ProjScanAssessmentV1): AgentLoopKitTaskContractV1['risks'] {
  return assessment.risks.map((risk) => ({
    id: risk.id,
    severity: risk.severity,
    message: risk.message,
    ...(risk.files?.length ? { files: risk.files } : {}),
  }));
}

function contractStatus(input: {
  assessment: ProjScanAssessmentV1;
  criteria: AgentLoopKitTaskContractV1['acceptanceCriteria'];
}) {
  if (
    input.assessment.verdict === 'block' ||
    input.assessment.risks.some((risk) => risk.severity === 'blocking')
  ) {
    return 'blocked' as const;
  }
  if (input.criteria.some((criterion) => criterion.status === 'unknown')) return 'draft' as const;
  return 'active' as const;
}

function nativeTaskStatus(status: AgentLoopKitTaskContractV1['status']) {
  if (status === 'blocked') return 'blocked';
  if (status === 'active') return 'in-progress';
  return 'proposed';
}

function nativeRiskNotes(assessment: ProjScanAssessmentV1) {
  const risks = assessment.risks
    .filter((risk) => risk.severity !== 'info')
    .map((risk) => {
      const files = risk.files?.length ? ` Files: ${risk.files.join(', ')}.` : '';
      const action = risk.suggestedAction ? ` Suggested action: ${risk.suggestedAction}` : '';
      return `[${risk.severity}] ${risk.message}${files}${action}`;
    });
  const reviewFirst = assessment.reviewFocus.map(
    (focus) => `Review first: ${focus.path} - ${focus.reasons.join('; ')}`,
  );
  return [...risks, ...reviewFirst];
}

function nativeTaskInput(input: {
  title: string;
  assessment: ProjScanAssessmentV1;
  criteria: AgentLoopKitTaskContractV1['acceptanceCriteria'];
  allowedPaths: string[];
  status: AgentLoopKitTaskContractV1['status'];
}): TaskContractInput {
  return {
    title: input.title,
    type: 'feature',
    status: nativeTaskStatus(input.status),
    problemStatement: input.assessment.summary,
    desiredOutcome: `Define scoped AgentLoopKit work for: ${input.assessment.intent}`,
    constraints: [
      `Use ProjScan assessment ${expectedEvidenceRelativePath(
        input.assessment.taskId,
        'projscan-assessment.json',
      )} as risk input.`,
      'Do not treat ProjScan as a source of complete acceptance criteria.',
      'Keep work inside allowed paths unless a human updates the task scope.',
    ],
    nonGoals: ['Do not import ProjScan or AgentFlight internals.'],
    assumptions: [
      `ProjScan verdict: ${input.assessment.verdict}`,
      ...(input.assessment.repositoryType
        ? [`Repository type: ${input.assessment.repositoryType}`]
        : []),
    ],
    likelyFiles: input.allowedPaths,
    forbiddenFiles: [],
    acceptanceCriteria: input.criteria.map((criterion) => criterion.text),
    verificationCommands: input.assessment.suggestedChecks.map((check) => check.command),
    riskNotes: nativeRiskNotes(input.assessment),
    rollbackNotes:
      'Revert changes made for this task and regenerate Baseframe evidence if scope changes.',
  };
}

async function readExistingContract(cwd: string, taskId: string) {
  const contractPath = path.resolve(
    cwd,
    expectedEvidenceRelativePath(taskId, 'agentloopkit-task.json'),
  );
  if (!(await pathExists(contractPath))) return undefined;
  return readJsonFileWithSchema(
    contractPath,
    AgentLoopKitTaskContractV1Schema,
    'BASEFRAME_INVALID_AGENTLOOPKIT_TASK',
    'AgentLoopKit task contract',
  );
}

async function updateWorkflowManifest(options: {
  cwd: string;
  assessment: ProjScanAssessmentV1;
  assessmentPath: string;
  taskPath: string;
  status: 'created' | 'completed' | 'failed';
  now: string;
}) {
  const manifestPath = path.resolve(options.cwd, '.baseframe/agent-workflow.json');
  const existing = (await pathExists(manifestPath))
    ? await readJsonFileWithSchema(
        manifestPath,
        BaseframeAgentWorkflowV1Schema,
        'BASEFRAME_INVALID_WORKFLOW_MANIFEST',
        'Baseframe workflow manifest',
      )
    : undefined;
  const next: BaseframeAgentWorkflowV1 = {
    schemaVersion: '1.0',
    taskId: options.assessment.taskId,
    intent: options.assessment.intent,
    createdAt: existing?.createdAt ?? options.now,
    updatedAt: options.now,
    tools: {
      ...existing?.tools,
      projscan: existing?.tools.projscan ?? {
        status: 'completed',
        assessmentPath: options.assessmentPath,
        version: options.assessment.producer.version,
      },
      agentloopkit: {
        status: options.status,
        taskPath: options.taskPath,
        version: getPackageVersion(),
      },
    },
  };
  await writeJsonFileAtomic(manifestPath, next);
  return next;
}

export async function createTaskFromProjScan(
  options: CreateTaskFromProjScanOptions,
): Promise<AgentLoopKitTaskContractV1> {
  const assessmentFile = resolveRepoFile(options.cwd, options.assessmentPath, 'ProjScan assessment');
  const pathTaskId = taskIdFromEvidencePath(assessmentFile.relativePath, 'projscan-assessment.json');
  const assessment = await readJsonFileWithSchema(
    assessmentFile.absolutePath,
    ProjScanAssessmentV1Schema,
    'BASEFRAME_INVALID_PROJSCAN_ASSESSMENT',
    'ProjScan assessment',
  );
  assertAssessmentPathSafety(assessment);
  if (assessment.taskId !== pathTaskId) {
    throw new BaseframeArtifactError(
      `ProjScan assessment task ID "${assessment.taskId}" does not match evidence path task ID "${pathTaskId}".`,
      'BASEFRAME_TASK_ID_MISMATCH',
      { expectedTaskId: pathTaskId, actualTaskId: assessment.taskId },
    );
  }
  assertSafeRelativePaths(options.allowedPaths, 'allowed path override');

  const now = options.now ?? new Date().toISOString();
  const title = options.title?.trim() || assessment.intent;
  const allowedPaths = uniqueValues([
    ...assessment.impactedAreas.flatMap((area) => area.paths),
    ...(options.allowedPaths ?? []),
  ]);
  const criteria = acceptanceCriteria(options.acceptanceCriteria);
  const status = contractStatus({ assessment, criteria });
  const existing = await readExistingContract(options.cwd, assessment.taskId);
  const taskResult = await createTaskContractFile({
    cwd: options.cwd,
    config: options.config,
    input: nativeTaskInput({ title, assessment, criteria, allowedPaths, status }),
    out: existing?.nativeTaskPath,
  });
  const activeTask = await setActiveTask({
    cwd: options.cwd,
    config: options.config,
    taskPath: taskResult.path,
  });
  const nativeTaskPath = activeTask.path;

  const contract: AgentLoopKitTaskContractV1 = {
    schemaVersion: '1.0',
    kind: 'agentloopkit-task',
    producer: {
      name: 'agentloopkit',
      version: getPackageVersion(),
    },
    taskId: assessment.taskId,
    intent: assessment.intent,
    title,
    createdAt: existing?.createdAt ?? now,
    sourceAssessment: {
      path: assessmentFile.relativePath,
      producerVersion: assessment.producer.version,
      verdict: assessment.verdict,
    },
    scope: {
      allowedPaths,
      reviewFirst: assessment.reviewFocus.map((focus) => ({
        path: focus.path,
        reasons: focus.reasons,
      })),
      excludedPaths: [],
    },
    acceptanceCriteria: criteria,
    verificationGates: verificationGates(assessment),
    risks: mappedRisks(assessment),
    status,
    nativeTaskPath,
  };
  const contractPath = resolveRepoFile(
    options.cwd,
    expectedEvidenceRelativePath(assessment.taskId, 'agentloopkit-task.json'),
    'AgentLoopKit task contract',
  );
  await writeJsonFileAtomic(contractPath.absolutePath, contract);
  await updateWorkflowManifest({
    cwd: options.cwd,
    assessment,
    assessmentPath: assessmentFile.relativePath,
    taskPath: contractPath.relativePath,
    status: status === 'active' ? 'completed' : 'created',
    now,
  });
  return contract;
}

function normalizeCommand(command: string) {
  return command.trim();
}

function agentFlightRiskMessages(input: {
  result: AgentFlightResultV1;
  updatedGates: AgentLoopKitTaskContractV1['verificationGates'];
}) {
  const risks: AgentLoopKitTaskContractV1['risks'] = [];
  for (const gate of input.updatedGates) {
    if (!gate.required) continue;
    if (gate.status === 'pending') {
      risks.push({
        id: `AF-GATE-PENDING-${gate.id}`,
        severity: 'warning',
        message: `AgentFlight did not complete required verification: ${gate.command}`,
      });
    }
    if (gate.status === 'failed') {
      risks.push({
        id: `AF-GATE-FAILED-${gate.id}`,
        severity: 'blocking',
        message: `AgentFlight reported failed verification: ${gate.command}`,
      });
    }
  }
  input.result.verification
    .filter((entry) => entry.status === 'incomplete')
    .forEach((entry, index) => {
      risks.push({
        id: `AF-GATE-INCOMPLETE-${index + 1}`,
        severity: 'warning',
        message: `AgentFlight reported incomplete verification: ${entry.command}`,
      });
    });
  input.result.scopeDrift.forEach((drift, index) => {
    risks.push({
      id: `AF-SCOPE-${index + 1}`,
      severity: 'blocking',
      message: `Scope drift: ${drift.path} - ${drift.reason}`,
      files: [drift.path],
    });
  });
  input.result.proofGaps.forEach((gap, index) => {
    risks.push({
      id: `AF-PROOF-${index + 1}`,
      severity: gap.severity,
      message: gap.suggestedCommand
        ? `${gap.message} Suggested command: ${gap.suggestedCommand}`
        : gap.message,
    });
  });
  if (input.result.readiness !== 'ready_for_review') {
    risks.push({
      id: 'AF-READINESS',
      severity:
        input.result.readiness === 'blocked_by_failed_verification' ||
        input.result.readiness === 'not_ready_for_review'
          ? 'blocking'
          : 'warning',
      message: `AgentFlight readiness is ${input.result.readiness}.`,
    });
  }
  return risks;
}

export async function evaluateAgentFlightResult(options: EvaluateAgentFlightResultOptions): Promise<{
  gatesPassed: boolean;
  updatedContract: AgentLoopKitTaskContractV1;
}> {
  assertSafeTaskId(options.taskId);
  const resultFile = resolveRepoFile(options.cwd, options.resultPath, 'AgentFlight result');
  const pathTaskId = taskIdFromEvidencePath(resultFile.relativePath, 'agentflight-result.json');
  if (pathTaskId !== options.taskId) {
    throw new BaseframeArtifactError(
      `AgentFlight result path task ID "${pathTaskId}" does not match requested task ID "${options.taskId}".`,
      'BASEFRAME_TASK_ID_MISMATCH',
      { expectedTaskId: options.taskId, actualTaskId: pathTaskId },
    );
  }
  const result = await readJsonFileWithSchema(
    resultFile.absolutePath,
    AgentFlightResultV1Schema,
    'BASEFRAME_INVALID_AGENTFLIGHT_RESULT',
    'AgentFlight result',
  );
  assertAgentFlightPathSafety(result);
  if (result.taskId !== options.taskId) {
    throw new BaseframeArtifactError(
      `AgentFlight result task ID "${result.taskId}" does not match requested task ID "${options.taskId}".`,
      'BASEFRAME_TASK_ID_MISMATCH',
      { expectedTaskId: options.taskId, actualTaskId: result.taskId },
    );
  }

  const contractPath = resolveRepoFile(
    options.cwd,
    expectedEvidenceRelativePath(options.taskId, 'agentloopkit-task.json'),
    'AgentLoopKit task contract',
  );
  const contract = await readJsonFileWithSchema(
    contractPath.absolutePath,
    AgentLoopKitTaskContractV1Schema,
    'BASEFRAME_INVALID_AGENTLOOPKIT_TASK',
    'AgentLoopKit task contract',
  );
  if (contract.taskId !== options.taskId) {
    throw new BaseframeArtifactError(
      `AgentLoopKit task contract task ID "${contract.taskId}" does not match requested task ID "${options.taskId}".`,
      'BASEFRAME_TASK_ID_MISMATCH',
      { expectedTaskId: options.taskId, actualTaskId: contract.taskId },
    );
  }

  const verificationByCommand = new Map(
    result.verification.map((entry) => [normalizeCommand(entry.command), entry]),
  );
  const updatedGates = contract.verificationGates.map((gate) => {
    const verification = verificationByCommand.get(normalizeCommand(gate.command));
    if (!verification) return { ...gate, status: gate.required ? 'pending' : 'skipped' } as const;
    if (verification.status === 'passed') return { ...gate, status: 'passed' as const };
    if (verification.status === 'failed') return { ...gate, status: 'failed' as const };
    return { ...gate, status: 'pending' as const };
  });
  const agentFlightRisks = agentFlightRiskMessages({ result, updatedGates });
  const requiredGatesPassed = updatedGates
    .filter((gate) => gate.required)
    .every((gate) => gate.status === 'passed');
  const blockingRisk = agentFlightRisks.some((risk) => risk.severity === 'blocking');
  const gatesPassed =
    requiredGatesPassed && !blockingRisk && result.readiness === 'ready_for_review';
  const previousRisks = contract.risks.filter((risk) => !risk.id.startsWith('AF-'));
  const updatedContract: AgentLoopKitTaskContractV1 = {
    ...contract,
    verificationGates: updatedGates,
    risks: [...previousRisks, ...agentFlightRisks],
    status:
      gatesPassed || contract.status === 'draft'
        ? contract.status === 'draft' && gatesPassed
          ? 'active'
          : contract.status
        : blockingRisk || updatedGates.some((gate) => gate.required && gate.status === 'failed')
          ? 'blocked'
          : contract.status,
  };
  await writeJsonFileAtomic(contractPath.absolutePath, updatedContract);
  return { gatesPassed, updatedContract };
}
