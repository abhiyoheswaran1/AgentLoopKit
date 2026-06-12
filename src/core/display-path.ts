import path from 'node:path';

export function toSafeDisplayPath(cwd: string, filePath: string) {
  const normalized = filePath.split(path.sep).join('/');
  const marker = '/.agentloop/';
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex >= 0) return `.agentloop/${normalized.slice(markerIndex + marker.length)}`;

  const repoPath = path.isAbsolute(filePath) ? path.relative(cwd, filePath) : filePath;
  if (repoPath.startsWith('..') || path.isAbsolute(repoPath)) return path.basename(filePath);
  return repoPath.split(path.sep).join('/');
}
