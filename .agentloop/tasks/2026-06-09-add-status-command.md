# Add status command

- Created date: 2026-06-09
- Task type: feature
- Status: verified

## Problem Statement

AgentLoopKit can create tasks, run verification, and summarize handoffs, but users do not have one command that answers "what is the current agentic work state?" This makes first-run onboarding and long agent sessions less ergonomic.

## Desired Outcome

Add `agentloop status` with Markdown and JSON output. It should show the project, git branch, working tree state, active/latest task contract, latest verification report, configured commands, and one deterministic next action.

## Constraints

- Do not run verification commands from `status`.
- Do not call an LLM or external API.
- Do not read env file contents.
- Keep output deterministic and CI-friendly.
- Preserve existing command behavior.

## Non-Goals

- Do not build a dashboard.
- Do not add watch mode.
- Do not add cloud history or telemetry.

## Assumptions

- "Active task" means the latest task Markdown file in `.agentloop/tasks/`, excluding `README.md`.
- "Latest report" means the latest Markdown file in `.agentloop/reports/`, excluding `README.md`.
- The first version can infer status from file names and Markdown headings rather than maintaining a task database.

## Likely Files or Areas

- `src/core/status.ts`
- `src/cli/commands/status.ts`
- `src/cli/index.ts`
- `tests/status.test.ts`
- `README.md`
- docs and product-panel records

## Files or Areas Not to Touch

- Verification command execution internals unless needed for status parsing.
- Template generation behavior.
- npm auth or release credentials.

## Acceptance Criteria

- `agentloop status` prints a human-readable Markdown status.
- `agentloop status --json` prints machine-readable status.
- Output includes active/latest task, latest verification report, dirty file count, configured command count, and next action.
- The command exits 0 when AgentLoopKit config is valid.
- The version command reports the current `package.json` version.
- Vitest covers status and version behavior.

## Verification Commands

- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 lint`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the status command commit. Existing AgentLoopKit commands and generated files continue to work because this feature is additive.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
