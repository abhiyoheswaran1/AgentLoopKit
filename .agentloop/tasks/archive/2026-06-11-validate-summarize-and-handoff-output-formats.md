# Validate summarize and handoff output formats

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
summarize and handoff document --format as markdown or json, but unsupported values fall back to Markdown instead of failing clearly.

## Desired Outcome
Unsupported --format values fail before handoff writes, and JSON-mode calls return a parseable error with the requested format and supported formats.

## Constraints
- Keep --format markdown and --format json behavior unchanged
- Keep --json as a supported alias for JSON output
- Do not change package version or release metadata
- Do not add dependencies

## Non-Goals
- Add new output formats
- Redesign global CLI error handling
- Change report, verify, status, or npm-status formats

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/summarize.ts
- tests/handoff.test.ts
- README.md
- docs/pr-summaries.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- summarize --format xml exits non-zero with a human-readable unsupported-format error and writes no handoff
- handoff --format xml exits non-zero before writing a handoff
- summarize --format xml --json returns a parseable UNSUPPORTED_OUTPUT_FORMAT error
- handoff --format xml --json returns a parseable UNSUPPORTED_OUTPUT_FORMAT error and writes no handoff
- existing markdown, json, and --json behavior remains covered

## Verification Commands
- npm test -- tests/handoff.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert summarize command validation, handoff tests, docs, and changelog entries.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
