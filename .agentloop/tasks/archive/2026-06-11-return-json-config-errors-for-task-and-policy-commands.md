# Return JSON config errors for task and policy commands

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Some JSON-capable commands still emit human-only stderr when agentloop.config.json is invalid, which makes agent and CI consumers handle inconsistent failure shapes.

## Desired Outcome
create-task, task subcommands, and policy subcommands return parseable CONFIG_ERROR JSON when --json is requested and config loading fails.

## Constraints
- Keep human output unchanged for non-json calls
- Do not run verification commands as part of these commands
- Do not change package version or release metadata

## Non-Goals
- Redesign all CLI error handling
- Change doctor init npm-status install-agent list-templates version or completion behavior

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- src/cli/commands/task.ts
- src/cli/commands/policy.ts
- src/cli/json-errors.ts
- tests/create-task.test.ts
- tests/task-state.test.ts
- tests/policy.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task --json returns CONFIG_ERROR JSON for invalid config without creating a task
- task JSON subcommands return CONFIG_ERROR JSON for invalid config without modifying task files or state
- policy JSON subcommands return CONFIG_ERROR JSON for invalid config
- non-json behavior continues through the global human error path

## Verification Commands
- npm test -- tests/create-task.test.ts tests/task-state.test.ts tests/policy.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the command imports and helper calls, plus the related tests and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
