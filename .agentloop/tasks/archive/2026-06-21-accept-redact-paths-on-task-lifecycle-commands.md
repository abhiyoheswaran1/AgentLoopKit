# Accept redact-paths on task lifecycle commands

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed task lifecycle update commands reject --redact-paths even though AgentLoopKit encourages redacted output before sharing command logs, and those commands print task paths that users may run with absolute inputs.

## Desired Outcome
task set, status, done, archive, and clear accept --redact-paths consistently, redact local absolute roots in human and JSON output where those commands print paths, and preserve task mutation behavior.

## Constraints
- Do not change task state semantics, task contract format, archive movement rules, status values, release behavior, dependencies, package version, tags, or publishing.

## Non-Goals
- Do not add global Commander options or redesign task command output.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts
- README.md
- docs/cli-reference.md
- docs/task-contracts.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- task set/status/done/archive/clear help shows --redact-paths.
- task status with --redact-paths no longer fails and still updates only the status line.
- absolute local task paths printed by task lifecycle commands are redacted in human and JSON output when requested.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Mutating task lifecycle commands must continue to write the same files and only redact display output.
- Pre-existing dirty non-evidence files before task creation: 139 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the task command option, redaction helper, tests, and docs; any task files changed during tests are temporary fixtures only.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
