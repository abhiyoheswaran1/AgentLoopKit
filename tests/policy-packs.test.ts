import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import {
  applyPolicyPack,
  listPolicyPacks,
  PolicyPackManifestError,
  readPolicyPack,
} from '../src/core/policy-packs.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createPolicyPackFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = {
    ...createDefaultConfig({
      name: 'policy-pack-demo',
      type: 'generic',
      packageManager: 'npm',
    }),
    policies: {
      packs: [{ name: 'org-review', path: '.agentloop/policy-packs/org-review' }],
    },
  };
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/policy-packs/org-review/policies'), { recursive: true });
  await writeJson(path.join(dir, '.agentloop/policy-packs/org-review/manifest.json'), {
    name: 'org-review',
    title: 'Org Review Pack',
    description: 'Local organization review rules.',
    policies: ['review-evidence-policy.md', 'release-policy.md'],
  });
  await writeFile(
    path.join(dir, '.agentloop/policy-packs/org-review/policies/review-evidence-policy.md'),
    '# Review Evidence Policy\n\nRequire task, verification, and handoff evidence.\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/policy-packs/org-review/policies/release-policy.md'),
    '# Release Policy\n\nRelease only after the release gate passes.\n',
  );
  return { dir, config };
}

describe('policy packs', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('lists bundled and configured local organization policy packs', async () => {
    const { dir, config } = await createPolicyPackFixture();

    const packs = await listPolicyPacks({ cwd: dir, config });

    expect(packs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'agentloop-baseline',
          source: 'bundled',
          policyCount: 8,
        }),
        expect.objectContaining({
          name: 'org-review',
          title: 'Org Review Pack',
          source: 'local',
          path: '.agentloop/policy-packs/org-review',
          policyCount: 2,
        }),
      ]),
    );
  });

  test('reads configured local policy packs without allowing path traversal', async () => {
    const { dir, config } = await createPolicyPackFixture();

    await expect(
      readPolicyPack({ cwd: dir, config, packName: 'org-review' }),
    ).resolves.toMatchObject({
      name: 'org-review',
      title: 'Org Review Pack',
      policies: [
        {
          fileName: 'release-policy.md',
          title: 'Release Policy',
          path: '.agentloop/policy-packs/org-review/policies/release-policy.md',
        },
        {
          fileName: 'review-evidence-policy.md',
          title: 'Review Evidence Policy',
          path: '.agentloop/policy-packs/org-review/policies/review-evidence-policy.md',
        },
      ],
    });
    await expect(readPolicyPack({ cwd: dir, config, packName: '../secrets' })).rejects.toThrow(
      'Policy pack not found',
    );
  });

  test('applies a policy pack by creating missing policies and skipping existing files', async () => {
    const { dir, config } = await createPolicyPackFixture();
    await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/policies/review-evidence-policy.md'),
      '# Review Evidence Policy\n\nLocal customized rule.\n',
    );

    const dryRun = await applyPolicyPack({
      cwd: dir,
      config,
      packName: 'org-review',
      dryRun: true,
    });
    const applied = await applyPolicyPack({ cwd: dir, config, packName: 'org-review' });

    expect(dryRun).toMatchObject({
      dryRun: true,
      writesFiles: false,
      created: ['.agentloop/policies/release-policy.md'],
      skipped: ['.agentloop/policies/review-evidence-policy.md'],
    });
    expect(applied).toMatchObject({
      dryRun: false,
      writesFiles: true,
      created: ['.agentloop/policies/release-policy.md'],
      skipped: ['.agentloop/policies/review-evidence-policy.md'],
    });
    await expect(
      readFile(path.join(dir, '.agentloop/policies/release-policy.md'), 'utf8'),
    ).resolves.toContain('Release only after the release gate passes.');
    await expect(
      readFile(path.join(dir, '.agentloop/policies/review-evidence-policy.md'), 'utf8'),
    ).resolves.toContain('Local customized rule.');
  });

  test('rejects policy pack manifest entries that escape the policies directory', async () => {
    const { dir, config } = await createPolicyPackFixture();
    await writeJson(path.join(dir, '.agentloop/policy-packs/org-review/manifest.json'), {
      name: 'org-review',
      title: 'Org Review Pack',
      description: 'Local organization review rules.',
      policies: ['../escaped-policy.md'],
    });

    await expect(readPolicyPack({ cwd: dir, config, packName: 'org-review' })).rejects.toThrow(
      PolicyPackManifestError,
    );
    await expect(applyPolicyPack({ cwd: dir, config, packName: 'org-review' })).rejects.toThrow(
      /must be a simple Markdown filename/i,
    );
  });

  test('exposes policy pack list, show, and apply through the CLI', async () => {
    const { dir } = await createPolicyPackFixture();
    await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });

    const list = await execa(tsxPath, [cliPath, 'policy', 'packs', '--json'], { cwd: dir });
    const show = await execa(tsxPath, [cliPath, 'policy', 'pack', 'show', 'org-review', '--json'], {
      cwd: dir,
    });
    const apply = await execa(
      tsxPath,
      [cliPath, 'policy', 'pack', 'apply', 'org-review', '--dry-run', '--json'],
      { cwd: dir },
    );

    expect(JSON.parse(list.stdout).packs).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'org-review', source: 'local' })]),
    );
    expect(JSON.parse(show.stdout).pack).toMatchObject({
      name: 'org-review',
      title: 'Org Review Pack',
    });
    expect(JSON.parse(apply.stdout)).toMatchObject({
      dryRun: true,
      writesFiles: false,
      created: [
        '.agentloop/policies/release-policy.md',
        '.agentloop/policies/review-evidence-policy.md',
      ],
    });
  });
});
