import path from 'node:path';
import { mkdir, readdir, readFile, realpath, stat, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { SUPPORTED_AGENTS } from '../src/core/constants.js';
import { inlineCode, singleLineInlineCode } from '../src/core/markdown-format.js';
import { CLI_PROCESS_TIMEOUT_MS, makeTempDir, removeTempDir } from './helpers.js';
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

  test('preserves an existing agent instruction file and appends missing AGENTS.md reference', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/agents'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/agents/codex.md'), '# Custom Codex rules\n\nKeep me.\n');
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing\n\nKeep this.');

    const result = await installAgentInstructions({ cwd: dir, agent: 'codex' });
    const codexMd = await readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8');
    const agentsMd = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');

    expect(result).toMatchObject({
      agentFileStatus: 'skipped',
      agentsMdStatus: 'updated',
    });
    expect(codexMd).toBe('# Custom Codex rules\n\nKeep me.\n');
    expect(agentsMd).toContain('Keep this.');
    expect(agentsMd).toContain('.agentloop/agents/codex.md');
  });

  test('reports skipped agent instruction files in JSON output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/agents'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/agents/codex.md'), '# Custom Codex rules\n\nKeep me.\n');
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing\n\nKeep this.');

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'codex', '--json'], {
      cwd: dir,
    });
    const payload = JSON.parse(result.stdout);

    expect(payload.agent).toMatchObject({
      name: 'codex',
      agentFileStatus: 'skipped',
      agentsMdStatus: 'updated',
    });
    await expect(readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8')).resolves.toBe(
      '# Custom Codex rules\n\nKeep me.\n',
    );
  });

  test('prints skipped agent instruction files in human output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/agents'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/agents/codex.md'), '# Custom Codex rules\n\nKeep me.\n');
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing\n\nKeep this.');
    const resolvedDir = await realpath(dir);
    const agentFilePath = path.join(resolvedDir, '.agentloop/agents/codex.md');

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'codex'], { cwd: dir });

    expect(result.stdout).toContain(`Agent instructions skipped: ${singleLineInlineCode(agentFilePath)}`);
    expect(result.stdout).toContain('AGENTS.md now references the agent instructions.');
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
        agentFileStatus: 'created',
        agentsMdStatus: 'updated',
      },
    });
    await expect(readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8')).resolves.toContain(
      'Codex',
    );
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toContain('Keep this.');
  });

  test('prints installed agent paths with Markdown-safe inline values', async () => {
    const dir = await makeTempDir('agent`loop-');
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing\n\nKeep this.');
    const resolvedDir = await realpath(dir);
    const agentFilePath = path.join(resolvedDir, '.agentloop/agents/codex.md');

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'codex'], { cwd: dir });

    expect(result.stdout).toContain(`Agent instructions written: ${inlineCode(agentFilePath)}`);
    expect(result.stdout).toContain('AGENTS.md now references the agent instructions.');
  });

  test('keeps installed agent paths on one line in human output while preserving JSON values', async () => {
    const dir = await makeTempDir('agentloopkit-\nwith-break-');
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing\n\nKeep this.');
    const resolvedDir = await realpath(dir);
    const agentFilePath = path.join(resolvedDir, '.agentloop/agents/codex.md');

    const humanResult = await execa(tsxPath, [cliPath, 'install-agent', 'codex'], { cwd: dir });
    const jsonResult = await execa(tsxPath, [cliPath, 'install-agent', 'codex', '--json'], {
      cwd: dir,
    });

    expect(humanResult.stdout).toContain(
      `Agent instructions written: ${singleLineInlineCode(agentFilePath)}`,
    );
    expect(humanResult.stdout).not.toContain(`Agent instructions written: ${inlineCode(agentFilePath)}`);
    expect(JSON.parse(jsonResult.stdout).agent.agentFilePath).toBe(agentFilePath);
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
      agents: SUPPORTED_AGENTS.map((agent, index) => ({
        name: agent,
        agentFilePath: path.join(resolvedDir, '.agentloop/agents', `${agent}.md`),
        agentsPath: path.join(resolvedDir, 'AGENTS.md'),
        agentFileStatus: 'created',
        agentsMdStatus: index === 0 ? 'created' : 'updated',
      })),
    });
    await expect(
      readFile(path.join(dir, '.agentloop/agents/generic.md'), 'utf8'),
    ).resolves.toContain('Generic Coding Agent');
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toContain(
      '.agentloop/agents/github-copilot-cli.md',
    );
  });

  test('prints unsupported agent errors as JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'vibes', '--json'], {
      cwd: dir,
      reject: false,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    expect(result.timedOut).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'UNSUPPORTED_AGENT',
        message: 'Unsupported agent "vibes".',
        requestedAgent: 'vibes',
        supportedAgents: [...SUPPORTED_AGENTS, 'all'],
      },
    });
    await expect(stat(path.join(dir, '.agentloop'))).rejects.toThrow();
  });

  test('rejects agent instruction writes when the agents directory resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/agents'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'codex', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'agent-instructions',
      expectedDir: '.agentloop/agents',
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toBe('.agentloop/agents/codex.md');
    expect(await readdir(outsideDir)).toEqual([]);
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).rejects.toThrow();
  });

  test('rejects AGENTS.md updates when the root instructions file resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    const outsideAgents = path.join(outsideDir, 'AGENTS.md');
    await writeFile(outsideAgents, '# Outside instructions\n');
    await symlink(outsideAgents, path.join(dir, 'AGENTS.md'), 'file');

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'codex', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'agents-md',
      expectedDir: '.',
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toBe('AGENTS.md');
    expect(await readFile(outsideAgents, 'utf8')).toBe('# Outside instructions\n');
    await expect(readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8')).rejects.toThrow();
  });

  test('keeps unsupported agent errors human-readable by default', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'install-agent', 'vibes'], {
      cwd: dir,
      reject: false,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    expect(result.timedOut).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Unsupported agent "vibes".');
    expect(result.stderr).toContain('Supported agents:');
    await expect(stat(path.join(dir, '.agentloop'))).rejects.toThrow();
  });
});
