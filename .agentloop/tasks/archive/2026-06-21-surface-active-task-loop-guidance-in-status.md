# Surface active task loop guidance in status

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
create-task can now point at a matching loop file once, but agents often re-enter through status or next and lose the task-type loop hint.

## Desired Outcome
status and next show the active or latest-open task's matching .agentloop/loops/<type>.md guidance when that repo-local file exists, with JSON fields added additively and no command execution.

## Constraints
- Do not add dependencies, release behavior, version bumps, tags, publishing, network calls, or broad loop-directory scans.
- Only check the one .agentloop/loops/<type>.md file implied by the selected active or latest-open task type.
- Keep existing next-action routing unchanged.

## Non-Goals
- Do not run loop guidance, enforce task-type workflows, or add hints for missing loop files.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- src/cli/commands/next.ts
- tests/status.test.ts
- tests/next.test.ts
- docs/status.md
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human status output shows a Loop guidance line for an active task whose type has an existing loop file.
- Human next output shows the same bounded loop guidance when it is relevant to the selected active or latest-open task.
- JSON status/next output expose loop guidance additively without changing next-action selection.

## Verification Commands
- npm test -- tests/status.test.ts tests/next.test.ts
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
- Status and next output is used by agents and scripts, so keep human additions concise and JSON fields additive.
- Pre-existing dirty non-evidence files before task creation: 149 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/product-panel.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the status/next loop guidance fields and tests; task contracts and loop files remain valid.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
