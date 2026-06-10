# Add local CI summary command

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit verification reports can record CI context, but teams do not have a direct local command that summarizes CI provenance, current AgentLoop evidence, and gate status for PR logs or CI artifacts.

## Desired Outcome
Add a read-only ci-summary command with Markdown and JSON output, optional file writing, allowlisted CI metadata only, and docs for GitHub Actions usage.

## Constraints
- No network calls, GitHub API calls, telemetry, token reads, or environment dumps.
- Do not execute verification commands from ci-summary.
- Written CI summaries must not replace latest verification report detection.

## Non-Goals
- Do not add CI provider API imports or hosted dashboards.
- Do not automate GitHub comments.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/ci-summary.ts
- src/cli/commands/ci-summary.ts
- tests/ci-summary.test.ts
- src/core/artifacts.ts
- docs/github-actions.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop ci-summary prints Markdown with CI provider, run URL when available, AgentLoop evidence, gate status, and next action.
- agentloop ci-summary --json returns machine-readable CI context and evidence.
- agentloop ci-summary --write writes a Markdown artifact under .agentloop/reports.
- check-gates/status/report/badge continue to use verification reports rather than ci-summary artifacts.

## Verification Commands
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
Remove ci-summary command/core/docs/tests and any generated ci-summary artifacts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
