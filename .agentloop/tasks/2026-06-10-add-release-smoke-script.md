# Add release smoke script

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
Release candidates rely on one-off shell smoke commands for packed tarball behavior, which makes safety checks easy to mistype or skip.

## Desired Outcome
Maintainers can run one checked-in command that packs AgentLoopKit and verifies the published-package behaviors we care about before release.

## Constraints
- Keep it local and deterministic except npm pack using local files.
- Do not publish, tag, call GitHub APIs, read tokens, or read .env files.
- Use Vitest for automated tests.

## Non-Goals
- Do not add a new public CLI command.
- Do not bump package version for this internal maintainer script.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A package script runs the packed-release smoke check.
- The smoke check verifies version output, init, task path guards, verification task guards, home-directory dry-run refusal, and README pins.
- Tests cover the smoke script command construction or behavior without publishing.

## Verification Commands
- npm run test -- tests/release-smoke.test.ts
- npm run smoke:release
- npm run lint
- npm run typecheck

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
