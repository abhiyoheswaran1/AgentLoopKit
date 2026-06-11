# Harden status and next Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement

agentloop status and agentloop next render task titles, statuses, paths, git metadata, verification report paths, and deferred task names directly into Markdown. These values come from local task files, git refs, and artifact paths, so backticks or Markdown punctuation can corrupt the output that agents read for next actions.

## Desired Outcome

Status and next Markdown output render local task, report, git, project, command, and summary values with Markdown-safe inline-code delimiters while preserving JSON output and brief output behavior.

## Constraints

- Do not bump package version
- Do not publish or release
- Preserve status --json and next --json structures
- Preserve status --brief text shape unless safety requires a change

## Non-Goals

- No new planner or next-action engine
- No task selection behavior change
- No git command changes

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/status.ts
- src/cli/commands/next.ts
- tests/status.test.ts
- tests/next.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- status Markdown uses safe inline code for task titles, statuses, paths, git labels, project name, package manager, and latest verification values containing backticks
- next Markdown uses safe inline code for task titles, statuses, paths, latest verification values, command, and working-tree summary values containing backticks
- JSON outputs remain unchanged for status and next

## Verification Commands

- npm test -- tests/status.test.ts tests/next.test.ts
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

- Human Markdown output snapshots/expectations will change to include inline-code delimiters around values.

## Rollback Notes

Revert status/next rendering changes, tests, and internal records.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
