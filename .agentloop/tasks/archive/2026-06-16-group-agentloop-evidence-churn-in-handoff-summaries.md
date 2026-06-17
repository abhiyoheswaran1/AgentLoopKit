# Group AgentLoop evidence churn in handoff summaries

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Long autonomous sessions generate hundreds of AgentLoop evidence files, causing summarize and handoff Markdown to dump huge changed-file lists that obscure the review surface.

## Desired Outcome
summarize and handoff Markdown should keep non-evidence changed files visible while grouping AgentLoop evidence churn into a compact count, without changing JSON changedFiles or run-ledger coverage.

## Constraints
- Keep changedFiles return values, handoff run changed-files JSON, check-gates coverage, status, and maintainer-check behavior complete.
- Do not delete, archive, hide from git, or mutate existing evidence files.
- Do not add network behavior, token reads, release work, version bumps, tags, publishing, or cleanup automation.

## Non-Goals
- Add a general file grouping system across every command.
- Change prepare-pr grouping or ship scoring.
- Change dirty-file semantics in gates, status, or handoff coverage.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/pr-summary.ts
- tests/handoff.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- Changed Files Markdown lists all non-evidence changed files normally.
- Changed Files Markdown summarizes AgentLoop evidence churn with a compact count instead of listing each evidence file.
- When only evidence files changed, the section still makes the evidence count explicit.
- JSON output and write-run changedFiles still include the full changed-file list.

## Verification Commands
- npm test -- tests/handoff.test.ts
- npm run typecheck
- npm run lint
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Handoff coverage may parse changed paths from Markdown; preserve run-ledger changed-files coverage and avoid weakening stale-handoff detection.

## Rollback Notes
Revert pr-summary rendering, handoff tests, and CLI docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
