# Show inherited dirty-work baseline in ship reports

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Long autonomous sessions can start each small task with an existing dirty non-evidence baseline. create-task records that baseline in Risk Notes, but ship reports still surface broad scope mostly as a total changed-file warning, forcing reviewers to hunt for the inherited baseline later in the report.

## Desired Outcome
Human ship reports show a concise inherited dirty-work baseline summary when the generated create-task risk note is present, using already-collected changed-file data and preserving readiness scoring and JSON contracts.

## Constraints
- Do not change readiness scores, ship JSON shape, gate decisions, create-task behavior, run-ledger schema, release behavior, dependencies, tags, publishing, or package versions.
- Do not add broad scans; use task Risk Notes and the changedFiles already collected by ship.

## Non-Goals
- Do not implement task-diff baselining or file-level current-task attribution.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/ship.ts
- tests/ship.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Ship Markdown includes an inherited dirty-work section when a task Risk Notes entry records pre-existing dirty non-evidence file count.
- Ship Markdown omits the section when that generated risk note is absent, and ship JSON/readiness scoring stay unchanged.

## Verification Commands
- npm test -- tests/ship.test.ts
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
- Pre-existing dirty non-evidence files before task creation: 113 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the ship renderer/test/docs changes; no data migration or artifact cleanup required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
