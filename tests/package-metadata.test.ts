import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

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
});
