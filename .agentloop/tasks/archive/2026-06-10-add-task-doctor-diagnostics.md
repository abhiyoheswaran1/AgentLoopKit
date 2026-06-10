# Add task doctor diagnostics

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement

Agents and maintainers can leave terminal or legacy task contracts in .agentloop/tasks, which makes task lists noisy and can confuse fallback task selection.

## Desired Outcome

agentloop task doctor reports task-folder hygiene issues in human and JSON output without mutating files.

## Constraints

- Read-only diagnostic command; do not archive, edit, or delete task files.
- Only inspect the configured tasks directory and existing task metadata.
- Keep output concise and deterministic for agents.

## Non-Goals

- No automatic archive command.
- No cloud service, telemetry, or LLM-based analysis.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/task-state.ts
- src/cli/commands/task.ts
- src/core/completions.ts
- tests/task-state.test.ts
- README.md
- docs/task-contracts.md
- docs/status.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Detects terminal task contracts left in .agentloop/tasks and recommends agentloop task archive <path>.
- Detects missing Status lines as unknown task statuses.
- Detects legacy completed and verified statuses as unsupported legacy statuses.
- JSON output includes overallStatus, counts, and diagnostics with stable ids, severities, paths, messages, and recommendations.
- Human output gives a concise task doctor report and next commands.
- Archived task contracts are ignored.

## Verification Commands

- npx vitest run tests/task-state.test.ts tests/completion.test.ts
- pnpm test
- pnpm typecheck
- pnpm build
- pnpm check:links
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Remove task doctor command, tests, and docs updates.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
