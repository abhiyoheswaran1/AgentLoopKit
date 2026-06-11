import path from 'node:path';
import { readFile, realpath, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { SUPPORTED_AGENTS } from '../src/core/constants.js';
import { makeTempDir, removeTempDir } from './helpers.js';
import {
  installAgentInstructions,
  installAllAgentInstructions,
} from '../src/core/agent-installation.js';

let tempDirs: string[] = [];
const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

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

  test('installs all bundled agent instruction files', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await installAllAgentInstructions({ cwd: dir });
    const agentsMd = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');

    expect(result).toHaveLength(7);
    await expect(readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8')).resolves.toContain(
      'Codex',
    );
    await expect(
      readFile(path.join(dir, '.agentloop/agents/claude-code.md'), 'utf8'),
    ).resolves.toContain('Claude Code');
    expect(agentsMd).toContain('.agentloop/agents/codex.md');
    expect(agentsMd).toContain('.agentloop/agents/generic.md');
  });

  test('prints single installed agent paths as JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing\n\nKeep this.');

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'codex', '--json'], {
      cwd: dir,
    });
    const resolvedDir = await realpath(dir);

    expect(JSON.parse(result.stdout)).toEqual({
      agent: {
        name: 'codex',
        agentFilePath: path.join(resolvedDir, '.agentloop/agents/codex.md'),
        agentsPath: path.join(resolvedDir, 'AGENTS.md'),
      },
    });
    await expect(readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8')).resolves.toContain(
      'Codex',
    );
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toContain('Keep this.');
  });

  test('prints all installed agent paths as JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'all', '--json'], {
      cwd: dir,
    });
    const resolvedDir = await realpath(dir);
    const payload = JSON.parse(result.stdout);

    expect(payload).toEqual({
      agents: SUPPORTED_AGENTS.map((agent) => ({
        name: agent,
        agentFilePath: path.join(resolvedDir, '.agentloop/agents', `${agent}.md`),
        agentsPath: path.join(resolvedDir, 'AGENTS.md'),
      })),
    });
    await expect(readFile(path.join(dir, '.agentloop/agents/generic.md'), 'utf8')).resolves.toContain(
      'Generic Coding Agent',
    );
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toContain(
      '.agentloop/agents/github-copilot-cli.md',
    );
  });
});
