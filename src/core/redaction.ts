import path from 'node:path';

function pathVariants(root: string) {
  const cleanRoot = root.trim();
  if (!cleanRoot || cleanRoot === path.parse(cleanRoot).root) return [];

  const variants = new Set([
    cleanRoot,
    cleanRoot.replace(/\\/g, '/'),
    cleanRoot.replace(/\//g, '\\'),
  ]);

  if (cleanRoot.startsWith('/var/')) variants.add(`/private${cleanRoot}`);
  if (cleanRoot.startsWith('/private/var/')) variants.add(cleanRoot.replace(/^\/private/, ''));

  for (const variant of [...variants]) {
    if (/^[A-Za-z]:/.test(variant)) {
      variants.add(variant[0].toUpperCase() + variant.slice(1));
      variants.add(variant[0].toLowerCase() + variant.slice(1));
    }
  }

  return [...variants].filter(Boolean);
}

function inferredAgentLoopRoots(value: string) {
  const roots = new Set<string>();
  const windowsPattern = /[A-Za-z]:[\\/][^\r\n`]*?(?=[\\/]\.agentloop(?:[\\/]|$))/g;
  const posixPattern = /\/[^\r\n`]*?(?=\/\.agentloop(?:\/|$))/g;
  const labeledWindowsPattern = /:\s+([A-Za-z]:[^\r\n`]+)/g;
  const labeledPosixPattern = /:\s+(\/[^\r\n`]+)/g;
  const clean = (root: string) => {
    const trimmedRoot = root.trim();
    const agentLoopIndex = trimmedRoot.search(/[\\/]\.agentloop(?:[\\/]|$)/);
    const trimmed = (agentLoopIndex === -1 ? trimmedRoot : trimmedRoot.slice(0, agentLoopIndex))
      .trim()
      .replace(/[.,;]+$/, '');
    return trimmed.startsWith('//') ? '' : trimmed;
  };

  for (const match of value.matchAll(windowsPattern)) {
    roots.add(clean(match[0]));
  }
  for (const match of value.matchAll(posixPattern)) {
    roots.add(clean(match[0]));
  }
  for (const match of value.matchAll(labeledWindowsPattern)) {
    roots.add(clean(match[1]));
  }
  for (const match of value.matchAll(labeledPosixPattern)) {
    roots.add(clean(match[1]));
  }

  return [...roots];
}

export function redactLocalRoots(value: string, roots: string[], replacement = '[git-root]') {
  let redacted = value;
  const variants = [...new Set([...roots, ...inferredAgentLoopRoots(value)].flatMap(pathVariants))]
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);

  for (const root of variants) {
    redacted = redacted.split(root).join(replacement);
  }

  return redacted;
}
