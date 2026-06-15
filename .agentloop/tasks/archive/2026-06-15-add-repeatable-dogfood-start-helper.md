# Add repeatable dogfood start helper

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement
Starting AgentFlight, AgentLoopKit task creation, and ProjScan manually is easy to get wrong. We already saw parallel task setup create generic task-contract races.

## Desired Outcome
AgentLoopKit maintainers have a repo-local command that starts companion dogfood tools sequentially, prints the exact commands it ran, and keeps the workflow local-first and reviewable.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood-start.mjs
- tests/dogfood-start-script.test.ts
- package.json
- .agentloop/harness/autonomous-dogfooding.md

## Files or Areas Not to Touch
- README.md
- src/cli/index.ts

## Acceptance Criteria
- Adds a dogfood start helper that starts AgentFlight before AgentLoop task creation and ProjScan.
- Supports dry-run mode so agents can inspect the planned commands without writing state.
- Adds regression tests for command order and argument handling.
- Keeps public README unchanged because this is repo-local maintainer tooling.

## Verification Commands
- npm test -- tests/dogfood-start-script.test.ts
- npm run test:unit
- npm run typecheck
- npm run lint

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This affects maintainer workflow only. Avoid adding package runtime dependencies or public product claims.

## Rollback Notes
Remove the helper script, package script entry, tests, and dogfood harness reference.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
