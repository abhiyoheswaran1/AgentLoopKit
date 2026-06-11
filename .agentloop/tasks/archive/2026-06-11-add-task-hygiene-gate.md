# Add task hygiene gate

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop task doctor can detect stale or malformed task contracts, but agentloop check-gates does not surface those diagnostics during review evidence checks.

## Desired Outcome
check-gates includes a warning-only task hygiene gate based on task doctor diagnostics, so reviewers and agents see active task-folder cleanup issues before handoff.

## Constraints
- Do not change package version or cut a release.
- Keep the gate read-only and warning-only by default.
- Do not archive, delete, rewrite, or auto-fix task files.

## Non-Goals
- No new task manager UI.
- No policy engine or blocking default behavior beyond existing strict warning behavior.

## Assumptions
- Task doctor diagnostics are already implemented and can be reused from src/core/task-state.ts.

## Likely Files or Areas
- src/core/check-gates.ts
- tests/check-gates.test.ts
- docs/check-gates.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates --json includes a task-hygiene gate with status pass when task doctor has no diagnostics
- check-gates --json includes a task-hygiene warning when task doctor reports stale or malformed active task files
- Default check-gates exits 0 when only task-hygiene warns and required evidence passes
- check-gates --strict exits 1 when task-hygiene warns
- Human output includes the task hygiene warning message

## Verification Commands
- npm test -- tests/check-gates.test.ts tests/task-state.test.ts
- npm test
- npm run lint
- npm run typecheck
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the task-hygiene gate integration, tests, and docs updates

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
