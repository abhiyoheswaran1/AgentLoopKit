# Prevent dogfood start placeholder task clutter

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
dogfood:start can leave an AgentFlight-generated placeholder task contract parked beside the detailed AgentLoop task, making roadmap status noisier during autonomous sessions.

## Desired Outcome
dogfood:start preserves the detailed AgentLoop task as the active task and parks only exact AgentFlight placeholder duplicates without deleting evidence.

## Constraints
- Do not delete task files or hide non-placeholder work.
- Keep release and publication flows untouched.

## Non-Goals
- No AgentFlight package changes.
- No Marketplace or release-channel work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood-start.mjs
- tests/dogfood-start-script.test.ts
- .agentloop/harness/autonomous-dogfooding.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- After AgentFlight creates a same-title placeholder and create-task writes the detailed contract, dogfood:start marks only the placeholder duplicate deferred.
- Dry-run remains non-mutating and shows the local commands that would run.
- Docs explain the placeholder parking behavior.

## Verification Commands
- npm test -- tests/dogfood-start-script.test.ts tests/autonomous-dogfood.test.ts
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the `scripts/dogfood-start.mjs` cleanup step, the dogfood-start tests, and the harness guide wording. If needed, manually park any exact AgentFlight placeholder task with `agentloop task status <path> deferred`.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
