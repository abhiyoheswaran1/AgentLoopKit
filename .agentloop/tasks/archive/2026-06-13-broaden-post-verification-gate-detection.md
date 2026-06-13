# Broaden post-verification gate detection

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
Task contracts and generated docs describe commands such as agentloop ship, check-gates, prepare-pr, handoff, and maintainer-check as post-verification evidence gates, but create-task and task doctor only flag a narrower subset when those commands are placed under Verification Commands.

## Desired Outcome
create-task warnings and task doctor diagnostics flag common AgentLoop review-readiness commands when they are recorded as verification commands.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task JSON warns for agentloop ship and agentloop prepare-pr under verification commands
- task doctor JSON reports the same commands as post-verification-gate-in-verification-commands
- the detector remains local-only and does not execute the commands

## Verification Commands
- npm test -- tests/create-task.test.ts -t "post-verification gates"
- npm test -- tests/task-state.test.ts -t "post-verification gates"
- npm test -- tests/create-task.test.ts tests/task-state.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

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
