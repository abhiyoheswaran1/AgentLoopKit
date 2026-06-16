# Make report output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human-readable report output is pasted into CI logs, PRs, and handoffs; dynamic report paths and metadata should not split Markdown when they contain line breaks.

## Desired Outcome
Report human output keeps dynamic values on one Markdown line while JSON output preserves raw values for scripts.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change HTML generation, artifact resolution, report metadata, JSON shape, package version, publish, or release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/report.ts
- tests/html-report.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human report output renders written report paths and metadata values on one Markdown line
- JSON report output preserves raw output path and metadata values
- Focused regression tests cover newline-containing report output paths

## Verification Commands
- npm test -- tests/html-report.test.ts

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Could accidentally alter JSON output or report generation if formatting is applied before writeHtmlReport returns.

## Rollback Notes
Revert the report formatter change and remove the focused regression/docs/internal notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
