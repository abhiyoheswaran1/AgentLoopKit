# Show doctor risk file details

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Doctor warns about potential risk files only by total count, which forces agents and reviewers to inspect the repo manually to understand whether the risk is migrations, env files, auth, billing, deployment, lockfiles, or security-sensitive code.

## Desired Outcome

Doctor human and JSON output show category-level risk checks with concise path examples, without reading .env contents or changing serious failure behavior.

## Constraints

- Do not read or print env file contents.
- Do not make risk files a serious failure.
- Keep output concise with capped examples.
- Preserve existing doctor JSON shape enough for current users.

## Non-Goals

- No secret scanning or credential inspection.
- No recursive policy engine.
- No command execution beyond existing doctor checks.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/doctor.ts
- tests/doctor.test.ts
- src/core/safety.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch

- .env
- node_modules

## Acceptance Criteria

- Doctor emits category-specific risk checks when risk files exist.
- Env files appear only as paths, never contents.
- No-risk repos still report a passing potential risk files check.
- Existing doctor tests keep passing.

## Verification Commands

- npx pnpm@10.12.1 test tests/doctor.test.ts tests/safety.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert doctor risk-detail changes and docs; existing count-only risk warning remains available.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
