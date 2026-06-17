# Surface latest archived task in artifacts inventory

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
After a verified task is marked done and archived, agentloop artifacts can print Latest task: not found even though check-gates and maintainer-check can still find the archived task evidence.

## Desired Outcome
agentloop artifacts surfaces the latest archived done task as review evidence when no live non-placeholder task qualifies, without counting deferred release tasks or AgentFlight placeholders as active work.

## Constraints
- Read-only inventory behavior only.
- Do not change task state, archive behavior, gate semantics, release readiness, publishing, package metadata, dependencies, or protected release files.
- Keep AgentFlight placeholder tasks and deferred release-channel tasks out of the latest-task fallback.

## Non-Goals
- Do not add cleanup, deletion, retention, or migration behavior for archived tasks.
- Do not change `check-gates`, `maintainer-check`, or task lifecycle semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- src/cli/commands/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- action.yml
- .github/workflows

## Acceptance Criteria
- `agentloop artifacts` human output shows the latest archived done task when no active/open task qualifies.
- `agentloop artifacts --json` includes the archived task in `tasks.latest` with enough status/path/source information for scripts.
- AgentFlight placeholders and deferred release-channel tasks remain excluded from the latest task fallback.

## Verification Commands
- npm test -- tests/artifacts.test.ts tests/cli-docs-drift.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the artifact inventory selection changes and the focused artifacts tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
