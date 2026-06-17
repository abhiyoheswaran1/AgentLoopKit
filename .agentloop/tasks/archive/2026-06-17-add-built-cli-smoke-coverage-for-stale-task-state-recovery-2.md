# Add built CLI smoke coverage for stale task state recovery

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover stale active-task pointer recovery, but the built CLI smoke path does not prove packaged status, next, and task doctor output guide users through bounded stale-state recovery.

## Desired Outcome
The built CLI smoke script creates a stale active-task pointer fixture and verifies status, next, and task doctor all recommend bounded recovery without leaking the absolute smoke repo path or mutating state.

## Constraints
- Keep changes scoped to built CLI smoke coverage and its guard test.
- Do not change stale-state runtime semantics unless the bug pass finds a real defect.
- Do not add dependencies, release prep, publishing, Marketplace, Scoop, or WinGet work.

## Non-Goals
- Do not add cleanup automation or mutate stale state during status, next, or task doctor.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows

## Acceptance Criteria
- A focused distribution-artifacts guard test fails before the smoke script includes stale-state recovery coverage and passes after implementation.
- node scripts/smoke-cli.mjs exercises built status --json, next --json, and task doctor --json --redact-paths against a stale active task pointer.
- Smoke assertions prove task doctor is the recommended recovery path and the absolute smoke repo path is not printed in redacted JSON.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "stale task state recovery"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Smoke script runtime and brittleness can increase if the fixture relies on broad output details.

## Rollback Notes
Revert scripts/smoke-cli.mjs and tests/distribution-artifacts.test.ts; no persistent runtime state or dependency changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
