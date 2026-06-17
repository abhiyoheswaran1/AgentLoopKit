# Use concise hygiene steps in dogfood output

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Normal dogfood output still streams task doctor and harness upgrade audit as JSON, making local dogfood logs noisier than the available human command output.

## Desired Outcome
Normal dogfood output uses human-readable task doctor and upgrade-harness output, while dogfood --json remains a structured step-result summary with child output suppressed.

## Constraints
- Do not change task doctor or upgrade-harness JSON output or schemas.
- Do not remove task folder hygiene or harness upgrade audit dogfood steps.
- Keep dogfood --json mode as structured step-result output with child output suppressed.
- Do not add network behavior, token reads, release work, version bumps, tags, or publishing.

## Non-Goals
- Change task doctor diagnostics or stale-state semantics.
- Change upgrade-harness detection semantics.
- Change dogfood evidence, AgentFlight, ProjScan, or dependency-audit behavior.

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
- createDogfoodSteps runs task folder hygiene as task doctor without --json.
- createDogfoodSteps runs harness upgrade audit as upgrade-harness --redact-paths without --json.
- Normal dogfood output keeps task doctor and harness upgrade sections human-readable.
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
