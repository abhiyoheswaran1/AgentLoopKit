import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

describe('config JSON schema', () => {
  test('ships a schema for agentloop.config.json', async () => {
    const raw = await readFile('schema/agentloop.config.schema.json', 'utf8');
    const schema = JSON.parse(raw) as {
      $id?: string;
      properties?: Record<string, unknown>;
      required?: string[];
    };

    expect(schema.$id).toBe('https://agentloopkit.dev/schema/agentloop.config.schema.json');
    expect(schema.required).toEqual(
      expect.arrayContaining(['version', 'project', 'paths', 'commands', 'safety', 'summary']),
    );
    expect(JSON.stringify(schema.properties)).toContain('"const":1');
    expect(JSON.stringify(schema.properties)).toContain('nextjs');
    expect(JSON.stringify(schema.properties)).toContain('protectEnvFiles');
  });
});
