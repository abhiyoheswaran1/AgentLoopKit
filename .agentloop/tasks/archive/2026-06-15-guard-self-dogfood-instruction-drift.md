# Guard self-dogfood instruction drift

- Created date: 2026-06-15
- Task type: test-generation
- Status: done

## Problem Statement
Self-dogfood instructions can drift from repo scripts and stop teaching future agents the real workflow

## Desired Outcome
A checked test fails if the self-dogfood harness stops mentioning the required start, strict, AgentFlight, and ProjScan commands

## Constraints
- Keep the change repo-local; do not add public README/npm claims for internal dogfood mechanics.
- Do not bump versions, create tags, publish packages, or run release workflows.

## Non-Goals
- Do not add a new user-facing CLI command.
- Do not change AgentFlight, ProjScan, or AgentLoopKit release behavior.

## Assumptions
- Future autonomous sessions use `.agentloop/harness/autonomous-dogfooding.md` as the repo-local workflow guide.

## Likely Files or Areas
- `.agentloop/harness/autonomous-dogfooding.md`
- `tests/autonomous-dogfood.test.ts`
- `.agentloop/dogfood-log.md`
- `.agentloop/backlog.md`

## Files or Areas Not to Touch
- `README.md`
- `package.json` version
- Release workflows, release notes, npm/GitHub/GHCR/MCP registry metadata

## Acceptance Criteria
- A focused test fails if the dogfood guide stops documenting the source-first AgentLoopKit CLI path.
- The dogfood guide explains why `npm run dogfood:start` works before `dist/` exists.
- The change remains internal harness documentation and test coverage only.
- The dogfood log and backlog record why the guard exists.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts
- npm run test:unit
- npm run typecheck
- npm run lint
- npm run check:links

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts
- agentloop handoff --write-run --redact-paths
- npm run dogfood:strict
- npx --yes agentflight doctor
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the test addition and the single dogfood-guide sentence if this guidance becomes obsolete.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
