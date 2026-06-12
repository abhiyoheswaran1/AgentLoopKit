# Harden release-note file path labels

- Created date: 2026-06-11
- Task type: security-review
- Status: review

## Problem Statement

Release notes render changed-file and working-tree path labels with fixed inline backticks. Repository paths containing backticks can corrupt release-note Markdown evidence.

## Desired Outcome

Release-note changed-file and working-tree path labels use Markdown-safe inline-code delimiters while preserving exact path text.

## Constraints

- Keep normal file path output unchanged for paths without backticks.
- Do not change git range selection, status parsing, or publishing behavior.

## Non-Goals

- Do not build a full Markdown sanitizer.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/release-notes.ts
- tests/release-notes.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Changed Files renders paths containing backticks with safe inline-code delimiters.
- Working Tree renders paths containing backticks with safe inline-code delimiters.
- Existing release-notes tests still pass.

## Verification Commands

- npm test -- tests/release-notes.test.ts -t "escapes release-note file path labels"
- npm test -- tests/release-notes.test.ts
- npm run lint
- npm run typecheck

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Release notes are release evidence; repository paths should not be able to break report structure.

## Rollback Notes

Revert the release-note path renderer and regression test if downstream Markdown rendering changes unexpectedly.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
