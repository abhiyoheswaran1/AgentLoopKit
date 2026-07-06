import path from 'node:path';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { initializeAgentLoop } from '../src/core/init.js';
import {
  createTaskFromProjScan,
  evaluateAgentFlightResult,
  type AgentFlightResultV1,
  type ProjScanAssessmentV1,
} from '../src/index.js';
import { CLI_PROCESS_TIMEOUT_MS, makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const projscanFixturePath = path.resolve('test/fixtures/baseframe/projscan-assessment.json');
const agentflightFixturePath = path.resolve('test/fixtures/baseframe/agentflight-result.json');
const taskId = 'auth-password-reset-20260626-01';

let tempDirs: string[] = [];

async function readFixture<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

async function createBaseframeRepo() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeJson(
    path.join(dir, 'agentloop.config.json'),
    createDefaultConfig({ name: 'demo', type: 'typescript-package', packageManager: 'pnpm' }),
  );
  await mkdir(path.join(dir, '.baseframe/evidence', taskId), { recursive: true });
  return dir;
}

async function writeAssessment(
  dir: string,
  assessment: ProjScanAssessmentV1,
  assessmentTaskId = assessment.taskId,
) {
  const assessmentPath = path.join(
    dir,
    '.baseframe/evidence',
    assessmentTaskId,
    'projscan-assessment.json',
  );
  await writeJson(assessmentPath, assessment);
  return assessmentPath;
}

async function writeAgentFlightResult(
  dir: string,
  result: AgentFlightResultV1,
  resultTaskId = result.taskId,
) {
  const resultPath = path.join(
    dir,
    '.baseframe/evidence',
    resultTaskId,
    'agentflight-result.json',
  );
  await writeJson(resultPath, result);
  return resultPath;
}

describe('Baseframe Suite Integration v1', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('creates a native task and stable task contract from a valid ProjScan assessment', async () => {
    const dir = await createBaseframeRepo();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'pnpm',
    });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment);
    await writeJson(path.join(dir, '.baseframe/agent-workflow.json'), {
      schemaVersion: '1.0',
      taskId,
      intent: assessment.intent,
      createdAt: '2026-06-26T08:00:00.000Z',
      updatedAt: '2026-06-26T08:00:00.000Z',
      tools: {
        projscan: {
          status: 'completed',
          assessmentPath: '.baseframe/evidence/auth-password-reset-20260626-01/projscan-assessment.json',
          version: '0.7.0'
        },
        agentflight: {
          status: 'created',
          resultPath: '.baseframe/evidence/auth-password-reset-20260626-01/agentflight-result.json',
          version: '0.5.0'
        }
      }
    });

    const contract = await createTaskFromProjScan({
      cwd: dir,
      config,
      assessmentPath,
      title: 'Implement password reset',
      allowedPaths: ['docs/auth.md'],
      acceptanceCriteria: ['Reset tokens expire', 'Reset tokens cannot be reused'],
      now: '2026-06-26T09:30:00.000Z',
    });

    expect(contract).toMatchObject({
      schemaVersion: '1.0',
      kind: 'agentloopkit-task',
      producer: {
        name: 'agentloopkit',
        version: expect.any(String),
      },
      taskId,
      intent: 'Implement password reset',
      title: 'Implement password reset',
      createdAt: '2026-06-26T09:30:00.000Z',
      sourceAssessment: {
        path: '.baseframe/evidence/auth-password-reset-20260626-01/projscan-assessment.json',
        producerVersion: '0.7.0',
        verdict: 'caution',
      },
      scope: {
        allowedPaths: ['src/auth/**', 'tests/auth/**', 'docs/auth.md'],
        reviewFirst: [
          {
            path: 'src/auth/password-reset.ts',
            reasons: ['Review token expiry and one-time-use handling.'],
          },
        ],
        excludedPaths: [],
      },
      acceptanceCriteria: [
        { id: 'AC-1', text: 'Reset tokens expire', status: 'pending' },
        { id: 'AC-2', text: 'Reset tokens cannot be reused', status: 'pending' },
      ],
      verificationGates: [
        {
          id: 'VG-1',
          command: 'pnpm test -- tests/auth/password-reset.test.ts',
          reason: 'Covers reset token behavior.',
          required: true,
          status: 'pending',
        },
        {
          id: 'VG-2',
          command: 'pnpm lint',
          reason: 'Keeps changed auth code lint-clean.',
          required: false,
          status: 'pending',
        },
      ],
      risks: expect.arrayContaining([
        {
          id: 'PS-WARN-1',
          severity: 'warning',
          message: 'Reset token handling is security-sensitive.',
          files: ['src/auth/password-reset.ts'],
        },
      ]),
      status: 'active',
      nativeTaskPath: expect.stringMatching(/^\.agentloop\/tasks\/.+\.md$/),
    });

    const contractPath = path.join(
      dir,
      '.baseframe/evidence/auth-password-reset-20260626-01/agentloopkit-task.json',
    );
    await expect(readFile(contractPath, 'utf8')).resolves.toContain('"kind": "agentloopkit-task"');
    const nativeTask = await readFile(path.join(dir, contract.nativeTaskPath as string), 'utf8');
    expect(nativeTask).toContain('# Implement password reset');
    expect(nativeTask).toContain('- src/auth/**');
    expect(nativeTask).toContain('- Reset tokens expire');
    expect(nativeTask).toContain('- pnpm test -- tests/auth/password-reset.test.ts');
    expect(nativeTask).toContain('Reset token handling is security-sensitive.');

    const workflow = JSON.parse(
      await readFile(path.join(dir, '.baseframe/agent-workflow.json'), 'utf8'),
    );
    expect(workflow.tools.projscan).toEqual({
      status: 'completed',
      assessmentPath: '.baseframe/evidence/auth-password-reset-20260626-01/projscan-assessment.json',
      version: '0.7.0',
    });
    expect(workflow.tools.agentflight).toEqual({
      status: 'created',
      resultPath: '.baseframe/evidence/auth-password-reset-20260626-01/agentflight-result.json',
      version: '0.5.0',
    });
    expect(workflow.tools.agentloopkit).toEqual({
      status: 'completed',
      taskPath: '.baseframe/evidence/auth-password-reset-20260626-01/agentloopkit-task.json',
      version: expect.any(String),
    });
    expect(workflow.createdAt).toBe('2026-06-26T08:00:00.000Z');
    expect(workflow.updatedAt).toBe('2026-06-26T09:30:00.000Z');
  });

  test('CLI import creates explicit unknown acceptance criteria when humans did not provide them', async () => {
    const dir = await createBaseframeRepo();
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment);

    const result = await execa(
      tsxPath,
      [cliPath, 'create-task', '--from-projscan', assessmentPath, '--json'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.baseframeTask.status).toBe('draft');
    expect(output.baseframeTask.acceptanceCriteria).toEqual([
      {
        id: 'AC-1',
        text: 'Human must define task-specific acceptance criteria before implementation is marked ready.',
        status: 'unknown',
      },
    ]);
    expect(output.warnings).toEqual([
      {
        code: 'BASEFRAME_ACCEPTANCE_CRITERIA_REQUIRED',
        message:
          'ProjScan assessments do not provide complete acceptance criteria. Add human acceptance criteria before treating this task as ready.',
      },
    ]);
    await expect(
      readFile(
        path.join(
          dir,
          '.baseframe/evidence/auth-password-reset-20260626-01/agentloopkit-task.json',
        ),
        'utf8',
      ),
    ).resolves.toContain('Human must define task-specific acceptance criteria');
  });

  test('rejects malformed ProjScan assessments without writing task artifacts', async () => {
    const dir = await createBaseframeRepo();
    const assessment = {
      ...(await readFixture<ProjScanAssessmentV1>(projscanFixturePath)),
      schemaVersion: '2.0',
    };
    const assessmentPath = await writeAssessment(dir, assessment as ProjScanAssessmentV1);

    const result = await execa(
      tsxPath,
      [cliPath, 'create-task', '--from-projscan', assessmentPath, '--json'],
      { cwd: dir, reject: false, timeout: CLI_PROCESS_TIMEOUT_MS },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'BASEFRAME_INVALID_PROJSCAN_ASSESSMENT',
        message: expect.stringContaining('schemaVersion'),
      },
    });
    await expect(
      stat(path.join(dir, '.baseframe/evidence/auth-password-reset-20260626-01/agentloopkit-task.json')),
    ).rejects.toThrow();
  });

  test('rejects task ID mismatches between the assessment path and artifact body', async () => {
    const dir = await createBaseframeRepo();
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment, 'different-task');

    const result = await execa(
      tsxPath,
      [cliPath, 'create-task', '--from-projscan', assessmentPath, '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'BASEFRAME_TASK_ID_MISMATCH',
        message: expect.stringContaining('different-task'),
      },
    });
  });

  test('rejects unsafe ProjScan task IDs and paths before writing outside the repo', async () => {
    const dir = await createBaseframeRepo();
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const unsafeAssessment = {
      ...assessment,
      impactedAreas: [
        {
          name: 'escape',
          paths: ['../outside.ts'],
          reason: 'This path must be rejected.',
        },
      ],
    };
    const assessmentPath = await writeAssessment(dir, unsafeAssessment);

    await expect(
      createTaskFromProjScan({
        cwd: dir,
        config: createDefaultConfig({ name: 'demo', type: 'typescript-package', packageManager: 'pnpm' }),
        assessmentPath,
      }),
    ).rejects.toMatchObject({
      code: 'BASEFRAME_UNSAFE_PATH',
    });
    await expect(stat(path.join(dir, '..', 'outside.ts'))).rejects.toThrow();
  });

  test('surfaces blocking ProjScan findings in the generated task contract', async () => {
    const dir = await createBaseframeRepo();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'pnpm',
    });
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    assessment.risks = [
      {
        id: 'PS-BLOCK-1',
        severity: 'blocking',
        category: 'auth',
        message: 'Password reset depends on unresolved token storage design.',
        files: ['src/auth/password-reset.ts'],
      },
    ];
    const assessmentPath = await writeAssessment(dir, assessment);

    const contract = await createTaskFromProjScan({
      cwd: dir,
      config,
      assessmentPath,
      acceptanceCriteria: ['Reset tokens expire'],
    });

    expect(contract.status).toBe('blocked');
    expect(contract.risks).toEqual([
      {
        id: 'PS-BLOCK-1',
        severity: 'blocking',
        message: 'Password reset depends on unresolved token storage design.',
        files: ['src/auth/password-reset.ts'],
      },
    ]);
  });

  test('imports AgentFlight results and marks matching verification gates passed', async () => {
    const dir = await createBaseframeRepo();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'pnpm',
    });
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment);
    await createTaskFromProjScan({
      cwd: dir,
      config,
      assessmentPath,
      acceptanceCriteria: ['Reset tokens expire'],
    });
    const resultPath = await writeAgentFlightResult(
      dir,
      await readFixture<AgentFlightResultV1>(agentflightFixturePath),
    );

    const result = await evaluateAgentFlightResult({
      cwd: dir,
      taskId,
      resultPath,
    });

    expect(result.gatesPassed).toBe(true);
    expect(result.updatedContract.verificationGates).toEqual([
      expect.objectContaining({ command: 'pnpm test -- tests/auth/password-reset.test.ts', status: 'passed' }),
      expect.objectContaining({ command: 'pnpm lint', status: 'passed' }),
    ]);
    const contractOnDisk = JSON.parse(
      await readFile(
        path.join(dir, '.baseframe/evidence/auth-password-reset-20260626-01/agentloopkit-task.json'),
        'utf8',
      ),
    );
    expect(contractOnDisk.verificationGates[0].status).toBe('passed');
  });

  test('fails AgentFlight reconciliation when required verification is missing, failed, or incomplete', async () => {
    const dir = await createBaseframeRepo();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'pnpm',
    });
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment);
    await createTaskFromProjScan({
      cwd: dir,
      config,
      assessmentPath,
      acceptanceCriteria: ['Reset tokens expire'],
    });

    const baseResult = await readFixture<AgentFlightResultV1>(agentflightFixturePath);
    const missingPath = await writeAgentFlightResult(dir, { ...baseResult, verification: [] });
    const missing = await evaluateAgentFlightResult({ cwd: dir, taskId, resultPath: missingPath });
    expect(missing.gatesPassed).toBe(false);
    expect(missing.updatedContract.verificationGates[0].status).toBe('pending');

    const failedPath = await writeAgentFlightResult(dir, {
      ...baseResult,
      verification: [{ command: 'pnpm test -- tests/auth/password-reset.test.ts', status: 'failed', exitCode: 1 }],
    });
    const failed = await evaluateAgentFlightResult({ cwd: dir, taskId, resultPath: failedPath });
    expect(failed.gatesPassed).toBe(false);
    expect(failed.updatedContract.verificationGates[0].status).toBe('failed');

    const incompletePath = await writeAgentFlightResult(dir, {
      ...baseResult,
      verification: [{ command: 'pnpm test -- tests/auth/password-reset.test.ts', status: 'incomplete' }],
    });
    const incomplete = await evaluateAgentFlightResult({
      cwd: dir,
      taskId,
      resultPath: incompletePath,
    });
    expect(incomplete.gatesPassed).toBe(false);
    expect(incomplete.updatedContract.verificationGates[0].status).toBe('pending');
    expect(incomplete.updatedContract.risks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'warning',
          message: expect.stringContaining('incomplete verification'),
        }),
      ]),
    );
  });

  test('surfaces AgentFlight scope drift and keeps required gates from passing', async () => {
    const dir = await createBaseframeRepo();
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'pnpm',
    });
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment);
    await createTaskFromProjScan({
      cwd: dir,
      config,
      assessmentPath,
      acceptanceCriteria: ['Reset tokens expire'],
    });
    const agentflight = await readFixture<AgentFlightResultV1>(agentflightFixturePath);
    const resultPath = await writeAgentFlightResult(dir, {
      ...agentflight,
      scopeDrift: [{ path: 'src/billing.ts', reason: 'Changed outside auth scope.' }],
    });

    const result = await evaluateAgentFlightResult({ cwd: dir, taskId, resultPath });

    expect(result.gatesPassed).toBe(false);
    expect(result.updatedContract.risks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'AF-SCOPE-1',
          severity: 'blocking',
          message: 'Scope drift: src/billing.ts - Changed outside auth scope.',
          files: ['src/billing.ts'],
        }),
      ]),
    );
  });

  test('CLI check-gates can reconcile AgentFlight results without changing standalone check-gates', async () => {
    const dir = await createBaseframeRepo();
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment);
    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--from-projscan',
        assessmentPath,
        '--acceptance',
        'Reset tokens expire',
      ],
      { cwd: dir },
    );
    const resultPath = await writeAgentFlightResult(
      dir,
      await readFixture<AgentFlightResultV1>(agentflightFixturePath),
    );

    const baseframeResult = await execa(
      tsxPath,
      [
        cliPath,
        'check-gates',
        '--baseframe-task-id',
        taskId,
        '--from-agentflight',
        resultPath,
        '--json',
      ],
      { cwd: dir },
    );
    expect(JSON.parse(baseframeResult.stdout)).toMatchObject({
      gatesPassed: true,
      updatedContract: {
        taskId,
        verificationGates: [
          { command: 'pnpm test -- tests/auth/password-reset.test.ts', status: 'passed' },
          { command: 'pnpm lint', status: 'passed' },
        ],
      },
    });

    await initializeAgentLoop({ cwd: dir });
    const standaloneResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });
    const standalone = JSON.parse(standaloneResult.stdout);
    expect(standalone).toHaveProperty('gates');
    expect(standalone).not.toHaveProperty('updatedContract');
  });

  test('check-gates no longer accepts --task for AgentFlight reconciliation', async () => {
    const dir = await createBaseframeRepo();
    const assessment = await readFixture<ProjScanAssessmentV1>(projscanFixturePath);
    const assessmentPath = await writeAssessment(dir, assessment);
    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--from-projscan',
        assessmentPath,
        '--acceptance',
        'Reset tokens expire',
      ],
      { cwd: dir },
    );
    const resultPath = await writeAgentFlightResult(
      dir,
      await readFixture<AgentFlightResultV1>(agentflightFixturePath),
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'check-gates', '--task', taskId, '--from-agentflight', resultPath, '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('--task');
  });
});
