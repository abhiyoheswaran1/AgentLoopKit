import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { formatTimestamp } from './dates.js';
import {
  appendUntrackedFilesToDiffStat,
  getGitDiffStat,
  getGitStatus,
  parseGitStatus,
  GitFileStatus,
} from './git.js';
import { pathExists, writeTextFile } from './file-system.js';
import { resolveExplicitArtifactPath, resolveUniqueOutputArtifactPath } from './artifacts.js';
import {
  getCurrentOrLatestRunTaskPath,
  getLatestVerificationReportPath,
  resolveCurrentVerificationEvidence,
} from './evidence.js';
import { escapeMarkdownProse, fencedCodeBlock, inlineCode } from './markdown-format.js';
import { verificationNotRunItems } from './verification-report-sections.js';
import {
  classifyChangedFiles,
  renderCompactChangeAreas,
  renderCompactChangedFiles,
} from './change-areas.js';
import { redactLocalRoots } from './redaction.js';
import { reconcileCriteriaCoverage, renderCriteriaCoverageMarkdown } from './criteria-coverage.js';

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

function renderReviewFocus(changedFiles: GitFileStatus[]) {
  if (!changedFiles.length) return '- No changed files detected.';

  const keys = new Set(classifyChangedFiles(changedFiles).map((area) => area.key));
  const lines: string[] = [];

  if (keys.has('source')) lines.push('- Review source changes for behavior and public API impact.');
  if (keys.has('tests')) lines.push('- Check tests cover the changed behavior.');
  if (keys.has('docs')) lines.push('- Check docs match the implemented command behavior.');
  if (keys.has('ci'))
    lines.push('- Review CI or automation changes for permissions and secret handling.');
  if (keys.has('config'))
    lines.push('- Review package and config changes for install, build, and publish impact.');
  if (keys.has('agentloop'))
    lines.push(
      '- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.',
    );
  if (keys.has('risk'))
    lines.push(
      '- Review risk-sensitive paths such as migrations, auth, security, billing, env, deployment, and lockfiles with extra care.',
    );
  if (keys.has('other')) lines.push('- Review uncategorized files for ownership and scope.');

  return lines.join('\n');
}

function renderDiffStat(diffStat?: string) {
  const trimmed = diffStat?.trim();
  return trimmed ? fencedCodeBlock('text', trimmed) : 'No diff stats available.';
}

function renderVerificationNotRun(markdown: string | undefined) {
  if (!markdown) return '- No verification report was available.';
  const items = verificationNotRunItems(markdown);
  if (!items.length) return '- No skipped commands were recorded.';
  return items
    .map((item) => `- ${escapeMarkdownProse(item).replace(/\r/g, '\\r').replace(/\n/g, '\\n')}`)
    .join('\n');
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
  const criteriaCoverage = reconcileCriteriaCoverage(input.taskMarkdown, input.verificationMarkdown);
  const criteriaCoverageMarkdown = renderCriteriaCoverageMarkdown(criteriaCoverage);

  const markdown = `# PR Summary

- Generated: ${input.timestamp}
- Task context: ${inlineCode(taskTitle)}
- Verification status: ${verificationLine}

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
${renderCompactChangedFiles(input.changedFiles)}

## Change Areas
${renderCompactChangeAreas(input.changedFiles)}

## Diff Stats
${renderDiffStat(input.diffStat)}

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
${renderReviewFocus(input.changedFiles)}

## Verification Performed
- ${verificationLine}

## Verification Report Not Run
${renderVerificationNotRun(input.verificationMarkdown)}

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

${criteriaCoverageMarkdown}

## Reviewer Checklist
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.
`;

  return { markdown, criteriaCoverage };
}

function redactLocalGitRoot(value: string, gitRoot: string, redactPaths: boolean | undefined) {
  return redactPaths ? redactLocalRoots(value, [gitRoot]) : value;
}

export async function summarizeRepository(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath?: string;
  reportPath?: string;
  timestamp?: string;
  write?: boolean;
  redactPaths?: boolean;
}) {
  const timestamp = options.timestamp ?? formatTimestamp();
  const status = await getGitStatus(options.cwd);
  const changedFiles = await parseGitStatus(status);
  const diffStat = appendUntrackedFilesToDiffStat(await getGitDiffStat(options.cwd), changedFiles);
  const taskPath =
    (options.taskPath
      ? await resolveExplicitArtifactPath({
          cwd: options.cwd,
          artifactType: 'task',
          requestedPath: options.taskPath,
          expectedDir: options.config.paths.tasksDir,
        })
      : undefined) ??
    (await getCurrentOrLatestRunTaskPath({ cwd: options.cwd, config: options.config }));
  const reportPath =
    (options.reportPath
      ? await resolveExplicitArtifactPath({
          cwd: options.cwd,
          artifactType: 'verification',
          requestedPath: options.reportPath,
          expectedDir: options.config.paths.reportsDir,
        })
      : undefined) ??
    (
      await resolveCurrentVerificationEvidence({
        cwd: options.cwd,
        taskPath,
        reportPath: await getLatestVerificationReportPath({
          cwd: options.cwd,
          config: options.config,
        }),
        reportsDir: options.config.paths.reportsDir,
        handoffsDir: options.config.paths.handoffsDir,
      })
    ).currentReportPath;
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
  const markdown = redactLocalGitRoot(summary.markdown, options.cwd, options.redactPaths);
  const defaultOutPath = path.join(options.config.paths.handoffsDir, `${timestamp}-pr-summary.md`);
  const outPath = options.write
    ? await resolveUniqueOutputArtifactPath({
        cwd: options.cwd,
        artifactType: 'handoff',
        requestedPath: defaultOutPath,
        expectedDir: options.config.paths.handoffsDir,
        expectedExtension: '.md',
      })
    : path.join(options.cwd, defaultOutPath);
  if (options.write) await writeTextFile(outPath, markdown);
  return { ...summary, markdown, outPath, changedFiles, diffStat, taskPath, reportPath };
}
