# Add built CLI smoke coverage for task list status filter

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover agentloop task list --status, but the built CLI smoke flow does not prove packaged task-list filtering works with human output, JSON groups, unsupported status JSON errors, and active-state preservation.

## Desired Outcome
scripts/smoke-cli.mjs exercises task list --status through the built CLI, and distribution-artifacts coverage locks the smoke assertions.

## Constraints
- Keep the smoke deterministic and local-only.
- Do not mutate task status except through the existing smoke task flow.
- Do not change release, version, package metadata, or publishing behavior.

## Non-Goals
- No new task-list semantics beyond smoke coverage.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- The built smoke script runs task list --status against its fixture repo and asserts only matching statuses are returned.
- The built smoke script checks JSON grouped arrays remain filtered and active state is preserved.
- The built smoke script checks unsupported task list status JSON errors are structured.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "task list status filter"
- node scripts/smoke-cli.mjs
- npm test -- tests/distribution-artifacts.test.ts
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Smoke script coverage can become noisy; keep assertions scoped to the task-list status filter.

## Rollback Notes
Revert the smoke-script and distribution-artifact test additions. Runtime task-list behavior remains covered by source tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
