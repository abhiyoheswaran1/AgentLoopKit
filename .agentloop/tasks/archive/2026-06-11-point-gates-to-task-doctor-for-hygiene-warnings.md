# Point gates to task doctor for hygiene warnings

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
check-gates now surfaces task-hygiene warnings, but when task, verification, and handoff evidence are present it still recommends refreshing the handoff instead of sending agents to the cleanup command.

## Desired Outcome
When task hygiene is the remaining warning after core review evidence exists, check-gates recommends agentloop task doctor so agents get the exact cleanup checklist.

## Constraints
- Do not change package version or cut a release.
- Keep the behavior read-only; do not archive or edit tasks automatically.
- Preserve higher-priority next actions for missing task contracts, failed verification, and missing handoffs.

## Non-Goals
- No new task cleanup command.
- No default warning-as-error behavior change.

## Assumptions
- task-hygiene warnings should guide users to task doctor only after required review evidence has been generated.

## Likely Files or Areas
- src/core/check-gates.ts
- tests/check-gates.test.ts
- docs/check-gates.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates --json recommends agentloop task doctor when task-hygiene warns and task, verification, and handoff evidence pass
- Human check-gates output prints Run agentloop task doctor for that state
- Missing task, failed verification, and missing handoff next actions remain unchanged
- No task files are changed by check-gates

## Verification Commands
- npm test -- tests/check-gates.test.ts tests/task-state.test.ts
- npm test
- npm run lint
- npm run typecheck
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the next-action prioritization, tests, and docs updates

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
