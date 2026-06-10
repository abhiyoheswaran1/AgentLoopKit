# Improve verification output excerpts

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement
Long verification output currently keeps only the beginning of stdout/stderr. When a command fails after a large log, the report can drop the final error lines reviewers need most.

## Desired Outcome
Verification reports keep concise output while preserving both the initial command context and the final failure lines.

## Constraints
- Keep command output honest. Do not hide failures or rewrite command output.
- Do not add dependencies.
- Keep JSON output shape stable unless a test proves a new field is needed.
- Do not execute verification commands except through explicit tests or `agentloop verify`.

## Non-Goals
- No HTML report generation.
- No AI-generated summaries.
- No streaming verification UI.

## Assumptions
- Reviewers usually need the top of the command output for setup context and the bottom for the root error.
- Character-based excerpts are enough for this MVP.

## Likely Files or Areas
- `src/core/verification.ts`
- `tests/verification.test.ts`
- `docs/verification-reports.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- Package publish workflow.
- Agent install behavior.
- Generated visual assets.

## Acceptance Criteria
- Long command output in markdown reports includes the beginning and the ending output.
- Truncated reports include a clear truncation marker with the original output length.
- Failed commands still report non-zero exit codes and overall failure.
- Existing verification behavior remains unchanged for short output.

## Verification Commands
- `npx pnpm@10.12.1 test tests/verification.test.ts`
- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the verification excerpt helper and its tests. Reports will return to first-only truncation.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
