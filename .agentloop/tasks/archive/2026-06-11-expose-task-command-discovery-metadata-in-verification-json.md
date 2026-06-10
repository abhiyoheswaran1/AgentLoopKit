# Expose task command discovery metadata in verification JSON

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop verify --json exposes executed commands, but when --task-commands is requested and no task commands are found, JSON consumers must parse Markdown to understand what happened.

## Desired Outcome
Verification JSON includes structured task-command discovery metadata showing whether task commands were requested and how many runnable commands were found.

## Constraints
- Do not change command execution behavior.
- Do not print task Markdown content in JSON metadata.
- Do not bump version or publish anything.

## Non-Goals
- Do not add policy evaluation or command approval prompts.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- tests/verification.test.ts
- docs/verification-reports.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- verify --json includes taskCommands.requested and taskCommands.foundCount.
- When --task-commands is absent, requested is false and foundCount is 0.
- When --task-commands is present and no runnable commands are found, requested is true and foundCount is 0.
- When task commands run, requested is true and foundCount matches the task command count.

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
Revert verification JSON metadata, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
