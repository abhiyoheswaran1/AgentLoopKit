import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { AGENTLOOP_MANIFEST_FILE, CURRENT_TEMPLATE_VERSION } from '../src/core/constants.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

// This suite guarantees the 0.x -> 1.0 upgrade path: every historical harness
// `templateVersion` marker written by past `agentloop init` runs must still be
// read cleanly by `upgrade-harness` on the current CLI, with no crash and a
// coherent, correctly-classified audit report.
//
// The real marker lives in `.agentloop/manifest.json` (`AGENTLOOP_MANIFEST_FILE`)
// as a numeric `templateVersion` field (see src/core/upgrade-harness.ts
// `inspectManifest`), not in `agentloop.config.json`. `CURRENT_TEMPLATE_VERSION`
// is defined in src/core/constants.ts and was bumped to 2 in AgentLoopKit
// 0.42.0 (see CHANGELOG.md); version 1 is the only template version that
// predates it.

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let dirs: string[] = [];
afterEach(async () => {
  await Promise.all(dirs.map(removeTempDir));
  dirs = [];
});

type ManifestFile = {
  version: number;
  templateVersion: number;
  generatedBy: string;
};

async function seedHarness(dir: string, templateVersion: number) {
  await writeJson(path.join(dir, 'package.json'), {
    name: 'upgrade-harness-matrix-fixture',
    scripts: { test: 'vitest' },
  });
  await initializeAgentLoop({ cwd: dir });

  const manifestPath = path.join(dir, AGENTLOOP_MANIFEST_FILE);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as ManifestFile;
  expect(manifest.templateVersion).toBe(CURRENT_TEMPLATE_VERSION);

  if (templateVersion !== manifest.templateVersion) {
    manifest.templateVersion = templateVersion;
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

// Every historical template version (all versions below current) plus the
// current version itself.
const templateVersions = Array.from({ length: CURRENT_TEMPLATE_VERSION }, (_, index) => index + 1);

describe('upgrade-harness migration matrix', () => {
  expect(templateVersions).toContain(1);
  expect(templateVersions).toContain(CURRENT_TEMPLATE_VERSION);

  for (const templateVersion of templateVersions) {
    const isCurrent = templateVersion === CURRENT_TEMPLATE_VERSION;

    test(`handles harness template version ${templateVersion} without error (${
      isCurrent ? 'current' : 'historical'
    })`, async () => {
      const dir = await makeTempDir();
      dirs.push(dir);
      await seedHarness(dir, templateVersion);

      const result = await execa(tsxPath, [cliPath, 'upgrade-harness', '--json'], {
        cwd: dir,
        reject: false,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');

      const output = JSON.parse(result.stdout);
      expect(output.manifest.templateVersion).toBe(templateVersion);
      expect(output.manifest.currentTemplateVersion).toBe(CURRENT_TEMPLATE_VERSION);

      if (isCurrent) {
        expect(output.manifest.status).toBe('current');
        // A freshly initialized harness at the current template version has
        // fully current guidance files too, so the overall audit should pass.
        expect(output.status).toBe('pass');
        expect(output.nextSteps).toEqual(
          expect.arrayContaining(['Harness guidance already mentions the current agent-readiness loop.']),
        );
      } else {
        expect(output.manifest.status).toBe('older');
        expect(output.status).toBe('warn');
        expect(output.nextSteps).toEqual(
          expect.arrayContaining([
            'Run `agentloop init --dry-run` to see missing generated files before writing.',
          ]),
        );
      }

      // Read-only audit: it must never write/mutate the repo it inspects.
      expect(output.writesFiles).toBe(false);
    });

    test(`reports version ${templateVersion} coherently in human-readable output`, async () => {
      const dir = await makeTempDir();
      dirs.push(dir);
      await seedHarness(dir, templateVersion);

      const result = await execa(tsxPath, [cliPath, 'upgrade-harness'], {
        cwd: dir,
        reject: false,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(
        `Current template version: \`${CURRENT_TEMPLATE_VERSION}\``,
      );
      expect(result.stdout).toContain(`Local template version: \`${templateVersion}\``);
      expect(result.stdout).toContain(
        isCurrent ? `Overall status: \`pass\`` : `Overall status: \`warn\``,
      );
    });
  }
});
