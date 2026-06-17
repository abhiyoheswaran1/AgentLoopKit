# Separate AgentFlight placeholders from roadmap task counts

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Exact AgentFlight placeholder task contracts are preserved as deferred evidence, but status, next, and task list still present them as ordinary parked roadmap tasks.

## Desired Outcome
AgentLoopKit keeps AgentFlight placeholders visible as preserved session evidence while excluding them from actionable deferred task counts and fallback recommendations.

## Constraints
- Do not delete placeholder task files.
- Do not hide custom deferred tasks or release-channel tasks.
- Do not change release, Marketplace, or publishing flows.

## Non-Goals
- No AgentFlight package changes.
- No broad task-directory scans beyond existing direct task inventory.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- src/core/status.ts
- src/cli/commands/next.ts
- src/cli/commands/task.ts
- tests/status.test.ts
- tests/next.test.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Exact AgentFlight placeholder contracts are classified as preserved placeholders in task metadata.
- status and next exclude placeholders from deferred task counts while exposing a separate placeholder list.
- task list labels placeholders without deleting or archiving them.
- Custom deferred tasks remain actionable parked tasks.

## Verification Commands
- npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts
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
Revert the task metadata classification, status/next rendering changes, task list label, and related tests. Existing placeholder task files can remain deferred because this change only affects classification and presentation.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
