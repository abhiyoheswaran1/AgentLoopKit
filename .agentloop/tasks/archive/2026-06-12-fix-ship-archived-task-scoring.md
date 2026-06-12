# Fix ship archived task scoring

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
After a completed task is archived, strict gates and maintainer-check resolve latest-run archived task evidence, but agentloop ship still scores task clarity as missing.

## Desired Outcome
agentloop ship reuses archived latest-run task evidence so review-readiness scoring keeps task context after cleanup.

## Constraints
- Keep command execution explicit and read-only unless ship is already writing its own report.

## Non-Goals
- Do not change task archive semantics or run verification automatically.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- ship reports archived latest-run task evidence as task context
- review-readiness task clarity is not zero when archived task evidence exists
- strict dogfood still passes after the task is archived

## Verification Commands
- npm test -- tests/ship.test.ts tests/check-gates.test.ts tests/maintainer-check.test.ts
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
- Changing task evidence resolution can affect ship reports and PR descriptions.

## Rollback Notes
Revert the ship evidence resolver change and the regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
