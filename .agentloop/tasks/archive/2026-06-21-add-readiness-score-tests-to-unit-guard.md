# Add readiness-score tests to unit guard

- Created date: 2026-06-21
- Task type: tests
- Status: done

## Problem Statement
The readiness-score parser bug was covered by focused tests, but tests/readiness-score.test.ts is not part of test:unit, so maintenance:check would not run that fast deterministic scoring coverage.

## Desired Outcome
test:unit includes tests/readiness-score.test.ts and package-script coverage locks that inclusion, so maintenance:check exercises readiness scoring regressions.

## Constraints
- Do not release, tag, publish, bump versions, or change dependencies.
- Keep the change focused on package scripts, package-script tests, and docs/evidence.

## Non-Goals
- No changes to readiness scoring behavior.
- No changes to maintenance-check step ordering.
- No full integration-suite expansion into test:unit.

## Assumptions
- tests/readiness-score.test.ts is fast enough for the unit-oriented guard.

## Likely Files or Areas
- package.json
- tests/package-scripts.test.ts
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json test:unit includes tests/readiness-score.test.ts.
- tests/package-scripts.test.ts asserts readiness-score coverage is in test:unit.
- npm run test:unit passes with the added readiness-score file.
- maintenance:check benefits through its existing test:unit step without new command-order changes.

## Verification Commands
- npm test -- tests/package-scripts.test.ts tests/readiness-score.test.ts
- npm run test:unit
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Adding another file to test:unit slightly increases maintenance-check runtime.
- Pre-existing dirty non-evidence files before task creation: 68 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove tests/readiness-score.test.ts from test:unit and revert package-script test/docs updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
