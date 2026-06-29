# Add autonomous loop scorecards

- Created date: 2026-06-28
- Task type: feature
- Status: done

## Problem Statement
Users can create and run guarded loops, but they need a deterministic pre-flight decision that says whether a loop can continue autonomously, must ask a human, or should stop before wasting tokens or drifting out of scope.

## Desired Outcome
AgentLoopKit provides a read-only loop scorecard that scores autonomous loop safety, token budget, guardrails, evidence freshness, scope drift, and next action before another iteration runs.

## Constraints
- Do not release, tag, publish, push, or bump versions.
- Stay local-first and deterministic; do not call an LLM or external service.
- Do not add dependencies.
- Use compact context handles instead of broad repo reads.

## Non-Goals
- Do not make AgentLoopKit a coding agent.
- Do not auto-fix code from the scorecard command.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/loop-contract.ts
- src/core/evidence-map.ts
- src/core/upgrade-harness.ts
- src/cli/commands/loop.ts
- src/index.ts
- tests/loop-contract.test.ts
- tests/evidence-map.test.ts
- tests/upgrade-harness.test.ts
- docs/loop-contracts.md
- docs/cli-reference.md
- docs/superpowers/specs/2026-06-28-loop-scorecard-design.md
- docs/superpowers/plans/2026-06-28-loop-scorecard.md
- README.md
- CHANGELOG.md
- DECISIONS.md
- AGENTS.md
- AGENTLOOP.md
- .agentloop
- src/templates

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Loop scorecard reports continue, ask-human, stop, or ready decisions with reasons.
- Scorecard exposes token budget, iteration budget, runner guardrail, readiness, and context-pack signals.
- JSON output is stable enough for agents to automate without parsing prose.
- Scorecard is read-only and does not execute runner or verification commands.
- Public docs describe the feature without inflated claims or external references.

## Verification Commands
- npm run test -- tests/loop-contract.test.ts tests/evidence-map.test.ts tests/upgrade-harness.test.ts tests/cli-docs-drift.test.ts
- npm run check:public-docs
- npm run lint
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Loop automation copy must not imply AgentLoopKit writes code or publishes by itself.
- Scorecard must not hide failed or missing verification.

## Rollback Notes
Remove the scorecard command/API/tests/docs and keep existing loop create/tick/run behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
