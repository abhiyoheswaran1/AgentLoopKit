# Cover invalid artifact output extensions

- Created date: 2026-06-11
- Task type: test-generation
- Status: done

## Problem Statement
Output path validation rejects files outside configured artifact directories, but the invalid-extension branch needs CLI regression coverage for report, badge, CI summary, and release notes.

## Desired Outcome
The CLI test suite proves wrong explicit output extensions fail before writing and return structured OUTPUT_PATH_INVALID JSON errors with reason wrong-extension.

## Constraints
- Do not change package version or cut a release.
- Keep behavior local-first and do not execute extra commands outside verification.

## Non-Goals
- No new artifact output features.
- No release metadata changes.

## Assumptions
- Existing output path resolver behavior should already reject wrong extensions; this task validates it at the CLI boundary.

## Likely Files or Areas
- tests/html-report.test.ts
- tests/badge.test.ts
- tests/ci-summary.test.ts
- tests/release-notes.test.ts
- src/core/artifacts.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- report --out inside reports with a non-.html extension fails before writing
- badge --out inside reports with a non-.svg extension fails before writing
- ci-summary --write --out inside reports with a non-.md extension fails before writing
- release-notes --write --out inside handoffs with a non-.md extension fails before writing
- JSON mode returns OUTPUT_PATH_INVALID with expectedExtension and reason wrong-extension

## Verification Commands
- npm test -- tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts
- npm test
- npm run lint
- npm run typecheck
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
Remove the invalid-extension regression tests and any implementation adjustment they require

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
