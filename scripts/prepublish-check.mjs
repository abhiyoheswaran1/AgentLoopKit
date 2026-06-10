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

const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

try {
  const changelog = await readFile(changelogPath, 'utf8');
  const body = unreleasedBody(changelog);

  if (hasUnreleasedEntries(body)) {
    console.error('CHANGELOG.md has unreleased entries.');
    console.error('Move them into a versioned release section before publishing to npm.');
    console.error('This prevents publishing package contents that do not match release metadata.');
    process.exitCode = 1;
  } else {
    console.log('Prepublish metadata check passed.');
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Prepublish metadata check failed: ${message}`);
  process.exitCode = 1;
}
