import { GitFileStatus } from './git.js';
import { singleLineInlineCode as inlineCode } from './markdown-format.js';

export type ChangeArea = {
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

export function classifyChangedFiles(changedFiles: GitFileStatus[]) {
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

export function renderChangedFileLine(file: GitFileStatus) {
  return `- ${file.status} ${inlineCode(file.path)}`;
}

export function renderChangeAreas(changedFiles: GitFileStatus[]) {
  if (!changedFiles.length) return '- No changed files detected.';

  return classifyChangedFiles(changedFiles)
    .map((area) => {
      return `### ${area.title}
${area.files.map(renderChangedFileLine).join('\n')}`;
    })
    .join('\n\n');
}
