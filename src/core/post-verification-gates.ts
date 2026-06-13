const AGENTLOOP_REVIEW_GATE_COMMANDS = [
  'badge',
  'check-gates',
  'ci-summary',
  'handoff',
  'maintainer-check',
  'prepare-pr',
  'report',
  'ship',
  'summarize',
];

const AGENTLOOP_CLI_PREFIX =
  '(?:^|\\s)(?:agentloopkit|agentloop|npx\\s+(?:--(?:yes|no-install)\\s+)*(?:agentloopkit|agentloop)|pnpm\\s+exec\\s+agentloop|npm\\s+exec\\s+agentloop|yarn\\s+agentloop|node\\s+\\S*(?:src|dist)/cli/index\\.(?:js|ts)|tsx\\s+\\S*(?:src|dist)/cli/index\\.(?:js|ts))\\s+';

const AGENTLOOP_REVIEW_GATE_PATTERN = new RegExp(
  `${AGENTLOOP_CLI_PREFIX}(?:${AGENTLOOP_REVIEW_GATE_COMMANDS.join('|')})\\b`,
);

const POST_VERIFICATION_GATE_PATTERNS = [
  /\bdogfood:strict\b/,
  /\bcheck-gates\b[\s\S]*\s--strict\b/,
  /\brelease-check\b[\s\S]*\s--strict\b/,
  AGENTLOOP_REVIEW_GATE_PATTERN,
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
