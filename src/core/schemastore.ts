import { CONFIG_SCHEMA_URL } from './schema-url.js';

export type SchemaStoreCatalogEntry = {
  name: string;
  description: string;
  fileMatch: string[];
  url: string;
};

export function buildSchemaStoreCatalogEntry(): SchemaStoreCatalogEntry {
  return {
    name: 'AgentLoopKit Configuration',
    description: 'Configuration for AgentLoopKit repo-level agentic engineering workflows.',
    fileMatch: ['agentloop.config.json'],
    url: CONFIG_SCHEMA_URL,
  };
}
