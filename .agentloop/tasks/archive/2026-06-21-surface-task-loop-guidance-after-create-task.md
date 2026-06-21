# Surface task loop guidance after create-task

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Users can create typed task contracts, but the command does not point them to the matching .agentloop/loops/<type>.md guidance after activation. This makes task types less actionable, especially the new research workflow.

## Desired Outcome
create-task human and JSON output include a bounded loop guidance hint when a matching loop file exists, and docs/tests cover the behavior without changing task contract contents or release behavior.

## Constraints
- Do not add dependencies, version bumps, release behavior, tags, publishing, network calls, or broad scans.
- Only mention a loop guidance file when the matching repo-local .agentloop/loops/<type>.md file exists.
- Do not change generated task Markdown schema unless a test proves it is necessary.

## Non-Goals
- Do not build a workflow runner, open files automatically, or enforce task-type-specific gates.
- Do not add guidance for task types that have no loop template.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- docs/cli-reference.md
- docs/task-contracts.md
- src/templates/tasks/README.md
- CHANGELOG.md
- DECISIONS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human create-task output prints a next-step loop guidance line for a task type with a matching loop template, such as research.
- JSON create-task output includes structured loop guidance for matching loop templates and omits it when the loop file is absent.
- The task contract Markdown remains unchanged except for user-requested contract fields.

## Verification Commands
- npm test -- tests/create-task.test.ts
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
- Output shape changes can affect scripts that parse create-task JSON, so add fields additively and keep existing task/activeTask/warnings keys stable.
- Pre-existing dirty non-evidence files before task creation: 149 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/product-panel.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the loop guidance helper/output/tests/docs; task files created before rollback remain valid.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
