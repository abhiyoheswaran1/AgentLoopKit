# Polish ready idle state and release-channel docs

- Created date: 2026-06-29
- Task type: bugfix
- Status: done

## Problem Statement
The ready command can warn that AgentLoopKit costs more context than it saves when the repo has no current task and no changed-file context, and release-channel docs need to stay explicit about Marketplace being owner-side until listing proof exists.

## Desired Outcome
Idle readiness output is calmer and release-channel docs stay honest before the next package release.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/ready.ts
- tests/ready.test.ts
- docs/release-proof.md
- docs/distribution-channels.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Idle ready output with no task does not warn that AgentLoopKit costs more context than it saves.
- Context-budget warnings still appear when there is meaningful repo context pressure.
- Release-channel documentation states Marketplace is owner-side/manual until listing proof exists.

## Verification Commands
- npm run test:unit
- npm run check:public-docs
- npm run check:links
- npm run lint
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing ready output may affect docs and tests that assert human copy.

## Rollback Notes
Revert the ready output/docs changes and keep release channels unchanged.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
