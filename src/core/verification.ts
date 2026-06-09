import path from 'node:path';
import { execa } from 'execa';
import { AgentLoopConfig } from './config.js';
import { formatTimestamp } from './dates.js';
import { getGitBranch, getGitCommit, getGitStatus } from './git.js';
import { writeTextFile } from './file-system.js';

export type VerificationCommandKey = 'test' | 'lint' | 'typecheck' | 'build' | 'custom';

export type VerificationCommandResult = {
  key: VerificationCommandKey;
  command: string;
  exitCode: number;
  passed: boolean;
  output: string;
};

export type VerificationOptions = {
  cwd: string;
  config: AgentLoopConfig;
  reportTimestamp?: string;
  nowIso?: string;
  skip?: Partial<Record<'test' | 'lint' | 'typecheck' | 'build', boolean>>;
  customCommands?: string[];
};

export type VerificationResult = {
  overallStatus: 'pass' | 'fail' | 'not-run';
  commands: VerificationCommandResult[];
  notRun: string[];
  markdown: string;
  reportPath: string;
};

function excerpt(output: string, limit = 5000) {
  if (output.length <= limit) return output;
  const headLimit = Math.ceil(limit / 2);
  const tailLimit = Math.floor(limit / 2);
  return `${output.slice(0, headLimit)}

[output truncated: showing first ${headLimit} and last ${tailLimit} characters of ${
    output.length
  } total]

${output.slice(-tailLimit)}`;
}

function commandEntries(config: AgentLoopConfig, options: VerificationOptions) {
  const configured: Array<[VerificationCommandKey, string]> = [
    ['test', config.commands.test],
    ['lint', config.commands.lint],
    ['typecheck', config.commands.typecheck],
    ['build', config.commands.build],
  ];

  const active = configured.filter(([key, command]) => {
    if (key === 'custom') return false;
    return command && !options.skip?.[key as 'test' | 'lint' | 'typecheck' | 'build'];
  });

  for (const command of options.customCommands ?? []) {
    if (command.trim()) active.push(['custom', command.trim()]);
  }

  return active;
}

export async function runVerification(options: VerificationOptions): Promise<VerificationResult> {
  const timestamp = options.reportTimestamp ?? formatTimestamp();
  const nowIso = options.nowIso ?? new Date().toISOString();
  const commands = commandEntries(options.config, options);
  const notRun = [
    ...(['test', 'lint', 'typecheck', 'build'] as const).filter((key) => {
      if (options.skip?.[key]) return true;
      return !options.config.commands[key];
    }),
  ];

  const results: VerificationCommandResult[] = [];
  for (const [key, command] of commands) {
    const result = await execa(command, {
      cwd: options.cwd,
      shell: true,
      all: true,
      reject: false,
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    results.push({
      key,
      command,
      exitCode: result.exitCode ?? 1,
      passed: result.exitCode === 0,
      output: result.all ?? result.stdout ?? result.stderr ?? '',
    });
  }

  const overallStatus =
    results.length === 0 ? 'not-run' : results.every((result) => result.passed) ? 'pass' : 'fail';
  const reportPath = path.join(
    options.cwd,
    options.config.paths.reportsDir,
    `${timestamp}-verification-report.md`,
  );
  const branch = await getGitBranch(options.cwd);
  const commit = await getGitCommit(options.cwd);
  const status = await getGitStatus(options.cwd);

  const markdown = `# Verification Report

- Timestamp: ${nowIso}
- Repo: ${path.basename(options.cwd)}
- Git branch: ${branch || 'not available'}
- Git commit: ${commit || 'not available'}
- Working tree: ${status.trim() ? 'dirty' : 'clean or unavailable'}
- Overall status: ${overallStatus}

## Commands Run
${
  results.length === 0
    ? 'No verification commands were configured or selected.'
    : results
        .map(
          (result) => `### ${result.key}: \`${result.command}\`

- Exit code: ${result.exitCode}
- Status: ${result.passed ? 'pass' : 'fail'}

\`\`\`text
${excerpt(result.output || '(no output)')}
\`\`\``,
        )
        .join('\n\n')
}

## Not Run
${notRun.length ? notRun.map((item) => `- ${item}`).join('\n') : '- Nothing skipped.'}

## Recommended Next Actions
${
  overallStatus === 'pass'
    ? '- Review the diff and prepare a handoff summary.'
    : overallStatus === 'fail'
      ? '- Fix failing commands before claiming completion.'
      : '- Add test, lint, typecheck, or build commands to agentloop.config.json.'
}
`;

  await writeTextFile(reportPath, markdown);
  return { overallStatus, commands: results, notRun, markdown, reportPath };
}
