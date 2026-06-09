import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { installAgentInstructions } from '../src/core/agent-installation.js';

let tempDirs: string[] = [];

describe('agent installation', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('creates agent instructions and appends AGENTS.md without overwriting existing content', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing\n\nKeep this.');

    const result = await installAgentInstructions({ cwd: dir, agent: 'codex' });
    const agentsMd = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');
    const codexMd = await readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8');

    expect(result.agentFilePath).toBe(path.join(dir, '.agentloop/agents/codex.md'));
    expect(agentsMd).toContain('Keep this.');
    expect(agentsMd).toContain('AgentLoopKit');
    expect(codexMd).toContain('Codex');
    expect(codexMd).toContain('verification evidence');
  });
});
