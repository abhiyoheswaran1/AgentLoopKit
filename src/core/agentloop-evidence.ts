export function normalizeAgentLoopEvidencePath(filePath: string) {
  return filePath.replace(/\\/g, '/');
}

export function agentLoopEvidenceGroup(filePath: string) {
  const normalizedPath = normalizeAgentLoopEvidencePath(filePath);
  if (normalizedPath.startsWith('.agentloop/handoffs/')) return '.agentloop/handoffs/';
  if (normalizedPath.startsWith('.agentloop/reports/')) return '.agentloop/reports/';
  if (normalizedPath.startsWith('.agentloop/runs/')) return '.agentloop/runs/';
  if (normalizedPath.startsWith('.agentloop/guard/')) return '.agentloop/guard/';
  if (normalizedPath === '.agentloop/state.json') return '.agentloop/state.json';
  if (normalizedPath.startsWith('.agentloop/tasks/archive/')) return '.agentloop/tasks/archive/';
  if (
    /^\.agentloop\/tasks\/[^/]+\.md$/.test(normalizedPath) &&
    normalizedPath !== '.agentloop/tasks/README.md'
  ) {
    return '.agentloop/tasks/';
  }
  if (normalizedPath === '.agentflight/current' || normalizedPath.startsWith('.agentflight/current/')) {
    return '.agentflight/current/';
  }
  if (normalizedPath.startsWith('.agentflight/reports/')) return '.agentflight/reports/';
  return undefined;
}

export function isAgentLoopEvidenceFile(filePath: string) {
  return agentLoopEvidenceGroup(filePath) !== undefined;
}
