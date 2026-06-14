import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import {
  createDefaultConfig,
  loadAgentLoopConfig,
  loadAgentLoopWorkspace,
  parseAgentLoopConfig,
} from '../src/core/config.js';
import { ConfigError } from '../src/core/errors.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

describe('config', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('creates defaults for a detected project', () => {
    const config = createDefaultConfig({
      name: 'demo',
      type: 'node',
      packageManager: 'pnpm',
      commands: { test: 'pnpm test', lint: '', typecheck: 'pnpm typecheck', build: '', format: '' },
    });

    expect(config.version).toBe(1);
    expect(config.$schema).toBe(
      'https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json',
    );
    expect(config.project.name).toBe('demo');
    expect(config.paths.agentloopDir).toBe('.agentloop');
    expect(config.commands.test).toBe('pnpm test');
    expect(config.policies.packs).toEqual([]);
  });

  test('rejects invalid config versions', () => {
    expect(() => parseAgentLoopConfig({ version: 2 })).toThrow(/version/i);
  });

  test('rejects absolute config paths', () => {
    const config = createDefaultConfig();

    expect(() =>
      parseAgentLoopConfig({
        ...config,
        paths: {
          ...config.paths,
          reportsDir: '/tmp/agentloop-reports',
        },
      }),
    ).toThrow(/repo-relative/i);
    expect(() =>
      parseAgentLoopConfig({
        ...config,
        paths: {
          ...config.paths,
          reportsDir: 'C:\\agentloop\\reports',
        },
      }),
    ).toThrow(/repo-relative/i);
    expect(() =>
      parseAgentLoopConfig({
        ...config,
        paths: {
          ...config.paths,
          reportsDir: 'C:agentloop\\reports',
        },
      }),
    ).toThrow(/repo-relative/i);
  });

  test('rejects config paths with parent traversal', () => {
    const config = createDefaultConfig();

    expect(() =>
      parseAgentLoopConfig({
        ...config,
        paths: {
          ...config.paths,
          tasksDir: '../outside/tasks',
        },
      }),
    ).toThrow(/parent traversal/i);
    expect(() =>
      parseAgentLoopConfig({
        ...config,
        paths: {
          ...config.paths,
          handoffsDir: '.agentloop/../outside-handoffs',
        },
      }),
    ).toThrow(/parent traversal/i);
    expect(() =>
      parseAgentLoopConfig({
        ...config,
        paths: {
          ...config.paths,
          handoffsDir: '.agentloop\\..\\outside-handoffs',
        },
      }),
    ).toThrow(/parent traversal/i);
  });

  test('defaults missing policy pack config and validates local policy pack paths', () => {
    const config = createDefaultConfig();
    const legacyConfig: Partial<typeof config> = { ...config };
    delete legacyConfig.policies;

    expect(parseAgentLoopConfig(legacyConfig).policies.packs).toEqual([]);
    expect(
      parseAgentLoopConfig({
        ...config,
        policies: {
          packs: [{ name: 'org-review', path: '.agentloop/policy-packs/org-review' }],
        },
      }).policies.packs,
    ).toEqual([{ name: 'org-review', path: '.agentloop/policy-packs/org-review' }]);
    expect(() =>
      parseAgentLoopConfig({
        ...config,
        policies: { packs: [{ name: 'outside', path: '../policy-packs/outside' }] },
      }),
    ).toThrow(/parent traversal/i);
    expect(() =>
      parseAgentLoopConfig({
        ...config,
        policies: { packs: [{ name: 'absolute', path: '/tmp/policy-pack' }] },
      }),
    ).toThrow(/repo-relative/i);
  });

  test('rejects malformed config JSON as a config error', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'agentloop.config.json'), '{not-json');

    await expect(loadAgentLoopConfig(dir)).rejects.toThrow(ConfigError);
    await expect(loadAgentLoopConfig(dir)).rejects.toThrow('Invalid AgentLoopKit config');
  });

  test('discovers nearest parent config as the command workspace', async () => {
    const dir = await makeTempDir();
    const nested = path.join(dir, 'packages', 'web', 'src');
    tempDirs.push(dir);
    await mkdir(nested, { recursive: true });
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({ name: 'root-demo', type: 'generic', packageManager: 'npm' }),
        null,
        2,
      ),
    );

    const workspace = await loadAgentLoopWorkspace(nested);

    expect(workspace.cwd).toBe(dir);
    expect(workspace.invocationCwd).toBe(nested);
    expect(workspace.configPath).toBe(path.join(dir, 'agentloop.config.json'));
    expect(workspace.targetIsConfigRoot).toBe(false);
    expect(workspace.config.project.name).toBe('root-demo');
  });

  test('reports missing workspace config as a config error', async () => {
    const dir = await makeTempDir();
    const nested = path.join(dir, 'src');
    tempDirs.push(dir);
    await mkdir(nested, { recursive: true });

    await expect(loadAgentLoopWorkspace(nested)).rejects.toThrow(ConfigError);
    await expect(loadAgentLoopWorkspace(nested)).rejects.toThrow('AgentLoopKit config not found');
  });
});
