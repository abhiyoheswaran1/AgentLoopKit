# Fix stale generated artifact ordering

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

Generated AgentLoopKit artifact files can have filesystem mtimes rewritten by git operations, causing status, artifacts, gates, or handoff flows to pick older evidence instead of the newest timestamped report.

## Desired Outcome

Generated timestamped artifacts are ordered by their filename timestamp and collision suffix, while manual files keep the existing mtime fallback.

## Constraints

- Do not change release version or publish anything.
- Keep manual/non-generated file ordering behavior compatible.

## Non-Goals

- None recorded yet.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/artifacts.ts
- tests/artifacts.test.ts
- tests/status.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- artifacts --json selects the newest timestamped verification, handoff, and ship report even when mtimes are stale.
- status --json selects the newest timestamped verification report even when an older report has a newer mtime.
- The fix is shared by generated artifact inventory and latest Markdown evidence lookup.

## Verification Commands

- npm test -- tests/artifacts.test.ts tests/status.test.ts
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates

- npm run dogfood:strict
- npx --yes projscan --format markdown doctor

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Evidence freshness and review-readiness commands depend on choosing the right latest report.

## Rollback Notes

Revert the comparator and regression tests if generated artifact ordering regresses other evidence surfaces.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
