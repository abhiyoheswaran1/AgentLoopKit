# Show dirty file examples in create-task next guidance

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
When no active or open task exists and status/next recommend agentloop create-task, the reason reports only the count of existing dirty non-evidence files. Agents still need bounded examples before deciding whether those files belong to the next task.

## Desired Outcome
Human and JSON next-action reasons include a bounded list of dirty non-evidence file examples when create-task guidance warns about pre-existing dirty files, without reading file contents or changing the recommended command.

## Constraints
- Do not change task selection, next-action command selection, verification selection, dirty-file collection, file-content reads, release behavior, dependencies, tags, publishing, or package versions.

## Non-Goals
- Do not block task creation, clean dirty files, expand the full changed-file list in human output, or infer ownership of dirty files.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts
- tests/next.test.ts
- docs/status.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Create-task next-action reasons keep the existing dirty non-evidence count.
- When dirty non-evidence files exist, create-task next-action reasons include bounded repo-relative examples.
- AgentLoop evidence-only dirty files do not add examples or dirty-work guidance.
- The recommended next-action command remains unchanged.

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
- Next-action reason copy changes in human and JSON output; keep command routing and dirty-file collection stable.
- Pre-existing dirty non-evidence files before task creation: 104 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove dirty example rendering from next-action reasons and restore tests/docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
