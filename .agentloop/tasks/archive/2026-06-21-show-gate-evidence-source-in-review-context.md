# Show gate evidence source in review context

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Human review-context output collapses gate state to a single status, so no-active archived-task sessions do not show whether the passing gate came from active, open, or archived task evidence.

## Desired Outcome
Human review-context output includes a concise task-evidence source label for the gate snapshot, aligned with check-gates/status language, while JSON output and gate decisions remain unchanged.

## Constraints
- Do not change check-gates pass/warn/fail semantics, strict-mode behavior, next-action command selection, review-context JSON field shape, release behavior, dependencies, tags, publishing, or package versions.
- Use only already-collected gate snapshot data; do not add broad scans or artifact body reads.

## Non-Goals
- Do not redesign review-context output or add new commands.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/review-context.ts
- tests/review-context.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- review-context human output names active, latest open, archived, or missing task-evidence source when gate data is available.
- review-context JSON remains backward-compatible and tests cover archived/no-active behavior.

## Verification Commands
- npm test -- tests/review-context.test.ts
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
- Pre-existing dirty non-evidence files before task creation: 112 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the review-context rendering/test/docs changes; no migrations or data cleanup required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
