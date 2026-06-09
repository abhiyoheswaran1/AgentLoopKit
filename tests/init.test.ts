import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import { initializeAgentLoop } from '../src/core/init.js';

let tempDirs: string[] = [];

describe('init', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('generates AgentLoopKit files in a project directory', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo', scripts: { test: 'vitest' } });

    const result = await initializeAgentLoop({ cwd: dir });
    const config = await readFile(path.join(dir, 'agentloop.config.json'), 'utf8');
    const manifest = JSON.parse(await readFile(path.join(dir, '.agentloop/manifest.json'), 'utf8'));

    expect(result.created.some((file) => file.endsWith('.agentloop/loops/feature.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/README.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/manifest.json'))).toBe(true);
    expect(manifest).toMatchObject({
      version: 1,
      templateVersion: 1,
      generatedBy: 'agentloopkit',
    });
    expect(config).toContain(
      '"$schema": "https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json"',
    );
    expect(config).toContain('"name": "demo"');
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).resolves.toContain('Specify');
    await expect(readFile(path.join(dir, '.agentloop/README.md'), 'utf8')).resolves.toContain(
      'agentloop create-task',
    );
    await expect(
      readFile(path.join(dir, '.agentloop/harness/commands.md'), 'utf8'),
    ).resolves.toContain('package-specific verification');
    await expect(readFile(path.join(dir, '.agentloop/README.md'), 'utf8')).resolves.toContain(
      'root and package-level checks',
    );
    await expect(readFile(path.join(dir, '.agentloop/tasks/README.md'), 'utf8')).resolves.toContain(
      'package-specific verification commands',
    );
  });

  test('safely appends to an existing AGENTS.md', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing Instructions\n\nDo not remove.');

    await initializeAgentLoop({ cwd: dir });
    const agents = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');

    expect(agents).toContain('Do not remove.');
    expect(agents).toContain('AgentLoopKit');
  });

  test('dry-run reports planned files without writing them', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await initializeAgentLoop({ cwd: dir, dryRun: true });

    expect(result.created.some((file) => file.endsWith('AGENTLOOP.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/README.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/manifest.json'))).toBe(true);
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(dir, '.agentloop/manifest.json'), 'utf8')).rejects.toThrow();
    await expect(
      readFile(path.join(dir, '.agentloop/harness/repo-map.md'), 'utf8'),
    ).rejects.toThrow();
    await expect(readFile(path.join(dir, '.agentloop/README.md'), 'utf8')).rejects.toThrow();
  });
});
