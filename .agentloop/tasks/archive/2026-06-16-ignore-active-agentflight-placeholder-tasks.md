# Ignore active AgentFlight placeholder tasks

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Direct AgentFlight sessions can create an exact AgentFlight placeholder task and pin it active. AgentLoopKit already preserves placeholders separately, but a pinned placeholder can still appear as the active task and hijack status/next/doctor flow until an agent manually parks it and resets the real task.

## Desired Outcome
AgentLoopKit detects an exact AgentFlight placeholder when it is pinned active, does not treat it as real active roadmap work, and provides bounded recovery guidance without mutating task files or broad scans.

## Constraints
- Do not modify AgentFlight itself or depend on AgentFlight internals beyond the exact placeholder contract already detected by AgentLoopKit.
- Do not release, tag, publish, bump versions, or touch distribution manifests.
- Keep behavior read-only except for normal task commands explicitly invoked by the user.

## Non-Goals
- No automatic deletion or archival of AgentFlight placeholder files.
- No broad task scans outside the configured task directory.
- No release or distribution work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- src/core/status.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts
- tests/status.test.ts
- tests/next.test.ts
- docs/status.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- task doctor reports a pinned AgentFlight placeholder with recovery commands.
- status and next do not report an exact AgentFlight placeholder as the active task.
- status and next still show preserved AgentFlight placeholder counts and recommend creating or setting a real task.
- Existing placeholder inventory behavior remains unchanged.

## Verification Commands
- npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Medium-low: status/next active-task semantics change only for exact AgentFlight placeholder contracts.

## Rollback Notes
Revert task-state/status/next tests, source changes, and docs for active AgentFlight placeholder handling.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
