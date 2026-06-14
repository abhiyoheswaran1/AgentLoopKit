import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

describe('package scripts', () => {
  test('separates fast development tests from integration and release suites', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts['test:quick']).toBe('npm run test:unit');
    expect(packageJson.scripts['test:unit']).toContain('tests/config.test.ts');
    expect(packageJson.scripts['test:unit']).toContain('tests/template-renderer.test.ts');
    expect(packageJson.scripts['test:unit']).toContain('tests/schemastore.test.ts');
    expect(packageJson.scripts['test:unit']).toContain('tests/policy-packs.test.ts');
    expect(packageJson.scripts['test:unit']).toContain('tests/github-metadata.test.ts');
    expect(packageJson.scripts['test:unit']).not.toContain('tests/doctor.test.ts');
    expect(packageJson.scripts['test:unit']).not.toContain('tests/upgrade-harness.test.ts');
    expect(packageJson.scripts['test:integration']).toContain('tests/doctor.test.ts');
    expect(packageJson.scripts['test:integration']).toContain('tests/upgrade-harness.test.ts');
    expect(packageJson.scripts['test:release']).toBe('npm test');
  });

  test('defines a local release-flow gate without publishing', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    };
    const releaseFlow = packageJson.scripts['release-flow'];

    expect(releaseFlow).toContain('node scripts/prepublish-check.mjs');
    expect(releaseFlow).toContain('npm run lint');
    expect(releaseFlow).toContain('npm run typecheck');
    expect(releaseFlow).toContain('npm run test:release');
    expect(releaseFlow).toContain('npm run build');
    expect(releaseFlow).toContain('npm run check:public-docs');
    expect(releaseFlow).toContain('npm run check:links');
    expect(releaseFlow).toContain('npm run dogfood:strict');
    expect(releaseFlow).toContain('npm run smoke:release');
    expect(releaseFlow).toContain('node dist/cli/index.js release-check --strict --redact-paths');
    expect(releaseFlow).not.toMatch(/\bnpm\s+publish\b/);
    expect(releaseFlow).not.toMatch(/\bgh\s+release\b/);
  });
});
