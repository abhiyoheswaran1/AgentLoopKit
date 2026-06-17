# Add npm-status safety tests to maintenance check

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The recurring maintenance gate protects release-proof, SchemaStore, policy packs, and GitHub metadata safety contracts, but it does not directly run the focused npm-status safety coverage even though npm-status is the release-adjacent command that must remain read-only, captured-JSON capable, env-file refusing, and token-free.

## Desired Outcome
maintenance:check includes focused npm-status safety tests and public maintenance docs name that coverage without implying release readiness, live registry mutation, publishing, or credential access.

## Constraints
- Do not publish packages, create tags, cut releases, bump versions, change dependencies, call live npm registry in the new maintenance step, read tokens, read env-file contents, or mutate package metadata.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/maintenance-check.mjs
- tests/maintenance-check-script.test.ts
- docs/maintenance-guards.md
- README.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- Focused TDD fails before the npm-status maintenance step exists and passes after implementation.
- createMaintenanceCheckSteps includes a step named npm status safety tests that runs npm test -- tests/npm-status.test.ts after the npm-only release-proof smoke and before unrelated safety surfaces.
- maintenance help text, README maintenance section, and docs/maintenance-guards.md mention npm-status safety coverage as read-only/non-publishing maintenance coverage.
- maintenance command list still excludes npm publish, gh release create, git tag, token-like args, and .env paths.

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts -t "npm status safety"
- npx prettier --check scripts/maintenance-check.mjs tests/maintenance-check-script.test.ts docs/maintenance-guards.md README.md
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm test -- tests/maintenance-check-script.test.ts tests/npm-status.test.ts
- npm run maintenance:check

## Post-Verification Gates
- npx --yes agentflight status
- npx --yes projscan doctor --format markdown
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the npm status safety tests maintenance step and revert the maintenance docs wording.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
