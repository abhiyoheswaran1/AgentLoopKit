import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { buildSchemaStoreCatalogEntry } from '../src/core/schemastore.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('SchemaStore support', () => {
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
});
