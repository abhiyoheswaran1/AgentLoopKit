import { cp, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type TemplateValues = Record<string, string | number | boolean | undefined>;

export function renderTemplateString(template: string, values: TemplateValues) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}

export function getTemplateRoot() {
  return fileURLToPath(new URL('../templates', import.meta.url));
}

export async function readTemplate(relativePath: string, values: TemplateValues = {}) {
  const raw = await readFile(path.join(getTemplateRoot(), relativePath), 'utf8');
  return renderTemplateString(raw, values);
}

export async function copyTemplateFile(
  relativePath: string,
  targetPath: string,
  values: TemplateValues = {},
) {
  const content = await readTemplate(relativePath, values);
  await import('node:fs/promises').then(({ mkdir, writeFile }) =>
    mkdir(path.dirname(targetPath), { recursive: true }).then(() => writeFile(targetPath, content)),
  );
}

export async function copyTemplateDirectory(sourceRelative: string, target: string) {
  await cp(path.join(getTemplateRoot(), sourceRelative), target, { recursive: true, force: true });
}

export async function listTemplateFiles() {
  const root = getTemplateRoot();
  const groups = await readdir(root, { withFileTypes: true });
  const result: Record<string, string[]> = {};

  for (const group of groups) {
    if (!group.isDirectory()) continue;
    const entries = await readdir(path.join(root, group.name), { withFileTypes: true });
    result[group.name] = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort();
  }

  return result;
}
