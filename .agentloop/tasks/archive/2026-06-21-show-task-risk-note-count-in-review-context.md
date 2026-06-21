# Show task risk-note count in review context

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
review-context gives agents one read-only snapshot, but it does not say whether the active task has Risk Notes recorded, so agents must open the task file just to know whether reviewer risk context exists.

## Desired Outcome
review-context JSON and Markdown include a task risk-note count for the active task without rendering task Markdown bodies or changing gate/scoring behavior.

## Constraints
- Do not release, tag, publish, bump versions, or change dependencies.
- Keep review-context read-only and avoid outputting full task Markdown content.
- Do not change ship, prepare-pr, gates, or readiness scoring behavior.

## Non-Goals
- No task Risk Notes text in review-context output.
- No new risk scoring or policy enforcement.
- No broad task scans beyond the active task contract.

## Assumptions
- The active task contract can be read by path when review-context needs active-task metadata.

## Likely Files or Areas
- src/core/review-context.ts
- tests/review-context.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- review-context --json includes active task risk-note count without including the Risk Notes prose.
- Human review-context output includes a concise task risk-note count when an active task exists.
- No-active-task review-context output remains compact and reports no active task risk count.
- Safety copy remains accurate: no full Markdown artifact bodies are included.

## Verification Commands
- npm test -- tests/review-context.test.ts
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
- Adding active-task reads to review-context could expose task prose if rendered accidentally; tests must assert prose is absent.
- Pre-existing dirty non-evidence files before task creation: 62 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove task risk-note count from review-context JSON/Markdown and revert docs/tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
