# Make verify output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human-readable verify output is pasted into handoffs and PRs; dynamic commands, paths, and status values should not split Markdown when they contain line breaks.

## Desired Outcome
Verify human output keeps dynamic values on one Markdown line while JSON output preserves raw values for scripts.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change verification execution semantics, task resolution, report format, timeout behavior, JSON shape, package version, publish, or release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/verify.ts
- tests/verification.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human verify output renders dynamic command/status/path values on one Markdown line
- JSON verify output preserves raw configured command values and report paths
- Focused regression tests cover newline-containing verification commands or paths

## Verification Commands
- npm test -- tests/verification.test.ts

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Could accidentally alter JSON output or verification execution if formatting is applied in the wrong layer.

## Rollback Notes
Revert the verify formatter change and remove the focused regression/docs/internal notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
