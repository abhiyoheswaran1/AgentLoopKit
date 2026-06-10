# Handle missing git executable safely

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement
Git helpers use execa with reject:false, but execa still rejects when the git executable is missing. Commands that should degrade to no Git context can crash on systems without git in PATH.

## Desired Outcome
Git-dependent AgentLoopKit commands treat a missing git executable as no Git repository/status instead of throwing, with regression tests proving that behavior.

## Constraints
- Do not require Git for normal init, status, summaries, or reports
- Keep local-only init requiring a real Git repository
- Do not change package version or release artifacts

## Non-Goals
- Do not shell out to alternate Git implementations
- Do not add dependencies

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/git.ts
- tests/git.test.ts
- tests/init.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Git helper tests cover missing executable behavior
- init dry-run works when git is missing from PATH
- Existing Git behavior remains unchanged when git is available

## Verification Commands
- npx pnpm@10.12.1 test tests/git.test.ts tests/init.test.ts
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
Remove the missing-Git regression tests and changelog entry.

## Investigation Result
`execa` with `reject: false` returns a failed result object for a missing executable instead of throwing. The current Git helpers already degrade to false or empty output. This task adds regression coverage so the behavior stays intact.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
