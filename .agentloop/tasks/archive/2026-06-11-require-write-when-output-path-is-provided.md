# Require write when output path is provided

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
ci-summary and release-notes accept --out but silently ignore it unless --write is also set, which can mislead agents or CI scripts into thinking a file was written.

## Desired Outcome
Commands that accept --out for generated Markdown fail fast unless --write is also set, with structured JSON errors for automation and clear human errors by default.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/ci-summary.ts
- src/cli/commands/release-notes.ts
- tests/ci-summary.test.ts
- tests/release-notes.test.ts
- docs/ci-summary.md
- docs/release-notes.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop ci-summary --out <path> --json exits 1 with OUT_REQUIRES_WRITE and writes nothing
- agentloop release-notes --out <path> --json exits 1 with OUT_REQUIRES_WRITE and writes nothing
- human output remains clear when --json is not requested

## Verification Commands
- npm test -- tests/ci-summary.test.ts tests/release-notes.test.ts
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
Revert the CLI validation, tests, and docs updates

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
