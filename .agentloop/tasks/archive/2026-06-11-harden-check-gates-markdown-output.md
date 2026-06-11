# Harden check-gates Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement

agentloop check-gates renders gate messages, paths, git metadata, and next-action commands directly into Markdown. Backticks in local task titles, file paths, git refs, or gate evidence can corrupt reviewer-facing gate output.

## Desired Outcome

Check-gates Markdown renders local gate, git, path, and command values with Markdown-safe inline-code delimiters while preserving JSON output and gate decisions.

## Constraints

- Do not bump package version
- Do not publish or release

## Non-Goals

- No gate decision behavior change
- No new gates

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/check-gates.ts
- tests/check-gates.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- check-gates Markdown uses Markdown-safe inline code for gate status, gate names, messages, paths, git branch, commit, root, target, changed-file counts, and next-action command values
- check-gates --json output remains unchanged
- strict-mode behavior and exit codes remain unchanged

## Verification Commands

- npm test -- tests/check-gates.test.ts
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

- Human check-gates Markdown output changes to include inline-code delimiters around local values.

## Rollback Notes

Revert the check-gates renderer changes, tests, and internal records.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
