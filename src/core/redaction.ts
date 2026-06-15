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

  return [...variants].filter(Boolean);
}

export function redactLocalRoots(value: string, roots: string[], replacement = '[git-root]') {
  let redacted = value;
  const variants = new Set(roots.flatMap(pathVariants));

  for (const root of variants) {
    redacted = redacted.split(root).join(replacement);
  }

  return redacted;
}
