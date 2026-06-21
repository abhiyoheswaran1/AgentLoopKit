# Label archived task evidence in check-gates

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
After normal task cleanup, check-gates may use the latest archived task as valid review evidence, but human output still labels that gate as Task contract. In no-active states, that can make archived evidence look like an active or current task contract.

## Desired Outcome
Human check-gates output identifies archived task evidence when the task gate path points under the task archive, while preserving the existing gate decision, command routing, and JSON gate fields.

## Constraints
- Do not change gate pass/warn/fail semantics, strict-mode exit behavior, task evidence resolution, verification selection, next-action command selection, release behavior, dependencies, tags, publishing, or package versions.
- Keep the archived-task evidence fallback valid for ship, check-gates, and maintainer review flows.

## Non-Goals
- Do not make archived tasks active again or require users to reopen a completed task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- tests/check-gates.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates human output labels an archived task gate as archived task evidence when the task path is under .agentloop/tasks/archive/.
- check-gates JSON keeps the existing task-contract gate id/name/message/path shape for compatibility.
- Active or open task gates still render as Task contract in human output.

## Verification Commands
- npm test -- tests/check-gates.test.ts
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
- Human-output labeling only; keep gate decisions, strict behavior, JSON fields, and archived evidence fallback stable.
- Pre-existing dirty non-evidence files before task creation: 107 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous check-gates human gate label and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
