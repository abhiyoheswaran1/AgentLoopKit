import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { execa } from 'execa';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { buildSchemaStoreCatalogEntry } from '../src/core/schemastore.js';
import { inlineCode, singleLineInlineCode } from '../src/core/markdown-format.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('SchemaStore support', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.doUnmock('../src/core/schemastore.js');
  });

  test('builds a catalog-ready SchemaStore entry for agentloop.config.json', () => {
    const entry = buildSchemaStoreCatalogEntry();

    expect(entry).toEqual({
      name: 'AgentLoopKit Configuration',
      description: 'Configuration for AgentLoopKit repo-level agentic engineering workflows.',
      fileMatch: ['agentloop.config.json'],
      url: 'https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json',
    });
  });

  test('ships a committed SchemaStore catalog entry that matches the core helper', async () => {
    const raw = await readFile('schema/schemastore/agentloopkit.json', 'utf8');

    expect(JSON.parse(raw)).toEqual(buildSchemaStoreCatalogEntry());
  });

  test('prints SchemaStore catalog entry from the CLI without writing files', async () => {
    const result = await execa(tsxPath, [cliPath, 'schemastore', '--json']);

    expect(JSON.parse(result.stdout)).toEqual({
      entry: buildSchemaStoreCatalogEntry(),
      safety: {
        writesFiles: false,
        callsNetwork: false,
      },
    });
  });

  test('prints human SchemaStore catalog values on one Markdown line while preserving JSON values', async () => {
    const entry = {
      name: 'AgentLoopKit\nConfiguration',
      description: 'Configuration for AgentLoopKit repo-level agentic engineering workflows.',
      fileMatch: ['agentloop.config.json', 'agentloop\ncustom.json'],
      url: 'https://example.test/schema\nagentloop.json',
    };
    vi.doMock('../src/core/schemastore.js', () => ({
      buildSchemaStoreCatalogEntry: () => entry,
    }));
    const { schemastoreCommand } = await import('../src/cli/commands/schemastore.js');
    const output: string[] = [];
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation((message = '') => {
      output.push(String(message));
    });

    await schemastoreCommand().exitOverride().parseAsync(['node', 'schemastore']);
    expect(output.join('\n')).toContain(`- Name: ${singleLineInlineCode(entry.name)}`);
    expect(output.join('\n')).toContain(singleLineInlineCode(entry.fileMatch[1]));
    expect(output.join('\n')).toContain(`- Schema URL: ${singleLineInlineCode(entry.url)}`);
    expect(output.join('\n')).not.toContain(`- Name: ${inlineCode(entry.name)}`);

    output.length = 0;
    await schemastoreCommand().exitOverride().parseAsync(['node', 'schemastore', '--json']);

    expect(consoleSpy).toHaveBeenCalled();
    expect(JSON.parse(output.join('\n')).entry).toEqual(entry);
  });
});
