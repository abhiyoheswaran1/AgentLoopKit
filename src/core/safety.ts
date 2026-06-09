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

export async function detectRiskFiles(cwd: string): Promise<RiskFiles> {
  const files = (await listFilesRecursive(cwd)).map((file) => relative(cwd, file));
  const includes = (needles: string[]) =>
    files.filter((file) => needles.some((needle) => file.toLowerCase().includes(needle)));

  return {
    migrations: includes(['migration', 'migrations/']),
    auth: includes(['auth', 'oauth', 'session', 'passport']),
    security: includes(['security', 'crypto', 'secret', 'permission', 'policy']),
    billing: includes(['billing', 'stripe', 'payment', 'invoice']),
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
