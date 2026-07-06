import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createDefaultConfig } from '../../src/core/config.js';

const cliPath = path.resolve('dist/cli/index.js');

// Integration-style: exercise the built CLI against a temp contract.
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
    let code: number;
    let out: string;
    try {
      out = execFileSync('node', [cliPath, 'harden', contract], { encoding: 'utf8' });
      code = 0;
    } catch (e: unknown) {
      const error = e as { status: number; stdout: string; stderr: string };
      code = error.status;
      out = `${error.stdout}${error.stderr}`;
    }
    expect(code).toBe(1);
    expect(out).toContain('blocking');
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
    const out = execFileSync(
      'node',
      [
        cliPath,
        'harden',
        contract,
        '--resolve',
        'unbounded-scope:files-or-areas-not-to-touch:0',
        '--answer',
        'src/legacy',
      ],
      { encoding: 'utf8' },
    );
    expect(out).toContain('hardened');
    const updated = await fs.readFile(contract, 'utf8');
    expect(updated).toContain('src/legacy');
    expect(updated).toContain('Hardening Log');
  });

  it('errors with HARDEN_NO_TASK when no task arg and no active task', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-'));
    const config = createDefaultConfig({ name: 'demo', type: 'typescript-package' });
    await fs.mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await fs.writeFile(path.join(dir, 'agentloop.config.json'), JSON.stringify(config, null, 2));
    let code: number;
    let out: string;
    try {
      out = execFileSync('node', [cliPath, 'harden'], { encoding: 'utf8', cwd: dir });
      code = 0;
    } catch (e: unknown) {
      const error = e as { status: number; stdout: string; stderr: string };
      code = error.status;
      out = `${error.stdout}${error.stderr}`;
    }
    expect(code).not.toBe(0);
    expect(out).toContain('No task specified');
  });
});
