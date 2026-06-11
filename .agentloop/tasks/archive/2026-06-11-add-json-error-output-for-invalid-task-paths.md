# Add JSON error output for invalid task paths

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop task show/set/status/archive have JSON success output, but invalid task paths still use the global human error path. Agents cannot parse whether the path was missing, outside the task directory, or not Markdown.

## Desired Outcome
Task subcommands with a task path return structured JSON errors for missing, outside-root, and non-Markdown paths when --json is requested.

## Constraints
- Keep default non-JSON error output human-readable.
- Do not change task path safety rules or archive behavior.
- Do not change package version or cut a release.

## Non-Goals
- Do not redesign task state management or add task search.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts
- README.md
- docs/task-contracts.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- task show missing --json prints valid JSON to stdout and exits non-zero.
- task set outside-path --json prints valid JSON to stdout and exits non-zero.
- task archive non-markdown --json prints valid JSON to stdout and exits non-zero.
- Default non-JSON task path errors remain human-readable on stderr.

## Verification Commands
- npm test -- task-state
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the task-state path error type, task command JSON handling, tests, README, task-contract docs, changelog, and AgentLoop evidence files from this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
