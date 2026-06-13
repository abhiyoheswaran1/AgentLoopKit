# Report post-ship gate state

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
agentloop ship can include a stale-handoff gate warning in its ship report because it checks gates before the ship run exists, even though the completed ship run records handoff evidence for the current dirty files.

## Desired Outcome
agentloop ship reports the post-ship review-evidence gate state so the report, JSON output, and GitHub comment reflect the one-command review-readiness flow.

## Constraints
- Do not add a duplicate handoff run for every ship command.
- Do not weaken stale handoff warnings outside the ship flow.
- Do not cut a release, create tags, publish packages, or change package metadata.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- ship --json reports passing gates when the generated ship run would cover the current dirty files and handoff evidence.
- the ship report Markdown does not include the stale handoff warning for a normal successful ship flow.
- uncovered dirty files outside the ship flow still warn through check-gates.

## Verification Commands
- npm test -- tests/ship.test.ts tests/check-gates.test.ts
- npm run typecheck
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
Revert the ship/check-gates changes and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
