import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PackageManager, PackageManagerSchema } from './config.js';
import { pathExists } from './file-system.js';

export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  if (await pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await pathExists(path.join(cwd, 'bun.lockb'))) return 'bun';
  if (await pathExists(path.join(cwd, 'bun.lock'))) return 'bun';
  if (await pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (await pathExists(path.join(cwd, 'package-lock.json'))) return 'npm';

  const packageJsonPath = path.join(cwd, 'package.json');
  if (await pathExists(packageJsonPath)) {
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
      packageManager?: string;
    };
    const manager = packageJson.packageManager?.split('@')[0];
    const parsed = PackageManagerSchema.safeParse(manager);
    if (parsed.success) return parsed.data;
  }

  return 'npm';
}

export function packageManagerRunCommand(manager: PackageManager, scriptName: string) {
  return `${manager} run ${scriptName}`;
}
