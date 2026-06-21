# Show review-area counts in ship scope warnings

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Ship reports currently warn that a task has a broad non-evidence change set, but the scope-control message does not summarize which review areas make it broad. Maintainer-check already shows compact area counts, so reviewers must cross-reference another command to understand the ship warning quickly.

## Desired Outcome
Ship/readiness scope-control output includes deterministic non-evidence review-area counts when a broad change-set warning fires, reusing the existing change-area classifier and preserving current scoring weights.

## Constraints
- Do not change readiness score weights, dimension names, gate statuses, changed-file collection, release behavior, dependency behavior, tags, publishing, or package versions.
- Do not read file contents for area classification; use path-only Git status data already available to the readiness flow.

## Non-Goals
- Do not split the current dirty worktree or hide broad-scope warnings.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/readiness-score.ts
- src/core/change-areas.ts
- tests/readiness-score.test.ts
- tests/ship.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- When non-evidence changed files exceed the broad-scope threshold, the scope-control message includes compact area counts such as Source, Tests, Documentation, or AgentLoop.
- When the change set is not broad, readiness output remains unchanged.
- The implementation reuses the existing change-area classifier instead of duplicating path classification.

## Verification Commands
- npm test -- tests/readiness-score.test.ts tests/ship.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Readiness wording is reviewer-facing; keep score math and JSON structure stable while changing only the explanatory message.
- Pre-existing dirty non-evidence files will be present at task start; preserve unrelated work and do not clean the tree.
- Pre-existing dirty non-evidence files before task creation: 94 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous scope-control message text and remove the new tests/records.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
