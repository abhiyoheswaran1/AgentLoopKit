# Strengthen policy pack maintenance gate

- Created date: 2026-06-16
- Task type: tests
- Status: done

## Problem Statement
The near-term roadmap says bundled policy packs must stay small, local, safe, and useful, but maintenance:check only names policy pack inventory explicitly.

## Desired Outcome
maintenance:check runs focused policy-pack safety coverage and public docs explain that policy-pack safety is checked directly.

## Constraints
- Do not add remote policy packs, enforcement engines, API calls, env reads, token reads, release, publish, or overwrite behavior.
- Keep policy pack apply semantics no-overwrite and local-only.

## Non-Goals
- Do not add new bundled policy packs.
- Do not change policy pack schemas unless tests expose a safety bug.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/maintenance-check.mjs
- tests/maintenance-check-script.test.ts
- tests/autonomous-dogfood.test.ts
- docs/maintenance-guards.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- maintenance check steps include focused policy-pack safety tests
- maintenance docs describe policy-pack safety coverage directly
- no remote policy-pack, enforcement, overwrite, token, API, release, or publish behavior is added

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/policy-packs.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check -- --json

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Maintenance gate runtime increases slightly; the tradeoff is clearer proof that policy packs remain safe.

## Rollback Notes
Revert scripts/maintenance-check.mjs, tests, docs, and AgentLoop evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
