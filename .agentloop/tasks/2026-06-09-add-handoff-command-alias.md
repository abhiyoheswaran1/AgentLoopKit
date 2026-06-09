# Add handoff command alias

- Created date: 2026-06-09
- Task type: feature
- Status: completed

## Problem Statement
Users have to remember that the final handoff command is summarize --write, which is less obvious than the loop step name.

## Desired Outcome
Add a deterministic agentloop handoff command that writes the same reviewer summary as summarize --write by default.

## Constraints
- Reuse the existing summary core
- Keep summarize behavior unchanged
- No new dependencies

## Non-Goals
- No LLM summaries
- No static dashboard

## Assumptions
- `handoff` should write by default because handoff is the final loop artifact.
- `summarize` should remain useful as a preview command.

## Likely Files or Areas
- `src/cli/commands/summarize.ts`
- `src/cli/index.ts`
- `src/core/status.ts`
- `tests/handoff.test.ts`
- `tests/status.test.ts`
- README and docs that mention handoff generation

## Files or Areas Not to Touch
- No package install scripts
- No network, telemetry, or LLM integration
- No unrelated template rewrites

## Acceptance Criteria
- agentloop handoff writes a file under .agentloop/handoffs
- agentloop handoff --json returns machine-readable output including outPath
- agentloop summarize still does not write unless --write is passed
- agentloop status suggests agentloop handoff when task and passing verification evidence exist

## Verification Commands
- npx pnpm@10.12.1 test tests/handoff.test.ts tests/status.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
