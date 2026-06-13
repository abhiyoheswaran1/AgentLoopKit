# Accept redacted output flag on review context

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
agentloop review-context rejects --redact-paths even though it is a shareable snapshot built from status and gate evidence.

## Desired Outcome
agentloop review-context --redact-paths succeeds in human and JSON modes, and nested status/gate calls receive the same redaction request.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change review-context content shape beyond redaction support

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/review-context.ts
- src/core/review-context.ts
- tests/review-context.test.ts
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop review-context --redact-paths exits successfully
- agentloop review-context --json --redact-paths exits successfully

## Verification Commands
- npm test -- tests/review-context.test.ts
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
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
