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

export function fencedCodeBlock(info: string, content: string) {
  const fence = '`'.repeat(Math.max(3, longestBacktickRun(content) + 1));
  return `${fence}${info}
${content}
${fence}`;
}
