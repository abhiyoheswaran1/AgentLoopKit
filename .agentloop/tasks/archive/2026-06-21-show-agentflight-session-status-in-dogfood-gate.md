# Show AgentFlight session status in dogfood gate

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Dogfooding showed npm run dogfood:strict can pass AgentFlight doctor while AgentFlight status still reports the session as blocked by an earlier failed verification. The dogfood gate should surface session readiness, not only tool health.

## Desired Outcome
The dogfood gate runs AgentFlight status as a visible advisory session-readiness step after AgentFlight doctor, while preserving exit-code based behavior and avoiding brittle parsing of AgentFlight human output.

## Constraints
- Do not parse AgentFlight human output for readiness, do not mutate AgentFlight evidence, and do not delete or rewrite failed verification records.
- Keep dogfood behavior exit-code based: the new step fails only if AgentFlight status itself exits non-zero.
- No dependencies, release prep, tag creation, publishing, or version bumping.

## Non-Goals
- Do not change AgentFlight itself or its command classification.
- Do not clear, rewrite, or hide existing AgentFlight failed evidence.
- Do not change maintainer-check warning semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- tests/dogfood-script.test.ts
- .agentloop/harness/autonomous-dogfooding.md
- docs/maintenance-guards.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-174.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- npm run dogfood includes an AgentFlight session status step after AgentFlight doctor.
- The dogfood script test proves AgentFlight status is invoked without --strict or output parsing.
- Docs explain that AgentFlight status is surfaced as session-readiness evidence while command exit codes remain the gate contract.

## Verification Commands
- npm test -- tests/dogfood-script.test.ts tests/autonomous-dogfood.test.ts
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
- Dogfood output can become noisy; keep the new AgentFlight status step advisory and preserve exit-code semantics.
- Pre-existing dirty non-evidence files before task creation: 88 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the AgentFlight status dogfood step and revert the related docs/tests/records.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
