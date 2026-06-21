# Use engineering-session wording in create-task guidance

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
Live guidance and create-task help still use older coding-centered session wording, which conflicts with the product direction toward agentic engineering and agent-assisted reviewability language.

## Desired Outcome
Root guidance, generated AGENTLOOP guidance, and create-task help use agentic engineering session wording, with tests or scans proving the old phrase is gone from live surfaces.

## Constraints
- Do not change command behavior, JSON output, task contract format, release behavior, dependencies, package version, tags, or publishing.

## Non-Goals
- Do not rewrite unrelated agent guidance or historical evidence.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- AGENTLOOP.md
- src/templates/root/AGENTLOOP.md
- src/cli/commands/create-task.ts
- tests

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- No live public/source surface contains the old coding-centered session phrase.
- create-task help uses agentic engineering session wording.
- Existing task creation behavior and task-contract content remain unchanged.

## Verification Commands
- npm test -- tests/create-task.test.ts tests/cli-docs-drift.test.ts
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
- Pre-existing dirty non-evidence files before task creation: 139 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the wording updates and tests/scans; no data migration or artifact cleanup required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
