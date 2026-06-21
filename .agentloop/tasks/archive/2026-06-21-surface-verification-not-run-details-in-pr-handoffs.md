# Surface verification not-run details in PR handoffs

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
PR handoff output says to check the verification report for skipped commands even when the verification report has a structured Not Run section. Reviewers should not have to open another file to see which commands were intentionally not run.

## Desired Outcome
prepare-pr and deterministic PR summaries render concrete Not Run commands from the verification report, with a clear fallback when nothing was skipped.

## Constraints
- No release, tag, publish, version bump, dependency change, or verification command behavior change.
- Do not parse arbitrary prose beyond the existing verification report Markdown sections.

## Non-Goals
- No readiness scoring change.
- No verification report format change.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/prepare-pr.ts
- src/core/pr-summary.ts
- tests/prepare-pr.test.ts
- tests/pr-summary.test.ts
- docs/pr-summaries.md
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- prepare-pr lists Not Run commands from the verification report instead of generic skipped-command copy.
- prepare-pr reports a clear no-skipped-commands fallback when the report says nothing was skipped.
- generatePrSummary uses the same Not Run parsing for handoff summaries.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts tests/pr-summary.test.ts
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
- Changing reviewer copy can affect handoff expectations; keep report parsing section-bounded and Markdown-safe.
- Pre-existing dirty non-evidence files before task creation: 79 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous generic Not Run fallback in prepare-pr and PR summaries.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
