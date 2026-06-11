#!/usr/bin/env node
/* global console, process */
import { spawn } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(repoRoot, 'dist', 'cli', 'index.js');
const taskPath = '.agentloop/tasks/smoke-cli-flow.md';

const SAFE_ENV_KEYS = [
  'APPDATA',
  'HOME',
  'LOCALAPPDATA',
  'PATH',
  'PATHEXT',
  'Path',
  'SystemRoot',
  'TEMP',
  'TMP',
  'USERPROFILE',
  'WINDIR',
];

function childEnv() {
  const env = { FORCE_COLOR: '0' };
  for (const key of SAFE_ENV_KEYS) {
    const value = process.env[key];
    if (value) env[key] = value;
  }
  return env;
}

function formatCommand(command, args) {
  return [command, ...args].join(' ');
}

function toPosixPath(filePath) {
  return String(filePath).replace(/\\/g, '/');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function realPathIfExists(filePath) {
  try {
    return realpathSync.native(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: childEnv(),
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolve({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });
}

async function runRequired(command, args, options = {}) {
  const result = await run(command, args, options);
  if (result.exitCode !== 0) {
    throw new Error(
      `${formatCommand(command, args)} failed with exit code ${result.exitCode}\n${result.stderr || result.stdout}`,
    );
  }
  return result;
}

async function runAgentLoop(args, options = {}) {
  return runRequired(process.execPath, [cliPath, ...args], options);
}

function parseJson(stdout, stepName) {
  try {
    return JSON.parse(stdout);
  } catch {
    throw new Error(`${stepName} did not print JSON:\n${stdout}`);
  }
}

async function assertFileExists(root, relativePath) {
  const filePath = path.join(root, relativePath);
  assert(await pathExists(filePath), `Expected ${relativePath} to exist.`);
}

function assertPathInside(parent, child, label) {
  const realParent = realPathIfExists(parent);
  const realChild = realPathIfExists(child);
  const relative = path.relative(realParent, realChild);
  assert(
    relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative)),
    `${label} was written outside ${realParent}: ${realChild}`,
  );
}

async function prepareSmokeRepo(tempRoot) {
  const smokeRepo = path.join(tempRoot, 'repo');
  await mkdir(smokeRepo, { recursive: true });
  await writeFile(
    path.join(smokeRepo, 'package.json'),
    JSON.stringify({ name: 'agentloopkit-cli-smoke', private: true, type: 'module' }, null, 2),
  );
  await runRequired('git', ['init', '-q'], { cwd: smokeRepo });
  return smokeRepo;
}

async function smokeCli({ keep = false } = {}) {
  const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));
  assert(await pathExists(cliPath), `Built CLI not found at ${cliPath}. Run pnpm build first.`);

  const tempRoot = await mkdtemp(path.join(tmpdir(), 'agentloopkit-cli-smoke-'));
  try {
    const smokeRepo = await prepareSmokeRepo(tempRoot);
    const uninitializedRepo = path.join(tempRoot, 'uninitialized');
    await mkdir(uninitializedRepo, { recursive: true });
    console.log(`CLI smoke for ${packageJson.name}@${packageJson.version}`);

    const version = await runAgentLoop(['version'], { cwd: smokeRepo });
    assert(
      version.stdout.trim() === packageJson.version,
      `Expected version ${packageJson.version}, got ${version.stdout.trim() || '(no output)'}.`,
    );
    console.log('Version smoke passed.');

    const missingConfig = await run(process.execPath, [cliPath, 'status', '--json'], {
      cwd: uninitializedRepo,
    });
    assert(missingConfig.exitCode !== 0, 'status --json without config unexpectedly passed.');
    const missingConfigJson = parseJson(missingConfig.stdout, 'missing config status');
    assert(
      missingConfigJson.error?.code === 'CONFIG_ERROR',
      'Missing config status JSON did not include CONFIG_ERROR.',
    );
    assert(
      missingConfigJson.error?.message?.includes('AgentLoopKit config not found') &&
        missingConfigJson.error?.message?.includes('agentloop init'),
      'Missing config status JSON did not include a useful init hint.',
    );
    console.log('Missing config smoke passed.');

    const dryRun = parseJson(
      (await runAgentLoop(['init', '--dry-run', '--json'], { cwd: smokeRepo })).stdout,
      'init dry-run',
    );
    assert(dryRun.created.length > 0, 'Init dry-run did not report planned files.');
    assert(
      !(await pathExists(path.join(smokeRepo, 'agentloop.config.json'))),
      'Init dry-run wrote agentloop.config.json.',
    );
    console.log('Init dry-run smoke passed.');

    await runAgentLoop(['init'], { cwd: smokeRepo });
    for (const relativePath of [
      'AGENTS.md',
      'AGENTLOOP.md',
      'agentloop.config.json',
      '.agentloop/README.md',
      '.agentloop/harness/commands.md',
      '.agentloop/policies/secrets-policy.md',
    ]) {
      await assertFileExists(smokeRepo, relativePath);
    }
    console.log('Init smoke passed.');

    const doctor = parseJson(
      (await runAgentLoop(['doctor', '--json'], { cwd: smokeRepo })).stdout,
      'doctor',
    );
    assert(Array.isArray(doctor.checks), 'Doctor JSON did not include checks.');
    assert(doctor.serious.length === 0, 'Doctor reported serious setup failures.');
    console.log('Doctor smoke passed.');

    const nestedDir = path.join(smokeRepo, 'src', 'features');
    await mkdir(nestedDir, { recursive: true });

    const createdTask = parseJson(
      (
        await runAgentLoop(
          [
            'create-task',
            '--title',
            'Smoke CLI flow',
            '--type',
            'tests',
            '--out',
            taskPath,
            '--problem',
            'Exercise the built AgentLoopKit CLI in CI.',
            '--outcome',
            'The CLI completes a local smoke flow without publishing.',
            '--constraint',
            'Do not publish, upload, or call external APIs.',
            '--acceptance',
            'The smoke flow completes on every supported CI OS.',
            '--verify-command',
            'node --version',
            '--rollback',
            'Delete the temporary smoke repository.',
            '--json',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'create-task',
    );
    assert(createdTask.task?.path, 'create-task JSON did not include task.path.');
    await assertFileExists(smokeRepo, taskPath);
    console.log('Create-task smoke passed.');

    const activeTask = parseJson(
      (await runAgentLoop(['task', 'set', taskPath, '--json'], { cwd: smokeRepo })).stdout,
      'task set',
    );
    assert(activeTask.activeTask?.path, 'task set JSON did not include activeTask.path.');

    const updatedTask = parseJson(
      (
        await runAgentLoop(['task', 'status', taskPath, 'in-progress', '--json'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'task status',
    );
    assert(updatedTask.task?.status === 'in-progress', 'task status did not set in-progress.');
    console.log('Task lifecycle smoke passed.');

    const verification = parseJson(
      (
        await runAgentLoop(
          [
            'verify',
            '--task',
            taskPath,
            '--no-test',
            '--no-lint',
            '--no-typecheck',
            '--no-build',
            '--command',
            'node --version',
            '--json',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'verify',
    );
    assert(verification.overallStatus === 'pass', 'verify did not report pass.');
    assert(verification.reportPath, 'verify JSON did not include reportPath.');
    assert(await pathExists(verification.reportPath), 'verify report was not written.');
    console.log('Verify smoke passed.');

    const handoff = parseJson(
      (
        await runAgentLoop(
          ['handoff', '--task', taskPath, '--report', verification.reportPath, '--json'],
          { cwd: smokeRepo },
        )
      ).stdout,
      'handoff',
    );
    assert(handoff.outPath, 'handoff JSON did not include outPath.');
    assert(await pathExists(handoff.outPath), 'handoff summary was not written.');
    console.log('Handoff smoke passed.');

    const gates = parseJson(
      (await runAgentLoop(['check-gates', '--json'], { cwd: smokeRepo })).stdout,
      'check-gates',
    );
    assert(['pass', 'warn'].includes(gates.overallStatus), 'check-gates reported failure.');
    assert(Array.isArray(gates.gates), 'check-gates JSON did not include gates.');
    console.log(`Check-gates smoke passed with status ${gates.overallStatus}.`);

    const ship = parseJson((await runAgentLoop(['ship', '--json'], { cwd: smokeRepo })).stdout, 'ship');
    assert(ship.readiness?.totalScore >= 0, 'ship JSON did not include a readiness score.');
    assert(ship.shipReportPath, 'ship JSON did not include shipReportPath.');
    assert(await pathExists(ship.shipReportPath), 'ship report was not written.');
    assert(ship.run?.id, 'ship JSON did not include run.id.');
    console.log('Ship smoke passed.');

    const runs = parseJson((await runAgentLoop(['runs', '--json'], { cwd: smokeRepo })).stdout, 'runs');
    assert(
      Array.isArray(runs.runs) && runs.runs.some((run) => run.id === ship.run.id),
      'runs JSON did not include the ship run.',
    );

    const shownRun = parseJson(
      (await runAgentLoop(['show-run', ship.run.id, '--json'], { cwd: smokeRepo })).stdout,
      'show-run',
    );
    assert(shownRun.run?.metadata?.id === ship.run.id, 'show-run JSON did not include the run.');

    const intent = parseJson(
      (await runAgentLoop(['intent', taskPath, '--json'], { cwd: smokeRepo })).stdout,
      'intent',
    );
    assert(Array.isArray(intent.runs), 'intent JSON did not include runs.');
    console.log('Run ledger smoke passed.');

    const preparedPr = parseJson(
      (await runAgentLoop(['prepare-pr', '--json', '--github-comment'], { cwd: smokeRepo })).stdout,
      'prepare-pr',
    );
    assert(preparedPr.titleSuggestion, 'prepare-pr JSON did not include titleSuggestion.');
    assert(preparedPr.body?.includes('## Verification Evidence'), 'prepare-pr body missing verification section.');
    assert(
      preparedPr.githubComment?.includes('AgentLoopKit Review Readiness'),
      'prepare-pr JSON did not include GitHub comment markdown.',
    );
    console.log('Prepare-pr smoke passed.');

    const maintainer = parseJson(
      (await runAgentLoop(['maintainer-check', '--json'], { cwd: smokeRepo })).stdout,
      'maintainer-check',
    );
    assert(['pass', 'warn'].includes(maintainer.status), 'maintainer-check reported failure.');
    assert(Array.isArray(maintainer.checks), 'maintainer-check JSON did not include checks.');
    console.log(`Maintainer-check smoke passed with status ${maintainer.status}.`);

    const nestedStatus = parseJson(
      (await runAgentLoop(['status', '--json'], { cwd: nestedDir })).stdout,
      'nested status',
    );
    assert(
      nestedStatus.project?.name === 'agentloopkit-cli-smoke',
      'nested status did not use the workspace root config.',
    );

    const nestedTaskPath = '.agentloop/tasks/nested-smoke-flow.md';
    const nestedTask = parseJson(
      (
        await runAgentLoop(
          [
            'create-task',
            '--title',
            'Nested smoke flow',
            '--type',
            'tests',
            '--out',
            nestedTaskPath,
            '--problem',
            'Exercise nested cwd command handling in the built CLI.',
            '--outcome',
            'Nested commands write artifacts to the initialized workspace root.',
            '--acceptance',
            'Nested smoke commands resolve the root AgentLoopKit workspace.',
            '--verify-command',
            'node --version',
            '--json',
          ],
          { cwd: nestedDir },
        )
      ).stdout,
      'nested create-task',
    );
    assert(
      toPosixPath(nestedTask.task?.path ?? '').endsWith(nestedTaskPath),
      'nested task path was not reported.',
    );
    await assertFileExists(smokeRepo, nestedTaskPath);

    const nestedVerification = parseJson(
      (
        await runAgentLoop(
          [
            'verify',
            '--task',
            nestedTaskPath,
            '--no-test',
            '--no-lint',
            '--no-typecheck',
            '--no-build',
            '--command',
            'node --version',
            '--json',
          ],
          { cwd: nestedDir },
        )
      ).stdout,
      'nested verify',
    );
    assert(nestedVerification.overallStatus === 'pass', 'nested verify did not report pass.');
    assert(nestedVerification.reportPath, 'nested verify JSON did not include reportPath.');
    assertPathInside(smokeRepo, nestedVerification.reportPath, 'nested verify report');
    assert(
      await pathExists(nestedVerification.reportPath),
      'nested verify report was not written.',
    );

    const nestedHandoff = parseJson(
      (
        await runAgentLoop(
          [
            'handoff',
            '--task',
            nestedTaskPath,
            '--report',
            nestedVerification.reportPath,
            '--json',
          ],
          { cwd: nestedDir },
        )
      ).stdout,
      'nested handoff',
    );
    assert(nestedHandoff.outPath, 'nested handoff JSON did not include outPath.');
    assertPathInside(smokeRepo, nestedHandoff.outPath, 'nested handoff summary');
    assert(await pathExists(nestedHandoff.outPath), 'nested handoff summary was not written.');

    const nestedGates = parseJson(
      (await runAgentLoop(['check-gates', '--json'], { cwd: nestedDir })).stdout,
      'nested check-gates',
    );
    assert(
      ['pass', 'warn'].includes(nestedGates.overallStatus),
      'nested check-gates reported failure.',
    );
    assert(Array.isArray(nestedGates.gates), 'nested check-gates JSON did not include gates.');

    const nestedPolicies = parseJson(
      (await runAgentLoop(['policy', 'list', '--json'], { cwd: nestedDir })).stdout,
      'nested policy list',
    );
    assert(Array.isArray(nestedPolicies.policies), 'nested policy list did not include policies.');
    assert(nestedPolicies.policies.length > 0, 'nested policy list returned no policies.');

    const nestedAgentInstall = parseJson(
      (await runAgentLoop(['install-agent', 'codex', '--json'], { cwd: nestedDir })).stdout,
      'nested install-agent',
    );
    const nestedAgentPath = nestedAgentInstall.agent?.agentFilePath;
    assert(
      nestedAgentInstall.agent?.name === 'codex' &&
        typeof nestedAgentPath === 'string' &&
        nestedAgentPath.endsWith(path.join('.agentloop', 'agents', 'codex.md')),
      'nested install-agent did not report the codex guide path.',
    );
    assertPathInside(smokeRepo, nestedAgentPath, 'nested install-agent guide');
    await assertFileExists(smokeRepo, '.agentloop/agents/codex.md');
    assert(
      !(await pathExists(path.join(nestedDir, '.agentloop'))),
      'nested commands wrote a .agentloop directory under the invocation cwd.',
    );
    console.log('Nested cwd smoke passed.');

    console.log('CLI smoke passed.');
  } finally {
    if (keep) {
      console.log(`Kept smoke directory: ${tempRoot}`);
    } else {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}

smokeCli({ keep: process.argv.includes('--keep') }).catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`CLI smoke failed: ${message}`);
  process.exitCode = 1;
});
