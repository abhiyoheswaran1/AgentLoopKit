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
