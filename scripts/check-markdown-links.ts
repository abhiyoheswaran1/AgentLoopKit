#!/usr/bin/env node
import path from 'node:path';
import { checkMarkdownLinks } from '../src/core/markdown-links.js';

const rootDir = process.cwd();
const result = await checkMarkdownLinks({ rootDir });

if (result.ok) {
  console.log(`Markdown links OK (${result.files.length} file(s) checked).`);
} else {
  console.error(`Markdown link check failed: ${result.issues.length} issue(s).`);
  for (const issue of result.issues) {
    const file = path.relative(rootDir, issue.filePath);
    const resolved = path.relative(rootDir, issue.resolvedPath);
    console.error(
      `- ${file}: [${issue.linkText}](${issue.target}) -> ${issue.reason}: ${resolved}`,
    );
  }
  process.exitCode = 1;
}
