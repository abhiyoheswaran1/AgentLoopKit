import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { formatTimestamp } from './dates.js';
import { getGitDiffStat, getGitStatus, parseGitStatus, GitFileStatus } from './git.js';
import { pathExists, writeTextFile } from './file-system.js';
import { latestMarkdownFile, verificationReportPattern } from './artifacts.js';
import { getActiveTaskPath } from './task-state.js';

export type PrSummaryInput = {
  timestamp: string;
  status: string;
  changedFiles: GitFileStatus[];
  taskMarkdown?: string;
  verificationMarkdown?: string;
  diffStat?: string;
};

type ChangeArea = {
  key: string;
  title: string;
  files: GitFileStatus[];
};

const CHANGE_AREAS: Array<{ key: string; title: string; matches: (filePath: string) => boolean }> =
  [
    {
      key: 'risk',
      title: 'Risk-Sensitive',
      matches: (filePath) =>
        /(^|\/)(migrations?|migration|auth|security|billing|deploy|deployment)(\/|\.|-|_|$)/.test(
          filePath,
        ) ||
        /(^|\/)\.env(\.|$)/.test(filePath) ||
        /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|Cargo\.lock|poetry\.lock)$/.test(
          filePath,
        ),
    },
    { key: 'source', title: 'Source', matches: (filePath) => /^src\//.test(filePath) },
    {
      key: 'tests',
      title: 'Tests',
      matches: (filePath) =>
        /(^|\/)(tests?|__tests__)\//.test(filePath) ||
        /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath),
    },
    {
      key: 'agentloop',
      title: 'AgentLoop',
      matches: (filePath) =>
        /^\.agentloop\//.test(filePath) ||
        /(^|\/)(AGENTS\.md|AGENTLOOP\.md|agentloop\.config\.json)$/.test(filePath),
    },
    {
      key: 'docs',
      title: 'Documentation',
      matches: (filePath) =>
        /(^|\/)docs\//.test(filePath) ||
        /(^|\/)(README|CHANGELOG|CONTRIBUTING|CODE_OF_CONDUCT|SECURITY|ROADMAP|DECISIONS)\.md$/i.test(
          filePath,
        ) ||
        /\.mdx?$/.test(filePath),
    },
    {
      key: 'ci',
      title: 'CI / Automation',
      matches: (filePath) =>
        /^\.github\//.test(filePath) ||
        /^scripts\//.test(filePath) ||
        /(^|\/)(Dockerfile|Makefile)$/.test(filePath),
    },
    {
      key: 'config',
      title: 'Config / Package',
      matches: (filePath) =>
        /(^|\/)(package\.json|tsconfig\.json|tsup\.config\.ts|vitest\.config\.ts|eslint\.config\.js|prettier\.config\.[cm]?js|pnpm-workspace\.yaml)$/.test(
          filePath,
        ) || /^schema\//.test(filePath),
    },
  ];

function extractLine(markdown: string | undefined, pattern: RegExp, fallback: string) {
  if (!markdown) return fallback;
  const match = markdown.match(pattern);
  return match?.[1]?.trim() || fallback;
}

function classifyChangedFiles(changedFiles: GitFileStatus[]) {
  const areas: ChangeArea[] = CHANGE_AREAS.map((area) => ({
    key: area.key,
    title: area.title,
    files: [],
  }));
  const other: ChangeArea = { key: 'other', title: 'Other', files: [] };

  for (const file of changedFiles) {
    const normalizedPath = file.path.replace(/\\/g, '/');
    const areaIndex = CHANGE_AREAS.findIndex((area) => area.matches(normalizedPath));
    if (areaIndex === -1) other.files.push(file);
    else areas[areaIndex]?.files.push(file);
  }

  return [...areas.filter((area) => area.files.length), ...(other.files.length ? [other] : [])];
}

function renderChangeAreas(changedFiles: GitFileStatus[]) {
  if (!changedFiles.length) return '- No changed files detected.';

  const areas = classifyChangedFiles(changedFiles);
  return areas
    .map((area) => {
      return `### ${area.title}
${area.files.map((file) => `- ${file.status} \`${file.path}\``).join('\n')}`;
    })
    .join('\n\n');
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

## Change Areas
${renderChangeAreas(input.changedFiles)}

## Diff Stats
${input.diffStat?.trim() || 'No diff stats available.'}

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
${renderReviewFocus(input.changedFiles)}

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
    (await latestMarkdownFile(path.join(options.cwd, options.config.paths.reportsDir), {
      pattern: verificationReportPattern,
    }));
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
