import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

describe('config schema contract', () => {
  test('agentloop.config.schema.json is locked', async () => {
    const raw = await readFile(
      path.resolve('schema/agentloop.config.schema.json'),
      'utf8',
    );
    expect(JSON.parse(raw)).toMatchSnapshot();
  });
});
