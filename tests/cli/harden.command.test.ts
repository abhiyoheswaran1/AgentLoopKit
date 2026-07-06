import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execa } from 'execa';
import { createDefaultConfig } from '../../src/core/config.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

// Integration-style: exercise the CLI (via tsx against source) against a temp contract.
describe('agentloop harden', () => {
  it('exits non-zero and reports blocking soft spots', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-'));
    const contract = path.join(dir, 'task.md');
    await fs.writeFile(
      contract,
      [
        '# T',
        '- Task type: feature',
        '## Files or Areas Not to Touch',
        '- None recorded yet.',
      ].join('\n'),
    );
    const result = await execa(tsxPath, [cliPath, 'harden', contract], { reject: false });
    expect(result.exitCode).toBe(1);
    expect(result.stdout + result.stderr).toContain('blocking');
  });

  it('applies a resolution and clears the blocking soft spot', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-'));
    const contract = path.join(dir, 'task.md');
    await fs.writeFile(
      contract,
      [
        '# T',
        '- Task type: bugfix',
        '## Files or Areas Not to Touch',
        '- None recorded yet.',
      ].join('\n'),
    );
    const result = await execa(
      tsxPath,
      [
        cliPath,
        'harden',
        contract,
        '--resolve',
        'unbounded-scope:files-or-areas-not-to-touch:0',
        '--answer',
        'src/legacy',
      ],
      { reject: false },
    );
    expect(result.stdout).toContain('hardened');
    const updated = await fs.readFile(contract, 'utf8');
    expect(updated).toContain('src/legacy');
    expect(updated).toContain('Hardening Log');
  });

  it('errors with HARDEN_NO_TASK when no task arg and no active task', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-'));
    const config = createDefaultConfig({ name: 'demo', type: 'typescript-package' });
    await fs.mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await fs.writeFile(path.join(dir, 'agentloop.config.json'), JSON.stringify(config, null, 2));
    const result = await execa(tsxPath, [cliPath, 'harden'], { cwd: dir, reject: false });
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout + result.stderr).toContain('No task specified');
  });

  it('errors with HARDEN_CONTRACT_NOT_FOUND when contract path does not exist', async () => {
    const nonExistentPath = path.join(os.tmpdir(), `harden-nonexistent-${Date.now()}.md`);
    const result = await execa(tsxPath, [cliPath, 'harden', nonExistentPath], { reject: false });
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout + result.stderr).toContain('not found');
  });
});
