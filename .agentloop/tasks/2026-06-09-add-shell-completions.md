# Add shell completions

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Users must type or remember AgentLoopKit commands manually. Common shell completion scripts would reduce friction for repeat CLI users without adding runtime dependencies.

## Desired Outcome

Add a deterministic local command that prints shell completion scripts for bash, zsh, and fish.

## Constraints

- No new runtime dependency.
- Completion scripts must be static, transparent, and local-only.
- Do not mutate shell profile files automatically.

## Non-Goals

- No installer that edits user dotfiles.
- No telemetry or shell command execution during completion generation.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/cli/commands/completion.ts
- src/core/completions.ts
- tests/completion.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch

- package.json

## Acceptance Criteria

- agentloop completion zsh prints a usable zsh completion script.
- agentloop completion bash prints a usable bash completion script.
- agentloop completion fish prints a usable fish completion script.
- Unsupported shells fail with a clear error.

## Verification Commands

- npx pnpm@10.12.1 test tests/completion.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the completion command, docs, tests, and generated guidance.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
