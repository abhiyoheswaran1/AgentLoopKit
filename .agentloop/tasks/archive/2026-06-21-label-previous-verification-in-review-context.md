# Label previous verification in review context

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
When no active or open task exists, review-context still prints Latest verification: pass even though status and next now label that report as previous evidence. Agents using review-context can still read archived-task verification as current-work proof.

## Desired Outcome
Human review-context output labels latest verification as previous evidence when no active or open task exists, while active/open task output and structured fields remain stable.

## Constraints
- Do not change task selection, next-action command selection, verification selection, review-context JSON field shape, release behavior, dependencies, tags, publishing, or package versions.

## Non-Goals
- Do not hide latest verification or change review gates.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/review-context.ts
- tests/review-context.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- review-context keeps Latest verification when an active or latest open task exists.
- review-context uses a previous-evidence label when no active or open task exists.
- review-context JSON fields remain unchanged.

## Verification Commands
- npm test -- tests/review-context.test.ts
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
- Read-only review-context copy changes; keep structured fields, routing, gates, and verification discovery stable.
- Pre-existing dirty non-evidence files before task creation: 106 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous review-context verification label and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
