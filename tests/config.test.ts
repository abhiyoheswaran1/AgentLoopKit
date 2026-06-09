import { describe, expect, test } from 'vitest';
import { createDefaultConfig, parseAgentLoopConfig } from '../src/core/config.js';

describe('config', () => {
  test('creates defaults for a detected project', () => {
    const config = createDefaultConfig({
      name: 'demo',
      type: 'node',
      packageManager: 'pnpm',
      commands: { test: 'pnpm test', lint: '', typecheck: 'pnpm typecheck', build: '', format: '' },
    });

    expect(config.version).toBe(1);
    expect(config.project.name).toBe('demo');
    expect(config.paths.agentloopDir).toBe('.agentloop');
    expect(config.commands.test).toBe('pnpm test');
  });

  test('rejects invalid config versions', () => {
    expect(() => parseAgentLoopConfig({ version: 2 })).toThrow(/version/i);
  });
});
