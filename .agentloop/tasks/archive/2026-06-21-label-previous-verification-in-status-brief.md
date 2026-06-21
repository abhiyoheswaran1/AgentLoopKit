# Label previous verification in status brief

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
After task archive, status and next Markdown now label latest verification as previous evidence, but status --brief still prints verification=pass when no active or open task exists. The compact line can still imply current-task proof.

## Desired Outcome
Compact human status output marks verification as previous evidence when no active or open task exists, while active/open task brief output and structured status fields remain unchanged.

## Constraints
- Do not change task selection, next-action command selection, verification selection, JSON field shape, release behavior, dependencies, tags, publishing, or package versions.

## Non-Goals
- Do not hide the latest verification report or change the full Markdown labels already implemented.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts
- docs/status.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- status --brief keeps verification=pass when an active or latest open task exists.
- status --brief uses a previous-evidence verification label when no active or open task exists.
- status --json fields remain unchanged aside from the existing human brief string.

## Verification Commands
- npm test -- tests/status.test.ts
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
- Compact human status copy changes; keep structured fields, command routing, and verification discovery stable.
- Pre-existing dirty non-evidence files before task creation: 105 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous status brief verification text and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
