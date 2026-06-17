# Bound AgentFlight placeholder task list output

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Long autonomous sessions can preserve many exact AgentFlight placeholder task contracts, and human agentloop task list output prints every placeholder after the real task contracts, making the next actionable work harder to scan.

## Desired Outcome
Human task list output keeps ordinary task contracts complete, shows only a bounded AgentFlight placeholder preview with an explicit hidden count, and task list --json still returns the full flat task array for scripts and review tooling.

## Constraints
- Keep task list read-only and do not delete, archive, or mutate placeholder files.
- Do not change task inventory classification, fallback task selection, status, next, artifacts, review-context, or JSON task list shape.
- Do not touch release, publishing, package metadata, dependencies, or registry workflows.

## Non-Goals
- No placeholder cleanup automation or retention policy.
- No AgentFlight format changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts
- docs/cli-reference.md
- docs/status.md

## Files or Areas Not to Touch
- Package metadata, release notes, tags, publishing workflows, registry metadata, dependency manifests, and lockfiles.

## Acceptance Criteria
- Human agentloop task list output caps AgentFlight placeholder rows after ordinary task contracts and reports how many placeholders are hidden.
- agentloop task list --json still includes every AgentFlight placeholder in the flat tasks array.
- Existing one-placeholder and ordinary task list behavior remains clear.
- Public task/status CLI docs describe the bounded human placeholder preview and complete JSON output.

## Verification Commands
- npm test -- tests/task-state.test.ts -t "AgentFlight placeholders"
- npm test -- tests/task-state.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Human output changes can break tests or users expecting every AgentFlight placeholder in terminal output; JSON remains complete as the script-safe path.

## Rollback Notes
Revert the task list printer change, the placeholder-preview tests, and the docs updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
