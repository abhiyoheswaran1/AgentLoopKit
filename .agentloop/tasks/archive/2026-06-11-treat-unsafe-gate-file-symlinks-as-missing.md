# Treat unsafe gate file symlinks as missing

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
check-gates currently treats required harness and policy paths as present when the path is a symlink to a file outside the repo. That lets outside files satisfy repo-local review gates.

## Desired Outcome
check-gates treats required root files, harness files, and policy files as missing when the resolved path is outside the current repo, without reading or modifying the outside file.

## Constraints
- Do not change generated file formats
- Do not delete or repair symlinks
- Keep default gate severity behavior unchanged

## Non-Goals
- No init repair command
- No release bump or publish

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- src/core/file-system.ts
- tests/check-gates.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates reports missing repo-harness files when a required root or harness path resolves outside the repo
- check-gates reports missing safety policy files when a required policy path resolves outside the repo
- outside symlink target contents are not printed

## Verification Commands
- npx pnpm@10.12.1 test tests/check-gates.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 check:links
- npm run build
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the check-gates required-file safety helper and tests

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
