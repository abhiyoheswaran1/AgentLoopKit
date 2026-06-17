# Guard README against release incident chatter

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Maintenance guidance says README must not carry local auth failures, token state, or temporary registry repair notes, but public-doc hygiene only guards some stale release chatter and the new release-runbook terms.

## Desired Outcome
Public docs hygiene rejects README-only release incident chatter while allowing release-specific docs to retain factual release history and maintainer guidance.

## Constraints
- Keep the guard README-specific so release history and release maintainer docs remain factual.
- Do not publish, tag, bump versions, change release workflows, read credentials, or call registries.
- Use TDD: add a failing README fixture before extending the hygiene helper.

## Non-Goals
- No README rewrite and no release-channel publication.
- No dependency changes or public API changes.

## Assumptions
- README should stay focused on install and usage; detailed release incidents belong in release docs if they are needed at all.

## Likely Files or Areas
- tests/public-docs-hygiene.test.ts
- scripts/smoke-packed-release.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- A README fixture containing local auth failure, token state, or temporary registry repair wording fails public-doc hygiene with the README focus error.
- A release-specific docs fixture can mention release authorization or registry repair history without failing the README guard.
- Focused public-doc hygiene tests and npm run check:public-docs pass after implementation.

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
- Over-broad wording could block legitimate release docs; keep matching scoped to README.

## Rollback Notes
Revert the new public-doc hygiene fixtures and the added README incident-chatter patterns.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
