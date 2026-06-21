# Label previous verification evidence in no-active next output

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
After a task is archived, agentloop next can still show a passing Latest verification line even though no active or open task exists. Status now labels this as previous evidence, but next still uses the current-work label in the same state.

## Desired Outcome
Human next output labels latest verification as previous evidence when no active or open task exists, matching status, while JSON fields and next-action behavior remain unchanged.

## Constraints
- Do not change verification selection, task selection, latest-report discovery, JSON output shape, next-action ordering, release behavior, dependencies, tags, publishing, or package versions.

## Non-Goals
- Do not hide the latest verification report or infer task ownership beyond existing active/latest task state.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/next.test.ts
- docs/status.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human next output keeps Latest verification when an active or open task exists.
- Human next output uses a previous-evidence label when no active or open task exists.
- Next JSON remains unchanged.

## Verification Commands
- npm test -- tests/next.test.ts
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
- Reviewer-facing next-action copy only; keep automation fields and routing stable.
- Pre-existing dirty non-evidence files before task creation: 102 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous human next label and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
