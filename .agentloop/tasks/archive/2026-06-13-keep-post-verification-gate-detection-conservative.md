# Keep post-verification gate detection conservative

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
The shared post-verification gate detector can match AgentLoop command words in the middle of another shell command, such as echo agentloop ship or npm run agentloop ship, which risks noisy warnings.

## Desired Outcome
The detector warns when the command itself clearly invokes AgentLoopKit review-readiness commands, and does not warn when those words are only arguments to another command.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- direct AgentLoop invocations such as agentloop ship, npx --yes agentloopkit prepare-pr, and pnpm exec agentloop check-gates still warn
- commands such as echo agentloop ship and npm run agentloop ship do not warn
- create-task and task doctor keep using the shared detector

## Verification Commands
- npm test -- tests/post-verification-gates.test.ts
- npm test -- tests/create-task.test.ts -t "post-verification gates"
- npm test -- tests/task-state.test.ts -t "post-verification gates"
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

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
