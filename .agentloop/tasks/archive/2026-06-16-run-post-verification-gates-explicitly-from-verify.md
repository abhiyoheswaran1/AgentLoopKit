# Run post-verification gates explicitly from verify

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement

Task contracts record Post-Verification Gates, but users must manually run them after verify writes evidence. Dogfooding showed this sequencing creates friction for strict gates such as dogfood:strict, ship, prepare-pr, check-gates, and maintainer-check.

## Desired Outcome

Users can opt in to running task post-verification gates after the verification report is written, while default verify behavior remains unchanged and safe.

## Constraints

- Preserve default `agentloop verify` and `agentloop verify --task-commands` behavior.
- Keep post-verification gate execution explicit and task-scoped.
- Do not add hidden network calls, token reads, GitHub posting, or release behavior.

## Non-Goals

- Do not run post-verification gates without an explicit flag
- Do not move commands between task sections automatically
- Do not add network calls, tokens, GitHub posting, or release behavior

## Assumptions

- Users can review task contract commands before passing execution flags.
- Post-verification gates may need the verification report to exist before they run.
- JSON consumers can inspect an added `postVerificationGates` result object without parsing Markdown.

## Likely Files or Areas

- `src/core/verification.ts`
- `src/cli/commands/verify.ts`
- `tests/verification.test.ts`
- `docs/verification-reports.md`
- `docs/cli-reference.md`
- Generated harness templates that describe verification sequencing

## Files or Areas Not to Touch

- Release workflows
- npm publishing metadata
- GitHub API or token handling
- MCP server behavior

## Acceptance Criteria

- verify does not run post-verification gates by default
- an explicit verify flag runs task post-verification gates after the report is written
- post-verification gate results are visible in human and JSON output
- a failing post-verification gate fails the verify command when the flag is used
- docs explain the sequencing and safety boundary

## Verification Commands

- npm test -- tests/verification.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck

## Post-Verification Gates

- npm run dogfood:strict

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the `verify` option, post-verification gate parsing/execution path, related tests, and documentation changes. Existing task contracts with `Post-Verification Gates` remain valid because the section already existed before this change.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
