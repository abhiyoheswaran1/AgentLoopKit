# Decide AgentLoop Context Contract product direction

- Created date: 2026-06-22
- Task type: research
- Status: done

## Problem Statement
We need to decide whether AgentLoop Context Contract should become the next flagship product direction before Headroom-like reducer work.

## Desired Outcome
Record persona-backed internal decision support, measurable usefulness criteria, and the next scoped product tasks for AgentLoop Context Contract.

## Constraints
- Use simulated personas and existing local dogfood evidence only; do not present this as real user research or adoption proof.
- Do not implement code, bump versions, tag, publish, or run release work in this research task.
- Favor repo-aware context selection, transparent receipts, and reversible local evidence over silent prompt rewriting or provider traffic interception.

## Non-Goals
- No proxy/wrapper implementation.
- No public marketing claim that estimates equal provider tokenizer or billing savings.
- No external participant recruitment, telemetry, analytics ingestion, or private-data processing.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/product-panel.md
- .agentloop/user-personas.md
- .agentloop/backlog.md
- .agentloop/research/
- docs/research.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Decision states whether AgentLoop Context Contract becomes the next flagship direction.
- Findings include team-persona and target-user-persona rationale.
- Impact metrics cover context reduction, agent readiness, setup success, reviewability, source retrieval, and safety.
- Follow-up tasks are phased and scoped.

## Verification Commands
- node dist/cli/index.js review-context --redact-paths

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Archive or mark the research task superseded if the product direction changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
