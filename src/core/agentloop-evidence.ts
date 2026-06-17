export function normalizeAgentLoopEvidencePath(filePath: string) {
  return filePath.replace(/\\/g, '/');
}

export function agentLoopEvidenceGroup(filePath: string) {
  const normalizedPath = normalizeAgentLoopEvidencePath(filePath);
  if (normalizedPath.startsWith('.agentloop/handoffs/')) return '.agentloop/handoffs/';
  if (normalizedPath.startsWith('.agentloop/reports/')) return '.agentloop/reports/';
  if (normalizedPath.startsWith('.agentloop/runs/')) return '.agentloop/runs/';
  if (normalizedPath.startsWith('.agentloop/tasks/archive/')) return '.agentloop/tasks/archive/';
  if (/^\.agentloop\/tasks\/\d{4}-\d{2}-\d{2}-.+\.md$/.test(normalizedPath)) {
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
