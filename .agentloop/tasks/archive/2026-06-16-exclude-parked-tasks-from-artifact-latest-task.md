# Exclude parked tasks from artifact latest task

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
agentloop artifacts still names a deferred task as Latest task when no actionable task contracts remain. In this repo that resurfaces the parked Publish GitHub Marketplace Action task even though it should stay deferred until maintainer approval.

## Desired Outcome
Artifact inventory keeps counting deferred and terminal ordinary task contracts, but its latest task field and Markdown latest-task line select only open real task statuses. When only deferred, terminal, or AgentFlight placeholder tasks remain, Latest task is not found.

## Constraints
- Keep deferred task counts and by-status output unchanged.
- Keep AgentFlight placeholder separation unchanged.
- Do not mutate task state, archive files, delete evidence, or change status/next behavior.
- Do not touch release, package version, Marketplace, Scoop, WinGet, or publishing files.

## Non-Goals
- Do not add cleanup automation or task selection commands.
- Do not hide deferred tasks from task list or artifact counts.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- artifacts --json reports tasks.latest as null when only deferred ordinary tasks exist.
- artifacts Markdown prints Latest task: not found when only deferred ordinary tasks and AgentFlight placeholders exist.
- artifacts still counts deferred tasks in tasks.count and tasks.byStatus.
- artifacts still selects an open real task as latest when open and deferred tasks both exist.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm test -- tests/status.test.ts tests/review-context.test.ts
- npm test -- tests/public-docs-hygiene.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing latest task semantics could affect scripts that used artifacts --json tasks.latest to find parked work.

## Rollback Notes
Revert the artifact latest-task filter, docs wording, and regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
