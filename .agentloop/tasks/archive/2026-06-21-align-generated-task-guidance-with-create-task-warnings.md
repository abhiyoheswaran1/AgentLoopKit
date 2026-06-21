# Align generated task guidance with create-task warnings

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
Freshly initialized AgentLoopKit repos get .agentloop/tasks/README.md guidance that explains task activation and JSON output, but it does not mention dirty-work creation warnings or placeholder-section warnings. New agents can miss the same safety cues now documented in public docs.

## Desired Outcome
Generated task guidance tells agents that create-task may warn about pre-existing dirty non-AgentLoop files and review-critical placeholder sections, while keeping those warnings advisory and non-mutating.

## Constraints
- Template-only user-facing guidance must stay concise and deterministic.
- Do not change create-task runtime behavior in this task.

## Non-Goals
- Do not add new warning codes or task-doctor diagnostics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/templates/tasks/README.md
- tests/init.test.ts
- docs/task-contracts.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- Fresh init writes .agentloop/tasks/README.md with dirty-work and placeholder-section create-task guidance.
- Existing task-contract docs remain consistent with generated task guidance.

## Verification Commands
- npm test -- tests/init.test.ts
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --no-install tsx src/cli/index.ts ship
- npx --no-install tsx src/cli/index.ts prepare-pr
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Docs/template copy can drift from implemented warnings and confuse fresh installs.

## Rollback Notes
Revert the template and init-test changes; no runtime state or data migration is involved.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
