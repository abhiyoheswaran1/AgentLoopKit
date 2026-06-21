# Clarify dogfood strict warning boundary

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
Strict dogfood passes when maintainer-check reports warn because maintainer-check exits zero for review guidance warnings. Current repo guidance can read as though every warning from every dogfood step blocks progress, which confuses agents during long dirty implementation batches.

## Desired Outcome
Document and test that dogfood strict blocks review-gate warnings through check-gates --strict, while maintainer-check warnings remain visible reviewer guidance unless the maintainer-check command exits non-zero.

## Constraints
- No behavior change to dogfood, maintainer-check exit codes, check-gates, release flow, package versions, tags, or publishing.

## Non-Goals
- No parsing maintainer-check human output in dogfood.
- No new strict flag on maintainer-check.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- tests/dogfood-script.test.ts
- README.md
- docs/cli-reference.md
- docs/maintenance-guards.md
- AGENTS.md
- src/templates/root/AGENTS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Dogfood help and docs say strict mode blocks review-gate warnings rather than every maintainer warning.
- Tests cover that strict dogfood keeps maintainer-check exit-code based and does not pass a strict flag to it.

## Verification Commands
- npm test -- tests/dogfood-script.test.ts tests/autonomous-dogfood.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing guidance may affect release-prep expectations; keep strict gate behavior and maintainer-check exit-code contract unchanged.
- Pre-existing dirty non-evidence files before task creation: 74 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore previous dogfood strict wording and test expectations.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
