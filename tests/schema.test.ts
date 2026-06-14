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
    const paths = (
      schema.properties?.paths as { properties?: Record<string, { pattern?: string }> }
    ).properties;

    expect(schema.$id).toBe(
      'https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json',
    );
    expect(schema.required).toEqual(
      expect.arrayContaining(['version', 'project', 'paths', 'commands', 'safety', 'summary']),
    );
    expect(JSON.stringify(schema.properties)).toContain('"const":1');
    expect(JSON.stringify(schema.properties)).toContain('nextjs');
    expect(JSON.stringify(schema.properties)).toContain('protectEnvFiles');
    expect(JSON.stringify(schema.properties)).toContain('"policies"');
    expect(JSON.stringify(schema.properties)).toContain('"packs"');
    expect(JSON.stringify(schema.properties)).toContain('repo-relative path');
    expect(paths?.reportsDir?.pattern).toContain('(?![A-Za-z]:)');
    expect(paths?.reportsDir?.pattern).toContain('[\\\\/]');
    expect(paths?.reportsDir?.pattern).toContain('\\.\\.');
  });
});
