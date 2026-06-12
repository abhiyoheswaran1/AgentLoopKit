# Group prepare-pr changed files by review area

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
prepare-pr produces a flat changed-file list even though reviewer handoffs are easier to scan when files are grouped by source, tests, docs, AgentLoop evidence, config, CI, risk-sensitive, and other areas.

## Desired Outcome
prepare-pr PR bodies group changed files by area using the same deterministic classification style as PR summaries.

## Constraints
- Keep output deterministic and local-only.
- Do not add GitHub API calls, tokens, AI calls, telemetry, or network behavior.
- Avoid broad PR body redesign.

## Non-Goals
- Do not change git status parsing or readiness scoring.
- Do not hide changed files from JSON output.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/prepare-pr.ts
- src/core/pr-summary.ts
- tests/prepare-pr.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- prepare-pr PR body groups changed files by review area.
- Grouped output is Markdown-safe for file paths.
- Existing changedFiles JSON remains available.
- Tests cover at least source, test, docs, and AgentLoop evidence groups.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- PR body formatting changes can affect copy-paste workflows.

## Rollback Notes
Revert the change-area renderer and return prepare-pr to the flat changed-file list.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
