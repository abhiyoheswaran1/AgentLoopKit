# Accept redacted output flag on next command

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
agentloop next rejects --redact-paths even though related shareable status and gate commands support the flag.

## Desired Outcome
agentloop next --redact-paths succeeds and uses the same redaction behavior as status-derived next-action output.

## Constraints
- Keep the change limited to `next` output compatibility.

## Non-Goals
- Do not change next-action selection rules

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/next.ts
- tests/next.test.ts
- docs/status.md
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop next --redact-paths exits successfully
- agentloop next --json --redact-paths exits successfully

## Verification Commands
- npm test -- tests/next.test.ts
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
Revert the `next` command option, regression test, and docs entry if the flag creates unexpected CLI compatibility issues.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
