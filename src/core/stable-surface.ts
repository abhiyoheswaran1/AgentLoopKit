export const STABLE_COMMANDS = [
  'init', 'doctor', 'create-task', 'verify', 'summarize', 'handoff',
  'status', 'next', 'start', 'review-context', 'context', 'ready', 'harden', 'loop',
  'guard', 'check-gates', 'ship', 'prepare-pr', 'runs', 'show-run', 'intent',
  'maintainer-check', 'report', 'badge', 'artifacts', 'upgrade-harness',
  'ci-summary', 'release-notes', 'release-check', 'release-proof', 'npm-status',
  'mcp-server', 'schemastore', 'github', 'policy', 'task', 'install-agent',
  'list-templates', 'completion', 'version',
] as const;

// Commands that expose a `--json` output surface. Verify each entry against its
// command source in src/cli/commands/ before adding it here; this list is the
// contract for Task 5 (WS2) / Task 7b Pass C (audit finding #5).
//
// Entries may be a bare stable command name (e.g. `'status'`) or a stable
// command followed by a subcommand and/or fixture flags, space-separated
// (e.g. `'task list'`, `'npm-status --package-name ... --registry-json ...'`).
// The contract test (tests/contract/json-shape.contract.test.ts) splits each
// entry on spaces to build argv. Command GROUPS (context, loop, github,
// policy, task) expose `--json` only on subcommands, not the bare group, so
// each group is represented here by one or more read-only subcommands that
// emit parseable JSON in a freshly-initialized repo.
//
// Commands NOT listed here that DO expose `--json` are documented with a
// reason in `KNOWN_NON_JSON` in the contract test — see that file for the
// full audit trail (Task 7b Pass C). `mcp-server` and `completion` are
// excluded from both lists because they do not register a `--json` option at
// all (verified against their command sources).
export const JSON_COMMANDS = [
  'status', 'next', 'start', 'ready', 'guard', 'check-gates',
  'review-context', 'artifacts',
  'init',
  'doctor',
  'create-task --type feature --title contract-lock-fixture',
  'harden harden-fixture.md',
  'task list', 'task doctor', 'task current',
  'policy list', 'policy status', 'policy packs',
  'context budget', 'context handles', 'context pack',
  'loop create --goal contract-lock-fixture --preset agentloopkit-maintenance',
  'loop status', 'loop report',
  'github import --issue-json github-issue-fixture.json --dry-run',
  'runs',
  'intent AGENTS.md',
  'verify --write-run',
  'summarize', 'handoff',
  'ship', 'prepare-pr',
  'maintainer-check',
  'report', 'badge',
  'ci-summary', 'release-notes', 'release-check',
  'release-proof --only github-release --github-release-json github-release-fixture.json',
  'schemastore', 'upgrade-harness',
  'npm-status --package-name agentloopkit-fixture --local-version 1.0.0 --registry-json npm-registry-fixture.json',
  'install-agent claude-code',
  'list-templates', 'version',
] as const;
