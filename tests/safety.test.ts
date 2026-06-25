import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { detectRiskFileScan, detectRiskFiles } from '../src/core/safety.js';

let tempDirs: string[] = [];

describe('safety scanning', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('detects risk file categories without reading env contents', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, 'migrations'));
    await writeFile(path.join(dir, 'migrations', '001.sql'), 'select 1;');
    await writeFile(path.join(dir, '.env'), 'SECRET=value');
    await writeFile(path.join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9');

    const risks = await detectRiskFiles(dir);

    expect(risks.migrations).toContain('migrations/001.sql');
    expect(risks.envFiles).toContain('.env');
    expect(risks.lockfiles).toContain('pnpm-lock.yaml');
  });

  test('ignores AgentLoopKit harness files during risk scanning', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/policies/security-policy.md'), '# Security');

    const risks = await detectRiskFiles(dir);

    expect(risks.security).toEqual([]);
  });

  test('ignores local evidence ledgers while preserving real source risk files', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentflight/sessions'), { recursive: true });
    await mkdir(path.join(dir, '.agentflight/evidence/af-auth-review'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/runs/2026-06-24-auth-security'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await mkdir(path.join(dir, 'src/auth'), { recursive: true });
    await mkdir(path.join(dir, 'src/security'), { recursive: true });
    await writeFile(path.join(dir, '.agentflight/sessions/af-auth-session.json'), '{}');
    await writeFile(
      path.join(dir, '.agentflight/evidence/af-auth-review/security-output.json'),
      '{}',
    );
    await writeFile(
      path.join(dir, '.agentloop/runs/2026-06-24-auth-security/metadata.json'),
      '{}',
    );
    await writeFile(path.join(dir, '.agentloop/reports/security-auth-report.json'), '{}');
    await writeFile(path.join(dir, '.agentloop/tasks/archive/auth-security-task.json'), '{}');
    await writeFile(path.join(dir, 'src/auth/session.ts'), 'export const session = true;');
    await writeFile(
      path.join(dir, 'src/security/permissions.ts'),
      'export const permissions = true;',
    );

    const risks = await detectRiskFiles(dir);

    expect(risks.auth).toEqual(['src/auth/session.ts']);
    expect(risks.security).toEqual(['src/security/permissions.ts']);
  });

  test('ignores documentation and template markdown when scanning semantic risk categories', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await mkdir(path.join(dir, 'src/templates/policies'), { recursive: true });
    await writeFile(path.join(dir, 'SECURITY.md'), '# Security policy');
    await writeFile(path.join(dir, 'docs/migration-guide.md'), '# Migration guide');
    await writeFile(path.join(dir, 'src/templates/policies/security-policy.md'), '# Security');

    const risks = await detectRiskFiles(dir);

    expect(risks.migrations).toEqual([]);
    expect(risks.security).toEqual([]);
  });

  test('reports when risk scanning is truncated by entry limits', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/auth-session.ts'), 'export const session = true;');
    await writeFile(path.join(dir, 'src/billing.ts'), 'export const billing = true;');
    await writeFile(path.join(dir, 'src/extra.ts'), 'export const extra = true;');

    const scan = await detectRiskFileScan(dir, { maxEntries: 2 });

    expect(scan.truncated).toBe(true);
    expect(scan.inspectedEntries).toBe(2);
  });
});
