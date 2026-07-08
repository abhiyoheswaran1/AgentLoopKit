import { listItems, sectionContent } from './markdown-sections.js';
import { escapeMarkdownProse } from './markdown-format.js';

const NOTHING_SKIPPED_VALUES = new Set(['nothing skipped', 'nothing skipped.']);

function fencedAwareSectionContent(markdown: string, heading: string) {
  const lines = markdown.split(/\r?\n/);
  const headingLine = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === headingLine);
  if (startIndex === -1) return '';

  const sectionLines: string[] = [];
  let inFence = false;
  for (const line of lines.slice(startIndex + 1)) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      sectionLines.push(line);
      continue;
    }
    if (!inFence && /^##\s+/.test(line.trim())) break;
    sectionLines.push(line);
  }

  return sectionLines.join('\n').trim();
}

function unwrapInlineCode(value: string) {
  const clean = value.trim();
  const inlineCodeMatch = clean.match(/^(`+)([\s\S]*?)\1$/);
  return inlineCodeMatch?.[2]?.trim() || clean;
}

function packageScriptName(command: string) {
  const tokens = command.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return undefined;

  let index = 0;
  if (tokens[index] === 'npx') {
    index += 1;
    while (tokens[index]?.startsWith('-')) index += 1;
  }

  const runner = tokens[index];
  if (!runner) return undefined;

  if (runner === 'npm') {
    const next = tokens[index + 1];
    if (next === 'run') return tokens[index + 2];
    if (next === 'test') return 'test';
    return undefined;
  }

  if (runner === 'pnpm' || runner.startsWith('pnpm@')) {
    const next = tokens[index + 1];
    if (next === 'run') return tokens[index + 2];
    return next?.startsWith('-') ? undefined : next;
  }

  if (runner === 'yarn' || runner.startsWith('yarn@')) {
    const next = tokens[index + 1];
    if (next === 'run') return tokens[index + 2];
    return next?.startsWith('-') ? undefined : next;
  }

  return undefined;
}

function commandIdentities(command: string) {
  const clean = command.trim();
  const scriptName = packageScriptName(clean);
  return [`exact:${clean}`, ...(scriptName ? [`script:${scriptName}`] : [])];
}

function passedCommandsRun(markdown: string) {
  const commands = new Set<string>();
  let currentCommand: string | undefined;

  for (const line of fencedAwareSectionContent(markdown, 'Commands Run').split(/\r?\n/)) {
    const heading = line.trim().match(/^###\s+[^:]+:\s+(.+)$/);
    if (heading) {
      currentCommand = unwrapInlineCode(heading[1]);
      continue;
    }

    if (currentCommand && /^-\s+Status:\s+pass\s*$/i.test(line.trim())) {
      for (const identity of commandIdentities(currentCommand)) commands.add(identity);
    }
  }

  return commands;
}

function commandFromNotRunItem(item: string) {
  const command = item.match(/^[^:]+:\s+(.+)$/)?.[1];
  return command ? unwrapInlineCode(command) : undefined;
}

export function verificationNotRunItems(markdown: string | undefined) {
  if (!markdown) return [];
  const passedCommands = passedCommandsRun(markdown);
  return listItems(sectionContent(markdown, 'Not Run')).filter(
    (item) =>
      !NOTHING_SKIPPED_VALUES.has(item.trim().toLowerCase()) &&
      !commandIdentities(commandFromNotRunItem(item) ?? '').some((identity) =>
        passedCommands.has(identity),
      ),
  );
}

export function renderVerificationNotRun(markdown: string | undefined) {
  if (!markdown) return '- No verification report was available.';
  const items = verificationNotRunItems(markdown);
  if (!items.length) return '- No skipped commands were recorded.';
  return items
    .map((item) => `- ${escapeMarkdownProse(item).replace(/\r/g, '\\r').replace(/\n/g, '\\n')}`)
    .join('\n');
}
