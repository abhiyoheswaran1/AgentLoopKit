import path from 'node:path';
import { CONFIG_FILE } from './constants.js';
import { loadAgentLoopConfig } from './config.js';
import { pathExists, readTextIfExists } from './file-system.js';
import { commandExists, getGitStatus, isInsideGitRepo } from './git.js';
import { detectPackageManager } from './package-manager.js';
import { detectPackageScripts, detectProjectType } from './project-detection.js';
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

function check(name: string, status: DoctorCheck['status'], message: string): DoctorCheck {
  return { name, status, message };
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
  const commands = await detectPackageScripts(cwd, packageManager);
  checks.push(check('Package manager', 'pass', packageManager));
  checks.push(check('Project type', 'pass', projectType));

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
