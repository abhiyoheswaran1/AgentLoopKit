# Strengthen GitHub metadata maintenance gate

- Created date: 2026-06-16
- Task type: tests
- Status: done

## Problem Statement
The near-term roadmap says GitHub metadata must stay optional, read-only, and token-free, but maintenance:check only checks the github import help surface.

## Desired Outcome
maintenance:check runs focused GitHub metadata safety coverage and public docs explain that behavior check.

## Constraints
- Do not add release, publish, token read, GitHub API, gh, upload, or posting behavior.
- Keep github import semantics local-first and unchanged unless tests expose a safety bug.

## Non-Goals
- Do not change github import file-write semantics.
- Do not make GitHub metadata required.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/maintenance-check.mjs
- tests/maintenance-check-script.test.ts
- tests/autonomous-dogfood.test.ts
- docs/maintenance-guards.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- maintenance check steps include focused GitHub metadata safety tests
- maintenance docs describe GitHub metadata safety coverage instead of only the help surface
- no release, publish, token read, GitHub API call, or GitHub posting behavior is added

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/github-metadata.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check -- --json

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Maintenance gate runtime increases slightly, but focused safety coverage protects the roadmap contract.

## Rollback Notes
Revert scripts/maintenance-check.mjs, related tests, docs, and AgentLoop evidence.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
