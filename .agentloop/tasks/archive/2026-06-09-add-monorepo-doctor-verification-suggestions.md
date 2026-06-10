# Add monorepo doctor verification suggestions

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Doctor warns on monorepo markers but does not give the user an immediate next action for package-level verification.

## Desired Outcome

The Monorepo doctor warning suggests recording package-specific verification commands in task contracts and gives safe package-manager examples without running commands automatically.

## Constraints

- Keep the DoctorCheck shape unchanged.
- Do not add package graph detection.
- Do not execute workspace commands.

## Non-Goals

- Build a monorepo runner.
- Change agentloop.config.json.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/doctor.ts
- tests/doctor.test.ts
- README.md

## Files or Areas Not to Touch

- src/core/verification.ts
- package.json

## Acceptance Criteria

- Doctor markdown includes package-specific verification guidance when monorepo markers are present.
- Doctor JSON includes the same guidance in the Monorepo check message.
- No commands run automatically.

## Verification Commands

- npx pnpm@10.12.1 test tests/doctor.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the doctor message and test changes.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
