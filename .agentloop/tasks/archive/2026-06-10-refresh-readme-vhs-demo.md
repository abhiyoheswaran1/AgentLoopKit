# Refresh README VHS demo

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
The README should show a polished, reproducible CLI demo generated from committed VHS sources before the next npm release.

## Desired Outcome
The README demo GIF is regenerated from an updated tape, README copy stays user-facing, and the next package release includes the new assets.

## Constraints
- Use VHS from committed sources.
- Do not add a product frontend, SaaS, telemetry, cloud service, or manual screen recording.
- Keep screenshots deterministic and release-ready for npm README rendering.

## Non-Goals
- Do not build a browser UI.
- Do not claim real user feedback.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- docs/assets/readme/agentloopkit-cli.tape produces docs/assets/readme/agentloopkit-cli.gif.
- README references the generated assets and contains no internal release-incident notes.
- Package release checks pass before npm/GitHub release.

## Verification Commands
- vhs docs/assets/readme/agentloopkit-cli.tape
- npm run smoke:release
- npm run typecheck
- npm test
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
