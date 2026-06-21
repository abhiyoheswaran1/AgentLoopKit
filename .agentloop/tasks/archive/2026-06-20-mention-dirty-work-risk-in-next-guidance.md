# Mention dirty-work risk in next guidance

- Created date: 2026-06-20
- Task type: feature
- Status: done

## Problem Statement
status and next recommend create-task when no active/open task exists, but in a dirty working tree the user does not see the same scope-contamination warning until after they run create-task.

## Desired Outcome
status and next keep recommending create-task, but their reason mentions existing dirty non-AgentLoop files so agents know to confirm the dirty work belongs to the new task.

## Constraints
- Do not change the recommended command.
- Do not block task creation or status output.
- Do not read dirty file contents.

## Non-Goals
- No cleanup, commit, stash, reset, or evidence deletion behavior.
- No release or publishing work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts
- tests/next.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- When no active/open task exists and dirty non-evidence files exist, status JSON nextAction.reason mentions existing dirty non-AgentLoop files before create-task.
- next JSON returns the same guidance for dirty create-task states.
- Clean deferred-only states still return no required command, and the recommended command for dirty states remains agentloop create-task.

## Verification Commands
- npm test -- tests/status.test.ts tests/next.test.ts
- npm run typecheck

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches status and next guidance; preserve command selection, JSON shape, and dirty-file counts.

## Rollback Notes
Revert the next-action copy change, tests, docs, and product evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
