# Harden AgentLoopKit autonomous dogfood harness

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit is already used to build AgentLoopKit, but the repository needs a clearer autonomous operating harness that future Codex sessions can follow. The harness should also dogfood Baseframe Labs companion tools, especially ProjScan and AgentFlight, while keeping the near-term OSS maintenance duties enforceable.

## Desired Outcome
Future coding-agent sessions can read this repo and know exactly how to use AgentLoopKit, ProjScan, AgentFlight, the product panel, target personas, and simulated research cycles to improve AgentLoopKit without cutting releases prematurely.

## Constraints
- Keep changes scoped and do not claim completion without proof.
- Do not cut a version or publish a release.
- Keep everything local-first.
- Do not add cloud services, telemetry, login, billing, or AI API calls.
- Do not make public docs claim simulated feedback as real usage.
- Keep AgentFlight and ProjScan dogfooding transparent and reviewable.

## Non-Goals
- No release.
- No new marketplace channel.
- No paid/pro implementation.
- No dashboard or frontend.

## Assumptions
- AgentFlight is used as a local session recorder and proof helper.
- ProjScan is used as a local repo-health and repo-understanding signal.
- AgentLoopKit remains the main task, verification, review, and handoff loop.
- Product-panel and user-persona files are internal decision-support artifacts.

## Likely Files or Areas
- AGENTS.md
- AGENTLOOP.md
- .agentloop/harness/
- .agentloop/product-panel.md
- .agentloop/user-personas.md
- .agentloop/dogfood-log.md
- .agentflight/
- scripts/dogfood.mjs
- tests/
- docs/
- package.json

## Files or Areas Not to Touch
- package version metadata
- release tags
- npm/GitHub/GHCR/MCP publishing workflows except read-only guard documentation or tests

## Acceptance Criteria
- `npm run dogfood` exercises AgentLoopKit self-checks, ProjScan, and AgentFlight health.
- AgentFlight is initialized with repo-safe config and ignores noisy generated ProjScan local memory artifacts.
- AGENTS.md tells future Codex sessions to use AgentLoopKit, ProjScan, AgentFlight, personas, and research cycles.
- Harness docs explain when to use the product panel and target personas.
- A docs page explains the autonomous dogfood workflow without claiming real user feedback.
- Near-term maintenance guardrails stay documented: release pipeline health, public-doc hygiene, release proof, SchemaStore freshness, small policy packs, and read-only GitHub metadata.
- Tests cover the dogfood script, autonomous harness guidance, and near-term maintenance guardrails.

## Verification Commands
- npm run test:unit
- npm run check:public-docs
- npm run check:links
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor
- node dist/cli/index.js check-gates --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Dogfood tooling can become noisy if generated local memory/session files are treated as product code.
- Public docs must not present simulated research as real user evidence.
- AgentFlight/ProjScan use must remain transparent and local-first.

## Rollback Notes
Revert the harness, script, docs, and test changes. Remove `.agentflight/` if the repo no longer wants AgentFlight dogfood configuration.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
