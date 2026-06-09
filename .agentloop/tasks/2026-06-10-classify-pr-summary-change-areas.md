# Classify PR summary change areas

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement

PR summaries list changed files but do not classify change areas, so reviewers must infer whether the diff touches source, tests, docs, CI, config, AgentLoop artifacts, or risk-sensitive paths.

## Desired Outcome

Add deterministic change-area classification and review-focus hints to generated PR summaries without calling an LLM.

## Constraints

- Keep output deterministic and local-only.
- Do not inspect file contents or read env files.
- Do not add dependencies.
- Preserve existing changed-file and diff-stat sections.

## Non-Goals

- No AI-generated narrative and no risk scoring.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/pr-summary.ts
- tests/pr-summary.test.ts
- docs/pr-summaries.md
- README.md

## Files or Areas Not to Touch

- .env

## Acceptance Criteria

- PR summaries include a Change Areas section grouping changed files by useful reviewer categories.
- PR summaries include deterministic Review Focus hints based on categories and risk-sensitive paths.
- Existing summary output remains backward-compatible enough for users who rely on Changed Files and Diff Stats.

## Verification Commands

- npx pnpm@10.12.1 test tests/pr-summary.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the classification implementation and docs if output becomes noisy or misleading.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
