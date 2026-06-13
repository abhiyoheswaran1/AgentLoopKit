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

const AGENTLOOP_REVIEW_GATE_COMMAND_SET = new Set(AGENTLOOP_REVIEW_GATE_COMMANDS);

const POST_VERIFICATION_GATE_PATTERNS = [
  /\bdogfood:strict\b/,
  /\bcheck-gates\b[\s\S]*\s--strict\b/,
  /\brelease-check\b[\s\S]*\s--strict\b/,
];

function shellWords(command: string) {
  return command.match(/"[^"]*"|'[^']*'|\S+/g)?.map((word) => word.replace(/^["']|["']$/g, '')) ?? [];
}

function isAgentLoopEntrypoint(command: string) {
  return command === 'agentloop' || command === 'agentloopkit';
}

function isLocalAgentLoopEntrypoint(command: string) {
  return /(?:^|\/)(?:src|dist)\/cli\/index\.(?:js|ts)$/.test(command);
}

function isNpxOption(command: string) {
  return command === '--yes' || command === '--no-install';
}

function agentLoopSubcommandIndex(words: string[]) {
  const [command, second, third] = words;
  if (!command) return -1;

  if (isAgentLoopEntrypoint(command)) return 1;

  if (command === 'npx') {
    let index = 1;
    while (index < words.length && isNpxOption(words[index] ?? '')) index += 1;
    return isAgentLoopEntrypoint(words[index] ?? '') ? index + 1 : -1;
  }

  if ((command === 'pnpm' || command === 'npm') && second === 'exec') {
    return isAgentLoopEntrypoint(third ?? '') ? 3 : -1;
  }

  if (command === 'yarn') {
    return isAgentLoopEntrypoint(second ?? '') ? 2 : -1;
  }

  if (command === 'node' || command === 'tsx') {
    return isLocalAgentLoopEntrypoint(second ?? '') ? 2 : -1;
  }

  return -1;
}

function invokesAgentLoopReviewGate(command: string) {
  const words = shellWords(command);
  const subcommandIndex = agentLoopSubcommandIndex(words);
  if (subcommandIndex === -1) return false;
  return AGENTLOOP_REVIEW_GATE_COMMAND_SET.has(words[subcommandIndex] ?? '');
}

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
  return (
    POST_VERIFICATION_GATE_PATTERNS.some((pattern) => pattern.test(command)) ||
    invokesAgentLoopReviewGate(command)
  );
}

export function findLikelyPostVerificationGates(commands: string[] | undefined) {
  return uniqueCommands((commands ?? []).filter(looksLikePostVerificationGate));
}
