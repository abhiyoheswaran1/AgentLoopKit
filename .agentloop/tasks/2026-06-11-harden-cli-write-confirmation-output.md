# Harden CLI write confirmation output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Several CLI commands print generated file paths, statuses, and messages in human write-confirmation output without Markdown-safe inline-code delimiters.

## Desired Outcome
Human confirmation output for generated task, report, handoff, badge, CI summary, release notes, report, verify, and agent-install writes renders local values safely while JSON output stays unchanged.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- src/cli/commands/verify.ts
- src/cli/commands/summarize.ts
- src/cli/commands/report.ts
- src/cli/commands/badge.ts
- src/cli/commands/ci-summary.ts
- src/cli/commands/release-notes.ts
- src/cli/commands/install-agent.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- write-confirmation paths are wrapped with the shared inline-code formatter
- badge source, status, and message confirmations are wrapped safely
- verification overall status confirmation is wrapped safely
- JSON outputs remain unchanged
- regression tests cover paths or values containing backticks

## Verification Commands
- npm test -- tests/create-task.test.ts tests/verification.test.ts tests/pr-summary.test.ts tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts tests/agent-installation.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This changes human CLI output strings; keep labels stable and only format values.

## Rollback Notes
Revert formatter imports, output wrapping, and the matching tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
