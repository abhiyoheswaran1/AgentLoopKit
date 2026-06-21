# Show dirty file examples in check-gates create-task guidance

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
When check-gates recommends agentloop create-task after archived or completed evidence covers the current dirty files, it reports only dirty counts. Status and next already show bounded dirty non-evidence examples before task creation, so agents using check-gates still lack the same scope cue.

## Desired Outcome
check-gates next-action reasons include up to five repo-relative dirty non-evidence examples when recommending agentloop create-task over existing dirty non-evidence files, while keeping the recommended command and gate decisions unchanged.

## Constraints
- Do not change gate pass/warn/fail semantics, strict-mode exit behavior, task evidence resolution, verification selection, next-action command selection, release behavior, dependencies, tags, publishing, or package versions.
- Do not read dirty file contents or scan beyond the Git status data check-gates already collects.

## Non-Goals
- Do not clean, archive, delete, or auto-assign dirty files to a task.

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
- check-gates human and JSON nextAction.reason include bounded dirty non-evidence examples when the command is agentloop create-task and such files exist.
- AgentLoop evidence-only dirty files do not trigger dirty non-evidence examples.
- The check-gates recommended command and gate statuses remain unchanged.

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
- Reason-copy only; preserve command routing, gate decisions, JSON field shape, file-content safety, release, tag, publish, and version behavior.
- Pre-existing dirty non-evidence files before task creation: 110 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous check-gates create-task reason and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
