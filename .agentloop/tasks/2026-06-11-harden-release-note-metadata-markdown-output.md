# Harden release-note metadata Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: review

## Problem Statement

Release notes already render changed-file paths with Markdown-safe inline code, but header metadata and AgentLoop evidence values still render package names, versions, ranges, branch names, commit IDs, task titles, statuses, and artifact paths directly into Markdown.

## Desired Outcome

Release-note Markdown renders header metadata and AgentLoop evidence values with Markdown-safe inline-code delimiters while preserving JSON output and git command behavior.

## Constraints

- Do not bump package version
- Do not publish or release
- Do not change git ref validation or release-note range selection

## Non-Goals

- No release creation
- No npm or GitHub API calls
- No changelog rewriting

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/release-notes.ts
- tests/release-notes.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Release-note header values containing backticks render safely
- Release-note AgentLoop evidence titles and paths containing backticks render safely
- Existing JSON output remains unchanged

## Verification Commands

- npm test -- tests/release-notes.test.ts
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

- Release note Markdown expectations will change from plain labels to inline-code values.

## Rollback Notes

Revert release-note rendering changes, tests, and internal records.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
