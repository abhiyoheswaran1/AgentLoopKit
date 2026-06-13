const POST_VERIFICATION_GATE_PATTERNS = [
  /\bdogfood:strict\b/,
  /\bcheck-gates\b[\s\S]*\s--strict\b/,
  /\brelease-check\b[\s\S]*\s--strict\b/,
];

function uniqueCommands(commands: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const command of commands) {
    const clean = command.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    result.push(clean);
  }
  return result;
}

export function looksLikePostVerificationGate(command: string) {
  return POST_VERIFICATION_GATE_PATTERNS.some((pattern) => pattern.test(command));
}

export function findLikelyPostVerificationGates(commands: string[] | undefined) {
  return uniqueCommands((commands ?? []).filter(looksLikePostVerificationGate));
}
