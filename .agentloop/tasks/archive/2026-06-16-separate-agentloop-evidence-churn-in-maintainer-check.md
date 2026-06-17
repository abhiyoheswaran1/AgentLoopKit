# Separate AgentLoop evidence churn in maintainer check

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Long autonomous sessions generate many AgentLoop evidence files, so maintainer-check can warn on a huge changed-file count even when the source-review surface is much smaller.

## Desired Outcome
maintainer-check reports total changed files with AgentLoop evidence separated, and the broad changed-file warning is based on non-evidence files while preserving existing safety checks.

## Constraints
- Do not hide changed files from git status, handoff coverage, check-gates, status, or JSON output outside the changed-file-count check message/status.
- Do not suppress dependency, migration, auth/security, generated-output, task, verification, or handoff checks.
- Do not add network behavior, token reads, release work, version bumps, tags, or publishing.

## Non-Goals
- Add a new file grouping system across commands.
- Change check-gates or status dirty-file semantics.
- Clean up or delete existing evidence files.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/maintainer-check.ts
- tests/maintainer-check.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- changed-file-count message includes AgentLoop evidence file count when changed files include AgentLoop evidence artifacts.
- changed-file-count warns when non-evidence changed files exceed the existing broad-change threshold.
- changed-file-count passes when the threshold is exceeded only by AgentLoop evidence files.
- Other maintainer-check safety checks continue to inspect the full changed-file list.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts
- npm run typecheck
- npm run lint
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing a maintainer-check status can affect review-gate expectations; keep the change limited to broad changed-file-count risk.

## Rollback Notes
Revert maintainer-check classification logic, tests, and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
