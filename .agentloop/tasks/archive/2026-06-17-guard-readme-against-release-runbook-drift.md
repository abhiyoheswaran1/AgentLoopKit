# Guard README against release runbook drift

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The roadmap says README should stay focused on user install and usage, but public-doc hygiene currently blocks false claims without guarding against maintainer-only release workflow details being pasted into README.

## Desired Outcome
Public docs hygiene rejects README-only maintainer publishing/runbook details while still allowing release-specific docs to cover release operations.

## Constraints
- Keep the guard scoped to README focus; do not make release docs or roadmap current-state checks fail for legitimate release guidance.
- Do not publish, tag, bump versions, change release workflows, or call external registries.
- Use TDD: add focused failing public-doc hygiene coverage before changing the helper.

## Non-Goals
- No README rewrite or release-channel publication.
- No dependency changes or public API changes.

## Assumptions
- Release-specific docs can still document release commands and trusted publishing details; the README should not become a maintainer release runbook.

## Likely Files or Areas
- tests/public-docs-hygiene.test.ts
- scripts/smoke-packed-release.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- A README fixture containing maintainer-only release workflow details fails public-doc hygiene with a specific README focus error.
- A release-specific docs fixture can mention the same release workflow terms without failing README focus hygiene.
- npm run check:public-docs and focused public-doc hygiene tests pass after implementation.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm test -- tests/public-docs-hygiene.test.ts
- npm run check:public-docs

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-broad patterns could block legitimate user-facing release command documentation; keep the guard README-specific and fixture-backed.

## Rollback Notes
Revert the test additions and the README focus assertion in scripts/smoke-packed-release.mjs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
