# Show failed verification next action in status

- Created date: 2026-06-09
- Task type: bugfix
- Status: completed

## Problem Statement
`agentloop status` treats any latest verification report as usable evidence. If the latest report failed and the working tree is dirty, the command can suggest `agentloop summarize --write`, which points users toward handoff before fixing verification.

## Desired Outcome
When the latest verification report has overall status `fail`, `agentloop status` should make the failure visible and suggest fixing/rerunning verification.

## Constraints
- Keep `status` read-only.
- Do not execute verification commands from `status`.
- Keep JSON output deterministic.
- Do not add dependencies.

## Non-Goals
- No task status lifecycle.
- No semantic error diagnosis.
- No AI failure summary.

## Assumptions
- The latest verification report's `Overall status: fail` line is enough to choose the safer next action.

## Likely Files or Areas
- `src/core/status.ts`
- `tests/status.test.ts`
- `docs/status.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- Verification command execution.
- npm publish workflow.
- Agent installation behavior.

## Acceptance Criteria
- `status --json` returns `agentloop verify` as the next command when the latest report failed.
- Markdown output shows the failed report status and the safer next action.
- Existing pass/no-task behavior remains unchanged.
- Tests cover the failed-report path.

## Verification Commands
- `npx pnpm@10.12.1 test tests/status.test.ts`
- `npx pnpm@10.12.1 lint`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the `status` next-action branch and its test. `status` will return to treating any latest report as sufficient evidence.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
