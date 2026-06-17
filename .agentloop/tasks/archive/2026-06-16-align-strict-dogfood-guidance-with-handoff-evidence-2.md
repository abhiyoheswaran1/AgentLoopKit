# Align strict dogfood guidance with handoff evidence

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
Public maintenance guidance still says to run `npm run dogfood:strict` after fresh verification, but dogfooding proved strict mode also needs fresh handoff or ship evidence because it runs strict review gates.

## Desired Outcome
README and maintenance guard docs tell agents and maintainers to run strict dogfood only after fresh handoff or ship evidence exists, matching the autonomous dogfooding harness.

## Constraints
- Keep this as a docs/test alignment task.
- Do not change release, publish, version, registry, token, or network behavior.
- Do not weaken strict dogfood or check-gates semantics.

## Non-Goals
- No release prep.
- No command behavior changes.
- No dependency changes.

## Assumptions
- Strict dogfood includes `check-gates --strict`, so missing reviewer evidence should remain a blocking condition.

## Likely Files or Areas
- `README.md`
- `docs/maintenance-guards.md`
- `tests/autonomous-dogfood.test.ts`

## Files or Areas Not to Touch
- Package metadata and lockfiles.
- Release workflows and channel docs unrelated to dogfood sequencing.

## Acceptance Criteria
- Public maintenance guidance says strict dogfood runs after fresh handoff or ship evidence exists.
- The harness and public docs use consistent sequencing language.
- Focused tests fail before the doc update and pass after it.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Update focused doc-harness test expectations first and confirm the stale public docs fail.
- Update README and maintenance guard wording to require fresh handoff or ship evidence.
- Run focused tests and dogfood tool checks.

## Risk Notes
- Low risk docs/test change. Main risk is making strict dogfood sound weaker than it is; keep wording explicit that review gates still block.

## Rollback Notes
Revert the README, maintenance docs, and focused test edits.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
