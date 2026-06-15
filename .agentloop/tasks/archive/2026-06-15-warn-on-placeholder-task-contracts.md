# Warn on placeholder task contracts

- Created date: 2026-06-15
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed placeholder task contracts can pass task doctor even when acceptance criteria, verification commands, likely files, and rollback notes still contain default filler.

## Desired Outcome
agentloop task doctor reports weak placeholder task contracts so agents fix task quality before treating the contract as review evidence.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- package.json

## Acceptance Criteria
- task doctor reports placeholder acceptance criteria
- task doctor reports missing verification commands
- task doctor remains read-only

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run test:unit
- npm run typecheck
- npm run check:public-docs
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- May make strict dogfood fail on intentionally deferred task templates; scope diagnostics to open active task files only

## Rollback Notes
Revert task doctor diagnostics, tests, docs, and generated evidence

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
