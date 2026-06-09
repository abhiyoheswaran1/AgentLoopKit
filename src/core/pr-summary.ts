import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { formatTimestamp } from './dates.js';
import { getGitDiffStat, getGitStatus, parseGitStatus, GitFileStatus } from './git.js';
import { pathExists, writeTextFile } from './file-system.js';
import { latestMarkdownFile } from './artifacts.js';
import { getActiveTaskPath } from './task-state.js';

export type PrSummaryInput = {
  timestamp: string;
  status: string;
  changedFiles: GitFileStatus[];
  taskMarkdown?: string;
  verificationMarkdown?: string;
  diffStat?: string;
};

function extractLine(markdown: string | undefined, pattern: RegExp, fallback: string) {
  if (!markdown) return fallback;
  const match = markdown.match(pattern);
  return match?.[1]?.trim() || fallback;
}

export function generatePrSummary(input: PrSummaryInput) {
  const taskTitle = extractLine(input.taskMarkdown, /^#\s+(.+)$/m, 'No task contract found.');
  const verification = extractLine(
    input.verificationMarkdown,
    /Overall status:\s*([a-z-]+)/i,
    'No verification report found.',
  );
  const verificationLine =
    verification === 'No verification report found.'
      ? verification
      : `Overall status: ${verification}`;

  const markdown = `# PR Summary

- Generated: ${input.timestamp}
- Task context: ${taskTitle}
- Verification status: ${verificationLine}

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
${
  input.changedFiles.length
    ? input.changedFiles.map((file) => `- ${file.status} \`${file.path}\``).join('\n')
    : '- No changed files detected.'
}

## Diff Stats
${input.diffStat?.trim() || 'No diff stats available.'}

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Verification Performed
- ${verificationLine}

## Verification Not Performed
- Check the verification report for skipped commands.

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

## Reviewer Checklist
- [ ] Acceptance criteria match the task contract.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.
`;

  return { markdown };
}

export async function summarizeRepository(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath?: string;
  reportPath?: string;
  timestamp?: string;
  write?: boolean;
}) {
  const timestamp = options.timestamp ?? formatTimestamp();
  const status = await getGitStatus(options.cwd);
  const changedFiles = await parseGitStatus(status);
  const diffStat = await getGitDiffStat(options.cwd);
  const taskPath =
    options.taskPath ??
    (await getActiveTaskPath({ cwd: options.cwd, config: options.config })) ??
    (await latestMarkdownFile(path.join(options.cwd, options.config.paths.tasksDir)));
  const reportPath =
    options.reportPath ??
    (await latestMarkdownFile(path.join(options.cwd, options.config.paths.reportsDir)));
  const taskMarkdown =
    taskPath && (await pathExists(taskPath)) ? await readFile(taskPath, 'utf8') : undefined;
  const verificationMarkdown =
    reportPath && (await pathExists(reportPath)) ? await readFile(reportPath, 'utf8') : undefined;
  const summary = generatePrSummary({
    timestamp,
    status,
    changedFiles,
    taskMarkdown,
    verificationMarkdown,
    diffStat,
  });
  const outPath = path.join(
    options.cwd,
    options.config.paths.handoffsDir,
    `${timestamp}-pr-summary.md`,
  );
  if (options.write) await writeTextFile(outPath, summary.markdown);
  return { ...summary, outPath, changedFiles };
}
