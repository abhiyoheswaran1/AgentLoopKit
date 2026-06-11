# Add JSON error output for unsupported task status

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop task status --json returns structured success output, but unsupported task status values still use the global human error path. Agents and CI cannot parse the supported status list.

## Desired Outcome
agentloop task status <path> <status> --json returns a structured error with code, message, requestedStatus, and supportedStatuses when the status is unsupported.

## Constraints
- Keep default non-JSON error output human-readable.
- Do not change supported statuses or task Markdown format.
- Do not change package version or cut a release.

## Non-Goals
- Do not add JSON error output for every task subcommand in this task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- src/core/task-state.ts
- tests/task-state.test.ts
- README.md
- docs/task-contracts.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Unsupported task status with --json prints valid JSON to stdout and exits non-zero.
- The JSON includes supportedStatuses.
- Unsupported task status without --json remains human-readable on stderr.

## Verification Commands
- npm test -- task-state
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
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
