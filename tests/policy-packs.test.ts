import path from 'node:path';
import { mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { inlineCode, singleLineInlineCode } from '../src/core/markdown-format.js';
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

async function createPolicyPackFixtureWithLineBreaks() {
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
  const packName = 'org\nreview';
  const packTitle = 'Org\nReview Pack';
  const packDescription = 'Local\norganization review rules.';
  const createdPolicyFile = 'release\npolicy.md';
  const skippedPolicyFile = 'review\nevidence-policy.md';
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/policy-packs/org-review/policies'), { recursive: true });
  await writeJson(path.join(dir, '.agentloop/policy-packs/org-review/manifest.json'), {
    name: packName,
    title: packTitle,
    description: packDescription,
    policies: [createdPolicyFile, skippedPolicyFile],
  });
  await writeFile(
    path.join(dir, '.agentloop/policy-packs/org-review/policies', createdPolicyFile),
    '# Release Policy\n\nRelease only after the release gate passes.\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/policy-packs/org-review/policies', skippedPolicyFile),
    '# Review Evidence Policy\n\nRequire task, verification, and handoff evidence.\n',
  );
  await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/policies', skippedPolicyFile),
    '# Review Evidence Policy\n\nLocal customized rule.\n',
  );
  return {
    dir,
    config,
    packName,
    packTitle,
    packDescription,
    createdPolicyFile,
    skippedPolicyFile,
  };
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

  test('rejects policy files that resolve outside the pack policy directory', async () => {
    const { dir, config } = await createPolicyPackFixture();
    const outsideDir = await makeTempDir('agentloopkit-outside-policy-pack-');
    tempDirs.push(outsideDir);
    const outsidePolicy = path.join(outsideDir, 'review-evidence-policy.md');
    const linkedPolicy = path.join(
      dir,
      '.agentloop/policy-packs/org-review/policies/review-evidence-policy.md',
    );
    await writeFile(outsidePolicy, '# Outside Policy\n\nThis content must not be read.\n');
    await rm(linkedPolicy);
    await symlink(outsidePolicy, linkedPolicy);

    await expect(readPolicyPack({ cwd: dir, config, packName: 'org-review' })).rejects.toThrow(
      PolicyPackManifestError,
    );
    await expect(applyPolicyPack({ cwd: dir, config, packName: 'org-review' })).rejects.toThrow(
      /must stay inside the pack policies directory/i,
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

  test('prints policy pack human output values containing line breaks on one Markdown line', async () => {
    const { dir, packName, packTitle, packDescription, createdPolicyFile, skippedPolicyFile } =
      await createPolicyPackFixtureWithLineBreaks();
    const createdPolicyPath = `.agentloop/policies/${createdPolicyFile}`;
    const skippedPolicyPath = `.agentloop/policies/${skippedPolicyFile}`;

    const list = await execa(tsxPath, [cliPath, 'policy', 'packs'], { cwd: dir });
    const show = await execa(tsxPath, [cliPath, 'policy', 'pack', 'show', packName], {
      cwd: dir,
    });
    const apply = await execa(
      tsxPath,
      [cliPath, 'policy', 'pack', 'apply', packName, '--dry-run'],
      { cwd: dir },
    );
    const applyJson = await execa(
      tsxPath,
      [cliPath, 'policy', 'pack', 'apply', packName, '--dry-run', '--json'],
      { cwd: dir },
    );

    expect(list.stdout).toContain(
      `- ${singleLineInlineCode(packName)} (${singleLineInlineCode('local')})`,
    );
    expect(list.stdout).toContain(`  ${singleLineInlineCode(packTitle)} - 2 policy file(s)`);
    expect(list.stdout).not.toContain(`- ${inlineCode(packName)} (${inlineCode('local')})`);

    expect(show.stdout).toContain('# Org\\nReview Pack');
    expect(show.stdout).toContain('Local\\norganization review rules.');
    expect(show.stdout).toContain(`- Name: ${singleLineInlineCode(packName)}`);
    expect(show.stdout).toContain(`- ${singleLineInlineCode(createdPolicyFile)}`);
    expect(show.stdout).toContain(`- ${singleLineInlineCode(skippedPolicyFile)}`);
    expect(show.stdout).not.toContain(`- Name: ${inlineCode(packName)}`);
    expect(show.stdout).not.toContain(`- ${inlineCode(createdPolicyFile)}`);

    expect(apply.stdout).toContain(`- Pack: ${singleLineInlineCode(packName)}`);
    expect(apply.stdout).toContain(`- ${singleLineInlineCode(createdPolicyPath)}`);
    expect(apply.stdout).toContain(`- ${singleLineInlineCode(skippedPolicyPath)}`);
    expect(apply.stdout).not.toContain(`- Pack: ${inlineCode(packName)}`);
    expect(apply.stdout).not.toContain(`- ${inlineCode(createdPolicyPath)}`);

    expect(JSON.parse(applyJson.stdout)).toMatchObject({
      pack: { name: packName, title: packTitle, description: packDescription },
      created: [createdPolicyPath],
      skipped: [skippedPolicyPath],
    });
  });
});
