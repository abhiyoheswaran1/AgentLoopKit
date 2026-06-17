# Add GitHub metadata safety guard to maintenance check

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The maintenance check runs focused GitHub metadata safety tests, but the maintenance-check script tests do not have a named guard that locks the read-only GitHub metadata surface and safety-test step together for future agents.

## Desired Outcome
tests/maintenance-check-script.test.ts has a direct named regression test proving maintenance:check keeps the github import help surface and npm test -- tests/github-metadata.test.ts safety step, with public docs already describing the gate in user-facing terms.

## Constraints
- Do not add GitHub API calls, gh execution, token reads, env-file reads, posting, required GitHub metadata, dependency changes, release prep, publishing, or Marketplace work.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/maintenance-check-script.test.ts
- scripts/maintenance-check.mjs
- docs/maintenance-guards.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused selector shows the named GitHub metadata maintenance guard is absent before the test is added.
- The named test proves github metadata import surface appears before github metadata safety tests and that the safety step runs npm test -- tests/github-metadata.test.ts.
- The maintenance gate still includes both the read-only help surface and focused GitHub metadata safety tests without changing command behavior.

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts -t "maintenance check includes GitHub metadata safety tests"
- npm test -- tests/maintenance-check-script.test.ts
- npm run maintenance:check
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/maintenance-check-script.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the maintenance-check script guard test; no persistent runtime state, docs behavior, or dependency changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
