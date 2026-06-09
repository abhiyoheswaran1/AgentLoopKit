# Add strict mode to check-gates

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement
check-gates is useful for humans, but CI users cannot opt in to fail on warning-level gates.

## Desired Outcome
Add an opt-in strict mode that treats warning gates as failures while preserving the default behavior.

## Constraints
- Default check-gates behavior must not change
- Do not run verification commands from check-gates
- Keep output deterministic

## Non-Goals
- No policy engine
- No dashboard

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- src/cli/commands/check-gates.ts
- tests/check-gates.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates --strict exits non-zero when any gate warns
- check-gates without --strict still exits zero for warnings only
- JSON output records strict mode

## Verification Commands
- npx pnpm@10.12.1 test tests/check-gates.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert strict-mode CLI/core/test/docs changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
