# Ignore active AgentFlight placeholders in check-gates

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
AgentFlight can pin its placeholder task active during a session. status and next ignore that placeholder, but check-gates still uses it as task evidence and treats the active-placeholder diagnostic as task hygiene, causing strict dogfood to fail until the user manually parks the placeholder.

## Desired Outcome
check-gates resolves task evidence through the same real-task fallback behavior as status and does not fail task hygiene solely because the active pointer is an AgentFlight placeholder.

## Constraints
- Keep task doctor direct output unchanged; it should still warn when the active pointer is a placeholder.
- Preserve check-gates failure behavior for real stale, missing, deferred, terminal, and unsupported task issues.
- Do not delete, archive, or mutate AgentFlight placeholder task files.

## Non-Goals
- Do not change AgentFlight itself or the external agentflight command.
- Do not hide AgentFlight placeholders from task list, artifacts, or review context.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/evidence.ts
- src/core/check-gates.ts
- tests/check-gates.test.ts
- tests/verification.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates uses the newest real open task when the active pointer targets an AgentFlight placeholder.
- check-gates strict mode passes task hygiene when the only diagnostic is active-task-agentflight-placeholder and other evidence is valid.
- task doctor still reports active-task-agentflight-placeholder directly.

## Verification Commands
- npm test -- tests/check-gates.test.ts tests/task-state.test.ts
- npm test -- tests/verification.test.ts -t task-commands
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This changes recovery behavior for check-gates only; tests must prove direct task doctor diagnostics remain visible.

## Rollback Notes
Revert the evidence fallback, check-gates filtering, and regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
