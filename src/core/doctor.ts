import path from 'node:path';
import { AGENTLOOP_MANIFEST_FILE, CONFIG_FILE, CURRENT_TEMPLATE_VERSION } from './constants.js';
import { loadAgentLoopConfig } from './config.js';
import { pathExists, readTextIfExists } from './file-system.js';
import { commandExists, getGitStatus, isInsideGitRepo } from './git.js';
import { detectPackageManager } from './package-manager.js';
import { detectMonorepo, detectPackageScripts, detectProjectType } from './project-detection.js';
import { detectRiskFiles } from './safety.js';

export type DoctorCheck = {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
};

export type DoctorResult = {
  checks: DoctorCheck[];
  warnings: DoctorCheck[];
  serious: DoctorCheck[];
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
  const markdown = `# AgentLoopKit Doctor

${checks
  .map((item) => {
    const icon = item.status === 'pass' ? '[pass]' : item.status === 'warn' ? '[warn]' : '[fail]';
    return `- ${icon} ${item.name}: ${item.message}`;
  })
  .join('\n')}
`;

  return { checks, warnings, serious, markdown };
}
