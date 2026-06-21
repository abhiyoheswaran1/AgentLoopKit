# Use untracked-aware diff stats in handoffs and reports

- Created date: 2026-06-20
- Task type: bugfix
- Status: done

## Problem Statement
After ship learned to append untracked non-evidence files to diff stats, deterministic handoff summaries and HTML reports still use raw git diff --stat and can omit new files from their Diff Stats sections.

## Desired Outcome
Shared diff-stat handling appends compact untracked non-evidence markers across ship, summarize/handoff, and HTML report surfaces without changing changed-file JSON or reading file contents.

## Constraints
- Do not synthesize full diffs or read untracked file contents.
- Keep AgentLoop evidence compaction unchanged.
- Keep JSON changed-file arrays unchanged.

## Non-Goals
- No prepare-pr body redesign.
- No release or publishing work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/git.ts
- src/core/ship.ts
- src/core/pr-summary.ts
- src/core/html-report.ts
- tests/pr-summary.test.ts
- tests/html-report.test.ts
- tests/ship.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- summarize/handoff diff stats include untracked non-evidence markers.
- HTML report diff stats include untracked non-evidence markers.
- Ship continues to include untracked markers through the shared helper.

## Verification Commands
- npm test -- tests/pr-summary.test.ts tests/html-report.test.ts tests/ship.test.ts
- npm run typecheck

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches multiple reviewer-facing evidence surfaces; preserve JSON and avoid file-content reads.

## Rollback Notes
Revert the shared diff-stat helper, call-site changes, tests, docs, and evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
