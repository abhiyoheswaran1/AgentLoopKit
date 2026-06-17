# Add SchemaStore consistency tests to maintenance check

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement

The near-term maintenance gate prints the SchemaStore catalog entry, but it does not run the focused SchemaStore test file that verifies the committed catalog entry matches the core helper and CLI safety contract.

## Desired Outcome

maintenance:check includes a named SchemaStore consistency test step after the SchemaStore output step, with docs and tests reflecting the recurring guard.

## Constraints

- Keep the step local and deterministic; do not submit to SchemaStore, call external services, publish, tag, or bump versions.
- Use TDD: update maintenance-check tests first and watch them fail before editing the script.

## Non-Goals

- No schema URL or catalog entry change.
- No dependency changes, release work, or registry/network checks.

## Assumptions

- SchemaStore output and focused SchemaStore tests together better protect the roadmap promise that catalog metadata stays current when config schema behavior changes.

## Likely Files or Areas

- tests/maintenance-check-script.test.ts
- scripts/maintenance-check.mjs
- README.md
- docs/maintenance-guards.md

## Files or Areas Not to Touch

- package.json
- pnpm-lock.yaml

## Acceptance Criteria

- The maintenance step list includes `schemastore consistency tests` after `schemastore entry`.
- The new step runs `npm test -- tests/schemastore.test.ts` and is not allowed to fail.
- README and maintenance guard docs mention SchemaStore consistency tests in the maintenance gate.

## Verification Commands

- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm test -- tests/maintenance-check-script.test.ts
- npm run maintenance:check

## Post-Verification Gates

- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- The maintenance gate gets one more focused test invocation; keep it limited to the existing fast SchemaStore test file.

## Rollback Notes

Remove the new maintenance step, the step-list tests, and the docs wording updates.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
