# Run task verification commands with explicit opt-in

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop verify --task includes task metadata but does not provide a safe way to run the task contract's Verification Commands list, so agents must manually duplicate task-specific checks with --command.

## Desired Outcome
agentloop verify can run task contract verification commands when the caller explicitly opts in, while the default --task behavior remains metadata-only for safety.

## Constraints
- Do not execute task Markdown commands unless --task-commands is present.
- Keep command output transparent in verification reports.
- Do not bump version or publish anything.

## Non-Goals
- Do not add a policy engine or command approval prompt.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- src/cli/commands/verify.ts
- tests/verification.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop verify --task <path> keeps the current safe default and does not execute task Markdown commands.
- agentloop verify --task <path> --task-commands runs commands listed under the task contract's Verification Commands section.
- Invalid or outside task paths are not read for task commands.

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/verification.test.ts
- npx --yes pnpm@10.12.1 typecheck

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the verify flag, task-command parsing, docs, and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
