# AgentLoopKit 1.0 — "Adopt With Confidence"

**Status:** Design (approved framing, pending spec review)
**Date:** 2026-07-06
**Current version:** 0.47.1
**Target:** 1.0.0

## Summary

AgentLoopKit 1.0 is a **stability and trust** release, not a feature release. The
product already has a deep, mature command surface (~40 commands spanning init,
task contracts, verification, ship, guard, context contract, loop contracts, MCP
server, and Baseframe suite integration). Nothing in the 0.x line is committed as
stable, so teams cannot safely build CI pipelines or shared agent workflows on top
of it.

1.0 turns the **entire current surface into a guaranteed public contract** and
proves — in CI — that the contract holds. The reviewer question this release must
answer with a hard "no" is: *"If I build my team's CI and agent workflow on
AgentLoopKit, will a v1.x release break me?"*

## Decisions (locked)

1. **Release intent:** 1.0 stability & trust. Freeze the surface as a committed
   public contract; add SemVer guarantees, a deprecation policy, and
   adopt-with-confidence positioning.
2. **Surface scope:** Commit **everything currently shipped** as stable. Maximum
   trust signal. Consequence: every future removal or breaking change is a 2.0
   event, and the newest surfaces (`loop*`, `baseframe/*`) get locked too — so
   they must be audited hardest before the freeze.
3. **Escape hatch (PM guardrail):** Because "freeze all 40 commands" would
   otherwise block shipping anything new in 1.x, 1.0 introduces a documented
   **experimental tier** for *future* features so new capabilities can ship in
   1.x minor releases without being instantly frozen.

## Goals

1. A precisely defined public contract enumerating every committed surface.
2. A written, published, and **CI-enforced** SemVer + deprecation policy.
3. Contract-lock tests that fail the build if any committed surface changes
   without an intentional version bump.
4. A pre-freeze consistency audit that fixes divergences before locking.
5. A guaranteed upgrade path: any 0.x repo migrates cleanly to 1.0.
6. "Adopt with confidence" positioning across README and docs.

## Non-Goals for 1.0

- No new commands.
- No new integrations.
- No scope expansion beyond the existing ROADMAP.md Non-Goals (no hosted SaaS, no
  LLM wrapper, no telemetry, no database, no IDE replacement).
- Sneaking features into the stability release is the primary threat to shipping a
  clean 1.0 and is explicitly out of scope.

## The public contract (six committed axes)

The stability guarantee covers exactly these surfaces. Each command/surface is
classified `stable` (frozen, additive-only) or `internal` (not part of the
contract).

1. **CLI commands + flags** — every command in `src/cli/commands/` and its
   documented flags. Flag *names*, *semantics*, and *defaults* are frozen.
2. **`agentloop.config.json` schema** — the config file shape under `schema/`.
   Existing fields frozen; new fields must be optional and backward-compatible.
3. **MCP tool surface** — tool names and input/output schemas exposed by
   `agentloop mcp-server`.
4. **`--json` output shapes** — the JSON envelope and field set for every command
   that supports `--json`. Additive changes only.
5. **Exit codes** — the meaning of 0 / non-zero exit codes, consistent across all
   commands.
6. **Generated harness format + package API** — the layout and template of
   generated files (`AGENTS.md`, `AGENTLOOP.md`, `.agentloop/`) and the public
   package API exports (`dist/index.js` / `dist/index.d.ts`).

## Workstreams

### WS1 — Define the contract
Write `docs/stability.md` enumerating all six committed axes above. For each
command: list committed flags, `--json` shape reference, exit-code semantics, and
its tier (stable/internal). This document is the single source of truth for what
1.0 promises.
**Deliverable:** `docs/stability.md`.

### WS2 — Consistency audit & freeze-prep (critical path, largest effort)
Systematically sweep all ~40 commands for divergences and fix them *before*
locking, because after 1.0 they are frozen until 2.0. Audit dimensions:

- Flag naming conventions (e.g. path redaction, task selection, strict modes) are
  consistent across commands.
- `--json` envelope shape is consistent (same top-level structure, error shape,
  metadata fields).
- Exit-code semantics mean the same thing everywhere (e.g. 0 = ok, 1 = failure,
  2 = misuse — pick and enforce one scheme).
- Path redaction behavior is uniform where `--redact-paths` is offered.
- Error message format is consistent.

The newest surfaces (`loop*`, `baseframe/*`, `release-*`) receive the hardest
review since they are least battle-tested.
**Deliverable:** a fixed, internally consistent surface + an audit report listing
what was found and changed.

### WS3 — Contract-lock tests (makes "stable" enforceable)
Snapshot/golden tests for every committed surface:

- CLI `--help` output per command.
- `agentloop.config.json` JSON schema.
- MCP tool names + schemas.
- Representative `--json` output per command (fixture-driven, deterministic).

A change to any locked snapshot fails CI unless the snapshot is intentionally
updated. Add a `contract:check` npm script and wire it into `release-flow`.
**Deliverable:** contract-lock test suite + `contract:check` in the release flow,
green.

### WS4 — Versioning policy + experimental escape hatch
Publish `docs/versioning.md`:

- SemVer promise for the stable tier (no breaking changes in 1.x).
- Deprecation policy: minimum one-minor deprecation window, `DEPRECATED` warnings
  on stderr, no removals before 2.0.
- **Experimental tier convention** for *future* features: a documented mechanism
  (e.g. an `experimental` grouping / explicit opt-in surface + an `experimental:
  true` marker in output) so new capabilities can ship in 1.x without joining the
  frozen contract until promoted.

**Deliverable:** `docs/versioning.md` + the experimental-tier convention,
referenced from `docs/stability.md`.

### WS5 — Upgrade guarantee + positioning
- Harden `upgrade-harness` so every prior 0.x template version migrates to the 1.0
  harness format. Add a test matrix across historical template versions.
- Positioning: README stability section + versioning guarantees, a migration guide
  for 0.x → 1.0, and "adopt with confidence" messaging.

**Deliverable:** reliable `upgrade-harness` across a version matrix + launch-ready
docs.

## Sequencing

```
WS1 (define contract)  ──┐
                          ├──► WS2 (audit & fix) ──► WS3 (lock tests) ──► 1.0 release
WS4 (policy + escape hatch) ──────────────────────┘        │
WS5 (upgrade + positioning) ───────────────────────────────┘
```

- WS1 and WS4 start immediately, in parallel.
- WS2 is the critical path and the largest effort.
- WS3 can only lock surfaces WS2 has finished fixing.
- WS5 lands last, before release.

## Success metrics

- 100% of committed surfaces have a contract-lock test.
- `contract:check` is wired into `release-flow` and green.
- The consistency audit is closed with zero known divergences in the stable tier.
- `upgrade-harness` migrates every prior template version in a test matrix.
- `README`, `docs/stability.md`, and `docs/versioning.md` are published.

## Risks

- **Freezing newest surfaces too early.** `loop*` and `baseframe/*` are weeks old;
  locking their JSON shapes may prove premature. Mitigation: WS2's hardest review
  targets them; if any is judged not-ready, classify it `experimental` (via WS4)
  rather than `stable` for 1.0 — this is the one permitted deviation from "commit
  everything."
- **Scope creep.** The stability release invites "while we're here" features.
  Mitigation: the Non-Goals section is enforced in review.
- **Audit reveals large inconsistency debt.** WS2 could balloon. Mitigation: WS2
  produces its audit report first (findings before fixes) so the fix cost is
  visible and can be scoped/triaged before committing to the release date.
