export const STABLE_COMMANDS = [
  'init', 'doctor', 'create-task', 'verify', 'summarize', 'handoff',
  'status', 'next', 'start', 'review-context', 'context', 'ready', 'loop',
  'guard', 'check-gates', 'ship', 'prepare-pr', 'runs', 'show-run', 'intent',
  'maintainer-check', 'report', 'badge', 'artifacts', 'upgrade-harness',
  'ci-summary', 'release-notes', 'release-check', 'release-proof', 'npm-status',
  'mcp-server', 'schemastore', 'github', 'policy', 'task', 'install-agent',
  'list-templates', 'completion', 'version',
] as const;

// Commands that expose a `--json` output surface. Verify each entry against its
// command source in src/cli/commands/ before adding it here; this list is the
// contract for Task 5. Start with the confirmed set below and extend during WS2.
export const JSON_COMMANDS = [
  'status', 'next', 'start', 'ready', 'guard', 'check-gates',
  'review-context', 'artifacts',
] as const;
