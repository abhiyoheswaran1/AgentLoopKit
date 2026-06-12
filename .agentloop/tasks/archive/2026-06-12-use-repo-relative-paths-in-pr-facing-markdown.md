# Use repo-relative paths in PR-facing Markdown

- Created date: 2026-06-12
- Task type: bugfix
- Status: review

## Problem Statement
Dogfooding ship --github-comment showed absolute local paths in PR-facing Markdown. Comments and PR descriptions should not leak a maintainer's machine path.

## Desired Outcome
Ship comments, ship reports, and prepare-pr Markdown render AgentLoop artifact paths relative to the repo while JSON output keeps existing script-friendly path fields.

## Constraints
- Do not change git parsing, scoring, run ledger storage, or JSON field names.
- No token handling, GitHub API calls, network calls, publishing, or version bump.

## Non-Goals
- Do not rewrite all historical reports.
- Do not hide changed source file paths from reviewers.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/ship.ts
- src/core/prepare-pr.ts
- tests/ship.test.ts
- tests/prepare-pr.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop ship --github-comment does not include the repo root or an absolute artifact path.
- agentloop ship report Markdown uses repo-relative verification, handoff, and ship paths.
- agentloop prepare-pr body and GitHub comment use repo-relative artifact paths.
- JSON output retains existing path fields for scripts.

## Verification Commands
- npm test -- tests/ship.test.ts tests/prepare-pr.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing display paths must not break scripts that consume JSON output.

## Rollback Notes
Restore previous Markdown path rendering while keeping the tests that document the privacy issue.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
