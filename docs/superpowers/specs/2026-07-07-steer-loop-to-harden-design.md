# Steer the Loop to Harden — Design

- Date: 2026-07-07
- Status: approved for planning
- Feature 1 of the harden follow-on program (targets the 1.1.0 bundle; lands under `## Unreleased`).

## Problem Statement

The `agentloop harden` feature added a soft-spot detector and a `contract-hardening` gate in `check-gates`/`ready`. But that gate sits at the *review boundary* — late in the loop. The guidance an agent follows on every step (`next`, `start`, `status`, and the unified `nextAction` field) does not yet know about soft spots, so it will happily steer an agent toward implementing, verifying, and handing off a thin/placeholder contract.

This is the single strongest, freshest dogfooding pain (all three 2026-06-19 real-repo trials): a placeholder task contract "could flow too far" — `verify` passes on real command evidence, `status`/`next` still recommend `handoff`, and `ship`/`prepare-pr`/`check-gates` "exposed the placeholders later," creating "reviewer-facing noise at exactly the point AgentLoopKit is supposed to make handoff evidence boring and trustworthy." We built the detector; we did not wire it into the guidance an agent actually follows first.

## Desired Outcome

When the active task contract has blocking soft spots, `agentloop next`, `start`, `status`, and the `nextAction` field recommend `agentloop harden` as the next safe step — *before* verify/handoff/ship — so a thin contract is hardened before it flows downstream. Deterministic, LLM-free, no new command.

## Non-Goals

- No LLM, no network, no telemetry (reuses the existing deterministic `analyzeContract`).
- No new command or new CLI surface — this is smarter routing through the existing shared next-action source.
- Not `guard`'s separate `nextActions[]` (drift/proof-debt is a distinct concern) — scope stays on the shared evidence-map next-action source that feeds `next`/`start`/`status`/`nextAction`.
- Not re-touching the `check-gates`/`ready` harden gate (already shipped) — this complements it at the guidance layer, no duplication.

## Architecture

Single integration point. `nextActions()` in `src/core/evidence-map.ts` builds the ordered recommendation array that `nextAction(map)` (= `map.nextActions[0]`) exposes to `next`, `start`, `status`, and the MCP `nextAction` field.

Add one new action inside `nextActions()`:

- **Position:** immediately after the `create-task` block (fires only when there is *no* task — mutually exclusive with this action) and **before** the verification block. This makes it `nextActions[0]` for any active thin contract, regardless of verification state.
- **Condition:** the active task contract has ≥1 **blocking** soft spot.
- **Action:** `{ command: 'agentloop harden', reason: '<N> blocking soft spot(s) in the task contract — harden it before implementing or verifying.' }` where `<N>` is the blocking count.

To keep `nextActions()` operating on primitives, `buildEvidenceMap` performs the detection: it runs `analyzeContract(taskMarkdown)` (imported from `./harden.js`) on the active task's markdown, counts blocking soft spots via `hasBlockingSoftSpots`/severity filter, and passes a single new `blockingSoftSpotCount: number` field into `nextActions()`. `nextActions()` pushes the harden action when `input.blockingSoftSpotCount > 0`. `buildEvidenceMap` already loads the active task; if its markdown is unavailable/unreadable, the count is `0` and the harden action is omitted — the evidence map never fails because of this (fail-safe).

## Behavior

- Fires on **blocking** soft spots only; advisory soft spots never trigger the recommendation (consistent with the gate).
- Takes precedence even when verification passed, failed, missing, or is stale — a thin contract means any verification is proving an underspecified spec, so `harden` stays the top recommendation until the blocking spots are resolved.
- Once the blocking spots are resolved (via `agentloop harden --resolve`), the action disappears and the loop flows on to verify/ship as before.
- The existing "review scope before handoff" action (unexplained/forbidden files) is untouched and coexists below the harden action in the list.

## Error Handling

`analyzeContract` is pure and deterministic. If the active task's markdown cannot be read, the harden action is simply not added; no exception propagates into `buildEvidenceMap`.

## Testing

- **Unit (`evidence-map`):** an active contract with blocking soft spots → `nextActions[0].command === 'agentloop harden'`, asserted even when verification is missing/failing/stale (proves the before-verify precedence) and when the diff is otherwise reviewable (proves it outranks `ship`). A contract with zero blocking soft spots → next-action behavior unchanged.
- **Surface coverage:** confirm `next`, `start`, `status`, and the MCP `nextAction` field surface the harden recommendation for a thin active contract (they all consume `map.nextActions[0]`).
- **Fail-safe:** unreadable task content → no harden action, no thrown error.

## Test Migration (flagged up front)

Some existing `next`/`start`/`status`/evidence-map fixtures use minimal contracts that ship with an unfilled "Files or Areas Not to Touch" (`None recorded yet.`), which is a blocking `unbounded-scope` soft spot. Those fixtures will now recommend `harden` first. Each affected fixture gets hardened (add a real forbidden-scope entry / fill the thin section) so the test asserts its original intent — the same legitimate fixture-hardening pattern verified in the harden feature's gate work. The plan enumerates and updates these; no assertion is weakened.

## Rollback

Fully additive: one new action in `nextActions()`, one new input threaded from `buildEvidenceMap`, plus tests and fixture updates. Revert by removing the action + input and restoring the fixtures. No existing command behavior is otherwise changed.
