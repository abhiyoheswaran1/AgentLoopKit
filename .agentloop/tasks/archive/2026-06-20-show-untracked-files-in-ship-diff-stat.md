# Show untracked files in ship diff stat

- Created date: 2026-06-20
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed ship reports list untracked files under Changed Files, but the Diff Stat section comes from git diff --stat and can omit new non-evidence files entirely.

## Desired Outcome
Ship reports keep the normal git diff stat and append compact untracked-file entries so reviewers can see new files were part of the review surface.

## Constraints
- Do not synthesize full file diffs or read untracked file contents.
- Keep JSON changedFiles unchanged.
- Keep AgentLoop evidence grouping behavior unchanged.

## Non-Goals
- No prepare-pr changed-file redesign.
- No release or publishing work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/git.ts
- src/core/ship.ts
- tests/ship.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Ship report Markdown diff stat includes untracked non-evidence files with a compact marker.
- Tracked git diff --stat output remains present when tracked files changed.
- JSON changedFiles and run changed-files evidence remain unchanged.

## Verification Commands
- npm test -- tests/ship.test.ts
- npm run typecheck

## Post-Verification Gates
- agentloop ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches reviewer-facing ship evidence; preserve changed-file semantics and avoid reading untracked file contents.

## Rollback Notes
Revert the ship diff-stat helper, tests, and docs/evidence updates for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
