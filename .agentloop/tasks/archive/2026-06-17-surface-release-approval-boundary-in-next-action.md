# Surface release approval boundary in next action

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
When no non-release task is active and the only real task contracts are deferred release-channel work, agentloop status and next still recommend a generic create-task path. Long autonomous sessions can miss that the repo is intentionally parked on maintainer release approval.

## Desired Outcome
agentloop status and agentloop next give bounded release-approval guidance when only deferred release-channel tasks remain, without broad backlog scans, mutation, or release preparation.

## Constraints
- Do not bump package versions, create tags, publish, modify release workflows, edit protected release files, or revive deferred release tasks.
- Keep detection local and bounded to task contracts already loaded by status/next.

## Non-Goals
- Do not implement release preparation, release publishing, Marketplace publication, GHCR, MCP Registry, Scoop, or WinGet work.

## Assumptions
- Deferred release task contracts are the source of truth for the approval boundary.

## Likely Files or Areas
- src/core/status.ts
- src/cli/commands/status.ts
- src/cli/commands/next.ts
- tests/status.test.ts
- tests/next.test.ts
- docs/status.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- action.yml
- .github/workflows

## Acceptance Criteria
- When no active/open task exists and all real deferred task contracts are release-channel tasks, next action text names the release approval boundary instead of only saying create-task.
- Human status and next output remain bounded and do not scan the full backlog.
- Generic create-task guidance remains unchanged when deferred tasks are not release-channel-only.

## Verification Commands
- npm test -- tests/status.test.ts tests/next.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-specialized empty-state copy could hide valid non-release work; keep the trigger narrow and covered by tests.

## Rollback Notes
Revert status/next guidance changes and the focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
