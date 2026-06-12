# Add redacted path output mode

- Created date: 2026-06-12
- Task type: security-review
- Status: done

## Problem Statement
Status and gate outputs can expose the maintainer's absolute Git root path when pasted into public issue, PR, or CI logs.

## Desired Outcome
Users and CI can request redacted path output that preserves review evidence while avoiding local machine path leakage.

## Constraints
- Do not break existing JSON fields that scripts may already consume.
- Do not hide repo-relative AgentLoop artifact paths.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- status supports redacted/safe path output without exposing the absolute repo root
- check-gates supports redacted/safe path output without exposing the absolute repo root
- default JSON behavior remains backward-compatible

## Verification Commands
- npm test -- tests/status.test.ts tests/check-gates.test.ts
- npm run typecheck

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the redaction option and keep existing absolute Git root output.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
