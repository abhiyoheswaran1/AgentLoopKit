# Add check-gates command

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement
Agents can create tasks, run verification, and handoff, but there is no deterministic command that checks whether the basic evidence gates are ready before review.

## Desired Outcome
Add a lightweight agentloop check-gates command with human and JSON output that checks task, verification, handoff, harness, policy, and git evidence without running tests or calling an LLM.

## Constraints
- No LLM calls, telemetry, cloud backend, database, or hidden network calls.
- Do not execute verification commands from check-gates.
- Keep the command deterministic and local-first.

## Non-Goals
- No policy engine.
- No static HTML report.
- No dashboard or SaaS feature.

## Assumptions
- Gate readiness can be useful even when it is advisory and does not replace human review.

## Likely Files or Areas
- src/cli/index.ts
- src/cli/commands
- src/core
- tests
- README.md
- docs

## Files or Areas Not to Touch
- .env
- npm-credentials

## Acceptance Criteria
- check-gates-human-output
- check-gates-json-output
- tests-cover-pass-and-warning-paths

## Verification Commands
- npx pnpm@10.12.1 test tests/check-gates.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the check-gates command, tests, docs, and product records.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
