# Sanitize run ledger display paths

- Created date: 2026-06-12
- Task type: bugfix
- Status: review

## Problem Statement
Run ledger APIs and CLI output can expose absolute or parent-relative artifact paths from stored metadata, while MCP and review-context already sanitize those paths.

## Desired Outcome
All public run ledger summaries, run details, and file intent output use safe repo-relative or basename-only paths without leaking local absolute directories or parent-relative paths.

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
- listRuns and readRun return safe display paths for task, verification, ship, handoff, and changed-file paths.
- agentloop runs, show-run, intent, MCP run tools, and review-context inherit sanitized paths without duplicate formatting logic.
- Existing run files remain readable for backwards compatibility.

## Verification Commands
- npm test -- tests/runs.test.ts tests/mcp-tools.test.ts tests/review-context.test.ts
- npm run typecheck
- npm run lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing run metadata at read boundaries could break tests that expect absolute paths from JSON output.
- Sanitizing changed-file paths too aggressively could reduce intent lookup precision.

## Rollback Notes
Revert the run metadata sanitization change and restore consumer-level formatting.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
