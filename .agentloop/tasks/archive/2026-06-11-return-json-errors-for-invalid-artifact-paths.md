# Return JSON errors for invalid artifact paths

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Explicit summarize, handoff, and report artifact paths can be missing or invalid without giving agents a structured error.

## Desired Outcome
When --json is requested, bad explicit task, verification/report, or handoff input paths return parseable errors and do not write misleading artifacts.

## Constraints
- Do not change implicit fallback behavior when no explicit path is supplied.
- Keep human output readable for non-JSON users.

## Non-Goals
- Restrict custom output paths.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/pr-summary.ts
- src/core/html-report.ts
- src/cli/commands/summarize.ts
- src/cli/commands/report.ts
- tests/handoff.test.ts
- tests/html-report.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- summarize --task missing --json exits non-zero with structured error
- handoff --verification missing --json exits non-zero without writing a handoff
- report --handoff missing --json exits non-zero without writing an HTML report

## Verification Commands
- npm test -- tests/handoff.test.ts tests/html-report.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the commit that adds `ArtifactPathError`, removes the explicit artifact-path validation calls, and removes the matching JSON-error tests and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
