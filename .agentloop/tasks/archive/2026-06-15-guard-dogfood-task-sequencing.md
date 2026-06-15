# Guard dogfood task sequencing

- Created date: 2026-06-15
- Task type: bugfix
- Status: done

## Problem Statement
Recent dogfood work twice started AgentFlight and AgentLoop task creation in parallel, allowing a generic AgentFlight-derived task contract to overwrite or win over the detailed task contract.

## Desired Outcome
Future AgentLoopKit development guidance tells agents to start AgentFlight and AgentLoop tasks sequentially, and a lightweight automated check keeps that guidance present.

## Constraints
- Keep the fix local-first and documentation/guard focused.
- Do not add release automation or publish anything.

## Non-Goals
- Do not change AgentFlight itself.
- Do not add network calls or tokens.

## Assumptions
- The current repo dogfood harness is the right place to encode this workflow rule.

## Likely Files or Areas
- .agentloop/harness/autonomous-dogfooding.md
- scripts/dogfood.mjs
- tests/autonomous-dogfood.test.ts

## Files or Areas Not to Touch
- package.json

## Acceptance Criteria
- Dogfood guidance says to start AgentFlight first, wait for it to finish, then create the AgentLoop task.
- Automated dogfood tests fail if the sequencing guidance is removed.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts
- npm run test:unit
- npm run typecheck
- npm run lint

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This affects maintainer workflow guidance, not end-user CLI behavior.

## Rollback Notes
Revert the guard test and dogfood guidance changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
