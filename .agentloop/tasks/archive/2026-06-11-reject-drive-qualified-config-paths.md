# Reject drive-qualified config paths

- Created date: 2026-06-11
- Task type: security-review
- Status: done

## Problem Statement

The JSON schema rejects Windows drive-qualified config paths like C:agentloop\reports, but the TypeScript config parser accepts them because path.win32.isAbsolute returns false for drive-relative paths.

## Desired Outcome

Runtime config validation rejects drive-qualified paths the same way the shipped schema does, keeping AgentLoopKit paths local repo-relative across platforms.

## Constraints

- Do not bump package version or publish a release
- Keep the fix focused on config path validation parity

## Non-Goals

- Do not redesign the config schema or add arbitrary external artifact directories

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/config.ts
- tests/config.test.ts
- CHANGELOG.md
- DECISIONS.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Config rejects Windows drive-qualified paths such as C:agentloop\reports
- Runtime validation stays aligned with schema restrictions
- Docs and internal records note the parity fix

## Verification Commands

- npm test -- tests/config.test.ts tests/schema.test.ts
- npm test
- npm run typecheck
- npm run build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the config validator regex check, the focused test case, and wording updates if a legitimate repo-relative path is blocked incorrectly. Do not allow Windows drive-qualified paths without a replacement boundary that proves artifacts stay inside the target repo.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
