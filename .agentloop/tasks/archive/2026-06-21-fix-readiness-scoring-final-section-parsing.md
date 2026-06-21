# Fix readiness scoring final-section parsing

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
readiness-score still uses a local Markdown section regex with an invalid end-of-string pattern, so a task section at the end of the file can be missed.

## Desired Outcome
Readiness scoring uses the shared section parser, preserves placeholder filtering for list items, and correctly scores tasks whose Rollback Notes or Risk Notes are final sections.

## Constraints
- Do not release, tag, publish, bump versions, or change dependencies.
- Keep the change focused on readiness scoring parser behavior and tests.
- Preserve current task-clarity scoring rules and placeholder filtering.

## Non-Goals
- No scoring weights or readiness dimension changes.
- No ship, prepare-pr, or review-context behavior changes beyond shared parser consistency.
- No new task contract format.

## Assumptions
- The shared markdown-sections parser already handles final sections without printing task prose.

## Likely Files or Areas
- src/core/readiness-score.ts
- tests/readiness-score.test.ts
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A task whose Rollback Notes section is the final Markdown section still receives rollback/risk task-clarity credit.
- A task whose final Risk Notes section is present still contributes to risk-sensitive-file readiness.
- The none recorded placeholder remains ignored for readiness list checks.
- No readiness weights or public score labels change.

## Verification Commands
- npm test -- tests/readiness-score.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing parser behavior can affect scores for unusual task Markdown; tests must pin the intended final-section cases.
- Pre-existing dirty non-evidence files before task creation: 65 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the local parser in readiness-score.ts and revert related tests/docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
