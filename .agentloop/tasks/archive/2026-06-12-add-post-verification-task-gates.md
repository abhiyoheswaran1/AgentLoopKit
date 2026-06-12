# Add post-verification task gates

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Dogfooding showed that commands like npm run dogfood:strict need a verification report before they can pass, so putting them in ## Verification Commands makes agentloop verify --task-commands fail for the wrong reason.

## Desired Outcome
Task contracts can record post-verification gates separately from commands that agentloop verify should run.

## Constraints
- None recorded yet.

## Non-Goals
- Do not make agentloop verify run post-verification gates automatically.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task supports a repeatable post-verification command flag
- generated task Markdown renders a Post-Verification Gates section when those commands are provided
- agentloop verify --task-commands does not execute post-verification gates

## Verification Commands
- npm test -- tests/task-contract.test.ts
- npm test -- tests/create-task.test.ts
- npm test -- tests/verification.test.ts
- npm run lint
- npm run typecheck
- npm run check:links
- git diff --check
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Adding another task field can confuse users if docs do not explain when to use it.

## Rollback Notes
Remove the post-verification option and section if it creates ambiguity.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
