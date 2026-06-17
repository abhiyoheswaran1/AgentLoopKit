# Use concise evidence steps in dogfood output

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Normal dogfood output still streams artifact inventory and maintainer-check as JSON, making local dogfood logs harder to scan than the human command outputs.

## Desired Outcome
Normal dogfood output uses human-readable artifact inventory and maintainer-check output, while dogfood --json remains a structured step-result summary.

## Constraints
- Do not change artifacts or maintainer-check JSON output or schemas.
- Do not remove artifact inventory or maintainer reviewability dogfood steps.
- Keep dogfood --json mode as structured step-result output with child output suppressed.
- Do not add network behavior, token reads, release work, version bumps, tags, or publishing.

## Non-Goals
- Change review-context output again.
- Change gate, status, task, artifact, or maintainer-check semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- tests/dogfood-script.test.ts
- tests/autonomous-dogfood.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- createDogfoodSteps runs artifact inventory as artifacts without --json.
- createDogfoodSteps runs maintainer reviewability check as maintainer-check --redact-paths without --json.
- Normal dogfood output keeps artifact and maintainer sections human-readable.
- Dogfood JSON mode continues to emit structured step results without streaming child output.

## Verification Commands
- npm test -- tests/dogfood-script.test.ts tests/autonomous-dogfood.test.ts
- npm run typecheck
- npm run lint
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing dogfood step arguments can affect log expectations, so keep step names and allow-failure behavior unchanged.

## Rollback Notes
Revert dogfood step argument changes, tests, and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
