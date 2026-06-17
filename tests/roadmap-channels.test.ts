import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

function splitMarkdownTableRow(line: string) {
  const columns: string[] = [];
  let current = '';
  let escaped = false;

  for (const char of line) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      current += char;
      escaped = true;
      continue;
    }
    if (char === '|') {
      columns.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) columns.push(current.trim());
  return columns.slice(1);
}

const verifiedImplementedBacklogItems = [
  'Release-proof channel completion values',
  'Bounded stale preview output',
  'Default bounded stale preview',
  'Ship report artifact filter',
  'Autonomous dogfood guide',
  'AgentFlight in dogfood gate',
  'Near-term maintenance guard',
  'Targeted release-proof channel check',
  'Self-dogfood instruction drift guard',
  'Use imported GitHub metadata in review surfaces',
  'Bound imported GitHub metadata fields',
  'Organization policy-pack workflow examples',
  'Better failed-command excerpts',
  'User-facing version pin cleanup',
  'Public-doc version pin guard',
  '`test-generation` task type',
  'Unsupported task type fast-fail',
  'Task verification command opt-in',
  'Task-command empty-state note',
  'Symlink-safe task paths',
  'Symlink-safe task lifecycle paths',
  'Repo-relative config paths',
  'Task-command JSON metadata',
  'Local release proof helper',
];

const releaseBlockedBacklogItems = [
  'Add GitHub Actions publish workflow',
  'Prepare 0.17.0 release metadata',
  'Docker and GHCR image',
  'MCP Registry submission',
];

async function readBacklogDecisionRows() {
  const backlog = await readFile('.agentloop/backlog.md', 'utf8');
  return new Map(
    backlog
      .split('\n')
      .filter((line) => line.startsWith('|') && !/^\|\s*-+/.test(line))
      .map((line) => splitMarkdownTableRow(line))
      .filter((columns) => columns.length >= 10)
      .map((columns) => [columns[0], columns[8].toLowerCase()] as const),
  );
}

describe('roadmap channel docs', () => {
  test('documents Windows channel plans without claiming Scoop or WinGet availability', async () => {
    const distribution = await readFile('docs/distribution-channels.md', 'utf8');
    const windows = await readFile('docs/designs/windows-package-managers.md', 'utf8');

    expect(distribution).toContain(
      '[Windows package manager design](designs/windows-package-managers.md)',
    );
    expect(windows).toContain('Scoop');
    expect(windows).toContain('WinGet');
    expect(windows).toContain('Do not claim `scoop install agentloopkit` until');
    expect(windows).toContain('Do not claim `winget install');
    expect(distribution).not.toContain('scoop install agentloopkit');
    expect(distribution).not.toContain('winget install agentloopkit');
  });

  test('editor integration design stays validation-first and avoids premature extension claims', async () => {
    const extension = await readFile('docs/designs/vscode-open-vsx-extension.md', 'utf8');
    const distribution = await readFile('docs/distribution-channels.md', 'utf8');

    expect(extension).toContain('Validation Gates');
    expect(extension).toContain('Do not publish to the VS Code Marketplace or Open VSX');
    expect(extension).toContain('thin command-palette helper');
    expect(extension).not.toContain('The extension is available');
    expect(distribution).toContain('Deferred');
  });

  test('does not keep completed backlog rows marked do now', async () => {
    const backlog = await readFile('.agentloop/backlog.md', 'utf8');
    const completedNotePattern =
      /\b(Archived:|Implemented|implemented|Completed|completed|Cycle \d+ implementation|Merged:|Live SchemaStore catalog|Added local-boundary hardening)\b/;
    const staleRows = backlog
      .split('\n')
      .map((line, index) => ({ line, lineNumber: index + 1 }))
      .filter(({ line }) => line.startsWith('|') && !/^\|\s*-+/.test(line))
      .map(({ line, lineNumber }) => ({
        columns: splitMarkdownTableRow(line),
        line,
        lineNumber,
      }))
      .filter(({ columns }) => columns.length >= 10)
      .filter(({ columns }) => columns[8].toLowerCase() === 'do now')
      .filter(({ columns }) => completedNotePattern.test(columns[9]))
      .map(({ lineNumber, columns }) => `${lineNumber}: ${columns[0]}`);

    expect(staleRows).toEqual([]);
  });

  test('keeps verified non-release backlog decisions implemented', async () => {
    const decisions = await readBacklogDecisionRows();

    for (const item of verifiedImplementedBacklogItems) {
      expect(decisions.get(item), item).toBe('implemented');
    }
  });

  test('keeps release-channel backlog decisions parked while release tasks are deferred', async () => {
    const decisions = await readBacklogDecisionRows();
    const marketplaceTask = await readFile(
      '.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md',
      'utf8',
    );
    const windowsTask = await readFile(
      '.agentloop/tasks/2026-06-10-add-scoop-winget-manifests.md',
      'utf8',
    );

    expect(marketplaceTask).toMatch(/- Status: deferred/);
    expect(windowsTask).toMatch(/- Status: deferred/);

    for (const item of releaseBlockedBacklogItems) {
      expect(decisions.get(item), item).toBe('later');
    }
  });
});
