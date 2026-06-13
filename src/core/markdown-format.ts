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

export function escapeMarkdownProse(content: string) {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/([[\]()*_{}#+!|>])/g, '\\$1')
    .replace(/^(\s*)([-=])/g, '$1\\$2')
    .replace(/^(\s*)(\d+)\./g, '$1$2\\.');
}

export function fencedCodeBlock(info: string, content: string) {
  const fence = '`'.repeat(Math.max(3, longestBacktickRun(content) + 1));
  return `${fence}${info}
${content}
${fence}`;
}
