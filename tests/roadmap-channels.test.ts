import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

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
});
