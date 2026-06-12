# Add ship GitHub comment output

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
agentloop prepare-pr can emit GitHub comment Markdown, but ship cannot. CI users who only want review-readiness evidence need a direct ship comment output.

## Desired Outcome
agentloop ship --github-comment emits Markdown suitable for a PR comment while preserving JSON and existing ship behavior.

## Constraints
- No GitHub token handling or API calls.
- No publishing, version bump, release, telemetry, or network behavior.

## Non-Goals
- Do not post comments to GitHub from the CLI.
- Do not change readiness scoring semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/ship.ts
- src/core/ship.ts
- tests/ship.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop ship --github-comment prints a PR-comment-style readiness report.
- agentloop ship --github-comment --json includes the comment Markdown without suppressing JSON.
- Existing ship JSON and human output remain compatible when the flag is not used.
- Docs and CLI reference explain that the CLI does not require or read GitHub tokens.

## Verification Commands
- npm test -- tests/ship.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Comment Markdown can become too verbose for CI comments if it duplicates the full ship report.

## Rollback Notes
Remove the --github-comment flag and helper, then restore ship help and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
