# Document dirty-work next guidance in status docs

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
The CLI reference documents that status and next mention dirty non-AgentLoop files before recommending create-task, but docs/status.md still omits that behavior.

## Desired Outcome
The dedicated status and next documentation explains that create-task next-action reasons call out existing dirty non-AgentLoop files without changing command selection or reading file contents.

## Constraints
- Docs-only change.
- Do not change CLI behavior.
- Do not add release or publishing work.

## Non-Goals
- No new screenshots, generated demos, or command output rewrites.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/status.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- docs/status.md describes dirty non-AgentLoop create-task guidance.
- README status/next section stays consistent if it mentions next-action behavior.

## Verification Commands
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Docs-only wording should stay local-first and avoid claiming real user feedback.

## Rollback Notes
Revert the status docs wording and product evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
