# Harden PR summary changed-file paths

- Created date: 2026-06-11
- Task type: security-review
- Status: review

## Problem Statement

PR summaries render changed git file paths with fixed inline backticks. A path containing backticks can corrupt the Markdown handoff or make changed-file evidence ambiguous.

## Desired Outcome

Changed-file paths in PR summaries use Markdown-safe inline-code delimiters while preserving exact paths.

## Constraints

- Keep normal file path rendering unchanged for paths without backticks.
- Do not change git status parsing or file classification.

## Non-Goals

- Do not build a full Markdown sanitizer.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/pr-summary.ts
- tests/pr-summary.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Changed Files and Change Areas both render paths containing backticks with safe inline-code delimiters.
- Existing PR summary tests for normal paths still pass.

## Verification Commands

- npm test -- tests/pr-summary.test.ts -t "escapes changed file paths"
- npm test -- tests/pr-summary.test.ts
- npm run lint
- npm run typecheck

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Reviewer handoffs are Markdown evidence; repository paths should not be able to corrupt report structure.

## Rollback Notes

Revert the PR summary path renderer and regression test if downstream Markdown rendering changes unexpectedly.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
