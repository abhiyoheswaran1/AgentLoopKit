# Make badge output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human-readable badge output is pasted into handoffs and release evidence; dynamic badge paths, sources, statuses, or messages should not split Markdown when they contain line breaks.

## Desired Outcome
Badge human output keeps dynamic values on one Markdown line while JSON output preserves raw values for scripts.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change badge generation, SVG contents, source selection, gate semantics, JSON shape, package version, publish, or release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/badge.ts
- tests/badge.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human badge output renders written badge paths and badge metadata on one Markdown line
- JSON badge output preserves raw output path and badge metadata values
- Focused regression tests cover newline-containing badge output paths

## Verification Commands
- npm test -- tests/badge.test.ts

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Could accidentally alter JSON output or badge generation if formatting is applied before writeEvidenceBadge returns.

## Rollback Notes
Revert the badge formatter change and remove the focused regression/docs/internal notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
