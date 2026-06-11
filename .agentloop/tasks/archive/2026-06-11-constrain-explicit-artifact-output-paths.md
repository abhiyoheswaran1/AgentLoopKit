# Constrain explicit artifact output paths

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Commands such as report, badge, ci-summary, and release-notes accept explicit --out paths that can point outside the configured AgentLoop artifact directories, which weakens the boring transparent file-write model.

## Desired Outcome
Generated AgentLoop artifacts only write to the configured reports or handoffs directories, with structured JSON errors for invalid explicit output paths and clear human errors by default.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- src/core/html-report.ts
- src/core/badge.ts
- src/core/ci-summary.ts
- src/core/release-notes.ts
- tests/html-report.test.ts
- tests/badge.test.ts
- tests/ci-summary.test.ts
- tests/release-notes.test.ts
- docs/html-reports.md
- docs/badges.md
- docs/ci-summary.md
- docs/release-notes.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- report --out outside .agentloop/reports fails before writing
- badge --out outside .agentloop/reports fails before writing
- ci-summary --write --out outside .agentloop/reports fails before writing
- release-notes --write --out outside .agentloop/handoffs fails before writing
- JSON mode returns OUTPUT_PATH_INVALID with requestedPath, expectedDir, expectedExtension, and reason

## Verification Commands
- npm test -- tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts
- npm test
- npm run lint
- npm run typecheck
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the output path validation, tests, and docs updates

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
