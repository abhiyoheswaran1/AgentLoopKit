import path from 'node:path';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolveOutputArtifactPath } from './artifacts.js';
import { AgentLoopConfig } from './config.js';
import { pathExists, writeTextFile } from './file-system.js';
import { checkGates, GateStatus } from './check-gates.js';
import { AgentLoopError } from './errors.js';

export const BADGE_SOURCES = ['verification', 'gates'] as const;
export type BadgeSource = (typeof BADGE_SOURCES)[number];
export type BadgeStatus = GateStatus | 'missing' | 'not-run' | 'unknown';

export type SvgBadgeInput = {
  label: string;
  message: string;
  status: BadgeStatus;
};

export type SvgBadgeResult = SvgBadgeInput & {
  svg: string;
};

export type EvidenceBadgeResult = {
  outPath: string;
  source: BadgeSource;
  status: BadgeStatus;
  label: string;
  message: string;
  sourcePath?: string;
  svg: string;
};

const verificationReportPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-verification-report\.md$/;

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function statusColor(status: BadgeStatus) {
  switch (status) {
    case 'pass':
      return '#2f855a';
    case 'fail':
      return '#c2410c';
    case 'warn':
    case 'not-run':
    case 'missing':
    case 'unknown':
      return '#a16207';
  }
}

function textWidth(value: string) {
  return Math.max(44, value.length * 7 + 18);
}

function parseSource(source: string | undefined): BadgeSource {
  const clean = source?.trim().toLowerCase() || 'verification';
  if ((BADGE_SOURCES as readonly string[]).includes(clean)) return clean as BadgeSource;
  throw new AgentLoopError(
    'Unsupported badge source. Use one of: verification, gates.',
    'UNSUPPORTED_BADGE_SOURCE',
  );
}

async function latestVerificationReport(dir: string) {
  if (!(await pathExists(dir))) return undefined;
  const entries = await Promise.all(
    (await readdir(dir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && verificationReportPattern.test(entry.name))
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

function extractVerificationStatus(markdown: string): BadgeStatus {
  const status = markdown
    .match(/Overall status:\s*([a-z-]+)/i)?.[1]
    ?.trim()
    .toLowerCase();
  if (status === 'pass' || status === 'fail' || status === 'not-run') return status;
  return 'unknown';
}

function normalizeDisplayPath(cwd: string, filePath: string | undefined) {
  if (!filePath) return undefined;
  return path.relative(cwd, filePath).split(path.sep).join('/') || '.';
}

export function generateSvgBadge(input: SvgBadgeInput): SvgBadgeResult {
  const labelWidth = textWidth(input.label);
  const messageWidth = textWidth(input.message);
  const totalWidth = labelWidth + messageWidth;
  const color = statusColor(input.status);
  const label = escapeXml(input.label);
  const message = escapeXml(input.message);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${message}">
  <title>${label}: ${message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".08"/>
    <stop offset="1" stop-opacity=".08"/>
  </linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="4"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#334155"/>
    <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${Math.floor(labelWidth / 2)}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${Math.floor(labelWidth / 2)}" y="14">${label}</text>
    <text x="${labelWidth + Math.floor(messageWidth / 2)}" y="15" fill="#010101" fill-opacity=".3">${message}</text>
    <text x="${labelWidth + Math.floor(messageWidth / 2)}" y="14">${message}</text>
  </g>
</svg>
`;

  return { ...input, svg };
}

export async function writeEvidenceBadge(options: {
  cwd: string;
  config: AgentLoopConfig;
  source?: string;
  outPath?: string;
  strict?: boolean;
}): Promise<EvidenceBadgeResult> {
  const source = parseSource(options.source);
  let status: BadgeStatus;
  let label: string;
  let message: string;
  let sourcePath: string | undefined;

  if (source === 'verification') {
    const reportPath = await latestVerificationReport(
      path.join(options.cwd, options.config.paths.reportsDir),
    );
    sourcePath = normalizeDisplayPath(options.cwd, reportPath);
    if (!reportPath) {
      status = 'missing';
      label = 'verification';
      message = 'missing';
    } else {
      const markdown = await readFile(reportPath, 'utf8');
      status = extractVerificationStatus(markdown);
      label = 'verification';
      message = status;
    }
  } else {
    const gates = await checkGates({
      cwd: options.cwd,
      config: options.config,
      strict: options.strict,
    });
    status = gates.overallStatus;
    label = 'gates';
    message = status;
  }

  const badge = generateSvgBadge({ label, message, status });
  const outPath =
    (options.outPath
      ? resolveOutputArtifactPath({
          cwd: options.cwd,
          artifactType: 'badge',
          requestedPath: options.outPath,
          expectedDir: options.config.paths.reportsDir,
          expectedExtension: '.svg',
        })
      : undefined) ??
    resolveOutputArtifactPath({
      cwd: options.cwd,
      artifactType: 'badge',
      requestedPath: path.join(options.config.paths.reportsDir, `agentloop-${source}.svg`),
      expectedDir: options.config.paths.reportsDir,
      expectedExtension: '.svg',
    });
  const absoluteOutPath = path.isAbsolute(outPath) ? outPath : path.resolve(options.cwd, outPath);

  await writeTextFile(absoluteOutPath, badge.svg);

  return {
    outPath: absoluteOutPath,
    source,
    status,
    label,
    message,
    sourcePath,
    svg: badge.svg,
  };
}
