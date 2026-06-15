# Make check-gates output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

check-gates output is often pasted into PRs or agent handoffs, but repo-controlled task titles, paths, refs, or gate messages can contain Markdown control characters or line breaks.

## Desired Outcome

Human-readable check-gates output renders dynamic values as safe single-line Markdown where appropriate while preserving JSON output for scripts.

## Constraints

- Keep JSON output unchanged for machine consumers.
- Do not change gate pass/warn/fail semantics or strict-mode exit-code behavior.

## Non-Goals

- Do not sanitize global command output or modify unrelated commands.

## Assumptions

- `check-gates` human output is Markdown-like text that users paste into PRs, issues, and agent handoffs.
- JSON output is the automation contract and should keep raw values.

## Likely Files or Areas

- src/core/check-gates.ts
- tests/check-gates.test.ts
- docs/cli-reference.md
- docs/check-gates.md

## Files or Areas Not to Touch

- Release metadata, package version, publish workflows, and unrelated commands.

## Acceptance Criteria

- check-gates Markdown output escapes a task title containing Markdown control characters and line breaks.
- check-gates Markdown output escapes dynamic gate messages containing line breaks.
- check-gates JSON output preserves raw dynamic values.

## Verification Commands

- npm test -- tests/check-gates.test.ts
- npm test -- tests/check-gates.test.ts tests/status.test.ts tests/cli-docs-drift.test.ts

## Post-Verification Gates

- npm run dogfood:strict
- npx --yes agentflight verify -- npm test -- tests/check-gates.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the local `gateInlineCode` renderer usage in `src/core/check-gates.ts` and remove the newline-focused regression test and docs note.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
