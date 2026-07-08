import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execa } from 'execa';
import { createDefaultConfig } from '../../src/core/config.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

// Integration-style: exercise the CLI (via tsx against source) against a temp contract.
// The explicit [task] path is now containment-checked against the repo root
// (resolved from `cwd`), so every fixture here runs with `cwd` set to the temp
// dir itself — that makes the temp dir its own "repo root" and keeps the
// contract path safely inside it.
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
    const result = await execa(tsxPath, [cliPath, 'harden', contract], {
      cwd: dir,
      reject: false,
    });
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
      { cwd: dir, reject: false },
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
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-'));
    const nonExistentPath = path.join(dir, `harden-nonexistent-${Date.now()}.md`);
    const result = await execa(tsxPath, [cliPath, 'harden', nonExistentPath], {
      cwd: dir,
      reject: false,
    });
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout + result.stderr).toContain('not found');
  });

  // FIX S2 (arbitrary file write): an explicit [task] path outside the repo
  // root must be rejected — not read, not overwritten — even though
  // `harden` is invoked with `--resolve`/`--answer` that would otherwise
  // trigger a write-back.
  it('rejects a task contract path outside the repo and does not touch it', async () => {
    const repoDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-repo-'));
    const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-outside-'));
    const victim = path.join(outsideDir, 'victim.md');
    const originalContent = [
      '# Victim',
      '- Task type: bugfix',
      '## Files or Areas Not to Touch',
      '- None recorded yet.',
    ].join('\n');
    await fs.writeFile(victim, originalContent);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'harden',
        victim,
        '--resolve',
        'unbounded-scope:files-or-areas-not-to-touch:0',
        '--answer',
        'src/legacy',
      ],
      { cwd: repoDir, reject: false },
    );

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout + result.stderr).toMatch(/outside|repo/i);
    const unchanged = await fs.readFile(victim, 'utf8');
    expect(unchanged).toBe(originalContent);
  });

  it('rejects a relative task contract path that escapes the repo via ../', async () => {
    const parentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-parent-'));
    const repoDir = path.join(parentDir, 'repo');
    const outsideDir = path.join(parentDir, 'outside');
    await fs.mkdir(repoDir);
    await fs.mkdir(outsideDir);
    const victim = path.join(outsideDir, 'victim.md');
    const originalContent = ['# Victim', '## Files or Areas Not to Touch', '- src/legacy'].join(
      '\n',
    );
    await fs.writeFile(victim, originalContent);

    const result = await execa(tsxPath, [cliPath, 'harden', '../outside/victim.md'], {
      cwd: repoDir,
      reject: false,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout + result.stderr).toMatch(/outside|repo/i);
    const unchanged = await fs.readFile(victim, 'utf8');
    expect(unchanged).toBe(originalContent);
  });

  // FIX M1 (false audit trail): a resolution that doesn't actually converge
  // must fail the CLI invocation and must not be written to disk.
  it('does not write a non-converging resolution and leaves the contract untouched', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'harden-'));
    const contract = path.join(dir, 'task.md');
    const originalContent = [
      '# T',
      '## Acceptance Criteria',
      '- The feature works well',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n');
    await fs.writeFile(contract, originalContent);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'harden',
        contract,
        '--resolve',
        'untestable-acceptance:acceptance-criteria:0',
        '--answer',
        'it just works, trust me',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout + result.stderr).toMatch(/did not clear|still triggers/i);
    const unchanged = await fs.readFile(contract, 'utf8');
    expect(unchanged).toBe(originalContent);
  });
});
