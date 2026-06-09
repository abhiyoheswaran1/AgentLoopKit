import path from 'node:path';
import { listFilesRecursive } from './file-system.js';

export type RiskFiles = {
  migrations: string[];
  auth: string[];
  security: string[];
  billing: string[];
  deployment: string[];
  lockfiles: string[];
  envFiles: string[];
};

function relative(cwd: string, file: string) {
  return path.relative(cwd, file).replaceAll(path.sep, '/');
}

function isSemanticRiskCandidate(file: string) {
  const extension = path.extname(file).toLowerCase();
  if (['.md', '.mdx', '.txt', '.rst', '.adoc'].includes(extension)) return false;
  return true;
}

export async function detectRiskFiles(cwd: string): Promise<RiskFiles> {
  const files = (await listFilesRecursive(cwd)).map((file) => relative(cwd, file));
  const semanticIncludes = (needles: string[]) =>
    files.filter(
      (file) =>
        isSemanticRiskCandidate(file) &&
        needles.some((needle) => file.toLowerCase().includes(needle)),
    );
  const migrationFiles = files.filter((file) => {
    const normalized = file.toLowerCase();
    return (
      isSemanticRiskCandidate(file) &&
      (normalized.includes('migrations/') ||
        normalized.includes('/migration/') ||
        path.basename(normalized).includes('migration'))
    );
  });

  return {
    migrations: migrationFiles,
    auth: semanticIncludes(['auth', 'oauth', 'session', 'passport']),
    security: semanticIncludes(['security', 'crypto', 'secret', 'permission', 'policy']),
    billing: semanticIncludes(['billing', 'stripe', 'payment', 'invoice']),
    deployment: files.filter((file) =>
      /(^|\/)(Dockerfile|docker-compose|vercel\.json|netlify\.toml|fly\.toml|render\.yaml|\.github\/workflows\/)/i.test(
        file,
      ),
    ),
    lockfiles: files.filter((file) =>
      ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lock', 'bun.lockb'].includes(
        path.basename(file),
      ),
    ),
    envFiles: files.filter((file) => /^\.env($|\.)|\/\.env($|\.)/.test(file)),
  };
}
