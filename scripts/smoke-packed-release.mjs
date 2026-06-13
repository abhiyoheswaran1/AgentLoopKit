#!/usr/bin/env node
/* global console, process */
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function unique(values) {
  return [...new Set(values)];
}

export function assertReadmePins(readme, version) {
  const pinnedVersions = unique(
    [...readme.matchAll(/agentloopkit@(\d+\.\d+\.\d+)/g)].map((match) => match[1]),
  );
  const staleVersion = pinnedVersions.find((pinnedVersion) => pinnedVersion !== version);

  if (staleVersion) {
    throw new Error(`README contains stale pinned version ${staleVersion}.`);
  }
}

const PUBLIC_DOC_ROOTS = ['README.md', 'docs', 'examples', '.github'];
const RELEASE_HISTORY_DOCS = new Set([
  'docs/launch-checklist.md',
  'docs/npm-publishing.md',
  'docs/release-status.md',
]);

const UNSUPPORTED_PUBLIC_CLAIMS = [
  { label: 'Homebrew claim', pattern: /\bHomebrew\b/i },
  { label: 'brew install command', pattern: /\bbrew\s+install\b/i },
  { label: 'retired Homebrew tap repo', pattern: /homebrew-agentloopkit/i },
];

const INTERNAL_CHATTER_CLAIMS = [
  { label: 'product-panel process', pattern: /\bproduct[- ]panel\b/i },
  { label: 'simulated feedback', pattern: /\bsimulated feedback\b/i },
  { label: 'dogfood log', pattern: /\bdogfood log\b/i },
  { label: 'stale npm mismatch wording', pattern: /\bnpm still serves\b/i },
  { label: 'latest GitHub release wording', pattern: /\blatest GitHub release\b/i },
  { label: 'npm latest remains wording', pattern: /\bnpm latest remains\b/i },
];

const STALE_REPO_HARNESS_RELEASE_CLAIMS = [
  {
    label: 'planned version batch',
    pattern: /\bplanned\s+`?\d+\.\d+\.\d+`?\s+batch\b/i,
  },
  {
    label: 'post-release current development window',
    pattern: /\bcurrent development after\s+`?\d+\.\d+\.\d+`?.*\bplanned\s+`?\d+\.\d+\.\d+`?/i,
  },
];

const README_REDACTION_COMMANDS = [
  'doctor',
  'status',
  'next',
  'review-context',
  'check-gates',
  'ship',
  'prepare-pr',
];

const SAFE_ENV_KEYS = [
  'APPDATA',
  'CI',
  'HOME',
  'LOCALAPPDATA',
  'NO_COLOR',
  'PATH',
  'PATHEXT',
  'Path',
  'SystemRoot',
  'TEMP',
  'TMP',
  'USERPROFILE',
  'WINDIR',
];

export function buildChildEnv(sourceEnv = process.env, explicitEnv = {}) {
  const env = { FORCE_COLOR: '0' };
  for (const key of SAFE_ENV_KEYS) {
    const value = sourceEnv[key];
    if (value) env[key] = value;
  }
  return { ...env, ...explicitEnv };
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function isMarkdownFile(filePath) {
  return filePath.endsWith('.md') || filePath.endsWith('.mdx');
}

function isGeneratedAgentLoopArtifact(filePath) {
  return toPosixPath(filePath).split('/').includes('.agentloop');
}

async function collectMarkdownFiles(rootDir, relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  let fileStat;
  try {
    fileStat = await stat(absolutePath);
  } catch {
    return [];
  }

  if (fileStat.isFile()) {
    return isMarkdownFile(relativePath) && !isGeneratedAgentLoopArtifact(relativePath)
      ? [relativePath]
      : [];
  }
  if (!fileStat.isDirectory()) {
    return [];
  }
  if (isGeneratedAgentLoopArtifact(relativePath)) {
    return [];
  }

  const entries = await readdir(absolutePath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => collectMarkdownFiles(rootDir, path.join(relativePath, entry.name))),
  );
  return files.flat();
}

function findAgentLoopVersionPins(content) {
  return unique([
    ...[...content.matchAll(/agentloopkit@(\d+\.\d+\.\d+)/g)].map((match) => match[1]),
    ...[...content.matchAll(/AgentLoopKit@v(\d+\.\d+\.\d+)/g)].map((match) => match[1]),
    ...[...content.matchAll(/agentloopkit-(\d+\.\d+\.\d+)\.tgz/g)].map((match) => match[1]),
  ]);
}

export function assertPublicDocsDoNotPinVersions(files) {
  for (const file of files) {
    const filePath = toPosixPath(file.filePath);
    if (RELEASE_HISTORY_DOCS.has(filePath)) {
      continue;
    }

    const pinnedVersions = findAgentLoopVersionPins(file.content);
    if (pinnedVersions.length > 0) {
      throw new Error(
        `${filePath} contains hardcoded AgentLoopKit version pin ${pinnedVersions[0]}. Use @latest for evaluation or <version> for examples that must be pinned.`,
      );
    }
  }
}

export function assertPublicDocsAvoidUnsupportedClaims(files) {
  for (const file of files) {
    const filePath = toPosixPath(file.filePath);
    const unsupportedClaim = UNSUPPORTED_PUBLIC_CLAIMS.find((claim) =>
      claim.pattern.test(file.content),
    );

    if (unsupportedClaim) {
      throw new Error(
        `${filePath} contains unsupported public claim: ${unsupportedClaim.label}. Only document channels after they are verified and intentionally supported.`,
      );
    }

    if (RELEASE_HISTORY_DOCS.has(filePath)) {
      continue;
    }

    const internalClaim = INTERNAL_CHATTER_CLAIMS.find((claim) => claim.pattern.test(file.content));
    if (internalClaim) {
      throw new Error(
        `${filePath} contains maintainer-only release chatter: ${internalClaim.label}. Keep README and normal docs user-facing.`,
      );
    }
  }
}

export function assertRepoHarnessAvoidsStaleReleaseBatch(files) {
  for (const file of files) {
    const staleClaim = STALE_REPO_HARNESS_RELEASE_CLAIMS.find((claim) =>
      claim.pattern.test(file.content),
    );

    if (staleClaim) {
      throw new Error(
        `${toPosixPath(file.filePath)} contains stale repo harness release guidance: ${staleClaim.label}. Keep release gating generic after a batch ships.`,
      );
    }
  }
}

export function assertReadmeRedactionGuidance(content) {
  const guidanceLine = content
    .split(/\r?\n/)
    .find((line) => line.includes('--redact-paths') && line.includes('public'));

  if (!guidanceLine) {
    return;
  }

  const missingCommand = README_REDACTION_COMMANDS.find(
    (command) => !guidanceLine.includes(`\`${command}\``),
  );
  if (missingCommand) {
    throw new Error(
      `README redaction guidance is missing \`${missingCommand}\`. Keep public-log safety guidance aligned with supported CLI flags.`,
    );
  }
}

function roadmapCurrentState(content) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => /^##\s+Current State\s*$/.test(line));
  if (start === -1) return '';

  const sectionLines = [];
  for (const line of lines.slice(start + 1)) {
    if (/^##\s+/.test(line)) break;
    sectionLines.push(line);
  }
  return sectionLines.join('\n');
}

function markdownSection(content, heading) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return '';

  const sectionLines = [];
  for (const line of lines.slice(start + 1)) {
    if (/^##\s+/.test(line)) break;
    sectionLines.push(line);
  }
  return sectionLines.join('\n');
}

function markdownLabeledBlock(content, label) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === label);
  if (start === -1) return '';

  const blockLines = [];
  for (const line of lines.slice(start + 1)) {
    if (/^##\s+/.test(line)) break;
    blockLines.push(line);
  }
  return blockLines.join('\n');
}

function assertRoadmapLine(section, expectedLine, filePath, message) {
  if (!section.includes(expectedLine)) {
    throw new Error(`${toPosixPath(filePath)} current state is stale: expected ${message}.`);
  }
}

export function assertRoadmapCurrentReleaseState({ filePath, content, version }) {
  const section = roadmapCurrentState(content);
  if (!section.trim()) {
    throw new Error(`${toPosixPath(filePath)} is missing a Current State section.`);
  }

  assertRoadmapLine(
    section,
    `- GitHub release \`v${version}\` is public.`,
    filePath,
    `current public release v${version}`,
  );
  assertRoadmapLine(
    section,
    `- npm latest is \`agentloopkit@${version}\`.`,
    filePath,
    `npm latest agentloopkit@${version}`,
  );
  assertRoadmapLine(
    section,
    `- GHCR and MCP Registry are live for \`${version}\`.`,
    filePath,
    `GHCR and MCP Registry version ${version}`,
  );

  if (
    !new RegExp(`- Release tag \`v${version}\` points at the published release commit\\.`).test(
      section,
    )
  ) {
    throw new Error(
      `${toPosixPath(filePath)} current state is stale: expected release tag v${version}.`,
    );
  }
}

export function assertFinalHandoffCurrentReleaseState({ filePath, content, version }) {
  const publishState =
    markdownSection(content, '## Current publish state') ||
    markdownLabeledBlock(content, 'Current publish state:');
  if (publishState.trim()) {
    const expectedRelease = `GitHub release \`v${version}\` is public.`;
    if (!publishState.includes(expectedRelease)) {
      throw new Error(
        `${toPosixPath(filePath)} current state is stale: expected current GitHub release v${version}.`,
      );
    }

    const expectedNpmVersion = new RegExp(
      `npm latest is (?:\`agentloopkit@${version}\`|\`${version}\`)`,
    );
    if (!expectedNpmVersion.test(publishState)) {
      throw new Error(
        `${toPosixPath(filePath)} current state is stale: expected npm latest ${version}.`,
      );
    }
  }

  const installSection = markdownSection(content, '## How users install it');
  if (!installSection.trim()) return;

  const staleInstallPin = findAgentLoopVersionPins(installSection).find(
    (pinnedVersion) => pinnedVersion !== version,
  );
  if (staleInstallPin) {
    throw new Error(
      `${toPosixPath(filePath)} install section contains stale AgentLoopKit version pin ${staleInstallPin}.`,
    );
  }
}

export async function collectPublicDocPinFiles(rootDir) {
  const relativeFiles = unique(
    (await Promise.all(PUBLIC_DOC_ROOTS.map((root) => collectMarkdownFiles(rootDir, root)))).flat(),
  )
    .map(toPosixPath)
    .sort();

  return Promise.all(
    relativeFiles.map(async (filePath) => ({
      filePath,
      content: await readFile(path.join(rootDir, filePath), 'utf8'),
    })),
  );
}

export async function collectRepoHarnessFiles(rootDir) {
  const relativeFiles = ['AGENTS.md', 'AGENTLOOP.md'];
  return Promise.all(
    relativeFiles.map(async (filePath) => ({
      filePath,
      content: await readFile(path.join(rootDir, filePath), 'utf8'),
    })),
  );
}

export async function runPublicDocsHygiene({ cwd = process.cwd(), version } = {}) {
  const packageJson = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
  const expectedVersion = version ?? packageJson.version;

  const publicDocFiles = await collectPublicDocPinFiles(cwd);
  assertPublicDocsDoNotPinVersions(publicDocFiles);
  assertPublicDocsAvoidUnsupportedClaims(publicDocFiles);
  const readme = publicDocFiles.find((file) => toPosixPath(file.filePath) === 'README.md');
  if (readme) {
    assertReadmeRedactionGuidance(readme.content);
  }

  const repoHarnessFiles = await collectRepoHarnessFiles(cwd);
  assertRepoHarnessAvoidsStaleReleaseBatch(repoHarnessFiles);

  assertRoadmapCurrentReleaseState({
    filePath: 'ROADMAP.md',
    content: await readFile(path.join(cwd, 'ROADMAP.md'), 'utf8'),
    version: expectedVersion,
  });

  try {
    assertFinalHandoffCurrentReleaseState({
      filePath: 'FINAL_HANDOFF.md',
      content: await readFile(path.join(cwd, 'FINAL_HANDOFF.md'), 'utf8'),
      version: expectedVersion,
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  return {
    version: expectedVersion,
    publicDocCount: publicDocFiles.length,
    repoHarnessCount: repoHarnessFiles.length,
  };
}

export function createSmokeSteps({ version, tarballPath }) {
  const npxArgs = ['--yes', '--package', tarballPath, 'agentloop'];
  return [
    {
      name: 'packed binary prints package version',
      command: 'npx',
      args: [...npxArgs, 'version'],
      cwd: 'temp',
      env: {},
      expectStdout: version,
    },
    {
      name: 'packed init writes AgentLoopKit files in a project directory',
      command: 'npx',
      args: [...npxArgs, 'init'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed local-only init excludes AgentLoopKit files from local git tracking',
      command: 'npx',
      args: [...npxArgs, 'init', '--local-only'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed create-task rejects output outside the task directory',
      command: 'npx',
      args: [...npxArgs, 'create-task'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed verify reports outside task paths as unavailable',
      command: 'npx',
      args: [...npxArgs, 'verify'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed init rejects symlinked harness targets',
      command: 'npx',
      args: [...npxArgs, 'init', '--json'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed task archive rejects symlinked archive destinations',
      command: 'npx',
      args: [...npxArgs, 'task', 'archive'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed init dry-run refuses the home directory',
      command: 'npx',
      args: [...npxArgs, 'init', '--dry-run'],
      cwd: 'temp',
      env: {},
    },
  ];
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: buildChildEnv(process.env, options.env),
      stdio: ['ignore', 'pipe', 'pipe'],
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
    child.on('close', (exitCode) => {
      resolve({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });
}

async function runRequired(command, args, options = {}) {
  const result = await runCommand(command, args, options);
  if (result.exitCode !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed with exit code ${result.exitCode}\n${result.stderr || result.stdout}`,
    );
  }
  return result;
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function makeTempDir(root, name) {
  const dir = path.join(root, name);
  await mkdir(dir, { recursive: true });
  return dir;
}

async function runPackedAgentLoop(tarballPath, args, options) {
  return runCommand('npx', ['--yes', '--package', tarballPath, 'agentloop', ...args], options);
}

async function packProject({ cwd, packDir }) {
  const result = await runRequired('npm', ['pack', '--pack-destination', packDir, '--silent'], {
    cwd,
  });
  const tarballName = result.stdout.trim().split(/\r?\n/).at(-1);
  if (!tarballName) {
    throw new Error('npm pack did not print a tarball name.');
  }
  return path.join(packDir, tarballName);
}

async function readPackedReadme({ tarballPath, extractDir }) {
  await mkdir(extractDir, { recursive: true });
  await runRequired('tar', ['-xzf', tarballPath, '-C', extractDir]);
  return readFile(path.join(extractDir, 'package', 'README.md'), 'utf8');
}

async function assertPackedVersion({ tarballPath, version, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'version-smoke');
  const result = await runPackedAgentLoop(tarballPath, ['version'], { cwd });
  if (result.exitCode !== 0 || result.stdout.trim() !== version) {
    throw new Error(`packed version smoke failed: ${result.stderr || result.stdout}`);
  }
}

async function assertPackedInit({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'init-smoke');
  await runRequired('npm', ['init', '-y'], { cwd });
  const result = await runPackedAgentLoop(tarballPath, ['init'], { cwd });
  if (result.exitCode !== 0) {
    throw new Error(`packed init smoke failed: ${result.stderr || result.stdout}`);
  }

  for (const filePath of [
    '.agentloop/README.md',
    'AGENTS.md',
    'AGENTLOOP.md',
    'agentloop.config.json',
  ]) {
    if (!(await pathExists(path.join(cwd, filePath)))) {
      throw new Error(`packed init smoke did not create ${filePath}.`);
    }
  }
}

async function assertPackedLocalOnlyInit({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'local-only-init-smoke');
  await runRequired('git', ['init', '-q'], { cwd });
  await runRequired('npm', ['init', '-y'], { cwd });
  const result = await runPackedAgentLoop(tarballPath, ['init', '--local-only'], { cwd });
  if (result.exitCode !== 0) {
    throw new Error(`packed local-only init smoke failed: ${result.stderr || result.stdout}`);
  }

  const exclude = await readFile(path.join(cwd, '.git/info/exclude'), 'utf8');
  for (const expected of [
    '# agentloopkit:local-only:start',
    '.agentloop/',
    'AGENTS.md',
    'AGENTLOOP.md',
    'agentloop.config.json',
  ]) {
    if (!exclude.includes(expected)) {
      throw new Error(`packed local-only init exclude file is missing ${expected}.`);
    }
  }

  const agents = await readFile(path.join(cwd, 'AGENTS.md'), 'utf8');
  if (!agents.includes('Local-only AgentLoopKit harness')) {
    throw new Error('packed local-only init did not write local-only agent guidance.');
  }

  const status = await runRequired('git', ['status', '--short'], { cwd });
  for (const excludedPath of ['.agentloop', 'AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json']) {
    if (status.stdout.includes(excludedPath)) {
      throw new Error(`packed local-only init left ${excludedPath} visible in git status.`);
    }
  }
}

async function assertCreateTaskGuard({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'create-task-smoke');
  const outsideDir = await makeTempDir(tempRoot, 'outside-create-task');
  await runRequired('npm', ['init', '-y'], { cwd });
  await runRequired('npx', ['--yes', '--package', tarballPath, 'agentloop', 'init'], { cwd });

  const outsidePath = path.join(outsideDir, 'outside-task.md');
  const result = await runPackedAgentLoop(
    tarballPath,
    ['create-task', '--title', 'Outside write', '--type', 'bugfix', '--out', outsidePath],
    { cwd },
  );
  if (result.exitCode === 0) {
    throw new Error('packed create-task outside write unexpectedly succeeded.');
  }
  if (await pathExists(outsidePath)) {
    throw new Error('packed create-task wrote outside the configured task directory.');
  }
}

async function assertVerifyTaskGuard({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'verify-smoke');
  const outsideDir = await makeTempDir(tempRoot, 'outside-verify');
  await runRequired('npm', ['init', '-y'], { cwd });
  await runRequired('npx', ['--yes', '--package', tarballPath, 'agentloop', 'init'], { cwd });

  const outsidePath = path.join(outsideDir, 'outside-task.md');
  await writeFile(outsidePath, '# Outside Secret Task\n- Task type: feature\n- Status: leaked\n');
  const result = await runPackedAgentLoop(
    tarballPath,
    [
      'verify',
      '--task',
      outsidePath,
      '--command',
      'node -e "console.log(\\"ok\\")"',
      '--no-test',
      '--no-lint',
      '--no-typecheck',
      '--no-build',
      '--json',
    ],
    { cwd },
  );
  if (result.stdout.includes('Outside Secret Task') || result.stdout.includes('leaked')) {
    throw new Error('packed verify leaked outside task file contents.');
  }
  if (result.exitCode === 0) {
    throw new Error('packed verify outside-task smoke unexpectedly succeeded.');
  }

  const payload = parseJsonSmokeResult(result, 'packed verify outside-task smoke');
  if (
    payload.error?.code !== 'ARTIFACT_PATH_INVALID' ||
    payload.error?.artifactType !== 'task' ||
    payload.error?.reason !== 'outside-directory'
  ) {
    throw new Error(`packed verify outside-task smoke returned unexpected JSON: ${result.stdout}`);
  }
}

function parseJsonSmokeResult(result, name) {
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`${name} did not print JSON: ${result.stderr || result.stdout}`);
  }
}

async function assertInitSymlinkGuard({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'init-symlink-smoke');
  const outsideDir = await makeTempDir(tempRoot, 'outside-init-symlink');
  await symlink(outsideDir, path.join(cwd, '.agentloop'), 'dir');

  const result = await runPackedAgentLoop(tarballPath, ['init', '--json'], { cwd });
  if (result.exitCode === 0) {
    throw new Error('packed init symlink guard unexpectedly succeeded.');
  }

  const payload = parseJsonSmokeResult(result, 'packed init symlink guard');
  if (
    payload.error?.code !== 'OUTPUT_PATH_INVALID' ||
    payload.error?.reason !== 'outside-directory'
  ) {
    throw new Error(`packed init symlink guard returned unexpected JSON: ${result.stdout}`);
  }
  if ((await readdir(outsideDir)).length > 0) {
    throw new Error('packed init symlink guard wrote files outside the repo.');
  }
  if (await pathExists(path.join(cwd, 'AGENTS.md'))) {
    throw new Error('packed init symlink guard wrote root harness files after rejection.');
  }
}

async function assertTaskArchiveSymlinkGuard({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'task-archive-symlink-smoke');
  const outsideDir = await makeTempDir(tempRoot, 'outside-task-archive-symlink');
  await runRequired('npm', ['init', '-y'], { cwd });
  await runRequired('npx', ['--yes', '--package', tarballPath, 'agentloop', 'init'], { cwd });
  const taskPath = path.join(cwd, '.agentloop/tasks/smoke-task.md');
  await writeFile(taskPath, '# Smoke task\n\n- Status: proposed\n');
  await symlink(outsideDir, path.join(cwd, '.agentloop/tasks/archive'), 'dir');

  const result = await runPackedAgentLoop(
    tarballPath,
    ['task', 'archive', '.agentloop/tasks/smoke-task.md', '--json'],
    { cwd },
  );
  if (result.exitCode === 0) {
    throw new Error('packed task archive symlink guard unexpectedly succeeded.');
  }

  const payload = parseJsonSmokeResult(result, 'packed task archive symlink guard');
  if (
    payload.error?.code !== 'OUTPUT_PATH_INVALID' ||
    payload.error?.artifactType !== 'task-archive' ||
    payload.error?.reason !== 'outside-directory'
  ) {
    throw new Error(`packed task archive symlink guard returned unexpected JSON: ${result.stdout}`);
  }
  if (!(await pathExists(taskPath))) {
    throw new Error('packed task archive symlink guard moved the source task.');
  }
  if (await pathExists(path.join(outsideDir, 'smoke-task.md'))) {
    throw new Error('packed task archive symlink guard wrote outside the repo.');
  }
}

async function assertHomeDryRunGuard({ tarballPath, tempRoot }) {
  const fakeHome = await makeTempDir(tempRoot, 'fake-home');
  const result = await runPackedAgentLoop(tarballPath, ['init', '--dry-run'], {
    cwd: fakeHome,
    env: { HOME: fakeHome },
  });
  if (result.exitCode === 0) {
    throw new Error('packed init dry-run unexpectedly allowed the home directory.');
  }
  if (!result.stderr.includes('Refusing to initialize your home directory')) {
    throw new Error(
      `packed init dry-run returned unexpected output: ${result.stderr || result.stdout}`,
    );
  }
}

export async function runReleaseSmoke(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const keep = Boolean(options.keep);
  const metadata = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'agentloopkit-release-smoke-'));
  const packDir = await makeTempDir(tempRoot, 'pack');
  const extractDir = await makeTempDir(tempRoot, 'extract');

  try {
    console.log(`Release smoke for ${metadata.name}@${metadata.version}`);
    await runRequired('npm', ['run', 'build'], { cwd });
    const tarballPath = await packProject({ cwd, packDir });
    console.log(`Packed ${tarballPath}`);

    const readme = await readPackedReadme({ tarballPath, extractDir });
    assertReadmePins(readme, metadata.version);
    console.log('README has no stale exact version pins.');
    const hygiene = await runPublicDocsHygiene({ cwd, version: metadata.version });
    console.log(
      `Public docs hygiene passed for ${hygiene.publicDocCount} public docs and ${hygiene.repoHarnessCount} harness files.`,
    );

    await assertPackedVersion({ tarballPath, version: metadata.version, tempRoot });
    console.log('Packed binary version smoke passed.');
    await assertPackedInit({ tarballPath, tempRoot });
    console.log('Packed init smoke passed.');
    await assertPackedLocalOnlyInit({ tarballPath, tempRoot });
    console.log('Packed local-only init smoke passed.');
    await assertCreateTaskGuard({ tarballPath, tempRoot });
    console.log('Packed create-task path guard smoke passed.');
    await assertVerifyTaskGuard({ tarballPath, tempRoot });
    console.log('Packed verify task path guard smoke passed.');
    await assertInitSymlinkGuard({ tarballPath, tempRoot });
    console.log('Packed init symlink guard smoke passed.');
    await assertTaskArchiveSymlinkGuard({ tarballPath, tempRoot });
    console.log('Packed task archive symlink guard smoke passed.');
    await assertHomeDryRunGuard({ tarballPath, tempRoot });
    console.log('Packed home-directory dry-run guard smoke passed.');
    console.log('Release smoke passed.');
    return { tarballPath };
  } finally {
    if (keep) {
      console.log(`Kept smoke directory: ${tempRoot}`);
    } else {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}

export function isDirectRun(importMetaUrl, argvPath) {
  return fileURLToPath(importMetaUrl) === path.resolve(argvPath);
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  runReleaseSmoke({ keep: process.argv.includes('--keep') }).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Release smoke failed: ${message}`);
    process.exitCode = 1;
  });
}
