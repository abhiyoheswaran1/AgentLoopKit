# Guard backlog implemented decisions

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
Older backlog rows can remain marked do now after their notes say implemented, completed, archived, or Cycle implementation; autonomous agents then reselect already-finished work.

## Desired Outcome
A unit-level roadmap hygiene guard fails on stale implemented backlog rows, and the backlog decision column reflects completed work accurately.

## Constraints
- Do not touch release metadata, publish workflows, package versions, Marketplace, Scoop, WinGet, npm, GHCR, or MCP Registry channels.
- Keep this internal to roadmap/backlog hygiene and deterministic local tests.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/roadmap-channels.test.ts
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Backlog rows whose notes clearly say implemented, completed, archived, or cycle implementation are not still marked do now.
- The guard runs in the existing unit test surface without editing package metadata.

## Verification Commands
- npm test -- tests/roadmap-channels.test.ts
- npm run dogfood

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- The detection could be too broad and relabel a genuinely active row; use conservative note markers only.

## Rollback Notes
Revert the backlog hygiene test and backlog decision-column edits.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
