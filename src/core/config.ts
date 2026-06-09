import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { CONFIG_FILE } from './constants.js';
import { ConfigError } from './errors.js';

export const ProjectTypeSchema = z.enum([
  'nextjs',
  'react-vite',
  'node',
  'typescript-package',
  'python',
  'docs-only',
  'generic',
]);

export const PackageManagerSchema = z.enum(['pnpm', 'npm', 'yarn', 'bun']);

export const CommandConfigSchema = z.object({
  test: z.string().default(''),
  lint: z.string().default(''),
  typecheck: z.string().default(''),
  build: z.string().default(''),
  format: z.string().default(''),
});

export const AgentLoopConfigSchema = z.object({
  $schema: z.string().optional(),
  version: z.literal(1),
  project: z.object({
    name: z.string(),
    type: ProjectTypeSchema,
    packageManager: PackageManagerSchema,
  }),
  paths: z.object({
    root: z.string(),
    agentloopDir: z.string(),
    tasksDir: z.string(),
    reportsDir: z.string(),
    handoffsDir: z.string(),
  }),
  commands: CommandConfigSchema,
  safety: z.object({
    requireCleanWorkingTree: z.boolean(),
    warnOnDirtyWorkingTree: z.boolean(),
    protectEnvFiles: z.boolean(),
    protectMigrations: z.boolean(),
    protectLockfiles: z.boolean(),
  }),
  summary: z.object({
    includeDiffStats: z.boolean(),
    includeChangedFiles: z.boolean(),
    includeVerification: z.boolean(),
    includeRisks: z.boolean(),
    includeRollback: z.boolean(),
  }),
});

export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type PackageManager = z.infer<typeof PackageManagerSchema>;
export type CommandConfig = z.infer<typeof CommandConfigSchema>;
export type AgentLoopConfig = z.infer<typeof AgentLoopConfigSchema>;

export type DefaultConfigInput = {
  name?: string;
  type?: ProjectType;
  packageManager?: PackageManager;
  commands?: Partial<CommandConfig>;
};

export function createDefaultConfig(input: DefaultConfigInput = {}): AgentLoopConfig {
  return {
    $schema: 'https://agentloopkit.dev/schema/agentloop.config.schema.json',
    version: 1,
    project: {
      name: input.name ?? '',
      type: input.type ?? 'generic',
      packageManager: input.packageManager ?? 'npm',
    },
    paths: {
      root: '.',
      agentloopDir: '.agentloop',
      tasksDir: '.agentloop/tasks',
      reportsDir: '.agentloop/reports',
      handoffsDir: '.agentloop/handoffs',
    },
    commands: {
      test: input.commands?.test ?? '',
      lint: input.commands?.lint ?? '',
      typecheck: input.commands?.typecheck ?? '',
      build: input.commands?.build ?? '',
      format: input.commands?.format ?? '',
    },
    safety: {
      requireCleanWorkingTree: false,
      warnOnDirtyWorkingTree: true,
      protectEnvFiles: true,
      protectMigrations: true,
      protectLockfiles: false,
    },
    summary: {
      includeDiffStats: true,
      includeChangedFiles: true,
      includeVerification: true,
      includeRisks: true,
      includeRollback: true,
    },
  };
}

export function parseAgentLoopConfig(value: unknown): AgentLoopConfig {
  const parsed = AgentLoopConfigSchema.safeParse(value);
  if (!parsed.success) {
    throw new ConfigError(`Invalid AgentLoopKit config: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function loadAgentLoopConfig(cwd: string): Promise<AgentLoopConfig> {
  const filePath = path.join(cwd, CONFIG_FILE);
  const raw = await readFile(filePath, 'utf8');
  return parseAgentLoopConfig(JSON.parse(raw));
}
