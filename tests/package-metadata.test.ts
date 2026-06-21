import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

async function assertMetadataPositioning(content: string) {
  // @ts-expect-error The smoke script is plain ESM and is exercised through Vitest here.
  const { assertPublicDocsAvoidUnsupportedClaims } = await import('../scripts/smoke-packed-release.mjs');
  return assertPublicDocsAvoidUnsupportedClaims([{ filePath: 'package.json', content }]);
}

describe('package metadata', () => {
  test('identifies Baseframe Labs as the public project owner', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      author?: { name?: string; url?: string };
    };

    expect(packageJson.author).toEqual({
      name: 'Baseframe Labs',
      url: 'https://www.baseframelabs.com/',
    });
  });

  test('uses product positioning-safe package metadata', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      description?: string;
      keywords?: string[];
    };

    expect(packageJson.description).toBe('A drop-in engineering loop for software agents.');
    expect(packageJson.keywords).toEqual(
      expect.arrayContaining(['software-agents', 'agent-assisted', 'reviewability']),
    );
    await expect(
      assertMetadataPositioning(
        JSON.stringify(
          {
            description: packageJson.description,
            keywords: packageJson.keywords,
          },
          null,
          2,
        ),
      ),
    ).resolves.toBeUndefined();
  });

  test('rejects unsupported package metadata positioning', async () => {
    const cheapAssisted = ['AI', 'assisted'].join('-');
    const cheapCoding = ['AI', 'coding', 'workflow'].join('-');
    const cheapAutomationKeyword = ['vibe', 'coding'].join('-');

    await expect(
      assertMetadataPositioning(
        JSON.stringify(
          {
            description: `Package for ${cheapAssisted} PRs and ${cheapCoding}.`,
            keywords: [cheapAutomationKeyword],
          },
          null,
          2,
        ),
      ),
    ).rejects.toThrow('unsupported positioning');
  });
});
