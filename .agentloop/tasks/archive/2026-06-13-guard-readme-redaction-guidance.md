# Guard README redaction guidance

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
README redaction guidance can drift from the CLI commands that support --redact-paths, which makes public-log safety guidance incomplete.

## Desired Outcome
Public docs hygiene fails when README omits any supported shareable --redact-paths command.

## Constraints
- Keep the guard focused on public README safety guidance.

## Non-Goals
- Do not add new CLI flags
- Do not change release metadata

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts
- README.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- public docs hygiene rejects README redaction guidance missing review-context
- public docs hygiene passes with all supported shareable redaction commands listed

## Verification Commands
- npm test -- tests/release-smoke.test.ts -t redaction
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the public-docs hygiene assertion and release-smoke tests if the supported redaction command list changes before docs are updated.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
