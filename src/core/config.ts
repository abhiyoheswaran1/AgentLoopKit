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

const configPathKeys = ['root', 'agentloopDir', 'tasksDir', 'reportsDir', 'handoffsDir'] as const;

function configPathIssue(configPath: string) {
  if (!configPath.trim()) return 'empty';
  if (configPath.includes('\0')) return 'null-byte';
  if (
    path.isAbsolute(configPath) ||
    path.posix.isAbsolute(configPath) ||
    path.win32.isAbsolute(configPath) ||
    /^[A-Za-z]:/.test(configPath)
  ) {
    return 'absolute';
  }
  if (configPath.split(/[\\/]/).includes('..')) return 'parent-traversal';
  return undefined;
}

function configPathIssueMessage(
  key: string,
  issue: NonNullable<ReturnType<typeof configPathIssue>>,
) {
  if (issue === 'empty') return `Config path ${key} must be a non-empty repo-relative path.`;
  if (issue === 'null-byte') return `Config path ${key} must not contain null bytes.`;
  if (issue === 'absolute')
    return `Config path ${key} must be a repo-relative path, not an absolute path.`;
  return `Config path ${key} must not contain parent traversal segments.`;
}

export const AgentLoopConfigSchema = z
  .object({
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
  })
  .superRefine((config, ctx) => {
    for (const key of configPathKeys) {
      const issue = configPathIssue(config.paths[key]);
      if (!issue) continue;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paths', key],
        message: configPathIssueMessage(key, issue),
      });
    }
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

const CONFIG_SCHEMA_URL =
  'https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json';

export function createDefaultConfig(input: DefaultConfigInput = {}): AgentLoopConfig {
  return {
    $schema: CONFIG_SCHEMA_URL,
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
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new ConfigError(`Invalid AgentLoopKit config: ${detail}`);
  }
  return parseAgentLoopConfig(parsed);
}
