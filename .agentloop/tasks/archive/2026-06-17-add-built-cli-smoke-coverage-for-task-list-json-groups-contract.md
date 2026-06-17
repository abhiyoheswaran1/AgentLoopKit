# Add built CLI smoke coverage for task-list JSON groups

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The task-list JSON grouping behavior has source-level regression coverage, but the built CLI smoke flow does not prove packaged output includes the complete flat tasks array plus grouped taskContracts and agentFlightPlaceholders arrays.

## Desired Outcome
The built CLI smoke script creates both an ordinary task contract and an exact AgentFlight placeholder fixture, then verifies task list --json exposes backward-compatible tasks plus grouped taskContracts and agentFlightPlaceholders without mutating active state.

## Constraints
- Keep this as smoke coverage only; do not change task-list behavior unless the smoke exposes an actual bug.
- Do not release, version bump, publish, tag, or touch Marketplace/Scoop/WinGet work.
- Use a bounded temporary smoke repo fixture and do not scan outside the configured task directory.

## Non-Goals
- No task-list JSON shape changes beyond fixing a discovered regression.
- No AgentFlight or ProjScan implementation changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused distribution-artifacts guard test fails before the smoke script checks task list --json grouping and passes after implementation.
- node scripts/smoke-cli.mjs exercises the built CLI task list --json output and asserts flat tasks, taskContracts, and agentFlightPlaceholders groups.
- The smoke checks that ordinary task contracts are not marked as AgentFlight placeholders and exact placeholders are grouped separately.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "task-list JSON groups"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke-script task-list JSON assertions and the distribution-artifacts guard test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
