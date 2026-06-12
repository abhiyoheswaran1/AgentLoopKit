#!/usr/bin/env node
/* global console, process */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

function unreleasedBody(changelog) {
  const match = changelog.match(/^##\s+Unreleased\s*\n([\s\S]*?)(?=^##\s+|\s*$)/m);
  return match?.[1]?.trim() ?? '';
}

function hasUnreleasedEntries(body) {
  if (!body) return false;
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('<!--') && !line.endsWith('-->'));

  if (lines.length === 0) return false;
  if (lines.length === 1 && /^-\s+No unreleased changes yet\.$/i.test(lines[0])) return false;
  return true;
}

function formatVersion(value) {
  return typeof value === 'string' && value.length > 0 ? value : '<missing>';
}

function validateServerMetadata(packageJson, serverJson) {
  const errors = [];
  const expectedVersion = packageJson.version;
  const packageName = packageJson.name;

  if (serverJson.version !== expectedVersion) {
    errors.push(
      `server.json version mismatch: expected ${expectedVersion} from package.json, got ${formatVersion(
        serverJson.version,
      )}.`,
    );
  }

  const npmPackage = Array.isArray(serverJson.packages)
    ? serverJson.packages.find(
        (entry) => entry?.registryType === 'npm' && entry?.identifier === packageName,
      )
    : undefined;

  if (!npmPackage) {
    errors.push(`server.json package ${packageName} metadata is missing.`);
  } else if (npmPackage.version !== expectedVersion) {
    errors.push(
      `server.json package ${packageName} version mismatch: expected ${expectedVersion} from package.json, got ${formatVersion(
        npmPackage.version,
      )}.`,
    );
  }

  return errors;
}

const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const serverJsonPath = path.join(process.cwd(), 'server.json');

try {
  const changelog = await readFile(changelogPath, 'utf8');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const serverJson = JSON.parse(await readFile(serverJsonPath, 'utf8'));
  const body = unreleasedBody(changelog);
  const errors = validateServerMetadata(packageJson, serverJson);

  if (hasUnreleasedEntries(body)) {
    errors.push('CHANGELOG.md has unreleased entries.');
    errors.push('Move them into a versioned release section before publishing to npm.');
    errors.push('This prevents publishing package contents that do not match release metadata.');
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exitCode = 1;
  } else {
    console.log('Prepublish metadata check passed.');
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Prepublish metadata check failed: ${message}`);
  process.exitCode = 1;
}
