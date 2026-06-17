# Add built CLI smoke coverage for report and badge redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
report and badge --redact-paths are covered by source tests, but the built CLI smoke flow does not prove packaged report and badge JSON output redacts local roots while still writing evidence artifacts.

## Desired Outcome
The built CLI smoke script exercises report --json --redact-paths and badge --json --redact-paths, asserts [git-root] output paths, confirms no temp repo path leaks, and confirms the real HTML/SVG files are still written.

## Constraints
- Do not change report or badge runtime behavior unless the smoke exposes a real bug.
- Do not release, publish, bump versions, call external APIs, or mutate release channels.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused distribution-artifacts test fails before report/badge redaction smoke assertions exist and passes after implementation.
- The built smoke script verifies redacted report and badge JSON paths without leaking the temp smoke repo path.
- The real report HTML and badge SVG files are written at their unredacted locations.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "report and badge redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke-script assertions and the distribution-artifacts guard test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
