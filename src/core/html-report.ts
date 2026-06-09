import path from 'node:path';
import { readFile, readdir, stat } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { formatTimestamp } from './dates.js';
import { latestMarkdownFile } from './artifacts.js';
import { pathExists, writeTextFile } from './file-system.js';
import {
  getGitBranch,
  getGitCommit,
  getGitDiffStat,
  getGitStatus,
  GitFileStatus,
  parseGitStatus,
} from './git.js';
import { summarizeRepository } from './pr-summary.js';
import { getActiveTaskPath } from './task-state.js';

export type HtmlReportInput = {
  timestamp: string;
  nowIso?: string;
  repoName: string;
  branch: string;
  commit: string;
  workingTreeStatus: string;
  taskPath?: string;
  verificationPath?: string;
  handoffPath?: string;
  changedFiles: GitFileStatus[];
  diffStat?: string;
  taskMarkdown?: string;
  verificationMarkdown?: string;
  handoffMarkdown?: string;
  summaryMarkdown?: string;
};

export type HtmlReportMetadata = {
  timestamp: string;
  repoName: string;
  taskTitle: string;
  verificationStatus: string;
  changedFileCount: number;
};

export type HtmlReportResult = {
  html: string;
  metadata: HtmlReportMetadata;
};

export type WriteHtmlReportOptions = {
  cwd: string;
  config: AgentLoopConfig;
  timestamp?: string;
  nowIso?: string;
  taskPath?: string;
  reportPath?: string;
  handoffPath?: string;
  outPath?: string;
};

export type WrittenHtmlReport = HtmlReportResult & {
  outPath: string;
  sourcePaths: {
    task?: string;
    verification?: string;
    handoff?: string;
  };
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractLine(markdown: string | undefined, pattern: RegExp, fallback: string) {
  if (!markdown) return fallback;
  return markdown.match(pattern)?.[1]?.trim() || fallback;
}

function extractTitle(markdown: string | undefined, fallback: string) {
  return extractLine(markdown, /^#\s+(.+)$/m, fallback);
}

function extractVerificationStatus(markdown: string | undefined) {
  return extractLine(markdown, /Overall status:\s*([a-z-]+)/i, 'not available');
}

function normalizeDisplayPath(cwd: string, filePath: string | undefined) {
  if (!filePath) return undefined;
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
  return path.relative(cwd, absolutePath).split(path.sep).join('/') || '.';
}

function resolveUserPath(cwd: string, filePath: string | undefined) {
  if (!filePath) return undefined;
  return path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(cwd, filePath);
}

async function readMarkdownIfExists(filePath: string | undefined) {
  if (!filePath || !(await pathExists(filePath))) return undefined;
  return readFile(filePath, 'utf8');
}

async function latestMatchingMarkdownFile(dir: string, pattern: RegExp) {
  if (!(await pathExists(dir))) return undefined;
  const entries = await Promise.all(
    (await readdir(dir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && pattern.test(entry.name))
      .map(async (entry) => {
        const filePath = path.join(dir, entry.name);
        const fileStat = await stat(filePath);
        return { filePath, name: entry.name, mtimeMs: fileStat.mtimeMs };
      }),
  );

  entries.sort((left, right) => {
    if (left.mtimeMs !== right.mtimeMs) return left.mtimeMs - right.mtimeMs;
    return left.name.localeCompare(right.name);
  });

  return entries.at(-1)?.filePath;
}

function renderSourcePath(label: string, filePath: string | undefined) {
  return `<li><span>${escapeHtml(label)}</span><code>${escapeHtml(filePath ?? 'not found')}</code></li>`;
}

function renderChangedFiles(changedFiles: GitFileStatus[]) {
  if (!changedFiles.length) return '<p class="muted">No changed files detected.</p>';
  return `<table>
  <thead><tr><th>Status</th><th>Path</th></tr></thead>
  <tbody>
${changedFiles
  .map(
    (file) =>
      `    <tr><td><code>${escapeHtml(file.status)}</code></td><td><code>${escapeHtml(
        file.path,
      )}</code></td></tr>`,
  )
  .join('\n')}
  </tbody>
</table>`;
}

function renderMarkdownBlock(label: string, markdown: string | undefined, emptyText: string) {
  return `<section>
  <h2>${escapeHtml(label)}</h2>
  ${
    markdown?.trim()
      ? `<pre>${escapeHtml(markdown.trim())}</pre>`
      : `<p class="muted">${escapeHtml(emptyText)}</p>`
  }
</section>`;
}

export function generateHtmlReport(input: HtmlReportInput): HtmlReportResult {
  const taskTitle = extractTitle(input.taskMarkdown, 'No task contract found');
  const verificationStatus = extractVerificationStatus(input.verificationMarkdown);
  const generatedAt = input.nowIso ?? new Date().toISOString();
  const metadata: HtmlReportMetadata = {
    timestamp: input.timestamp,
    repoName: input.repoName,
    taskTitle,
    verificationStatus,
    changedFileCount: input.changedFiles.length,
  };

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AgentLoopKit Report - ${escapeHtml(input.repoName)}</title>
  <style>
    :root { color-scheme: light; --ink: oklch(22% 0.026 245); --muted: oklch(48% 0.023 245); --line: oklch(84% 0.018 245); --panel: oklch(97% 0.009 245); --paper: oklch(99% 0.006 245); --accent: oklch(49% 0.09 183); --warn-ink: oklch(42% 0.12 52); --warn-bg: oklch(96% 0.035 72); --terminal: oklch(19% 0.024 245); --terminal-ink: oklch(91% 0.014 245); }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--paper); line-height: 1.55; }
    main { max-width: 1040px; margin: 0 auto; padding: 44px 24px 56px; }
    header { border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 28px; }
    .eyebrow { color: var(--accent); font-size: 13px; font-weight: 700; letter-spacing: 0; text-transform: uppercase; }
    h1 { margin: 8px 0 12px; font-size: clamp(32px, 5vw, 54px); line-height: 1.03; letter-spacing: 0; }
    h2 { margin: 0 0 12px; font-size: 21px; letter-spacing: 0; }
    section { border-top: 1px solid var(--line); padding: 24px 0; }
    .summary { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); margin-top: 18px; }
    .metric { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 14px; }
    .metric span { display: block; color: var(--muted); font-size: 13px; }
    .metric strong { display: block; margin-top: 5px; font-size: 16px; overflow-wrap: anywhere; }
    ul.sources { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
    ul.sources li { display: grid; gap: 4px; }
    .muted { color: var(--muted); }
    .safety { border: 1px solid oklch(78% 0.08 62); color: var(--warn-ink); background: var(--warn-bg); padding: 14px 16px; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    th, td { text-align: left; border-bottom: 1px solid var(--line); padding: 10px 12px; vertical-align: top; }
    th { background: var(--panel); font-size: 13px; color: var(--muted); }
    tr:last-child td { border-bottom: 0; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; font-size: 0.92em; overflow-wrap: anywhere; }
    pre { margin: 0; padding: 16px; overflow: auto; border: 1px solid var(--line); border-radius: 8px; background: var(--terminal); color: var(--terminal-ink); font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">AgentLoopKit local evidence report</div>
      <h1>${escapeHtml(taskTitle)}</h1>
      <p class="muted">Generated ${escapeHtml(generatedAt)} from local repository artifacts. No LLM, network call, telemetry, or command execution is required to render this report.</p>
      <div class="summary">
        <div class="metric"><span>Repository</span><strong>${escapeHtml(input.repoName)}</strong></div>
        <div class="metric"><span>Branch</span><strong>${escapeHtml(input.branch || 'not available')}</strong></div>
        <div class="metric"><span>Commit</span><strong>${escapeHtml(input.commit || 'not available')}</strong></div>
        <div class="metric"><span>Working tree</span><strong>${escapeHtml(input.workingTreeStatus)}</strong></div>
        <div class="metric"><span>Verification</span><strong>${escapeHtml(verificationStatus)}</strong></div>
        <div class="metric"><span>Changed files</span><strong>${input.changedFiles.length}</strong></div>
      </div>
    </header>

    <section>
      <h2>Source Artifacts</h2>
      <ul class="sources">
        ${renderSourcePath('Task contract', input.taskPath)}
        ${renderSourcePath('Verification report', input.verificationPath)}
        ${renderSourcePath('Handoff summary', input.handoffPath)}
      </ul>
    </section>

    <section>
      <h2>Changed Files</h2>
      ${renderChangedFiles(input.changedFiles)}
    </section>

    ${renderMarkdownBlock('Task Contract', input.taskMarkdown, 'No task contract was found.')}
    ${renderMarkdownBlock('Verification Evidence', input.verificationMarkdown, 'No verification report was found.')}
    ${renderMarkdownBlock('Reviewer Handoff', input.handoffMarkdown, 'No handoff summary was found.')}
    ${renderMarkdownBlock('Current Deterministic Summary', input.summaryMarkdown, 'No deterministic summary was generated.')}

    <section>
      <h2>Diff Stats</h2>
      <pre>${escapeHtml(input.diffStat?.trim() || 'No diff stats available.')}</pre>
    </section>

    <section>
      <h2>Safety Notes</h2>
      <div class="safety">This report is a local static artifact. It must not be treated as proof that verification passed unless the verification section says so. Review protected areas such as secrets, auth, billing, deployment, migrations, lockfiles, and public APIs before merge.</div>
    </section>
  </main>
</body>
</html>
`;

  return { html, metadata };
}

export async function writeHtmlReport(options: WriteHtmlReportOptions): Promise<WrittenHtmlReport> {
  const timestamp = options.timestamp ?? formatTimestamp();
  const cwd = options.cwd;
  const taskPath =
    resolveUserPath(cwd, options.taskPath) ??
    (await getActiveTaskPath({ cwd, config: options.config })) ??
    (await latestMarkdownFile(path.join(cwd, options.config.paths.tasksDir)));
  const verificationPath =
    resolveUserPath(cwd, options.reportPath) ??
    (await latestMatchingMarkdownFile(
      path.join(cwd, options.config.paths.reportsDir),
      /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-verification-report\.md$/,
    ));
  const handoffPath =
    resolveUserPath(cwd, options.handoffPath) ??
    (await latestMatchingMarkdownFile(
      path.join(cwd, options.config.paths.handoffsDir),
      /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-pr-summary\.md$/,
    ));

  const [status, branch, commit, diffStat, taskMarkdown, verificationMarkdown, handoffMarkdown] =
    await Promise.all([
      getGitStatus(cwd),
      getGitBranch(cwd),
      getGitCommit(cwd),
      getGitDiffStat(cwd),
      readMarkdownIfExists(taskPath),
      readMarkdownIfExists(verificationPath),
      readMarkdownIfExists(handoffPath),
    ]);
  const changedFiles = await parseGitStatus(status);
  const summary = await summarizeRepository({
    cwd,
    config: options.config,
    taskPath,
    reportPath: verificationPath,
    timestamp,
    write: false,
  });
  const report = generateHtmlReport({
    timestamp,
    nowIso: options.nowIso,
    repoName: options.config.project.name || path.basename(cwd),
    branch,
    commit,
    workingTreeStatus: status.trim() ? 'dirty' : 'clean or unavailable',
    taskPath: normalizeDisplayPath(cwd, taskPath),
    verificationPath: normalizeDisplayPath(cwd, verificationPath),
    handoffPath: normalizeDisplayPath(cwd, handoffPath),
    changedFiles,
    diffStat,
    taskMarkdown,
    verificationMarkdown,
    handoffMarkdown,
    summaryMarkdown: summary.markdown,
  });
  const outPath =
    resolveUserPath(cwd, options.outPath) ??
    path.join(cwd, options.config.paths.reportsDir, `${timestamp}-agentloop-report.html`);

  await writeTextFile(outPath, report.html);

  return {
    ...report,
    outPath,
    sourcePaths: {
      task: normalizeDisplayPath(cwd, taskPath),
      verification: normalizeDisplayPath(cwd, verificationPath),
      handoff: normalizeDisplayPath(cwd, handoffPath),
    },
  };
}
