# Harden artifacts Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement

agentloop artifacts renders task titles, statuses, artifact titles, and artifact paths directly into Markdown. Backticks in local artifact metadata can corrupt the human evidence inventory.

## Desired Outcome

Artifact inventory Markdown renders local task, report, handoff, HTML report, badge, CI summary, and release-note values with Markdown-safe inline-code delimiters while preserving JSON output.

## Constraints

- Do not bump package version
- Do not publish or release

## Non-Goals

- No artifact discovery behavior change
- No new artifact types

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/artifacts.ts
- tests/artifacts.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- artifacts Markdown uses Markdown-safe inline code for task title, task status, task path, verification status, report paths, handoff titles, CI summary titles, release-note titles, HTML report paths, and badge paths
- artifacts --type and --latest Markdown output use the same safe formatting
- artifacts --json output remains unchanged

## Verification Commands

- npm test -- tests/artifacts.test.ts
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

- Human artifacts Markdown output changes to include inline-code delimiters around local values.

## Rollback Notes

Revert the artifacts renderer changes, tests, and internal records.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
