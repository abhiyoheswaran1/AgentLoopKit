# Reject artifact root symlink escapes

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Generated AgentLoop artifacts should not be written outside the repository when a configured AgentLoop artifact directory is a symlink to another location.

## Desired Outcome
Task creation, verification reports, handoffs, HTML reports, badges, CI summaries, and release-note outputs reject configured artifact roots that resolve outside the repo before writing files.

## Constraints
- Do not bump package versions or publish releases.
- Keep the change local-first and dependency-free.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A regression test fails before implementation for a configured artifact root symlinked outside the repo.
- Generated artifact writes reject the unsafe root and do not create files outside the repo.

## Verification Commands
- npx pnpm@10.12.1 test tests/create-task.test.ts tests/verification.test.ts tests/handoff.test.ts tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
