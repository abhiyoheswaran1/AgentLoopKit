# Hardening Gate Fails by Default (C1) — Design

- Date: 2026-07-08
- Status: proposed (user-approved product decision: flip to fail-by-default with a downgrade flag). Theme C, Feature 1. Targets `1.1.0`; under `## Unreleased`.

## North-star / decision

The `contract-hardening` gate currently **warns** when a task contract has blocking soft spots (unverifiable acceptance criteria, unbounded scope, etc.), failing only under `--strict`. That means `check-gates`/`ready` can report **pass/ready on a thin contract** — false comfort, the opposite of the north-star. User decision: flip to **fail by default**, with a `--allow-soft-spots` flag to downgrade to a warning for teams that want the gentler behavior. This is unreleased (ships in 1.1.0), so no 1.0 user breaks; upgrading makes `check-gates`/`ready` newly red on un-hardened contracts.

## Desired Outcome

- `check-gates`: the `contract-hardening` gate is `fail` when there are blocking soft spots (was `warn`); `--allow-soft-spots` downgrades it to `warn`.
- `ready`: the `contract-hardening` gate is `fail` when there are blocking soft spots (was `warn`) → `ready.status` becomes `blocked`; `--allow-soft-spots` downgrades it to `warn`.
- The escape hatch is a per-invocation flag (not a config opt-in, per the chosen option).

## Non-Goals

- No LLM/network/telemetry. Reuses the existing `analyzeContract` blocking-count already computed in both gates.
- Does not change soft-spot detection, `harden`, or the steer-to-harden next-action.
- Not the ship-skipped-commands (C2) or harden-at-create-task (C3) items.

## Architecture

- `src/core/check-gates.ts`: add `allowSoftSpots?: boolean` to `checkGates` options. The `contract-hardening` gate status becomes `blockingCount > 0 ? (options.allowSoftSpots ? 'warn' : 'fail') : 'pass'` (message unchanged). `overallStatus` then fails by default (a `fail` gate → overall `fail`), and `--strict` is now moot for this gate (already fail).
- `src/core/ready.ts`: `buildReadyGates` gains `allowSoftSpots?: boolean`; the `contract-hardening` gate (line ~149) becomes `blockingCount > 0 ? (allowSoftSpots ? 'warn' : 'fail') : 'pass'`. `statusFromGates` already returns `blocked` on any `fail`, so a soft-spot contract is `blocked` by default.
- CLI: add `.option('--allow-soft-spots', 'treat unresolved blocking soft spots as a warning instead of a failure')` to `check-gates` and `ready`, threading it into `checkGates`/the ready evaluation.

## Contract / surface

- Adding `--allow-soft-spots` to `check-gates` and `ready` changes their `--help` — the `cli-help.contract` snapshots for those two commands are updated (DELIBERATE additive flag). The `--json` shapes are unchanged (the gate object shape is `{id,name,status,message}`; only a status VALUE changes, which the shape lock does not capture).
- `docs/cli-reference.md` / README: add the flag to the check-gates/ready reference if those docs enumerate flags (confirm; the drift test only requires command presence, not flags — update docs only if a test/doc convention requires it).

## Error Handling / Determinism

No new failure modes; the blocking count is already computed. Deterministic.

## Testing

- **check-gates:** a thin active contract (blocking soft spots) → the `contract-hardening` gate is `fail` and `overallStatus` is `fail` by DEFAULT (no `--strict`); with `--allow-soft-spots` → the gate is `warn` and `overallStatus` `warn`; a hardened contract → `pass` (unchanged).
- **ready:** thin contract → `status` `blocked` by default; `--allow-soft-spots` → `warn`/not-blocked; hardened → ready.
- **CLI help:** the `cli-help.contract` snapshots for check-gates + ready gain the flag (deliberate update; confirm ONLY the flag line changed).
- **Migration:** update the hardening-gate-specific tests that asserted the OLD `warn`/pass-by-default behavior to the new `fail`-by-default (this is the intended behavior change, not a weakened assertion). Most check-gates fixtures were already hardened in the harden feature, so they are unaffected.

## Rollback

Revert the gate-status expression in both files + the two CLI flags + the help-snapshot update. Behavior returns to warn-by-default.
