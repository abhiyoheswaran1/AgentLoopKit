# Use concise review context in dogfood output

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Normal dogfood output runs review-context with --json, so long dirty autonomous sessions print the full changed-file snapshot into terminal logs.

## Desired Outcome
Dogfood still checks review-context, but normal dogfood output uses the concise human snapshot with redacted paths instead of dumping full JSON.

## Constraints
- Do not change review-context JSON output or schema.
- Do not remove the review-context dogfood step.
- Keep dogfood --json mode as a structured step-result summary.
- Do not add network behavior, token reads, release work, version bumps, tags, or publishing.

## Non-Goals
- Add new review-context filtering options.
- Change maintainer-check, artifacts, status, or gate semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- tests/autonomous-dogfood.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- createDogfoodSteps runs the agent review context step as review-context --redact-paths without --json.
- Normal dogfood still includes the review context step and redacts local paths.
- Dogfood JSON mode continues to emit structured step results without streaming command output.
- Public docs describe the concise human review-context dogfood output.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts
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
- Changing dogfood step arguments can affect CI log expectations, so keep the step name and read-only review-context behavior unchanged.

## Rollback Notes
Revert the dogfood step argument change, tests, and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
