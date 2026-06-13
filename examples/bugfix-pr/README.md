# Bugfix PR Example

This example shows a small bugfix flow that ends with review-ready PR text.

Scenario: password-reset login sends users to the dashboard instead of the page they originally requested.

## Task Contract

```bash
agentloop create-task \
  --type bugfix \
  --title "Fix password-reset redirect" \
  --problem-statement "After password reset, users lose the requested redirect target and land on the dashboard." \
  --desired-outcome "Password-reset login preserves the safe redirect target." \
  --likely-file src/auth \
  --likely-file tests/auth \
  --forbidden-file migrations \
  --acceptance "A safe redirect target survives the password-reset login flow" \
  --acceptance "Unsafe external redirect targets are rejected" \
  --verification "npm test -- auth" \
  --verification "npm run typecheck" \
  --risk "Touches login redirect behavior" \
  --rollback "Revert the redirect helper and related tests"
```

Ask the agent to read `AGENTS.md`, `AGENTLOOP.md`, and the active task before editing.

## Implement

Keep the diff narrow:

- update the redirect helper or callback route;
- add or update focused auth tests;
- avoid unrelated session, migration, or UI refactors.

## Verify

```bash
agentloop verify --task-commands
```

If the repo config already includes the same commands, AgentLoopKit runs each exact command once and records skipped duplicates in the report.

## Ship

```bash
agentloop ship
```

`ship` checks task clarity, changed files, verification freshness, gates, handoff readiness, and risk flags. The score describes review evidence. It does not claim the auth code is correct.

## Prepare The PR

```bash
agentloop prepare-pr
agentloop prepare-pr --github-comment
```

Use the generated title and body as the PR draft. Review the risks and rollback notes before posting.

## Maintainer Check

```bash
agentloop maintainer-check
```

Maintainers can use this to ask for missing evidence before reviewing the bugfix.

## Expected Evidence

- `.agentloop/tasks/<date>-fix-password-reset-redirect.md`
- `.agentloop/reports/<timestamp>-verification-report.md`
- `.agentloop/reports/<timestamp>-ship-report.md`
- `.agentloop/runs/<run-id>/`
- `.agentloop/handoffs/<timestamp>-pr-summary.md`
