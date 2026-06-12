# Add bulk task archive mode

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Dogfooding release batches showed that archiving shipped task contracts one at a time is repetitive and easy to forget.

## Desired Outcome
Allow maintainers to archive multiple terminal task contracts by status with an explicit dry-run path before moving files.

## Constraints
- Do not delete task files
- Do not archive deferred tasks by default
- Do not change existing single-path archive behavior

## Non-Goals
- No interactive task UI
- No automatic archive during release

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop task archive supports --status <status>
- bulk archive mode supports --dry-run
- bulk archive mode refuses ambiguous use without a status or explicit path
- tests cover dry-run, moved tasks, and invalid statuses

## Verification Commands
- npm test -- tests/task-archive.test.ts
- npm run lint
- npm run typecheck
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Bulk file moves can surprise maintainers if dry-run output is unclear.

## Rollback Notes
Remove the bulk archive options and keep the existing single-task archive command.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
