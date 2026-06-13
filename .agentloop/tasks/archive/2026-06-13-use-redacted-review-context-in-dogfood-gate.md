# Use redacted review context in dogfood gate

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
The dogfood script uses redacted status and gate output but still runs review-context --json without --redact-paths.

## Desired Outcome
Dogfood agent review context step uses review-context --json --redact-paths so self-check summaries follow the same public-log safety rule.

## Constraints
- Keep the dogfood script read-only and non-release.

## Non-Goals
- Do not change review-context command behavior
- Do not run release checks or publish

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- tests/dogfood-script.test.ts
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- dogfood step plan includes --redact-paths for agent review context
- strict dogfood still passes

## Verification Commands
- npm test -- tests/dogfood-script.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the dogfood step argument and test assertion if `review-context --redact-paths` regresses.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
