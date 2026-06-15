# Make status and next output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

status and next output are frequently pasted into agent handoffs and PRs, but task titles, task paths, refs, or report paths with line breaks can split Markdown list items.

## Desired Outcome

Human-readable status and next output render dynamic values as single-line inline code while JSON output keeps raw values for scripts.

## Constraints

- Keep next-action selection unchanged.
- Keep status --json and next --json raw for automation.
- Do not change brief status behavior beyond existing line-break flattening.

## Non-Goals

- Do not apply a global sanitizer to every command in this task.

## Assumptions

- `status` and `next` human output is Markdown-like text that agents paste into PRs, issues, and handoffs.
- JSON output is the automation contract and should keep raw values.

## Likely Files or Areas

- src/core/status.ts
- src/cli/commands/next.ts
- src/core/markdown-format.ts
- tests/status.test.ts
- tests/next.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch

- Release metadata, package version, publish workflows, and next-action decision logic.

## Acceptance Criteria

- status Markdown output keeps task values containing line breaks on one Markdown list line.
- next Markdown output keeps task values containing line breaks on one Markdown list line.
- status --json and next --json preserve raw task values.

## Verification Commands

- npm test -- tests/status.test.ts tests/next.test.ts
- npm test -- tests/status.test.ts tests/next.test.ts tests/cli-docs-drift.test.ts

## Post-Verification Gates

- npm run dogfood:strict
- npx --yes agentflight verify -- npm test -- tests/status.test.ts tests/next.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the `singleLineInlineCode` helper usage in `src/core/status.ts` and `src/cli/commands/next.ts`, then remove the line-break regression tests and docs note.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
