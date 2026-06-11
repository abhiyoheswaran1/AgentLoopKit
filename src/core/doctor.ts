import path from 'node:path';
import { realpath } from 'node:fs/promises';
import { AGENTLOOP_MANIFEST_FILE, CONFIG_FILE, CURRENT_TEMPLATE_VERSION } from './constants.js';
import { loadAgentLoopConfig } from './config.js';
import { pathExists, readTextIfExists } from './file-system.js';
import { commandExists, getGitRoot, getGitStatus, isInsideGitRepo } from './git.js';
import { detectPackageManager } from './package-manager.js';
import { detectMonorepo, detectPackageScripts, detectProjectType } from './project-detection.js';
import { detectRiskFiles } from './safety.js';

export type DoctorCheck = {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
};

export type DoctorNextAction = {
  id: string;
  command: string;
  reason: string;
};

export type DoctorResult = {
  checks: DoctorCheck[];
  warnings: DoctorCheck[];
  serious: DoctorCheck[];
  nextActions: DoctorNextAction[];
  git: {
    isRepository: boolean;
    root: string;
    targetIsRoot: boolean;
  };
  markdown: string;
};

const MONOREPO_VERIFICATION_GUIDANCE =
  'Root checks may not cover every package; add package-specific verification commands to the task contract, such as pnpm --filter <package> test, npm --workspace <package> test, or cd packages/<name> && npm test. AgentLoopKit does not run workspace commands automatically.';

const MISSING_MANIFEST_MESSAGE =
  'missing .agentloop/manifest.json; run agentloop init with the current CLI to add missing files without overwriting existing harness files';

const INVALID_MANIFEST_MESSAGE =
  'invalid .agentloop/manifest.json; review docs/template-migrations.md and recreate the manifest with agentloop init if needed';

function check(name: string, status: DoctorCheck['status'], message: string): DoctorCheck {
  return { name, status, message };
}

function nextAction(id: string, command: string, reason: string): DoctorNextAction {
  return { id, command, reason };
}

const RISK_CATEGORY_LABELS = {
  migrations: 'migrations',
  auth: 'auth',
  security: 'security',
  billing: 'billing',
  deployment: 'deployment',
  lockfiles: 'lockfiles',
  envFiles: 'env files',
} as const;

function formatRiskFiles(files: string[]) {
  const preview = files.slice(0, 3).join(', ');
  const remaining = files.length - 3;
  return `${files.length} detected: ${preview}${remaining > 0 ? ` (+${remaining} more)` : ''}`;
}

function hasWarnOrFail(checks: DoctorCheck[], name: string) {
  const item = checks.find((candidate) => candidate.name === name);
  return item?.status === 'warn' || item?.status === 'fail';
}

function chooseDoctorNextActions(checks: DoctorCheck[]): DoctorNextAction[] {
  const actions: DoctorNextAction[] = [];
  const missingHarness =
    ['AGENTS.md', 'AGENTLOOP.md', '.agentloop', 'Template manifest'].some((name) =>
      hasWarnOrFail(checks, name),
    ) || hasWarnOrFail(checks, 'AGENTS.md AgentLoopKit section');

  if (hasWarnOrFail(checks, CONFIG_FILE)) {
    actions.push(
      nextAction(
        'fix-config',
        'fix agentloop.config.json',
        'Doctor cannot validate the repo loop until the AgentLoopKit config is valid.',
      ),
    );
  }

  if (missingHarness) {
    actions.push(
      nextAction(
        'refresh-harness',
        'agentloop init',
        'Refresh missing or stale AgentLoopKit harness metadata without overwriting existing files.',
      ),
    );
  }

  if (hasWarnOrFail(checks, 'Git repository')) {
    actions.push(
      nextAction(
        'initialize-git',
        'git init',
        'AgentLoopKit evidence is easier to review when the project is inside a Git repository.',
      ),
    );
  }

  if (hasWarnOrFail(checks, 'Git target')) {
    actions.push(
      nextAction(
        'check-git-root',
        'agentloop doctor from the Git root',
        'Confirm whether AgentLoopKit should live at the repository root or the current subdirectory.',
      ),
    );
  }

  if (hasWarnOrFail(checks, 'Working tree')) {
    actions.push(
      nextAction(
        'review-working-tree',
        'git status --short',
        'Review uncommitted files before asking an agent to continue.',
      ),
    );
  }

  if (['test command', 'lint command', 'typecheck command', 'build command', 'Tests'].some((name) => hasWarnOrFail(checks, name))) {
    actions.push(
      nextAction(
        'add-verification',
        'add package scripts or configure verification.commands',
        'AgentLoopKit needs project-specific verification commands before agents can prove completion.',
      ),
    );
  }

  if (hasWarnOrFail(checks, 'Monorepo')) {
    actions.push(
      nextAction(
        'scope-monorepo-verification',
        'add workspace-specific verification commands to the task contract',
        'Root checks may miss package-level failures in monorepos.',
      ),
    );
  }

  if (hasWarnOrFail(checks, 'Potential risk files')) {
    actions.push(
      nextAction(
        'review-risk-files',
        'review risk files before starting autonomous work',
        'Risk files were detected; protect sensitive areas in the task contract before editing.',
      ),
    );
  }

  return actions;
}

function renderNextActions(nextActions: DoctorNextAction[]) {
  if (!nextActions.length) {
    return '## Next Steps\n\nNo doctor follow-up required. Create a task with `agentloop create-task` when you are ready to start work.\n';
  }

  return `## Next Steps

${nextActions.map((item) => `- Run \`${item.command}\`: ${item.reason}`).join('\n')}
`;
}

async function resolveComparablePath(filePath: string) {
  try {
    return await realpath(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

async function checkTemplateManifest(cwd: string): Promise<DoctorCheck> {
  const manifest = await readTextIfExists(path.join(cwd, AGENTLOOP_MANIFEST_FILE));
  if (!manifest) return check('Template manifest', 'warn', MISSING_MANIFEST_MESSAGE);

  try {
    const parsed = JSON.parse(manifest) as {
      version?: unknown;
      templateVersion?: unknown;
      generatedBy?: unknown;
    };
    if (
      parsed.version !== 1 ||
      typeof parsed.templateVersion !== 'number' ||
      parsed.generatedBy !== 'agentloopkit'
    ) {
      return check('Template manifest', 'warn', INVALID_MANIFEST_MESSAGE);
    }

    if (parsed.templateVersion < CURRENT_TEMPLATE_VERSION) {
      return check(
        'Template manifest',
        'warn',
        `template version ${parsed.templateVersion} is older than current version ${CURRENT_TEMPLATE_VERSION}; review docs/template-migrations.md and rerun agentloop init to add missing files`,
      );
    }

    if (parsed.templateVersion > CURRENT_TEMPLATE_VERSION) {
      return check(
        'Template manifest',
        'warn',
        `template version ${parsed.templateVersion} is newer than this CLI supports; upgrade AgentLoopKit before changing generated harness files`,
      );
    }

    return check(
      'Template manifest',
      'pass',
      `template version ${CURRENT_TEMPLATE_VERSION} is current`,
    );
  } catch {
    return check('Template manifest', 'warn', INVALID_MANIFEST_MESSAGE);
  }
}

export async function runDoctor(options: { cwd: string }): Promise<DoctorResult> {
  const cwd = options.cwd;
  const checks: DoctorCheck[] = [];

  checks.push(check('Current directory', 'pass', cwd));
  const gitInstalled = await commandExists('git');
  checks.push(
    check(
      'Git installed',
      gitInstalled ? 'pass' : 'warn',
      gitInstalled ? 'git is available' : 'git not found',
    ),
  );
  const inGit = gitInstalled ? await isInsideGitRepo(cwd) : false;
  checks.push(
    check(
      'Git repository',
      inGit ? 'pass' : 'warn',
      inGit ? 'inside a git repo' : 'not inside a git repo',
    ),
  );
  const gitRoot = inGit ? await getGitRoot(cwd) : '';
  const resolvedGitRoot = gitRoot ? await resolveComparablePath(gitRoot) : '';
  const targetIsRoot = resolvedGitRoot
    ? resolvedGitRoot === (await resolveComparablePath(cwd))
    : false;
  const git = {
    isRepository: inGit,
    root: resolvedGitRoot,
    targetIsRoot,
  };
  if (inGit) {
    checks.push(check('Git root', 'pass', resolvedGitRoot));
    checks.push(
      check(
        'Git target',
        targetIsRoot ? 'pass' : 'warn',
        targetIsRoot
          ? 'current directory is the Git root'
          : 'current directory is a Git subdirectory',
      ),
    );
    if (!targetIsRoot) {
      checks.push(
        check(
          'Git subdirectory target',
          'warn',
          'AgentLoopKit files live in the current directory, not the Git root.',
        ),
      );
    }
  }

  const status = inGit ? await getGitStatus(cwd) : '';
  checks.push(
    check(
      'Working tree',
      status.trim() ? 'warn' : 'pass',
      status.trim() ? 'working tree has changes' : 'clean',
    ),
  );

  for (const file of ['AGENTS.md', 'AGENTLOOP.md', '.agentloop']) {
    const exists = await pathExists(path.join(cwd, file));
    checks.push(check(file, exists ? 'pass' : 'warn', exists ? 'found' : 'missing'));
  }
  checks.push(await checkTemplateManifest(cwd));

  try {
    await loadAgentLoopConfig(cwd);
    checks.push(check(CONFIG_FILE, 'pass', 'valid'));
  } catch (error) {
    checks.push(
      check(CONFIG_FILE, 'fail', error instanceof Error ? error.message : 'invalid config'),
    );
  }

  const agents = await readTextIfExists(path.join(cwd, 'AGENTS.md'));
  if (agents && !agents.includes('AgentLoopKit')) {
    checks.push(
      check('AGENTS.md AgentLoopKit section', 'warn', 'AGENTS.md does not mention AgentLoopKit'),
    );
  }

  const packageManager = await detectPackageManager(cwd);
  const projectType = await detectProjectType(cwd);
  const monorepo = await detectMonorepo(cwd);
  const commands = await detectPackageScripts(cwd, packageManager);
  checks.push(check('Package manager', 'pass', packageManager));
  checks.push(check('Project type', 'pass', projectType));
  checks.push(
    check(
      'Monorepo',
      monorepo.detected ? 'warn' : 'pass',
      monorepo.detected
        ? `workspace markers detected: ${monorepo.markers.join(', ')}. ${MONOREPO_VERIFICATION_GUIDANCE}`
        : 'not detected',
    ),
  );

  for (const key of ['test', 'lint', 'typecheck', 'build'] as const) {
    checks.push(
      check(`${key} command`, commands[key] ? 'pass' : 'warn', commands[key] || 'not detected'),
    );
  }

  const risks = await detectRiskFiles(cwd);
  const riskCount = Object.values(risks).reduce((count, files) => count + files.length, 0);
  checks.push(
    check(
      'Potential risk files',
      riskCount ? 'warn' : 'pass',
      riskCount ? `${riskCount} risk file(s) detected` : 'none detected',
    ),
  );
  for (const [category, files] of Object.entries(risks)) {
    if (files.length === 0) continue;
    checks.push(
      check(
        `Risk files: ${RISK_CATEGORY_LABELS[category as keyof typeof RISK_CATEGORY_LABELS]}`,
        'warn',
        formatRiskFiles(files),
      ),
    );
  }
  if (!commands.test) {
    checks.push(check('Tests', 'warn', 'no test command detected'));
  }

  const warnings = checks.filter((item) => item.status === 'warn');
  const serious = checks.filter((item) => item.status === 'fail');
  const nextActions = chooseDoctorNextActions(checks);
  const markdown = `# AgentLoopKit Doctor

${checks
  .map((item) => {
    const icon = item.status === 'pass' ? '[pass]' : item.status === 'warn' ? '[warn]' : '[fail]';
    return `- ${icon} ${item.name}: ${item.message}`;
  })
  .join('\n')}

${renderNextActions(nextActions)}
`;

  return { checks, warnings, serious, nextActions, git, markdown };
}
