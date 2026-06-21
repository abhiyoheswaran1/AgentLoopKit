# Document safe AgentFlight verify command syntax

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
Dogfooding created a failed AgentFlight verification record by passing the entire npm test command as one quoted argument. Future agents need repo-local guidance that AgentFlight verify commands should be passed as argv after --.

## Desired Outcome
The autonomous dogfood guide and maintenance docs show the safe AgentFlight verify syntax with -- before the command and warn against passing the whole command as a quoted string.

## Constraints
- Docs and tests only; do not change AgentFlight behavior, AgentLoopKit command behavior, dependencies, release metadata, tags, or publishing.
- Do not rewrite or hide existing failed AgentFlight evidence.

## Non-Goals
- Do not implement AgentFlight command parsing or status readiness changes.
- Do not add cleanup automation for AgentFlight evidence.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/harness/autonomous-dogfooding.md
- docs/maintenance-guards.md
- tests/autonomous-dogfood.test.ts
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-175.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Dogfood guidance includes a concrete example of npx --yes agentflight verify -- npm test -- tests/example.test.ts.
- Guidance says not to pass the full verification command as one quoted string.
- Harness tests protect the AgentFlight verify syntax guidance.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Guidance must stay local and factual; do not imply AgentFlight behavior was fixed by AgentLoopKit.
- Pre-existing dirty non-evidence files before task creation: 89 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the AgentFlight verify syntax guidance and related tests/records.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
