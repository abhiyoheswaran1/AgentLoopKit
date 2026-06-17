#!/usr/bin/env node
/* global console, process */
import { spawn } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, stat, utimes, writeFile } from 'node:fs/promises';
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

function childEnv(overrides = {}) {
  const env = { FORCE_COLOR: '0' };
  for (const key of SAFE_ENV_KEYS) {
    const value = process.env[key];
    if (value) env[key] = value;
  }
  return { ...env, ...overrides };
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
      env: childEnv(options.env),
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

function resolvePublicPath(root, filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
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

async function prepareReleaseProofSmokeRepo(tempRoot, packageJson) {
  const releaseProofRepo = path.join(tempRoot, 'release-proof-repo');
  const npmRegistryJsonPath = path.join(releaseProofRepo, 'npm-view.json');
  const gitCommitArgs = [
    '-c',
    'user.name=AgentLoopKit Smoke',
    '-c',
    'user.email=smoke@example.invalid',
    '-c',
    'commit.gpgsign=false',
  ];

  await mkdir(releaseProofRepo, { recursive: true });
  await runRequired('git', ['init', '-q'], { cwd: releaseProofRepo });
  await writeFile(
    path.join(releaseProofRepo, 'package.json'),
    JSON.stringify(
      {
        name: 'agentloopkit-cli-smoke',
        version: packageJson.version,
        private: true,
        type: 'module',
      },
      null,
      2,
    ),
  );
  await runRequired('git', ['add', 'package.json'], { cwd: releaseProofRepo });
  await runRequired('git', [...gitCommitArgs, 'commit', '-m', 'Prepare release proof fixture'], {
    cwd: releaseProofRepo,
  });
  await runRequired('git', ['tag', `v${packageJson.version}`], { cwd: releaseProofRepo });
  await writeFile(path.join(releaseProofRepo, 'unreleased.md'), '# Unreleased smoke fixture\n');
  await runRequired('git', ['add', 'unreleased.md'], { cwd: releaseProofRepo });
  await runRequired('git', [...gitCommitArgs, 'commit', '-m', 'Add unreleased fixture'], {
    cwd: releaseProofRepo,
  });
  await writeFile(
    npmRegistryJsonPath,
    JSON.stringify(
      {
        version: packageJson.version,
        versions: ['0.0.0', packageJson.version],
      },
      null,
      2,
    ),
  );

  return { releaseProofRepo, npmRegistryJsonPath };
}

async function prepareReleaseCheckSmokeRepo(tempRoot) {
  const rawReleaseCheckRepo = path.join(tempRoot, 'release-check-repo');
  const gitCommitArgs = [
    '-c',
    'user.name=AgentLoopKit Smoke',
    '-c',
    'user.email=smoke@example.invalid',
    '-c',
    'commit.gpgsign=false',
  ];

  await mkdir(rawReleaseCheckRepo, { recursive: true });
  const releaseCheckRepo = realPathIfExists(rawReleaseCheckRepo);
  const releaseCheckNestedCwd = path.join(releaseCheckRepo, 'packages', 'web');
  await mkdir(releaseCheckNestedCwd, { recursive: true });
  await runRequired('git', ['init', '-q'], { cwd: releaseCheckRepo });
  await writeFile(
    path.join(releaseCheckRepo, 'package.json'),
    JSON.stringify(
      {
        name: 'agentloopkit-release-check-smoke',
        version: '1.2.3',
        private: true,
        type: 'module',
        scripts: {
          test: 'echo test',
          lint: 'echo lint',
          typecheck: 'echo typecheck',
          build: 'echo build',
          'smoke:release': 'echo smoke',
        },
      },
      null,
      2,
    ),
  );
  await writeFile(
    path.join(releaseCheckRepo, 'CHANGELOG.md'),
    '# Changelog\n\n## 1.2.3\n\n- Prepared release-check redaction smoke evidence.\n',
  );
  await runAgentLoop(['init'], { cwd: releaseCheckRepo });
  await writeFile(
    path.join(releaseCheckRepo, '.agentloop/reports/2026-06-11-10-00-verification-report.md'),
    '# Verification Report\n\nOverall status: pass\n',
  );
  await writeFile(
    path.join(releaseCheckRepo, '.agentloop/handoffs/2026-06-11-10-05-pr-summary.md'),
    '# PR Summary\n\nReview release-check smoke evidence.\n',
  );
  await writeFile(
    path.join(releaseCheckRepo, '.agentloop/handoffs/2026-06-11-10-10-release-notes.md'),
    '# Release Notes\n\n## 1.2.3\n\nRelease-check smoke evidence.\n',
  );
  await writeFile(path.join(releaseCheckRepo, '.env.local'), 'SECRET_VALUE=do-not-print\n');
  await runRequired('git', ['add', '.'], { cwd: releaseCheckRepo });
  await runRequired('git', [...gitCommitArgs, 'commit', '-m', 'Prepare release check fixture'], {
    cwd: releaseCheckRepo,
  });
  await writeFile(path.join(releaseCheckRepo, 'src-dirty.js'), 'export const dirty = true;\n');
  await writeFile(
    path.join(releaseCheckRepo, '.agentloop/reports/2026-06-11-10-20-verification-report.md'),
    '# Verification Report\n\nOverall status: pass\n',
  );

  return { releaseCheckRepo, releaseCheckNestedCwd };
}

async function prepareReleaseNotesSmokeRepo(tempRoot) {
  const releaseNotesRepo = path.join(tempRoot, 'release-notes-repo');
  const gitCommitArgs = [
    '-c',
    'user.name=AgentLoopKit Smoke',
    '-c',
    'user.email=smoke@example.invalid',
    '-c',
    'commit.gpgsign=false',
  ];

  await mkdir(releaseNotesRepo, { recursive: true });
  await runRequired('git', ['init', '-q'], { cwd: releaseNotesRepo });
  await writeFile(
    path.join(releaseNotesRepo, 'package.json'),
    JSON.stringify(
      {
        name: `smoke-${releaseNotesRepo}`,
        version: '1.2.3',
        private: true,
        type: 'module',
        scripts: { test: 'echo ok' },
      },
      null,
      2,
    ),
  );
  await writeFile(
    path.join(releaseNotesRepo, 'CHANGELOG.md'),
    '# Changelog\n\n## 1.2.3\n\n- Added release-notes redaction smoke coverage.\n',
  );
  await mkdir(path.join(releaseNotesRepo, 'src'), { recursive: true });
  await writeFile(path.join(releaseNotesRepo, 'src/index.js'), 'export const smoke = true;\n');
  await runAgentLoop(['init'], { cwd: releaseNotesRepo });
  await runRequired('git', ['add', '.'], { cwd: releaseNotesRepo });
  await runRequired('git', [...gitCommitArgs, 'commit', '-m', 'Prepare release notes fixture'], {
    cwd: releaseNotesRepo,
  });

  return releaseNotesRepo;
}

async function writeArtifactOrderingFile(root, relativePath, content, modifiedAt) {
  const filePath = path.join(root, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  const timestamp = new Date(modifiedAt);
  await utimes(filePath, timestamp, timestamp);
}

async function prepareArtifactOrderingSmokeRepo(tempRoot) {
  const artifactOrderingRepo = path.join(tempRoot, 'artifact-ordering-repo');
  const olderGeneratedMtime = '2026-06-16T12:48:00.000Z';
  const newerGeneratedMtime = '2026-06-16T12:32:00.000Z';
  const expectedVerificationPath = '.agentloop/reports/2026-06-16-12-24-verification-report.md';
  const expectedHandoffPath = '.agentloop/handoffs/2026-06-16-12-24-pr-summary.md';
  const expectedShipReportPath = '.agentloop/reports/2026-06-16-12-24-ship-report.md';

  await mkdir(artifactOrderingRepo, { recursive: true });
  await writeFile(
    path.join(artifactOrderingRepo, 'package.json'),
    JSON.stringify(
      { name: 'agentloopkit-artifact-ordering-smoke', private: true, type: 'module' },
      null,
      2,
    ),
  );
  await runRequired('git', ['init', '-q'], { cwd: artifactOrderingRepo });
  await runAgentLoop(['init'], { cwd: artifactOrderingRepo });
  await writeArtifactOrderingFile(
    artifactOrderingRepo,
    '.agentloop/reports/2026-06-16-11-51-verification-report.md',
    '# Older Verification\n\nOverall status: fail\n',
    olderGeneratedMtime,
  );
  await writeArtifactOrderingFile(
    artifactOrderingRepo,
    expectedVerificationPath,
    '# Newer Verification\n\nOverall status: pass\n',
    newerGeneratedMtime,
  );
  await writeArtifactOrderingFile(
    artifactOrderingRepo,
    '.agentloop/handoffs/2026-06-16-11-51-pr-summary.md',
    '# Older Handoff\n',
    olderGeneratedMtime,
  );
  await writeArtifactOrderingFile(
    artifactOrderingRepo,
    expectedHandoffPath,
    '# Newer Handoff\n',
    newerGeneratedMtime,
  );
  await writeArtifactOrderingFile(
    artifactOrderingRepo,
    '.agentloop/reports/2026-06-16-11-51-ship-report.md',
    '# Older Ship\n',
    olderGeneratedMtime,
  );
  await writeArtifactOrderingFile(
    artifactOrderingRepo,
    expectedShipReportPath,
    '# Newer Ship\n',
    newerGeneratedMtime,
  );

  return {
    artifactOrderingRepo,
    expectedVerificationPath,
    expectedHandoffPath,
    expectedShipReportPath,
  };
}

async function writeOldShipReportFixture(root) {
  const reportPath = path.join(root, '.agentloop', 'reports', '2020-01-01-00-00-ship-report.md');
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(
    reportPath,
    [
      '# AgentLoopKit Ship Report',
      '',
      '- Fixture: stale ship report for built CLI smoke coverage.',
      '- Safety: local temp repo only.',
      '',
    ].join('\n'),
  );
  const timestamp = new Date('2020-01-01T00:00:00.000Z');
  await utimes(reportPath, timestamp, timestamp);
  return '.agentloop/reports/2020-01-01-00-00-ship-report.md';
}

async function writeRunMetadataFixture(root, metadata) {
  const runPath = path.join(root, '.agentloop', 'runs', metadata.id);
  await mkdir(runPath, { recursive: true });
  await writeFile(path.join(runPath, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
}

async function prepareStaleArtifactLimitSmokeRepo(tempRoot) {
  const staleArtifactRepo = await prepareSmokeRepo(path.join(tempRoot, 'stale-artifact-limit'));
  const staleVerificationPath = '.agentloop/reports/2026-06-10-09-00-verification-report.md';
  const latestVerificationPath = '.agentloop/reports/2026-06-10-09-30-verification-report.md';
  const staleHandoffPath = '.agentloop/handoffs/2026-06-10-09-05-pr-summary.md';
  const latestHandoffPath = '.agentloop/handoffs/2026-06-10-09-35-pr-summary.md';
  const staleShipReportPath = '.agentloop/reports/2026-06-10-09-10-ship-report.md';
  const latestShipReportPath = '.agentloop/reports/2026-06-10-09-40-ship-report.md';

  await runAgentLoop(['init'], { cwd: staleArtifactRepo });
  await writeArtifactOrderingFile(
    staleArtifactRepo,
    staleVerificationPath,
    '# Verification Report\n\nOverall status: pass\n',
    '2026-06-10T09:00:00.000Z',
  );
  await writeArtifactOrderingFile(
    staleArtifactRepo,
    latestVerificationPath,
    '# Verification Report\n\nOverall status: pass\n',
    '2026-06-10T09:30:00.000Z',
  );
  await writeArtifactOrderingFile(
    staleArtifactRepo,
    staleHandoffPath,
    '# PR Summary\n\nOlder handoff smoke fixture.\n',
    '2026-06-10T09:05:00.000Z',
  );
  await writeArtifactOrderingFile(
    staleArtifactRepo,
    latestHandoffPath,
    '# PR Summary\n\nLatest handoff smoke fixture.\n',
    '2026-06-10T09:35:00.000Z',
  );
  await writeArtifactOrderingFile(
    staleArtifactRepo,
    staleShipReportPath,
    '# AgentLoopKit Ship Report\n\nOlder ship smoke fixture.\n',
    '2026-06-10T09:10:00.000Z',
  );
  await writeArtifactOrderingFile(
    staleArtifactRepo,
    latestShipReportPath,
    '# AgentLoopKit Ship Report\n\nLatest ship smoke fixture.\n',
    '2026-06-10T09:40:00.000Z',
  );
  await writeRunMetadataFixture(staleArtifactRepo, {
    id: '2026-06-10-09-15-verify',
    command: 'verify',
    createdAt: '2026-06-10-09-15',
    createdAtEpochMs: 1781082900000,
    verificationReportPath: staleVerificationPath,
  });
  await writeRunMetadataFixture(staleArtifactRepo, {
    id: '2026-06-10-09-45-ship',
    command: 'ship',
    createdAt: '2026-06-10-09-45',
    createdAtEpochMs: 1781084700000,
    verificationReportPath: latestVerificationPath,
    handoffPath: latestHandoffPath,
    shipReportPath: latestShipReportPath,
  });

  return { staleArtifactRepo, staleShipReportPath };
}

async function prepareDefaultStalePreviewSmokeRepo(tempRoot) {
  const defaultStaleRepo = await prepareSmokeRepo(path.join(tempRoot, 'default-stale-preview'));
  const hiddenDefaultStaleVerificationPath =
    '.agentloop/reports/2026-06-10-08-50-verification-report.md';

  await runAgentLoop(['init'], { cwd: defaultStaleRepo });
  for (let minute = 0; minute <= 50; minute += 1) {
    const paddedMinute = String(minute).padStart(2, '0');
    const relativePath = `.agentloop/reports/2026-06-10-08-${paddedMinute}-verification-report.md`;
    await writeArtifactOrderingFile(
      defaultStaleRepo,
      relativePath,
      '# Verification Report\n\nOverall status: pass\n',
      `2026-06-10T08:${paddedMinute}:00.000Z`,
    );
  }
  await writeArtifactOrderingFile(
    defaultStaleRepo,
    '.agentloop/reports/2026-06-10-09-00-verification-report.md',
    '# Verification Report\n\nOverall status: pass\n',
    '2026-06-10T09:00:00.000Z',
  );

  return { defaultStaleRepo, hiddenDefaultStaleVerificationPath };
}

function agentFlightPlaceholderMarkdown(title, status = 'proposed') {
  return `# ${title}

- Created date: 2026-06-17
- Task type: feature
- Status: ${status}

## Problem Statement
AgentFlight session task: ${title}

## Desired Outcome
Task is implemented with local verification evidence.
`;
}

async function smokeCli({ keep = false } = {}) {
  const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));
  assert(await pathExists(cliPath), `Built CLI not found at ${cliPath}. Run pnpm build first.`);

  const tempRoot = await mkdtemp(path.join(tmpdir(), 'agentloopkit-cli-smoke-'));
  try {
    const smokeRepo = await prepareSmokeRepo(tempRoot);
    const smokeGitRoot = realPathIfExists(smokeRepo);
    const uninitializedRepo = path.join(tempRoot, 'uninitialized');
    await mkdir(uninitializedRepo, { recursive: true });
    console.log(`CLI smoke for ${packageJson.name}@${packageJson.version}`);

    const version = await runAgentLoop(['version'], { cwd: smokeRepo });
    assert(
      version.stdout.trim() === packageJson.version,
      `Expected version ${packageJson.version}, got ${version.stdout.trim() || '(no output)'}.`,
    );
    console.log('Version smoke passed.');

    const npmStatusRegistryJsonPath = path.join(tempRoot, 'npm-status-view.json');
    const npmStatusEnvPath = path.join(tempRoot, '.env.npm-status-smoke');
    await writeFile(
      npmStatusRegistryJsonPath,
      JSON.stringify(
        {
          version: packageJson.version,
          versions: ['0.0.0', packageJson.version],
        },
        null,
        2,
      ),
    );
    await writeFile(npmStatusEnvPath, 'NPM_TOKEN=do-not-print\n');
    const npmStatus = parseJson(
      (
        await runAgentLoop(
          ['npm-status', '--agentloopkit', '--registry-json', npmStatusRegistryJsonPath, '--json'],
          { cwd: smokeRepo },
        )
      ).stdout,
      'npm-status captured registry',
    );
    assert(npmStatus.status === 'current', 'npm-status captured registry was not current.');
    assert(
      npmStatus.packageName === 'agentloopkit',
      'npm-status captured registry did not check agentloopkit.',
    );
    assert(
      npmStatus.localVersion === packageJson.version,
      'npm-status captured registry did not use the built package version.',
    );
    assert(
      npmStatus.source?.command === 'captured npm view JSON',
      'npm-status captured registry did not use captured JSON as the source.',
    );
    assert(
      npmStatus.registry?.hasLocalVersion === true,
      'npm-status captured registry did not report the local version.',
    );
    assert(
      npmStatus.safety?.doesNot?.includes('publish packages') &&
        npmStatus.safety?.doesNot?.includes('read .env files') &&
        npmStatus.safety?.doesNot?.includes('change package metadata'),
      'npm-status captured registry did not preserve safety claims.',
    );

    const npmStatusHuman = await runAgentLoop(
      [
        'npm-status',
        '--agentloopkit',
        '--registry-json',
        npmStatusRegistryJsonPath,
        '--expect-current',
      ],
      { cwd: smokeRepo },
    );
    assert(
      npmStatusHuman.stdout.includes('npm latest matches local package version'),
      'npm-status --expect-current did not print the current status.',
    );
    assert(
      npmStatusHuman.stdout.includes(
        'This command only runs `npm view --json agentloopkit version versions` unless `--registry-json` is provided.',
      ),
      'npm-status --expect-current did not print the safety boundary.',
    );

    const npmStatusEnvRefusal = await run(
      process.execPath,
      [cliPath, 'npm-status', '--registry-json', npmStatusEnvPath, '--json'],
      { cwd: smokeRepo },
    );
    assert(npmStatusEnvRefusal.exitCode !== 0, 'npm-status accepted an env registry JSON path.');
    const npmStatusEnvError = parseJson(npmStatusEnvRefusal.stdout, 'npm-status env refusal');
    assert(
      npmStatusEnvError.error?.code === 'NPM_STATUS_REGISTRY_JSON_INVALID',
      'npm-status env refusal did not return the expected error code.',
    );
    assert(
      npmStatusEnvError.error?.reason === 'env-file',
      'npm-status env refusal did not report env-file reason.',
    );
    assert(
      !npmStatusEnvRefusal.stdout.includes('do-not-print') &&
        !npmStatusEnvRefusal.stderr.includes('do-not-print'),
      'npm-status env refusal printed env fixture contents.',
    );
    console.log('Npm-status captured registry smoke passed.');

    const releaseProofCompletion = await runAgentLoop(['completion', 'bash'], { cwd: smokeRepo });
    const releaseProofCompletionChannels = [
      'npm',
      'github-release',
      'github-marketplace',
      'ghcr',
      'mcp-registry',
    ];
    assert(
      releaseProofCompletion.stdout.includes('release-proof'),
      'completion bash did not include release-proof.',
    );
    assert(
      releaseProofCompletion.stdout.includes('"$previous" == "--only"'),
      'release-proof completion did not include --only channel guard.',
    );
    for (const channel of releaseProofCompletionChannels) {
      assert(
        releaseProofCompletion.stdout.includes(channel),
        `release-proof completion did not include channel ${channel}.`,
      );
    }
    console.log('Release-proof completion smoke passed.');

    const { releaseProofRepo, npmRegistryJsonPath } = await prepareReleaseProofSmokeRepo(
      tempRoot,
      packageJson,
    );
    const releaseProofHeadTagArgs = ['release-proof', '--only', 'npm', '--json'];
    const releaseProofHeadTag = parseJson(
      (
        await runAgentLoop(
          [...releaseProofHeadTagArgs, '--npm-registry-json', npmRegistryJsonPath],
          {
            cwd: releaseProofRepo,
          },
        )
      ).stdout,
      'release-proof HEAD tag',
    );
    assert(
      releaseProofHeadTag.overallStatus === 'pass',
      'release-proof HEAD tag smoke did not pass.',
    );
    assert(
      releaseProofHeadTag.git?.tagCommit,
      'release-proof HEAD tag smoke did not include git.tagCommit.',
    );
    assert(
      releaseProofHeadTag.git?.headMatchesTag === false,
      'release-proof HEAD tag smoke did not report headMatchesTag false.',
    );
    assert(
      releaseProofHeadTag.nextAction?.command === 'agentloop release-check',
      'release-proof HEAD tag smoke did not recommend release-check.',
    );
    assert(
      !JSON.stringify(releaseProofHeadTag).includes(smokeRepo),
      'release-proof HEAD tag JSON leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(releaseProofHeadTag).includes(releaseProofRepo),
      'release-proof HEAD tag JSON leaked the absolute release-proof repo path.',
    );
    console.log('Release-proof HEAD tag smoke passed.');

    const { releaseCheckRepo, releaseCheckNestedCwd } =
      await prepareReleaseCheckSmokeRepo(tempRoot);
    const releaseCheckHuman = await runAgentLoop(['release-check'], {
      cwd: releaseCheckNestedCwd,
    });
    const redactedReleaseCheckHuman = await runAgentLoop(['release-check', '--redact-paths'], {
      cwd: releaseCheckNestedCwd,
    });
    const releaseCheckJson = parseJson(
      (await runAgentLoop(['release-check', '--json'], { cwd: releaseCheckNestedCwd })).stdout,
      'release-check',
    );
    const redactedReleaseCheck = parseJson(
      (
        await runAgentLoop(['release-check', '--json', '--redact-paths'], {
          cwd: releaseCheckNestedCwd,
        })
      ).stdout,
      'release-check redacted',
    );
    assert(
      releaseCheckHuman.stdout.includes('# AgentLoopKit Release Check'),
      'release-check human output did not include the expected heading.',
    );
    assert(
      redactedReleaseCheckHuman.stdout.includes('# AgentLoopKit Release Check'),
      'release-check --redact-paths human output did not include the expected heading.',
    );
    assert(
      releaseCheckJson.git?.root === releaseCheckRepo,
      'release-check JSON did not include the absolute git root before redaction.',
    );
    assert(
      releaseCheckJson.git?.changedFileCount === 2,
      'release-check JSON did not report the expected dirty file count.',
    );
    assert(
      releaseCheckJson.git?.nonEvidenceChangedFileCount === 1,
      'release-check JSON did not report the expected non-evidence file count.',
    );
    assert(
      releaseCheckJson.git?.agentLoopEvidenceChangedFileCount === 1,
      'release-check JSON did not report the expected AgentLoop evidence file count.',
    );
    assert(
      releaseCheckHuman.stdout.includes(
        '- Changed files: `2` (`1` non-evidence, `1` AgentLoop evidence)',
      ),
      'release-check human output did not include the changed-file evidence split.',
    );
    assert(
      redactedReleaseCheck.git?.root === '[git-root]',
      'release-check --json --redact-paths did not redact the git root.',
    );
    assert(
      redactedReleaseCheck.safety?.doesNot?.includes('publish packages'),
      'release-check redacted JSON did not preserve safety claims.',
    );
    assert(
      !releaseCheckHuman.stdout.includes('do-not-print') &&
        !JSON.stringify(releaseCheckJson).includes('do-not-print') &&
        !redactedReleaseCheckHuman.stdout.includes('do-not-print') &&
        !JSON.stringify(redactedReleaseCheck).includes('do-not-print'),
      'release-check smoke printed env fixture contents.',
    );
    assert(
      !redactedReleaseCheckHuman.stdout.includes(releaseCheckRepo),
      'release-check --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedReleaseCheck).includes(releaseCheckRepo),
      'release-check --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Release-check redaction smoke passed.');

    const {
      artifactOrderingRepo,
      expectedVerificationPath,
      expectedHandoffPath,
      expectedShipReportPath,
    } = await prepareArtifactOrderingSmokeRepo(tempRoot);
    const artifactOrderingStatusArgs = ['status', '--json'];
    const artifactOrderingStatus = parseJson(
      (
        await runAgentLoop([...artifactOrderingStatusArgs, '--redact-paths'], {
          cwd: artifactOrderingRepo,
        })
      ).stdout,
      'artifact ordering status',
    );
    assert(
      artifactOrderingStatus.latestReport?.path === expectedVerificationPath,
      'status --json did not select the latest generated verification report by filename.',
    );
    assert(
      artifactOrderingStatus.latestReport?.overallStatus === 'pass',
      'status --json did not read the newer generated verification report.',
    );

    const artifactOrderingInventoryArgs = ['artifacts', '--json'];
    const artifactOrderingInventory = parseJson(
      (
        await runAgentLoop([...artifactOrderingInventoryArgs, '--redact-paths'], {
          cwd: artifactOrderingRepo,
        })
      ).stdout,
      'artifact ordering artifacts',
    );
    assert(
      artifactOrderingInventory.verificationReports.latest?.path === expectedVerificationPath,
      'artifacts --json did not select the latest generated verification report by filename.',
    );
    assert(
      artifactOrderingInventory.handoffs.latest?.path === expectedHandoffPath,
      'artifacts --json did not select the latest generated handoff by filename.',
    );
    assert(
      artifactOrderingInventory.shipReports.latest?.path === expectedShipReportPath,
      'artifacts --json did not select the latest generated ship report by filename.',
    );
    assert(
      !JSON.stringify(artifactOrderingStatus).includes(smokeRepo) &&
        !JSON.stringify(artifactOrderingInventory).includes(smokeRepo),
      'generated artifact ordering JSON leaked the absolute smoke repo path.',
    );
    console.log('Generated artifact filename ordering smoke passed.');

    const fishCompletion = await runAgentLoop(['completion', 'fish'], { cwd: smokeRepo });
    const fishTaskArchivePredicate =
      '__fish_seen_subcommand_from task; and __fish_seen_subcommand_from archive';
    const fishArchiveStatusValue = "-l status -a 'done'";
    for (const commandName of ['agentloop', 'agentloopkit']) {
      assert(
        fishCompletion.stdout.includes(
          `complete -c ${commandName} -n '${fishTaskArchivePredicate}'`,
        ),
        `completion fish did not include nested task archive predicate for ${commandName}.`,
      );
      assert(
        fishCompletion.stdout.includes(
          `complete -c ${commandName} -n '${fishTaskArchivePredicate}' ${fishArchiveStatusValue}`,
        ),
        `completion fish did not include task archive --status value for ${commandName}.`,
      );
      assert(
        !fishCompletion.stdout.includes(
          `complete -c ${commandName} -n '__fish_seen_subcommand_from archive' -l status`,
        ),
        `completion fish still included top-level archive status predicate for ${commandName}.`,
      );
    }
    console.log('Fish task archive completion smoke passed.');

    const listTemplatesHuman = await runAgentLoop(['list-templates'], { cwd: smokeRepo });
    const listTemplates = parseJson(
      (await runAgentLoop(['list-templates', '--json'], { cwd: smokeRepo })).stdout,
      'list-templates',
    );
    assert(
      listTemplatesHuman.stdout.includes('agents:') &&
        listTemplatesHuman.stdout.includes('  - codex.md'),
      'list-templates human output did not include agent templates.',
    );
    assert(
      listTemplatesHuman.stdout.includes('root:') &&
        listTemplatesHuman.stdout.includes('  - AGENTLOOP.md'),
      'list-templates human output did not include root templates.',
    );
    assert(
      listTemplates.templates?.agents?.includes('codex.md'),
      'list-templates JSON did not include codex.md.',
    );
    assert(
      listTemplates.templates?.root?.includes('AGENTLOOP.md'),
      'list-templates JSON did not include AGENTLOOP.md.',
    );

    const zshCompletion = await runAgentLoop(['completion', 'zsh'], { cwd: smokeRepo });
    const powershellCompletion = await runAgentLoop(['completion', 'powershell'], {
      cwd: smokeRepo,
    });
    const pwshCompletion = await runAgentLoop(['completion', 'pwsh'], { cwd: smokeRepo });
    const unsupportedCompletion = await run(process.execPath, [cliPath, 'completion', 'nushell'], {
      cwd: smokeRepo,
    });
    assert(
      zshCompletion.stdout.includes('#compdef agentloop agentloopkit'),
      'completion zsh did not include the expected compdef.',
    );
    assert(
      zshCompletion.stdout.includes('_agentloop()'),
      'completion zsh did not include the agentloop function.',
    );
    assert(
      powershellCompletion.stdout.includes('Register-ArgumentCompleter'),
      'completion powershell did not include Register-ArgumentCompleter.',
    );
    assert(
      powershellCompletion.stdout.includes('agentloopkit'),
      'completion powershell did not include the agentloopkit command.',
    );
    assert(
      powershellCompletion.stdout === pwshCompletion.stdout,
      'completion pwsh did not match powershell output.',
    );
    assert(
      !powershellCompletion.stdout.includes('$PROFILE'),
      'completion powershell included a shell profile mutation hint.',
    );
    assert(
      unsupportedCompletion.exitCode !== 0,
      'completion unsupported shell unexpectedly passed.',
    );
    assert(
      unsupportedCompletion.stderr.includes('Unsupported shell "nushell"'),
      'completion unsupported shell did not explain the unsupported shell.',
    );
    console.log('Template and completion command smoke passed.');

    const schemastore = parseJson(
      (await runAgentLoop(['schemastore', '--json'], { cwd: smokeRepo })).stdout,
      'schemastore',
    );
    const schemaStoreSchemaUrl =
      'https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json';
    assert(
      schemastore.entry?.name === 'AgentLoopKit Configuration',
      'schemastore JSON did not include the expected entry name.',
    );
    assert(
      schemastore.entry?.fileMatch?.includes('agentloop.config.json'),
      'schemastore JSON did not include agentloop.config.json fileMatch.',
    );
    assert(
      schemastore.entry?.url === schemaStoreSchemaUrl,
      'schemastore JSON did not include the expected schema URL.',
    );
    assert(schemastore.safety?.writesFiles === false, 'schemastore reported file writes.');
    assert(schemastore.safety?.callsNetwork === false, 'schemastore reported network calls.');
    console.log('SchemaStore smoke passed.');

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

    const forcedHome = path.join(tempRoot, 'forced-home');
    await mkdir(forcedHome, { recursive: true });
    const forcedHomeWarning =
      'Warning: Target directory is your home directory. AgentLoopKit can write repository harness files there when --force is used.';
    const forcedHomeDryRun = await runAgentLoop(['init', '--dry-run', '--force'], {
      cwd: forcedHome,
      env: { HOME: forcedHome },
    });
    assert(
      forcedHomeDryRun.stdout.includes(forcedHomeWarning),
      'forced home-directory dry-run did not print the warning.',
    );
    assert(
      forcedHomeDryRun.stdout.includes('No files written.'),
      'forced home-directory dry-run did not report no writes.',
    );
    for (const relativePath of [
      'agentloop.config.json',
      'AGENTS.md',
      'AGENTLOOP.md',
      '.agentloop',
    ]) {
      assert(
        !(await pathExists(path.join(forcedHome, relativePath))),
        `forced home-directory dry-run wrote ${relativePath}.`,
      );
    }
    console.log('Forced home-directory dry-run warning smoke passed.');

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

    await writeFile(
      path.join(smokeRepo, 'github-issue.json'),
      JSON.stringify(
        {
          number: 42,
          title: 'Smoke GitHub metadata issue',
          state: 'OPEN',
          url: 'https://github.com/example/agentloopkit-smoke/issues/42',
          author: { login: 'octocat' },
          labels: [{ name: 'smoke' }],
          body: 'Local dry-run fixture for the built CLI smoke script.',
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(smokeRepo, 'github-pr.json'),
      JSON.stringify(
        {
          number: 77,
          title: 'Smoke GitHub metadata PR',
          state: 'OPEN',
          url: 'https://github.com/example/agentloopkit-smoke/pull/77',
          author: { login: 'contributor' },
          labels: [{ name: 'smoke-pr' }],
          isDraft: false,
          baseRefName: 'main',
          headRefName: 'smoke/github-metadata',
          changedFiles: 2,
          additions: 17,
          deletions: 3,
          body: 'Local PR fixture for the built CLI smoke script.',
        },
        null,
        2,
      ),
    );
    const githubImport = parseJson(
      (
        await runAgentLoop(
          ['github', 'import', '--issue-json', 'github-issue.json', '--dry-run', '--json'],
          { cwd: smokeRepo },
        )
      ).stdout,
      'github import dry-run',
    );
    assert(githubImport.status === 'pass', 'github import dry-run did not pass.');
    assert(githubImport.dryRun === true, 'github import dry-run did not report dryRun true.');
    assert(
      githubImport.writesFiles === false,
      'github import dry-run reported it would write files.',
    );
    assert(githubImport.issue?.number === 42, 'github import dry-run did not import issue #42.');
    assert(
      githubImport.safety?.readsOnlyExplicitJson === true,
      'github import dry-run did not preserve explicit JSON safety.',
    );
    assert(
      githubImport.safety?.callsGithubApi === false,
      'github import dry-run reported a GitHub API call.',
    );
    assert(
      githubImport.safety?.readsTokens === false,
      'github import dry-run reported token reads.',
    );
    assert(
      githubImport.safety?.readsEnvFiles === false,
      'github import dry-run reported env-file reads.',
    );
    assert(
      !(await pathExists(path.join(smokeRepo, '.agentloop/github/context.json'))),
      'github import dry-run wrote .agentloop/github/context.json.',
    );
    console.log('GitHub metadata dry-run smoke passed.');

    const githubWriteImport = parseJson(
      (
        await runAgentLoop(
          [
            'github',
            'import',
            '--issue-json',
            'github-issue.json',
            '--pr-json',
            'github-pr.json',
            '--json',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'github import write',
    );
    assert(githubWriteImport.status === 'pass', 'github import write did not pass.');
    assert(githubWriteImport.dryRun === false, 'github import write reported dryRun true.');
    assert(githubWriteImport.writesFiles === true, 'github import write did not report writes.');
    assert(
      githubWriteImport.outputPath === '.agentloop/github/context.json',
      'github import write did not report the repo-relative context path.',
    );
    assert(githubWriteImport.issue?.number === 42, 'github import write did not import issue #42.');
    assert(
      githubWriteImport.pullRequest?.number === 77,
      'github import write did not import PR #77.',
    );
    assert(
      githubWriteImport.safety?.callsGithubApi === false &&
        githubWriteImport.safety?.readsTokens === false &&
        githubWriteImport.safety?.readsEnvFiles === false,
      'github import write did not preserve safety claims.',
    );
    assert(
      await pathExists(path.join(smokeRepo, '.agentloop/github/context.json')),
      'github import write did not write .agentloop/github/context.json.',
    );
    const githubContext = parseJson(
      await readFile(path.join(smokeRepo, '.agentloop/github/context.json'), 'utf8'),
      'github metadata context',
    );
    assert(githubContext.issue?.number === 42, 'written GitHub context missing issue #42.');
    assert(githubContext.pullRequest?.number === 77, 'written GitHub context missing PR #77.');
    assert(
      !JSON.stringify(githubWriteImport).includes(smokeRepo) &&
        !JSON.stringify(githubContext).includes(smokeRepo),
      'github import write leaked the absolute smoke repo path.',
    );
    console.log('GitHub metadata write smoke passed.');

    const redactedHarnessUpgrade = parseJson(
      (await runAgentLoop(['upgrade-harness', '--json', '--redact-paths'], { cwd: smokeRepo }))
        .stdout,
      'upgrade-harness',
    );
    assert(
      redactedHarnessUpgrade.status === 'pass',
      'upgrade-harness did not pass after fresh init.',
    );
    assert(redactedHarnessUpgrade.writesFiles === false, 'upgrade-harness should be read-only.');
    assert(
      redactedHarnessUpgrade.targetDirectory === '[agentloop-root]',
      'upgrade-harness did not redact the target directory.',
    );
    console.log('Harness upgrade smoke passed.');

    const doctor = parseJson(
      (await runAgentLoop(['doctor', '--json'], { cwd: smokeRepo })).stdout,
      'doctor',
    );
    assert(Array.isArray(doctor.checks), 'Doctor JSON did not include checks.');
    assert(doctor.serious.length === 0, 'Doctor reported serious setup failures.');
    console.log('Doctor smoke passed.');

    const doctorRedactedHuman = await runAgentLoop(['doctor', '--redact-paths'], {
      cwd: smokeRepo,
    });
    assert(
      doctorRedactedHuman.stdout.includes('- [`pass`] `Git root`: `[git-root]`'),
      'doctor --redact-paths did not redact the Git root in human output.',
    );
    assert(
      !doctorRedactedHuman.stdout.includes(smokeRepo),
      'doctor --redact-paths leaked the absolute smoke repo path.',
    );

    const doctorRedactedJson = parseJson(
      (
        await runAgentLoop(['doctor', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'doctor redacted',
    );
    assert(
      doctorRedactedJson.git?.root === '[git-root]',
      'doctor --json --redact-paths did not redact the Git root.',
    );
    assert(
      doctorRedactedJson.checks?.some(
        (check) => check.name === 'Git root' && check.message === '[git-root]',
      ),
      'doctor --json --redact-paths did not redact the Git root check.',
    );
    assert(
      !JSON.stringify(doctorRedactedJson).includes(smokeRepo),
      'doctor --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Doctor redaction smoke passed.');

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
            '--likely-file',
            'dist/cli/index.js',
            '--acceptance',
            'The smoke flow completes on every supported CI OS.',
            '--verify-command',
            'node task-command-output.mjs',
            '--post-verification',
            'node post-gate-output.mjs',
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
    assert(
      createdTask.activeTask?.path === taskPath,
      'create-task JSON did not set the created task as active.',
    );
    await assertFileExists(smokeRepo, taskPath);

    const smokeTaskPath = path.join(smokeRepo, taskPath);
    const smokeTaskMarkdown = await readFile(smokeTaskPath, 'utf8');
    await writeFile(
      smokeTaskPath,
      `${smokeTaskMarkdown}\n## Local Redaction Fixture\n\nSmoke repo root: ${smokeRepo}\nSmoke real git root: ${smokeGitRoot}\n`,
    );

    const currentAfterCreate = parseJson(
      (await runAgentLoop(['task', 'current', '--json'], { cwd: smokeRepo })).stdout,
      'task current after create-task',
    );
    assert(
      currentAfterCreate.activeTask?.path === taskPath,
      'task current did not report the task created by create-task.',
    );
    console.log('Create-task smoke passed.');

    const placeholderTitle = 'Smoke AgentFlight placeholder';
    const placeholderTaskPath = '.agentloop/tasks/smoke-agentflight-placeholder.md';
    await writeFile(
      path.join(smokeRepo, placeholderTaskPath),
      agentFlightPlaceholderMarkdown(placeholderTitle, 'deferred'),
    );
    const deferredTaskTitle = 'Smoke deferred task';
    await writeFile(
      path.join(smokeRepo, '.agentloop/tasks/smoke-deferred-task.md'),
      `# ${deferredTaskTitle}\n\n- Status: deferred\n`,
    );

    const taskList = parseJson(
      (await runAgentLoop(['task', 'list', '--json'], { cwd: smokeRepo })).stdout,
      'task list',
    );
    assert(Array.isArray(taskList.tasks), 'task list JSON did not include tasks.');
    assert(Array.isArray(taskList.taskContracts), 'task list JSON did not include taskContracts.');
    assert(
      Array.isArray(taskList.agentFlightPlaceholders),
      'task list JSON did not include agentFlightPlaceholders.',
    );
    const realTaskContract = taskList.taskContracts.find((task) => task.title === 'Smoke CLI flow');
    const placeholderTask = taskList.agentFlightPlaceholders.find(
      (task) => task.title === placeholderTitle,
    );
    assert(realTaskContract, 'task list JSON did not include the ordinary task contract group.');
    assert(
      realTaskContract.source !== 'agentflight-placeholder',
      'task list JSON marked the ordinary task as an AgentFlight placeholder.',
    );
    assert(
      placeholderTask?.source === 'agentflight-placeholder',
      'task list JSON did not include the AgentFlight placeholder group.',
    );
    assert(
      taskList.tasks.length ===
        taskList.taskContracts.length + taskList.agentFlightPlaceholders.length,
      'task list JSON grouped counts did not match the flat task count.',
    );
    const compactTaskList = parseJson(
      (await runAgentLoop(['task', 'list', '--json', '--brief'], { cwd: smokeRepo })).stdout,
      'compact task list',
    );
    assert(
      compactTaskList.tasks === undefined,
      'task list --json --brief included the full flat task array.',
    );
    assert(
      compactTaskList.totalCount === taskList.tasks.length,
      'task list --json --brief changed the total task count.',
    );
    assert(
      compactTaskList.taskContracts?.count === taskList.taskContracts.length,
      'task list --json --brief changed the ordinary task count.',
    );
    assert(
      compactTaskList.agentFlightPlaceholders?.count === taskList.agentFlightPlaceholders.length,
      'task list --json --brief changed the AgentFlight placeholder count.',
    );
    assert(
      compactTaskList.agentFlightPlaceholders?.preview?.length <= 3,
      'task list --json --brief did not bound the AgentFlight placeholder preview.',
    );
    const currentAfterTaskList = parseJson(
      (await runAgentLoop(['task', 'current', '--json'], { cwd: smokeRepo })).stdout,
      'task current after task list',
    );
    assert(
      currentAfterTaskList.activeTask?.path === taskPath,
      'task list JSON changed the active task pointer.',
    );
    console.log('Task-list JSON groups smoke passed.');

    const deferredTaskListHuman = await runAgentLoop(['task', 'list', '--status', 'deferred'], {
      cwd: smokeRepo,
    });
    assert(
      deferredTaskListHuman.stdout.includes(deferredTaskTitle),
      'task list --status deferred did not include the deferred task.',
    );
    assert(
      deferredTaskListHuman.stdout.includes(placeholderTitle),
      'task list --status deferred did not include the deferred AgentFlight placeholder.',
    );
    assert(
      !deferredTaskListHuman.stdout.includes('Smoke CLI flow'),
      'task list --status deferred included a proposed task.',
    );

    const deferredTaskList = parseJson(
      (
        await runAgentLoop(['task', 'list', '--json', '--status', 'deferred'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'task list status filter',
    );
    assert(
      deferredTaskList.tasks.every((task) => task.status === 'deferred'),
      'task list --json --status deferred returned a non-deferred flat task.',
    );
    assert(
      deferredTaskList.taskContracts.every((task) => task.status === 'deferred'),
      'task list --json --status deferred returned a non-deferred task contract.',
    );
    assert(
      deferredTaskList.agentFlightPlaceholders.every((task) => task.status === 'deferred'),
      'task list --json --status deferred returned a non-deferred AgentFlight placeholder.',
    );
    assert(
      deferredTaskList.taskContracts.some((task) => task.title === deferredTaskTitle),
      'task list --json --status deferred did not include the deferred task contract group.',
    );
    assert(
      deferredTaskList.agentFlightPlaceholders.some((task) => task.title === placeholderTitle),
      'task list --json --status deferred did not include the deferred placeholder group.',
    );
    assert(
      !deferredTaskList.tasks.some((task) => task.title === 'Smoke CLI flow'),
      'task list --json --status deferred included the proposed active task.',
    );
    assert(
      deferredTaskList.tasks.length ===
        deferredTaskList.taskContracts.length + deferredTaskList.agentFlightPlaceholders.length,
      'task list --json --status deferred grouped counts did not match the flat task count.',
    );
    const compactDeferredTaskList = parseJson(
      (
        await runAgentLoop(['task', 'list', '--json', '--brief', '--status', 'deferred'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'compact task list status filter',
    );
    assert(
      compactDeferredTaskList.tasks === undefined,
      'task list --json --brief --status deferred included the full flat task array.',
    );
    assert(
      compactDeferredTaskList.statusFilter === 'deferred',
      'task list --json --brief --status deferred did not report the status filter.',
    );
    assert(
      compactDeferredTaskList.totalCount === deferredTaskList.tasks.length,
      'task list --json --brief --status deferred changed the total task count.',
    );
    assert(
      compactDeferredTaskList.taskContracts?.count === deferredTaskList.taskContracts.length,
      'task list --json --brief --status deferred changed the task contract count.',
    );
    assert(
      compactDeferredTaskList.agentFlightPlaceholders?.count ===
        deferredTaskList.agentFlightPlaceholders.length,
      'task list --json --brief --status deferred changed the placeholder count.',
    );
    const currentAfterTaskListStatus = parseJson(
      (await runAgentLoop(['task', 'current', '--json'], { cwd: smokeRepo })).stdout,
      'task current after task list status filter',
    );
    assert(
      currentAfterTaskListStatus.activeTask?.path === taskPath,
      'task list --status changed the active task pointer.',
    );

    const taskListStatusErrorResult = await run(
      process.execPath,
      [cliPath, 'task', 'list', '--status', 'waiting', '--json'],
      { cwd: smokeRepo },
    );
    assert(
      taskListStatusErrorResult.exitCode !== 0,
      'task list --status waiting unexpectedly passed.',
    );
    assert(
      taskListStatusErrorResult.stderr === '',
      'task list --status waiting --json wrote to stderr.',
    );
    const taskListStatusError = parseJson(
      taskListStatusErrorResult.stdout,
      'task list unsupported status',
    );
    assert(
      taskListStatusError.error?.code === 'UNSUPPORTED_TASK_STATUS',
      'task list --status waiting --json returned the wrong error code.',
    );
    assert(
      taskListStatusError.error?.requestedStatus === 'waiting',
      'task list --status waiting --json did not report the requested status.',
    );
    console.log('Task-list status filter smoke passed.');

    const taskShowRedactedHuman = await runAgentLoop(['task', 'show', taskPath, '--redact-paths'], {
      cwd: smokeRepo,
    });
    const taskShowRedactedJson = parseJson(
      (
        await runAgentLoop(['task', 'show', taskPath, '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'task show redacted',
    );
    assert(
      taskShowRedactedHuman.stdout.includes('[git-root]'),
      'task show --redact-paths did not redact the local root in human output.',
    );
    assert(
      taskShowRedactedJson.task?.content?.includes('[git-root]'),
      'task show --json --redact-paths did not redact task content.',
    );
    assert(
      !taskShowRedactedHuman.stdout.includes(smokeRepo) &&
        !taskShowRedactedHuman.stdout.includes(smokeGitRoot),
      'task show --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(taskShowRedactedJson).includes(smokeRepo) &&
        !JSON.stringify(taskShowRedactedJson).includes(smokeGitRoot),
      'task show --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Task-show redaction smoke passed.');

    const taskDoctorRedactedHuman = await runAgentLoop(['task', 'doctor', '--redact-paths'], {
      cwd: smokeRepo,
    });
    assert(
      taskDoctorRedactedHuman.stdout.includes('Status: `pass`'),
      'task doctor --redact-paths did not report pass.',
    );
    assert(
      !taskDoctorRedactedHuman.stdout.includes(smokeRepo),
      'task doctor --redact-paths leaked the absolute smoke repo path.',
    );

    const taskDoctorRedactedJson = parseJson(
      (
        await runAgentLoop(['task', 'doctor', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'task doctor redacted',
    );
    assert(
      taskDoctorRedactedJson.taskDoctor?.overallStatus === 'pass',
      'task doctor --json --redact-paths did not report pass.',
    );
    assert(
      !JSON.stringify(taskDoctorRedactedJson).includes(smokeRepo),
      'task doctor --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Task-doctor redaction smoke passed.');

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

    await writeFile(
      path.join(smokeRepo, 'task-command-output.mjs'),
      "console.log('task-command-smoke');\n",
    );
    await writeFile(
      path.join(smokeRepo, 'post-gate-output.mjs'),
      "console.log('post-verification-gate-smoke');\n",
    );
    const taskCommandVerification = parseJson(
      (
        await runAgentLoop(
          [
            'verify',
            '--task',
            taskPath,
            '--task-commands',
            '--only-task-commands',
            '--post-verification-gates',
            '--write-run',
            '--json',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'verify task commands and post-verification gates',
    );
    assert(
      taskCommandVerification.overallStatus === 'pass',
      'task-command verify did not report pass.',
    );
    assert(
      taskCommandVerification.taskCommands?.requested === true,
      'task-command verify did not report requested task commands.',
    );
    assert(
      taskCommandVerification.taskCommands?.foundCount === 1,
      'task-command verify did not find exactly one task command.',
    );
    assert(
      taskCommandVerification.postVerificationGates?.requested === true,
      'task-command verify did not request post-verification gates.',
    );
    assert(
      taskCommandVerification.postVerificationGates?.foundCount === 1,
      'task-command verify did not find exactly one post-verification gate.',
    );
    assert(
      taskCommandVerification.postVerificationGates?.results?.[0]?.passed === true,
      'task-command verify post-verification gate did not pass.',
    );
    assert(
      taskCommandVerification.run?.id,
      'task-command verify did not write a run when --write-run was used.',
    );
    const taskCommandVerificationReportPath = resolvePublicPath(
      smokeRepo,
      taskCommandVerification.reportPath,
    );
    assert(
      await pathExists(taskCommandVerificationReportPath),
      'task-command verify report was not written.',
    );
    console.log('Task-command post-verification smoke passed.');

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
            '--write-run',
            '--json',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'verify',
    );
    assert(verification.overallStatus === 'pass', 'verify did not report pass.');
    assert(verification.reportPath, 'verify JSON did not include reportPath.');
    const verificationReportPath = resolvePublicPath(smokeRepo, verification.reportPath);
    assert(await pathExists(verificationReportPath), 'verify report was not written.');
    assert(verification.run?.id, 'verify JSON did not include run.id when --write-run was used.');
    console.log('Verify smoke passed.');

    const redactedVerification = parseJson(
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
            '--write-run',
            '--json',
            '--redact-paths',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'verify redacted',
    );
    assert(
      redactedVerification.overallStatus === verification.overallStatus,
      'verify --json --redact-paths changed the overall status.',
    );
    assert(
      redactedVerification.commands?.length === verification.commands?.length,
      'verify --json --redact-paths changed command evidence count.',
    );
    assert(
      redactedVerification.commands?.every((command) => command.passed === true),
      'verify --json --redact-paths did not preserve passing command evidence.',
    );
    assert(
      redactedVerification.reportPath,
      'verify --json --redact-paths did not include reportPath.',
    );
    assert(
      redactedVerification.run?.id,
      'verify --json --redact-paths did not include run.id when --write-run was used.',
    );
    const redactedVerificationReportPath = resolvePublicPath(
      smokeRepo,
      redactedVerification.reportPath,
    );
    assert(
      await pathExists(redactedVerificationReportPath),
      'verify --json --redact-paths report was not written.',
    );
    const redactedVerificationReport = await readFile(redactedVerificationReportPath, 'utf8');
    assert(
      redactedVerificationReport.includes('# Verification Report'),
      'verify --redact-paths report did not include verification report Markdown.',
    );
    assert(
      !redactedVerificationReport.includes(smokeRepo) &&
        !redactedVerificationReport.includes(smokeGitRoot),
      'verify --redact-paths report leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedVerification).includes(smokeRepo) &&
        !JSON.stringify(redactedVerification).includes(smokeGitRoot),
      'verify --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Verify redaction smoke passed.');

    await writeFile(
      path.join(smokeRepo, 'progress-output.mjs'),
      "console.log('raw-child-output-hidden-from-progress');\n",
    );
    const progressVerification = await runAgentLoop(
      [
        'verify',
        '--task',
        taskPath,
        '--no-test',
        '--no-lint',
        '--no-typecheck',
        '--no-build',
        '--command',
        'node progress-output.mjs',
        '--progress',
      ],
      { cwd: smokeRepo },
    );
    assert(
      progressVerification.stdout.includes('[1/1] custom started: `node progress-output.mjs`'),
      'verify --progress did not print the command start line.',
    );
    assert(
      /\[1\/1\] custom passed in \d+ms/.test(progressVerification.stdout),
      'verify --progress did not print the command finish line.',
    );
    assert(
      !progressVerification.stdout.includes('raw-child-output-hidden-from-progress'),
      'verify --progress streamed raw child output to stdout.',
    );
    console.log('Verify progress smoke passed.');

    const handoff = parseJson(
      (
        await runAgentLoop(
          [
            'handoff',
            '--task',
            taskPath,
            '--report',
            verification.reportPath,
            '--write-run',
            '--json',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'handoff',
    );
    assert(handoff.outPath, 'handoff JSON did not include outPath.');
    const handoffPath = resolvePublicPath(smokeRepo, handoff.outPath);
    assert(await pathExists(handoffPath), 'handoff summary was not written.');
    assert(handoff.run?.id, 'handoff JSON did not include run.id when --write-run was used.');
    console.log('Handoff smoke passed.');

    const gatesHuman = await runAgentLoop(['check-gates'], { cwd: smokeRepo });
    const redactedGatesHuman = await runAgentLoop(['check-gates', '--redact-paths'], {
      cwd: smokeRepo,
    });
    const gates = parseJson(
      (await runAgentLoop(['check-gates', '--json'], { cwd: smokeRepo })).stdout,
      'check-gates',
    );
    const redactedGates = parseJson(
      (
        await runAgentLoop(['check-gates', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'check-gates redacted',
    );
    assert(
      gatesHuman.stdout.includes('# AgentLoopKit Gates'),
      'check-gates human output did not include the expected heading.',
    );
    assert(
      redactedGatesHuman.stdout.includes('# AgentLoopKit Gates'),
      'check-gates --redact-paths human output did not include the expected heading.',
    );
    assert(['pass', 'warn'].includes(gates.overallStatus), 'check-gates reported failure.');
    assert(Array.isArray(gates.gates), 'check-gates JSON did not include gates.');
    assert(
      gates.git?.root === smokeGitRoot,
      'check-gates JSON did not include the resolved git root before redaction.',
    );
    assert(
      redactedGates.git?.root === '[git-root]',
      'check-gates --json --redact-paths did not redact the git root.',
    );
    assert(
      redactedGates.overallStatus === gates.overallStatus,
      'check-gates --json --redact-paths changed the overall status.',
    );
    assert(
      JSON.stringify(redactedGates.gates) === JSON.stringify(gates.gates),
      'check-gates --json --redact-paths changed gate decisions.',
    );
    assert(
      !redactedGatesHuman.stdout.includes(smokeRepo) &&
        !redactedGatesHuman.stdout.includes(smokeGitRoot),
      'check-gates --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedGates).includes(smokeRepo) &&
        !JSON.stringify(redactedGates).includes(smokeGitRoot),
      'check-gates --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Check-gates redaction smoke passed.');
    console.log(`Check-gates smoke passed with status ${gates.overallStatus}.`);

    const oldShipReportPath = await writeOldShipReportFixture(smokeRepo);

    const ship = parseJson(
      (await runAgentLoop(['ship', '--json', '--github-comment'], { cwd: smokeRepo })).stdout,
      'ship',
    );
    assert(ship.readiness?.totalScore >= 0, 'ship JSON did not include a readiness score.');
    assert(ship.shipReportPath, 'ship JSON did not include shipReportPath.');
    const shipReportPath = resolvePublicPath(smokeRepo, ship.shipReportPath);
    assert(await pathExists(shipReportPath), 'ship report was not written.');
    assert(ship.run?.id, 'ship JSON did not include run.id.');
    assert(
      ship.githubComment?.includes('AgentLoopKit Review Readiness'),
      'ship JSON did not include GitHub comment markdown.',
    );
    console.log('Ship smoke passed.');

    const artifacts = parseJson(
      (await runAgentLoop(['artifacts', '--json'], { cwd: smokeRepo })).stdout,
      'artifacts',
    );
    const redactedArtifactsHuman = await runAgentLoop(['artifacts', '--redact-paths'], {
      cwd: smokeRepo,
    });
    const redactedArtifacts = parseJson(
      (
        await runAgentLoop(['artifacts', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'artifacts redacted',
    );
    assert(
      redactedArtifactsHuman.stdout.includes('# AgentLoopKit Artifacts'),
      'artifacts --redact-paths did not include the expected heading.',
    );
    assert(
      redactedArtifacts.tasks?.count === artifacts.tasks?.count,
      'artifacts --json --redact-paths changed task count.',
    );
    assert(
      redactedArtifacts.verificationReports?.latest?.path ===
        artifacts.verificationReports?.latest?.path,
      'artifacts --json --redact-paths changed latest verification path.',
    );
    assert(
      redactedArtifacts.handoffs?.latest?.path === artifacts.handoffs?.latest?.path,
      'artifacts --json --redact-paths changed latest handoff path.',
    );
    assert(
      !redactedArtifactsHuman.stdout.includes(smokeRepo) &&
        !redactedArtifactsHuman.stdout.includes(smokeGitRoot),
      'artifacts --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedArtifacts).includes(smokeRepo) &&
        !JSON.stringify(redactedArtifacts).includes(smokeGitRoot),
      'artifacts --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Artifacts redaction smoke passed.');

    const shipReportArtifacts = parseJson(
      (await runAgentLoop(['artifacts', '--type', 'ship-report', '--json'], { cwd: smokeRepo }))
        .stdout,
      'artifacts ship-report',
    );
    assert(
      shipReportArtifacts.shipReports?.count >= 1,
      'artifacts --type ship-report JSON did not include a ship report count.',
    );
    assert(
      shipReportArtifacts.shipReports?.latest?.path === ship.shipReportPath,
      'artifacts --type ship-report JSON did not point at the latest ship report.',
    );

    const latestShipReportArtifact = await runAgentLoop(
      ['artifacts', '--type', 'ship-report', '--latest'],
      { cwd: smokeRepo },
    );
    assert(
      latestShipReportArtifact.stdout.includes(ship.shipReportPath),
      'artifacts --type ship-report --latest did not include the latest ship report.',
    );
    console.log('Latest ship-report artifact smoke passed.');

    const latestRunArtifact = await runAgentLoop(['artifacts', '--type', 'run', '--latest'], {
      cwd: smokeRepo,
    });
    assert(
      latestRunArtifact.stdout.includes(ship.run.id),
      'artifacts --type run --latest did not include the latest ship run.',
    );
    assert(
      latestRunArtifact.stdout.includes('changed file(s)'),
      'artifacts --type run --latest did not include changed-file scope.',
    );
    assert(
      latestRunArtifact.stdout.includes('non-evidence') &&
        latestRunArtifact.stdout.includes('AgentLoop evidence'),
      'artifacts --type run --latest did not split AgentLoop evidence churn.',
    );
    console.log('Artifact run split smoke passed.');

    const staleShipReportArtifacts = parseJson(
      (
        await runAgentLoop(['artifacts', '--stale', '--type', 'ship-report', '--json'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'artifacts stale ship-report',
    );
    assert(
      staleShipReportArtifacts.stale?.safety?.readOnly === true,
      'artifacts --stale --type ship-report did not report read-only safety.',
    );
    assert(
      staleShipReportArtifacts.stale?.deletesFiles === false,
      'artifacts --stale --type ship-report reported destructive behavior.',
    );
    assert(
      staleShipReportArtifacts.stale?.candidateCount === 1,
      'artifacts --stale --type ship-report did not report the expected stale ship report.',
    );
    assert(
      staleShipReportArtifacts.stale?.candidates?.[0]?.path === oldShipReportPath,
      'artifacts --stale --type ship-report did not point at the stale fixture.',
    );
    assert(
      staleShipReportArtifacts.stale?.candidates?.every(
        (candidate) => candidate.type === 'ship-report',
      ),
      'artifacts --stale --type ship-report included a non-ship-report candidate.',
    );
    console.log('Ship report artifact smoke passed.');

    const { staleArtifactRepo, staleShipReportPath } =
      await prepareStaleArtifactLimitSmokeRepo(tempRoot);
    const { defaultStaleRepo, hiddenDefaultStaleVerificationPath } =
      await prepareDefaultStalePreviewSmokeRepo(tempRoot);
    const defaultStaleArtifacts = parseJson(
      (await runAgentLoop(['artifacts', '--stale', '--json'], { cwd: defaultStaleRepo })).stdout,
      'artifacts default stale preview',
    );
    assert(
      defaultStaleArtifacts.stale?.candidateCount === 51,
      'artifacts --stale --json did not report all default stale candidates.',
    );
    assert(
      defaultStaleArtifacts.stale?.shownCandidateCount === 51,
      'artifacts --stale --json unexpectedly capped shown candidate count.',
    );
    assert(
      defaultStaleArtifacts.stale?.hiddenCandidateCount === 0,
      'artifacts --stale --json unexpectedly hid default stale candidates.',
    );
    assert(
      defaultStaleArtifacts.stale?.limit === null,
      'artifacts --stale --json unexpectedly reported a default limit.',
    );
    assert(
      defaultStaleArtifacts.stale?.candidates?.length === 51,
      'artifacts --stale --json did not keep the complete candidate list.',
    );

    const defaultStaleArtifactsHuman = await runAgentLoop(['artifacts', '--stale'], {
      cwd: defaultStaleRepo,
    });
    assert(
      defaultStaleArtifactsHuman.stdout.includes('- Showing `50` of `51` candidate(s).'),
      'artifacts --stale did not print the default bounded candidate count.',
    );
    assert(
      defaultStaleArtifactsHuman.stdout.includes('- Hidden candidates: `1`.'),
      'artifacts --stale did not print the default hidden candidate count.',
    );
    assert(
      !defaultStaleArtifactsHuman.stdout.includes(hiddenDefaultStaleVerificationPath),
      'artifacts --stale printed candidates beyond the default Markdown cap.',
    );
    console.log('Default stale artifact preview smoke passed.');

    const boundedStaleArtifacts = parseJson(
      (
        await runAgentLoop(['artifacts', '--stale', '--limit', '2', '--json'], {
          cwd: staleArtifactRepo,
        })
      ).stdout,
      'artifacts stale limit',
    );
    assert(
      boundedStaleArtifacts.stale?.candidateCount === 4,
      'artifacts --stale --limit 2 JSON did not report all stale candidates.',
    );
    assert(
      boundedStaleArtifacts.stale?.shownCandidateCount === 2,
      'artifacts --stale --limit 2 JSON did not report the shown candidate count.',
    );
    assert(
      boundedStaleArtifacts.stale?.hiddenCandidateCount === 2,
      'artifacts --stale --limit 2 JSON did not report hidden candidates.',
    );
    assert(
      boundedStaleArtifacts.stale?.limit === 2,
      'artifacts --stale --limit 2 JSON did not report the applied limit.',
    );
    assert(
      boundedStaleArtifacts.stale?.candidates?.length === 2,
      'artifacts --stale --limit 2 JSON did not bound the candidate list.',
    );

    const boundedStaleArtifactsHuman = await runAgentLoop(
      ['artifacts', '--stale', '--limit', '2'],
      {
        cwd: staleArtifactRepo,
      },
    );
    assert(
      boundedStaleArtifactsHuman.stdout.includes('- Showing `2` of `4` candidate(s).'),
      'artifacts --stale --limit 2 did not print the bounded candidate count.',
    );
    assert(
      boundedStaleArtifactsHuman.stdout.includes('- Hidden candidates: `2`.'),
      'artifacts --stale --limit 2 did not print the hidden candidate count.',
    );
    assert(
      !boundedStaleArtifactsHuman.stdout.includes(staleShipReportPath),
      'artifacts --stale --limit 2 printed candidates beyond the limit.',
    );

    const limitWithoutStale = await run(
      process.execPath,
      [cliPath, 'artifacts', '--limit', '2', '--json'],
      { cwd: staleArtifactRepo },
    );
    assert(limitWithoutStale.exitCode !== 0, 'artifacts --limit 2 passed without --stale.');
    assert(limitWithoutStale.stderr === '', 'artifacts --limit 2 --json wrote to stderr.');
    const limitWithoutStaleError = parseJson(
      limitWithoutStale.stdout,
      'artifacts limit without stale',
    );
    assert(
      limitWithoutStaleError.error?.code === 'LIMIT_REQUIRES_STALE_PREVIEW',
      'artifacts --limit 2 without --stale did not return the expected error code.',
    );
    assert(
      limitWithoutStaleError.error?.message === 'Use --limit with --stale.',
      'artifacts --limit 2 without --stale did not return the expected message.',
    );
    assert(
      limitWithoutStaleError.error?.options?.includes('limit') &&
        limitWithoutStaleError.error?.options?.includes('stale'),
      'artifacts --limit 2 without --stale did not report both relevant options.',
    );
    console.log('Stale artifact limit smoke passed.');

    const redactedReportRelativePath = '.agentloop/reports/redacted-smoke-report.html';
    const redactedBadgeRelativePath = '.agentloop/reports/redacted-smoke-badge.svg';
    const redactedReportPath = path.join(smokeRepo, redactedReportRelativePath);
    const redactedBadgePath = path.join(smokeRepo, redactedBadgeRelativePath);
    const expectedRedactedReportPath = '[git-root]/.agentloop/reports/redacted-smoke-report.html';
    const expectedRedactedBadgePath = '[git-root]/.agentloop/reports/redacted-smoke-badge.svg';

    const redactedReport = parseJson(
      (
        await runAgentLoop(['report', '--out', redactedReportPath, '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'report redacted',
    );
    assert(
      toPosixPath(redactedReport.outPath ?? '') === expectedRedactedReportPath,
      'redacted report JSON did not redact the HTML report path.',
    );
    assert(
      !JSON.stringify(redactedReport).includes(smokeRepo),
      'redacted report JSON leaked the absolute smoke repo path.',
    );
    await assertFileExists(smokeRepo, redactedReportRelativePath);
    const redactedReportHtml = await readFile(redactedReportPath, 'utf8');
    assert(redactedReportHtml.includes('<html'), 'redacted report smoke did not write HTML.');

    const redactedBadge = parseJson(
      (
        await runAgentLoop(['badge', '--out', redactedBadgePath, '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'badge redacted',
    );
    assert(
      toPosixPath(redactedBadge.outPath ?? '') === expectedRedactedBadgePath,
      'redacted badge JSON did not redact the SVG badge path.',
    );
    assert(
      !JSON.stringify(redactedBadge).includes(smokeRepo),
      'redacted badge JSON leaked the absolute smoke repo path.',
    );
    await assertFileExists(smokeRepo, redactedBadgeRelativePath);
    const redactedBadgeSvg = await readFile(redactedBadgePath, 'utf8');
    assert(redactedBadgeSvg.includes('<svg'), 'redacted badge smoke did not write SVG.');
    console.log('Report and badge redaction smoke passed.');

    const redactedCiSummaryRelativePath = '.agentloop/reports/redacted-smoke-ci-summary.md';
    const redactedCiSummaryPath = path.join(smokeRepo, redactedCiSummaryRelativePath);
    const expectedRedactedCiSummaryPath =
      '[git-root]/.agentloop/reports/redacted-smoke-ci-summary.md';
    const redactedCiSummary = parseJson(
      (
        await runAgentLoop(
          ['ci-summary', '--write', '--out', redactedCiSummaryPath, '--json', '--redact-paths'],
          {
            cwd: smokeRepo,
            env: {
              GITHUB_ACTIONS: 'true',
              GITHUB_WORKFLOW: `CI ${smokeRepo}`,
            },
          },
        )
      ).stdout,
      'ci-summary redacted',
    );
    assert(
      toPosixPath(redactedCiSummary.writtenPath ?? '') === expectedRedactedCiSummaryPath,
      'redacted ci-summary JSON did not redact the summary path.',
    );
    assert(
      redactedCiSummary.ci?.workflow === 'CI [git-root]',
      'redacted ci-summary JSON did not redact the workflow value.',
    );
    assert(
      redactedCiSummary.markdown?.includes('- Workflow: `CI [git-root]`'),
      'redacted ci-summary JSON did not include redacted Markdown.',
    );
    assert(
      !JSON.stringify(redactedCiSummary).includes(smokeRepo),
      'redacted ci-summary JSON leaked the absolute smoke repo path.',
    );
    await assertFileExists(smokeRepo, redactedCiSummaryRelativePath);
    const redactedCiSummaryMarkdown = await readFile(redactedCiSummaryPath, 'utf8');
    assert(
      redactedCiSummaryMarkdown.includes('- Workflow: `CI [git-root]`'),
      'redacted ci-summary smoke did not write redacted Markdown.',
    );
    assert(
      !redactedCiSummaryMarkdown.includes(smokeRepo),
      'redacted ci-summary Markdown leaked the absolute smoke repo path.',
    );
    console.log('CI summary redaction smoke passed.');

    const releaseNotesRepo = await prepareReleaseNotesSmokeRepo(tempRoot);
    const redactedReleaseNotesRelativePath = '.agentloop/handoffs/redacted-smoke-release-notes.md';
    const redactedReleaseNotesPath = path.join(releaseNotesRepo, redactedReleaseNotesRelativePath);
    const expectedRedactedReleaseNotesPath =
      '[git-root]/.agentloop/handoffs/redacted-smoke-release-notes.md';
    const redactedReleaseNotes = parseJson(
      (
        await runAgentLoop(
          [
            'release-notes',
            '--write',
            '--out',
            redactedReleaseNotesPath,
            '--json',
            '--redact-paths',
          ],
          { cwd: releaseNotesRepo },
        )
      ).stdout,
      'release-notes redacted',
    );
    assert(
      toPosixPath(redactedReleaseNotes.writtenPath ?? '') === expectedRedactedReleaseNotesPath,
      'redacted release-notes JSON did not redact the written path.',
    );
    assert(
      redactedReleaseNotes.packageName === 'smoke-[git-root]',
      'redacted release-notes JSON did not redact the package name.',
    );
    assert(
      redactedReleaseNotes.markdown?.includes('- Package: `smoke-[git-root]`'),
      'redacted release-notes JSON did not include redacted Markdown.',
    );
    assert(
      !JSON.stringify(redactedReleaseNotes).includes(releaseNotesRepo),
      'redacted release-notes JSON leaked the absolute release notes repo path.',
    );
    await assertFileExists(releaseNotesRepo, redactedReleaseNotesRelativePath);
    const redactedReleaseNotesMarkdown = await readFile(redactedReleaseNotesPath, 'utf8');
    assert(
      redactedReleaseNotesMarkdown.includes('- Package: `smoke-[git-root]`'),
      'redacted release-notes smoke did not write redacted Markdown.',
    );
    assert(
      !redactedReleaseNotesMarkdown.includes(releaseNotesRepo),
      'redacted release-notes Markdown leaked the absolute release notes repo path.',
    );
    console.log('Release-notes redaction smoke passed.');

    const statusWithRun = parseJson(
      (await runAgentLoop(['status', '--json'], { cwd: smokeRepo })).stdout,
      'status with latest run',
    );
    assert(
      statusWithRun.latestRun?.id === ship.run.id,
      'status JSON did not include the latest ship run.',
    );
    assert(
      statusWithRun.brief?.includes(`run="ship ${ship.readiness.totalScore}/100"`),
      'status brief did not include the latest ship score.',
    );

    const statusHuman = await runAgentLoop(['status'], { cwd: smokeRepo });
    const redactedStatusHuman = await runAgentLoop(['status', '--redact-paths'], {
      cwd: smokeRepo,
    });
    const redactedStatus = parseJson(
      (await runAgentLoop(['status', '--json', '--redact-paths'], { cwd: smokeRepo })).stdout,
      'status redacted',
    );
    const compactStatus = parseJson(
      (
        await runAgentLoop(['status', '--json', '--brief', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'compact status JSON',
    );
    const nextAction = parseJson(
      (await runAgentLoop(['next', '--json'], { cwd: smokeRepo })).stdout,
      'next',
    );
    const nextHuman = await runAgentLoop(['next'], { cwd: smokeRepo });
    const redactedNextHuman = await runAgentLoop(['next', '--redact-paths'], {
      cwd: smokeRepo,
    });
    const redactedNext = parseJson(
      (await runAgentLoop(['next', '--json', '--redact-paths'], { cwd: smokeRepo })).stdout,
      'next redacted',
    );
    assert(
      statusHuman.stdout.includes('# AgentLoopKit Status'),
      'status human output did not include the expected heading.',
    );
    assert(
      redactedStatusHuman.stdout.includes('# AgentLoopKit Status'),
      'status --redact-paths human output did not include the expected heading.',
    );
    assert(
      nextHuman.stdout.includes('# AgentLoopKit Next Action'),
      'next human output did not include the expected heading.',
    );
    assert(
      redactedNextHuman.stdout.includes('# AgentLoopKit Next Action'),
      'next --redact-paths human output did not include the expected heading.',
    );
    assert(redactedStatus.git?.root === '[git-root]', 'status did not redact the git root.');
    assert(redactedStatus.git?.targetIsRoot === true, 'status changed the git target.');
    assert(
      redactedStatus.latestRun?.id === statusWithRun.latestRun?.id,
      'status --json --redact-paths changed the latest run.',
    );
    assert(
      redactedStatus.brief?.includes(`run="ship ${ship.readiness.totalScore}/100"`),
      'status --json --redact-paths changed the latest ship score.',
    );
    assert(
      compactStatus.workingTree?.changedFiles === undefined,
      'status --json --brief included full changed-file details.',
    );
    assert(compactStatus.markdown === undefined, 'status --json --brief included Markdown output.');
    assert(
      compactStatus.workingTree?.changedFileCount === statusWithRun.workingTree?.changedFileCount,
      'status --json --brief changed working-tree counts.',
    );
    assert(
      Number.isInteger(compactStatus.agentFlightPlaceholderTasks?.count),
      'status --json --brief did not include AgentFlight placeholder count.',
    );
    assert(
      compactStatus.nextAction?.command === statusWithRun.nextAction?.command,
      'status --json --brief changed next action.',
    );
    assert(
      compactStatus.git?.root === '[git-root]',
      'status --json --brief --redact-paths did not redact the git root.',
    );
    assert(
      redactedNext.command === nextAction.command,
      'next --json --redact-paths changed command.',
    );
    assert(redactedNext.reason === nextAction.reason, 'next --json --redact-paths changed reason.');
    const redactedStatusAndNextOutput = [
      redactedStatusHuman.stdout,
      JSON.stringify(redactedStatus),
      JSON.stringify(compactStatus),
      redactedNextHuman.stdout,
      JSON.stringify(redactedNext),
    ].join('\n');
    assert(
      !redactedStatusAndNextOutput.includes(smokeRepo) &&
        !redactedStatusAndNextOutput.includes(smokeGitRoot),
      'status/next --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Compact status JSON smoke passed.');
    console.log('Status and next redaction smoke passed.');

    const reviewContext = parseJson(
      (await runAgentLoop(['review-context', '--json'], { cwd: smokeRepo })).stdout,
      'review-context',
    );
    const reviewContextHuman = await runAgentLoop(['review-context'], { cwd: smokeRepo });
    const redactedReviewContextHuman = await runAgentLoop(['review-context', '--redact-paths'], {
      cwd: smokeRepo,
    });
    const redactedReviewContext = parseJson(
      (
        await runAgentLoop(['review-context', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'review-context redacted',
    );
    assert(
      reviewContext.latestShip?.score === ship.readiness.totalScore,
      'review-context JSON did not include the latest ship score.',
    );
    assert(
      reviewContext.gates?.overallStatus === 'pass',
      'review-context JSON did not include passing gates.',
    );
    assert(
      reviewContext.githubMetadata?.path === '.agentloop/github/context.json',
      'review-context JSON did not include the GitHub metadata context path.',
    );
    assert(
      reviewContext.githubMetadata?.issue?.number === 42,
      'review-context JSON did not include imported issue #42.',
    );
    assert(
      reviewContext.githubMetadata?.pullRequest?.number === 77,
      'review-context JSON did not include imported PR #77.',
    );
    assert(
      reviewContextHuman.stdout.includes('# AgentLoopKit Review Context'),
      'review-context human output did not include the expected heading.',
    );
    assert(
      redactedReviewContextHuman.stdout.includes('# AgentLoopKit Review Context'),
      'review-context --redact-paths human output did not include the expected heading.',
    );
    assert(
      redactedReviewContext.latestShip?.score === reviewContext.latestShip?.score,
      'review-context --json --redact-paths changed the latest ship score.',
    );
    assert(
      redactedReviewContext.gates?.overallStatus === reviewContext.gates?.overallStatus,
      'review-context --json --redact-paths changed gate status.',
    );
    assert(
      redactedReviewContext.artifacts?.tasks?.count === reviewContext.artifacts?.tasks?.count,
      'review-context --json --redact-paths changed task artifact count.',
    );
    assert(
      !JSON.stringify(reviewContext).includes(smokeRepo),
      'review-context JSON leaked the absolute smoke repo path.',
    );
    assert(
      !redactedReviewContextHuman.stdout.includes(smokeRepo) &&
        !redactedReviewContextHuman.stdout.includes(smokeGitRoot),
      'review-context --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedReviewContext).includes(smokeRepo) &&
        !JSON.stringify(redactedReviewContext).includes(smokeGitRoot),
      'review-context --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Review-context redaction smoke passed.');
    console.log('Review-context smoke passed.');

    const runs = parseJson(
      (await runAgentLoop(['runs', '--json'], { cwd: smokeRepo })).stdout,
      'runs',
    );
    assert(
      Array.isArray(runs.runs) &&
        runs.runs.some((run) => run.id === verification.run.id && run.command === 'verify') &&
        runs.runs.some((run) => run.id === handoff.run.id && run.command === 'handoff') &&
        runs.runs.some((run) => run.id === ship.run.id && run.command === 'ship'),
      'runs JSON did not include verify, handoff, and ship runs.',
    );
    const latestRuns = await runAgentLoop(['runs', '--latest'], { cwd: smokeRepo });
    assert(
      latestRuns.stdout.includes(ship.run.id),
      'runs --latest did not include the latest ship run.',
    );
    assert(
      !latestRuns.stdout.includes(handoff.run.id) &&
        !latestRuns.stdout.includes(verification.run.id),
      'runs --latest included older run entries.',
    );
    const limitedRuns = parseJson(
      (await runAgentLoop(['runs', '--limit', '2', '--json'], { cwd: smokeRepo })).stdout,
      'runs --limit',
    );
    assert(Array.isArray(limitedRuns.runs), 'runs --limit JSON did not include runs.');
    assert(limitedRuns.runs.length === 2, 'runs --limit 2 did not return exactly two runs.');
    assert(
      limitedRuns.runs[0]?.id === ship.run.id && limitedRuns.runs[1]?.id === handoff.run.id,
      'runs --limit 2 did not return the newest two runs in order.',
    );
    console.log('Run ledger limit smoke passed.');

    const latestRunsJson = parseJson(
      (await runAgentLoop(['runs', '--latest', '--json'], { cwd: smokeRepo })).stdout,
      'runs --latest JSON',
    );
    const latestRunsRedacted = await runAgentLoop(['runs', '--latest', '--redact-paths'], {
      cwd: smokeRepo,
    });
    const latestRunsRedactedJson = parseJson(
      (
        await runAgentLoop(['runs', '--latest', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'runs --latest redacted JSON',
    );
    assert(
      latestRunsRedacted.stdout === latestRuns.stdout,
      'runs --latest --redact-paths changed human output.',
    );
    assert(
      JSON.stringify(latestRunsRedactedJson) === JSON.stringify(latestRunsJson),
      'runs --latest --json --redact-paths changed JSON output.',
    );

    const shownRun = await runAgentLoop(['show-run', ship.run.id], { cwd: smokeRepo });
    const shownRunRedacted = await runAgentLoop(['show-run', ship.run.id, '--redact-paths'], {
      cwd: smokeRepo,
    });
    const shownRunJson = parseJson(
      (await runAgentLoop(['show-run', ship.run.id, '--json'], { cwd: smokeRepo })).stdout,
      'show-run',
    );
    const shownRunRedactedJson = parseJson(
      (
        await runAgentLoop(['show-run', ship.run.id, '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'show-run redacted',
    );
    assert(
      shownRunJson.run?.metadata?.id === ship.run.id,
      'show-run JSON did not include the run.',
    );
    assert(
      shownRunRedacted.stdout === shownRun.stdout,
      'show-run --redact-paths changed human output.',
    );
    assert(
      JSON.stringify(shownRunRedactedJson) === JSON.stringify(shownRunJson),
      'show-run --json --redact-paths changed JSON output.',
    );

    const intent = await runAgentLoop(['intent', taskPath], { cwd: smokeRepo });
    const intentRedacted = await runAgentLoop(['intent', taskPath, '--redact-paths'], {
      cwd: smokeRepo,
    });
    const intentJson = parseJson(
      (await runAgentLoop(['intent', taskPath, '--json'], { cwd: smokeRepo })).stdout,
      'intent',
    );
    const intentRedactedJson = parseJson(
      (
        await runAgentLoop(['intent', taskPath, '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'intent redacted',
    );
    assert(Array.isArray(intentJson.runs), 'intent JSON did not include runs.');
    assert(intentRedacted.stdout === intent.stdout, 'intent --redact-paths changed human output.');
    assert(
      JSON.stringify(intentRedactedJson) === JSON.stringify(intentJson),
      'intent --json --redact-paths changed JSON output.',
    );
    const runLedgerRedactionOutput = [
      latestRunsRedacted.stdout,
      JSON.stringify(latestRunsRedactedJson),
      shownRunRedacted.stdout,
      JSON.stringify(shownRunRedactedJson),
      intentRedacted.stdout,
      JSON.stringify(intentRedactedJson),
    ].join('\n');
    assert(
      !runLedgerRedactionOutput.includes(smokeRepo),
      'run ledger --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Run ledger redaction smoke passed.');
    console.log('Run ledger smoke passed.');

    const redactedHandoff = parseJson(
      (
        await runAgentLoop(
          [
            'handoff',
            '--task',
            taskPath,
            '--report',
            verification.reportPath,
            '--write-run',
            '--json',
            '--redact-paths',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'handoff redacted',
    );
    assert(redactedHandoff.outPath, 'handoff --json --redact-paths did not include outPath.');
    assert(
      redactedHandoff.run?.id,
      'handoff --json --redact-paths did not include run.id when --write-run was used.',
    );
    const redactedHandoffPath = resolvePublicPath(smokeRepo, redactedHandoff.outPath);
    assert(
      await pathExists(redactedHandoffPath),
      'handoff --json --redact-paths summary was not written.',
    );
    const redactedHandoffSummary = await readFile(redactedHandoffPath, 'utf8');
    assert(
      redactedHandoffSummary.includes('# PR Summary'),
      'handoff --redact-paths summary did not include PR summary Markdown.',
    );
    assert(
      !redactedHandoffSummary.includes(smokeRepo) && !redactedHandoffSummary.includes(smokeGitRoot),
      'handoff --redact-paths summary leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedHandoff).includes(smokeRepo) &&
        !JSON.stringify(redactedHandoff).includes(smokeGitRoot),
      'handoff --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Handoff redaction smoke passed.');

    const redactedSummary = parseJson(
      (
        await runAgentLoop(
          [
            'summarize',
            '--task',
            taskPath,
            '--report',
            verification.reportPath,
            '--write',
            '--write-run',
            '--json',
            '--redact-paths',
          ],
          { cwd: smokeRepo },
        )
      ).stdout,
      'summarize redacted',
    );
    assert(redactedSummary.outPath, 'summarize --json --redact-paths did not include outPath.');
    assert(
      redactedSummary.run?.id,
      'summarize --json --redact-paths did not include run.id when --write-run was used.',
    );
    const redactedSummaryPath = resolvePublicPath(smokeRepo, redactedSummary.outPath);
    assert(
      await pathExists(redactedSummaryPath),
      'summarize --json --redact-paths summary was not written.',
    );
    const redactedSummaryMarkdown = await readFile(redactedSummaryPath, 'utf8');
    assert(
      redactedSummaryMarkdown.includes('# PR Summary'),
      'summarize --redact-paths summary did not include PR summary Markdown.',
    );
    assert(
      !redactedSummaryMarkdown.includes(smokeRepo) &&
        !redactedSummaryMarkdown.includes(smokeGitRoot),
      'summarize --redact-paths summary leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedSummary).includes(smokeRepo) &&
        !JSON.stringify(redactedSummary).includes(smokeGitRoot),
      'summarize --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Summarize redaction smoke passed.');

    const redactedShip = parseJson(
      (
        await runAgentLoop(['ship', '--json', '--github-comment', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'ship redacted',
    );
    const redactedShipComment = await runAgentLoop(['ship', '--github-comment', '--redact-paths'], {
      cwd: smokeRepo,
    });
    assert(
      redactedShip.readiness?.totalScore >= 0,
      'ship --json --redact-paths did not preserve readiness evidence.',
    );
    assert(
      redactedShip.gates?.git?.root === '[git-root]',
      'ship --json --redact-paths did not redact the nested gate git root.',
    );
    assert(
      redactedShip.gates?.git?.targetIsRoot === true,
      'ship --json --redact-paths did not preserve the nested gate git target.',
    );
    assert(
      redactedShip.gates?.markdown?.includes('- Git root: `[git-root]`'),
      'ship --json --redact-paths did not redact the nested gate Markdown.',
    );
    assert(
      redactedShip.githubComment?.includes('AgentLoopKit Review Readiness'),
      'ship --json --github-comment --redact-paths did not include GitHub comment markdown.',
    );
    assert(
      redactedShipComment.stdout.includes('AgentLoopKit Review Readiness'),
      'ship --github-comment --redact-paths did not print GitHub comment markdown.',
    );
    assert(
      !redactedShipComment.stdout.includes(smokeRepo) &&
        !redactedShipComment.stdout.includes(smokeGitRoot),
      'ship --github-comment --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedShip).includes(smokeRepo) &&
        !JSON.stringify(redactedShip).includes(smokeGitRoot),
      'ship --json --github-comment --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Ship redaction smoke passed.');

    const preparedPr = parseJson(
      (await runAgentLoop(['prepare-pr', '--json', '--github-comment'], { cwd: smokeRepo })).stdout,
      'prepare-pr',
    );
    assert(preparedPr.titleSuggestion, 'prepare-pr JSON did not include titleSuggestion.');
    assert(
      preparedPr.body?.includes('## Verification Evidence'),
      'prepare-pr body missing verification section.',
    );
    assert(
      preparedPr.body?.includes('## Imported GitHub Context'),
      'prepare-pr body missing imported GitHub context section.',
    );
    assert(
      preparedPr.body?.includes('Smoke GitHub metadata PR'),
      'prepare-pr body did not include imported GitHub PR metadata.',
    );
    assert(
      preparedPr.githubComment?.includes('AgentLoopKit Review Readiness'),
      'prepare-pr JSON did not include GitHub comment markdown.',
    );
    console.log('Prepare-pr smoke passed.');

    const redactedPreparedPr = parseJson(
      (
        await runAgentLoop(['prepare-pr', '--json', '--github-comment', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'prepare-pr redacted',
    );
    const redactedPreparePrComment = await runAgentLoop(
      ['prepare-pr', '--github-comment', '--redact-paths'],
      {
        cwd: smokeRepo,
      },
    );
    assert(
      redactedPreparedPr.titleSuggestion === preparedPr.titleSuggestion,
      'prepare-pr --json --redact-paths changed the title suggestion.',
    );
    assert(
      redactedPreparedPr.body?.includes('## Verification Evidence'),
      'prepare-pr --json --redact-paths did not preserve the PR body.',
    );
    assert(
      redactedPreparedPr.githubComment?.includes('AgentLoopKit Review Readiness'),
      'prepare-pr --json --github-comment --redact-paths did not include GitHub comment markdown.',
    );
    assert(
      ['reused', 'refreshed'].includes(redactedPreparedPr.shipEvidence?.source),
      'prepare-pr --json --redact-paths did not preserve ship evidence status.',
    );
    assert(
      redactedPreparePrComment.stdout.includes('AgentLoopKit Review Readiness'),
      'prepare-pr --github-comment --redact-paths did not print GitHub comment markdown.',
    );
    assert(
      !redactedPreparePrComment.stdout.includes(smokeRepo) &&
        !redactedPreparePrComment.stdout.includes(smokeGitRoot),
      'prepare-pr --github-comment --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedPreparedPr).includes(smokeRepo) &&
        !JSON.stringify(redactedPreparedPr).includes(smokeGitRoot),
      'prepare-pr --json --github-comment --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Prepare-pr redaction smoke passed.');

    const maintainer = parseJson(
      (await runAgentLoop(['maintainer-check', '--json'], { cwd: smokeRepo })).stdout,
      'maintainer-check',
    );
    const maintainerHuman = await runAgentLoop(['maintainer-check'], { cwd: smokeRepo });
    const redactedMaintainerHuman = await runAgentLoop(['maintainer-check', '--redact-paths'], {
      cwd: smokeRepo,
    });
    const redactedMaintainer = parseJson(
      (
        await runAgentLoop(['maintainer-check', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'maintainer-check redacted',
    );
    assert(['pass', 'warn'].includes(maintainer.status), 'maintainer-check reported failure.');
    assert(Array.isArray(maintainer.checks), 'maintainer-check JSON did not include checks.');
    assert(
      maintainer.checks?.some((check) => check.id === 'github-metadata' && check.status === 'pass'),
      'maintainer-check JSON did not report imported GitHub metadata.',
    );
    assert(
      maintainerHuman.stdout.includes('# AgentLoopKit Maintainer Check'),
      'maintainer-check human output did not include the expected heading.',
    );
    assert(
      redactedMaintainerHuman.stdout.includes('# AgentLoopKit Maintainer Check'),
      'maintainer-check --redact-paths human output did not include the expected heading.',
    );
    assert(
      redactedMaintainer.status === maintainer.status,
      'maintainer-check --json --redact-paths changed status.',
    );
    assert(
      redactedMaintainer.checks?.length === maintainer.checks?.length,
      'maintainer-check --json --redact-paths changed check count.',
    );
    assert(
      !redactedMaintainerHuman.stdout.includes(smokeRepo) &&
        !redactedMaintainerHuman.stdout.includes(smokeGitRoot),
      'maintainer-check --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedMaintainer).includes(smokeRepo) &&
        !JSON.stringify(redactedMaintainer).includes(smokeGitRoot),
      'maintainer-check --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Maintainer-check redaction smoke passed.');
    console.log('GitHub metadata review-surface smoke passed.');
    console.log(`Maintainer-check smoke passed with status ${maintainer.status}.`);

    const doneTask = parseJson(
      (await runAgentLoop(['task', 'done', '--json'], { cwd: smokeRepo })).stdout,
      'task done',
    );
    assert(doneTask.task?.status === 'done', 'task done did not mark the active task done.');
    const doneTaskMarkdown = await readFile(path.join(smokeRepo, taskPath), 'utf8');
    assert(doneTaskMarkdown.includes('- Status: done'), 'task done did not update task Markdown.');
    console.log('Task done smoke passed.');

    const archivedTask = parseJson(
      (await runAgentLoop(['task', 'archive', taskPath, '--json'], { cwd: smokeRepo })).stdout,
      'task archive',
    );
    assert(
      archivedTask.task?.previousPath === taskPath,
      'task archive did not report the original task path.',
    );
    assert(
      archivedTask.task?.path === '.agentloop/tasks/archive/smoke-cli-flow.md',
      'task archive did not report the archived task path.',
    );

    const archivedTaskDoctor = parseJson(
      (await runAgentLoop(['task', 'doctor', '--json'], { cwd: smokeRepo })).stdout,
      'archived task doctor',
    );
    assert(
      archivedTaskDoctor.taskDoctor?.overallStatus === 'pass',
      'task doctor did not pass after task archive evidence.',
    );
    assert(
      !archivedTaskDoctor.taskDoctor?.diagnostics?.some(
        (diagnostic) => diagnostic.id === 'recent-evidence-without-active-task',
      ),
      'task doctor warned about recent evidence after the task was archived.',
    );
    console.log('Task-doctor archived task evidence smoke passed.');

    const archivedTaskArtifactsHuman = await runAgentLoop(
      ['artifacts', '--type', 'task', '--latest'],
      { cwd: smokeRepo },
    );
    const archivedTaskArtifacts = parseJson(
      (await runAgentLoop(['artifacts', '--json'], { cwd: smokeRepo })).stdout,
      'archived task artifacts',
    );
    assert(
      archivedTaskArtifacts.tasks?.latest?.archived === true,
      'artifacts --json did not mark the archived task fallback.',
    );
    assert(
      archivedTaskArtifacts.tasks?.latest?.path === '.agentloop/tasks/archive/smoke-cli-flow.md',
      'artifacts --json did not report the archived task path as latest task evidence.',
    );
    assert(
      archivedTaskArtifactsHuman.stdout.includes(
        '- Latest task: `Smoke CLI flow` (`done`, `archived`) - `.agentloop/tasks/archive/smoke-cli-flow.md`',
      ),
      'artifacts --type task --latest did not report the archived task fallback.',
    );
    console.log('Artifacts archived task fallback smoke passed.');

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
    const nestedVerificationReportPath = resolvePublicPath(
      smokeRepo,
      nestedVerification.reportPath,
    );
    assertPathInside(smokeRepo, nestedVerificationReportPath, 'nested verify report');
    assert(await pathExists(nestedVerificationReportPath), 'nested verify report was not written.');

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
    const nestedHandoffPath = resolvePublicPath(smokeRepo, nestedHandoff.outPath);
    assertPathInside(smokeRepo, nestedHandoffPath, 'nested handoff summary');
    assert(await pathExists(nestedHandoffPath), 'nested handoff summary was not written.');

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

    const policyStatus = parseJson(
      (await runAgentLoop(['policy', 'status', '--json'], { cwd: nestedDir })).stdout,
      'nested policy status',
    );
    assert(
      policyStatus.summary?.current > 0,
      'nested policy status did not report current policies.',
    );

    const redactedPolicyListHuman = await runAgentLoop(['policy', 'list', '--redact-paths'], {
      cwd: nestedDir,
    });
    const redactedPolicyStatusHuman = await runAgentLoop(['policy', 'status', '--redact-paths'], {
      cwd: nestedDir,
    });
    const redactedPolicyShowHuman = await runAgentLoop(
      ['policy', 'show', 'security', '--redact-paths'],
      { cwd: nestedDir },
    );
    const redactedPolicyList = parseJson(
      (
        await runAgentLoop(['policy', 'list', '--json', '--redact-paths'], {
          cwd: nestedDir,
        })
      ).stdout,
      'nested policy list redacted',
    );
    const redactedPolicyStatus = parseJson(
      (
        await runAgentLoop(['policy', 'status', '--json', '--redact-paths'], {
          cwd: nestedDir,
        })
      ).stdout,
      'nested policy status redacted',
    );
    assert(
      redactedPolicyListHuman.stdout.includes('AgentLoopKit policies:'),
      'policy list --redact-paths did not print policy inventory.',
    );
    assert(
      redactedPolicyStatusHuman.stdout.includes('AgentLoopKit policy status:'),
      'policy status --redact-paths did not print policy status.',
    );
    assert(
      redactedPolicyShowHuman.stdout.includes('# Security Policy'),
      'policy show --redact-paths did not print policy Markdown.',
    );
    assert(
      JSON.stringify(redactedPolicyList) === JSON.stringify(nestedPolicies),
      'policy list --json --redact-paths changed the inventory payload.',
    );
    assert(
      JSON.stringify(redactedPolicyStatus) === JSON.stringify(policyStatus),
      'policy status --json --redact-paths changed the status payload.',
    );
    assert(
      !redactedPolicyListHuman.stdout.includes(smokeRepo) &&
        !redactedPolicyStatusHuman.stdout.includes(smokeRepo) &&
        !redactedPolicyShowHuman.stdout.includes(smokeRepo),
      'policy command --redact-paths leaked the absolute smoke repo path.',
    );
    assert(
      !JSON.stringify(redactedPolicyList).includes(smokeRepo) &&
        !JSON.stringify(redactedPolicyStatus).includes(smokeRepo),
      'policy command --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Policy command redaction smoke passed.');

    const policyPacks = parseJson(
      (await runAgentLoop(['policy', 'packs', '--json'], { cwd: nestedDir })).stdout,
      'nested policy pack inventory',
    );
    assert(Array.isArray(policyPacks.packs), 'policy pack inventory did not include packs.');
    for (const packName of ['agentloop-baseline', 'maintainer-review']) {
      const pack = policyPacks.packs.find((entry) => entry.name === packName);
      assert(pack, `policy pack inventory missing ${packName}.`);
      assert(
        Number.isInteger(pack.policyCount) && pack.policyCount > 0,
        `policy pack inventory reported an invalid count for ${packName}.`,
      );
    }
    console.log('Policy pack inventory smoke passed.');

    const redactedPolicyPacksHuman = await runAgentLoop(['policy', 'packs', '--redact-paths'], {
      cwd: nestedDir,
    });
    assert(
      redactedPolicyPacksHuman.stdout.includes('agentloop-baseline'),
      'policy packs --redact-paths did not include the baseline pack.',
    );
    assert(
      !redactedPolicyPacksHuman.stdout.includes(smokeRepo),
      'policy packs --redact-paths leaked the absolute smoke repo path.',
    );

    const redactedPolicyPacks = parseJson(
      (
        await runAgentLoop(['policy', 'packs', '--json', '--redact-paths'], {
          cwd: nestedDir,
        })
      ).stdout,
      'nested policy pack redacted inventory',
    );
    assert(
      JSON.stringify(redactedPolicyPacks) === JSON.stringify(policyPacks),
      'policy packs --json --redact-paths changed the inventory payload.',
    );
    assert(
      !JSON.stringify(redactedPolicyPacks).includes(smokeRepo),
      'policy packs --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Policy pack redaction smoke passed.');

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
    await writeFile(nestedAgentPath, '# Smoke-preserved Codex rules\n\nKeep this guidance.\n');
    const preservedCodexGuide = await readFile(nestedAgentPath, 'utf8');
    const rerunAgentInstall = parseJson(
      (await runAgentLoop(['install-agent', 'codex', '--json'], { cwd: nestedDir })).stdout,
      'nested install-agent rerun',
    );
    const afterCodexGuide = await readFile(nestedAgentPath, 'utf8');
    const agentsMd = await readFile(path.join(smokeRepo, 'AGENTS.md'), 'utf8');
    assert(
      rerunAgentInstall.agent?.agentFileStatus === 'skipped',
      'rerun install-agent did not skip the existing codex guide.',
    );
    assert(afterCodexGuide === preservedCodexGuide, 'rerun install-agent overwrote codex guide.');
    assert(
      agentsMd.includes('.agentloop/agents/codex.md'),
      'rerun install-agent left AGENTS.md without the codex guide reference.',
    );
    console.log('Install-agent preservation smoke passed.');

    const redactedAgentInstall = parseJson(
      (
        await runAgentLoop(['install-agent', 'codex', '--json', '--redact-paths'], {
          cwd: nestedDir,
        })
      ).stdout,
      'nested install-agent redacted',
    );
    assert(
      toPosixPath(redactedAgentInstall.agent?.agentFilePath ?? '') ===
        '[git-root]/.agentloop/agents/codex.md',
      'redacted install-agent JSON did not redact the codex guide path.',
    );
    assert(
      toPosixPath(redactedAgentInstall.agent?.agentsPath ?? '') === '[git-root]/AGENTS.md',
      'redacted install-agent JSON did not redact the AGENTS.md path.',
    );
    assert(
      redactedAgentInstall.agent?.agentFileStatus === 'skipped',
      'redacted install-agent JSON did not preserve the skipped status.',
    );
    assert(
      !JSON.stringify(redactedAgentInstall).includes(smokeRepo),
      'redacted install-agent JSON leaked the absolute smoke repo path.',
    );
    console.log('Install-agent redaction smoke passed.');

    assert(
      !(await pathExists(path.join(nestedDir, '.agentloop'))),
      'nested commands wrote a .agentloop directory under the invocation cwd.',
    );
    console.log('Nested cwd smoke passed.');

    const staleActiveTaskState = {
      version: 1,
      activeTaskPath: '.agentloop/tasks/missing-smoke-task.md',
    };
    const staleReportFileName = '2026-06-16-20-30-verification-report.md';
    await writeFile(
      path.join(smokeRepo, '.agentloop', 'state.json'),
      `${JSON.stringify(staleActiveTaskState, null, 2)}\n`,
    );
    await mkdir(path.join(smokeRepo, '.agentloop', 'reports'), { recursive: true });
    await writeFile(
      path.join(smokeRepo, '.agentloop', 'reports', staleReportFileName),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const staleStatus = parseJson(
      (await runAgentLoop(['status', '--json'], { cwd: smokeRepo })).stdout,
      'stale status',
    );
    assert(
      staleStatus.activeTask === null,
      'status --json did not ignore the stale active task pointer.',
    );
    assert(
      staleStatus.nextAction?.command === 'agentloop task doctor',
      'status --json did not recommend task doctor for stale active task state.',
    );
    assert(
      staleStatus.nextAction?.reason?.includes('active task pointer is stale'),
      'status --json did not explain the stale active task pointer.',
    );

    const staleNext = parseJson(
      (await runAgentLoop(['next', '--json'], { cwd: smokeRepo })).stdout,
      'stale next',
    );
    assert(
      staleNext.command === 'agentloop task doctor',
      'next --json did not recommend task doctor for stale active task state.',
    );
    assert(
      staleNext.reason?.includes('active task pointer is stale'),
      'next --json did not explain the stale active task pointer.',
    );

    const staleTaskDoctor = parseJson(
      (
        await runAgentLoop(['task', 'doctor', '--json', '--redact-paths'], {
          cwd: smokeRepo,
        })
      ).stdout,
      'stale task doctor',
    );
    assert(
      staleTaskDoctor.taskDoctor?.overallStatus === 'warn',
      'task doctor did not warn for stale active task state.',
    );
    assert(
      staleTaskDoctor.taskDoctor?.diagnostics?.some((diagnostic) =>
        ['active-task-missing', 'active-task-older-than-runs'].includes(diagnostic.id),
      ),
      'task doctor did not include a stale active task diagnostic.',
    );
    const staleRecoveryDiagnostic = staleTaskDoctor.taskDoctor?.diagnostics?.find((diagnostic) =>
      ['active-task-missing', 'active-task-older-than-runs'].includes(diagnostic.id),
    );
    assert(
      staleRecoveryDiagnostic?.commands?.includes('agentloop task clear') &&
        staleRecoveryDiagnostic.commands.includes('agentloop task set <path>') &&
        staleRecoveryDiagnostic.commands.includes('agentloop create-task'),
      'task doctor did not include bounded stale-state recovery commands.',
    );
    assert(
      !JSON.stringify(staleTaskDoctor).includes(smokeRepo),
      'task doctor --json --redact-paths leaked the absolute smoke repo path.',
    );
    console.log('Stale task state recovery smoke passed.');

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
