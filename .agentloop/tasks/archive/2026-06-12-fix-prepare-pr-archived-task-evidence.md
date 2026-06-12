# Fix prepare-pr archived task evidence

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
prepare-pr loses task-contract context after a task is archived even when the latest ship run references archived task evidence.

## Desired Outcome
prepare-pr reuses fresh ship evidence and renders PR title, acceptance criteria, risks, and rollback notes from archived latest-run task contracts.

## Constraints
- Keep output deterministic and local-only.

## Non-Goals
- Do not reactivate archived tasks.
- Do not change task archive semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/prepare-pr.ts
- tests/prepare-pr.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- prepare-pr resolves archived latest-run task contracts for PR copy.
- prepare-pr can reuse a fresh ship run after task archival without writing duplicate ship runs.
- Regression tests cover archived-task prepare-pr behavior.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts tests/ship.test.ts
- npm run lint
- npm run typecheck
- npm run check:links
- git diff --check
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
