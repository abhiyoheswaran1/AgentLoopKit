# Add next action command

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit status includes a next action, but agents and scripts need a smaller command that prints only the next recommended action.

## Desired Outcome
agentloop next prints the next local AgentLoop command and reason, with JSON support for agents and CI.

## Constraints
- Reuse existing status next-action logic instead of adding a second decision engine.
- Do not run verification commands, mutate files, call networks, or inspect secrets.

## Non-Goals
- Do not build a scheduler, project manager, AI planner, or cloud workflow.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/next.ts
- src/cli/index.ts
- src/core/completions.ts
- tests/next.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop next prints the next command and reason from local repo evidence.
- agentloop next --json returns command, reason, task, verification, and dirty state context.
- agentloop next does not mutate .agentloop/state.json or run verification commands.

## Verification Commands
- npx pnpm@10.12.1 test tests/next.test.ts tests/completion.test.ts
- npx pnpm@10.12.1 test
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the next command registration, tests, docs, and completion entry.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
