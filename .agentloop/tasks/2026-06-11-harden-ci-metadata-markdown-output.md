# Harden CI metadata Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: review

## Problem Statement

Verification reports and CI summaries render allowlisted CI metadata directly into Markdown. Values are normalized to one line, but backticks or Markdown punctuation in branch names, workflow names, refs, or URLs can still corrupt report structure or reviewer evidence.

## Desired Outcome

Verification and CI summary Markdown render CI metadata values with Markdown-safe inline-code delimiters while preserving existing JSON output and not expanding environment access.

## Constraints

- Do not bump package version
- Do not publish or release
- Do not read arbitrary environment variables
- Preserve existing CI provider detection

## Non-Goals

- No provider API calls
- No telemetry
- No CI workflow changes

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/verification.ts
- src/core/ci-summary.ts
- src/core/markdown-format.ts
- tests/verification.test.ts
- tests/ci-summary.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Verification report CI Context uses safe inline code for provider metadata values containing backticks
- CI summary CI Context uses safe inline code for provider metadata values containing backticks
- Existing plain CI context expectations remain understandable

## Verification Commands

- npm test -- tests/verification.test.ts tests/ci-summary.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run build
- node scripts/smoke-cli.mjs
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Changing Markdown rendering may require adjusting existing assertions while preserving JSON structures.

## Rollback Notes

Revert CI metadata rendering changes, focused tests, and docs records.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
