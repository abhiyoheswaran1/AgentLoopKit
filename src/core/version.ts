import { readFileSync } from 'node:fs';

type PackageJson = {
  version: string;
};

export function getPackageVersion() {
  const packageJsonUrl = new URL('../../package.json', import.meta.url);
  const packageJson = JSON.parse(readFileSync(packageJsonUrl, 'utf8')) as PackageJson;
  return packageJson.version;
}
