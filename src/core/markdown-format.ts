export function longestBacktickRun(value: string) {
  const runs = value.match(/`+/g) ?? [];
  return runs.reduce((longest, run) => Math.max(longest, run.length), 0);
}

export function inlineCode(content: string) {
  const fence = '`'.repeat(Math.max(1, longestBacktickRun(content) + 1));
  const needsPadding =
    content.startsWith('`') ||
    content.endsWith('`') ||
    content.startsWith(' ') ||
    content.endsWith(' ');
  return `${fence}${needsPadding ? ` ${content} ` : content}${fence}`;
}

export function singleLineInlineCode(content: string) {
  return inlineCode(content.replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
}

function escapeMarkdownText(content: string) {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/^(\s*)>/gm, '$1\\>')
    .replace(/([[\]()*_{}#+!|])/g, '\\$1')
    .replace(/^(\s*)([-=])/gm, '$1\\$2')
    .replace(/^(\s*)(\d+)\./gm, '$1$2\\.');
}

export function escapeMarkdownProse(content: string) {
  let escaped = '';
  let cursor = 0;
  const inlineCodePattern = /(`+)([\s\S]*?)\1/g;
  for (const match of content.matchAll(inlineCodePattern)) {
    escaped += escapeMarkdownText(content.slice(cursor, match.index));
    escaped += match[0];
    cursor = (match.index ?? 0) + match[0].length;
  }
  escaped += escapeMarkdownText(content.slice(cursor));
  return escaped;
}

export function fencedCodeBlock(info: string, content: string) {
  const fence = '`'.repeat(Math.max(3, longestBacktickRun(content) + 1));
  return `${fence}${info}
${content}
${fence}`;
}
