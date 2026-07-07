# Verified-State Fingerprint (Content-Addressed Verification Freshness) — Design

- Date: 2026-07-07
- Status: approved for planning
- Theme A, Feature 1 of the reviewer-trust north-star program (`.agentloop/research/2026-07-07-reviewer-trust-northstar-loop-audit.md`). Targets the `1.1.0` bundle; lands under `## Unreleased`.

## North-star this serves

*A reviewer can trust an agent's work from local evidence alone, in a single pass, without taking anything on faith.* This feature closes the **#1 trust gap**: verification "freshness" is currently time-addressed, so a reviewer can be shown `verification: fresh` for code that was edited after it was verified.

## Problem Statement

`resolveCurrentVerificationEvidence` (`src/core/evidence.ts:140-165`) decides freshness solely by comparing file mtimes: `reportStat.mtimeMs < taskStat.mtimeMs`. Editing source after a passing `verify` touches neither the task file nor the report, so freshness stays `fresh`. The verification report already records git commit and a coarse `dirty/clean` flag (`verification.ts:644-648`), but nothing hashes the verified content and nothing compares it back. Result: `guard`, `explain-diff`, `check-gates`, `ready`, and the `nextAction` guidance can all report a passing/fresh verification for a working tree that has since changed — a direct violation of the north-star.

## Desired Outcome

Verification freshness is **content-addressed**: a fingerprint of the working-tree state is recorded at verify time and compared at freshness-check time. If the working tree changed since verification, freshness is `stale` with a precise reason. Deterministic, local, no network.

## Non-Goals

- No LLM, no network, no telemetry (reuses existing `git.ts` helpers + Node `crypto`).
- Not run-ledger coverage or handoff coverage — those are the next two Theme A features and reuse this feature's primitive. Out of scope here.
- Does not hash untracked-file *bodies* in v1 (see Fingerprint scope) — a documented limitation, not gold-plated now.
- No change to what `verify` executes or how it scores; this only adds a recorded fingerprint and a freshness comparison.

## Architecture

### The primitive — `src/core/verified-state.ts`

```
computeVerifiedStateFingerprint({ cwd }): Promise<string>
```

Returns a deterministic sha256 (Node `crypto`) over the working-tree content that verification ran against:
- `git diff HEAD` — all tracked changes vs HEAD (a new commit or any tracked edit changes this)
- `git status --porcelain` — dirty/untracked **paths** (adding/removing a file changes this)

The two outputs are concatenated with a stable separator and hashed. **Reusable primitive:** the later Theme A features (run-ledger coverage, handoff coverage) call this same function.

**Fingerprint scope (v1):** tracked content + path-level status. It deliberately does NOT hash untracked-file bodies (only their paths). Editing an existing untracked file's body without changing its path is the one case it misses — documented as a known limitation, kept out to avoid walking arbitrary scratch files.

**Outside a git repo / git unavailable:** returns a stable empty-state sentinel value (no throw); freshness then falls back to the mtime rule.

### Recording (verify time)

In `verification.ts`, where the report's branch/commit/dirty lines are written, also compute the fingerprint and write a machine-readable line mirroring the existing "Git commit" line:

```
- Verified-state fingerprint: `<sha256>`
```

### Checking (freshness time)

In `resolveCurrentVerificationEvidence` (`evidence.ts`):
- Parse the fingerprint from the report (one regex, like `extractOverallStatus`).
- Recompute the current fingerprint via `computeVerifiedStateFingerprint`.
- **present + matches** → `fresh` (as today).
- **present + mismatch** → `stale`, reason: *"The working tree changed since verification; the verified-state fingerprint no longer matches. Rerun verification."*
- **absent (legacy report)** → fall back to the existing mtime rule (non-breaking; the trust upgrade applies to reports written from this feature onward).
- The existing mtime check remains as an additional guard (a report older than the task is still stale).

This propagates automatically to `guard`, `explain-diff`, `check-gates`, `ready`, and `nextAction`, since they all consume `resolveCurrent…Evidence`.

## Error Handling

- All git calls reuse existing `git.ts` helpers; failures/outside-repo → empty-state sentinel → mtime fallback, never a throw into the evidence pipeline.
- sha256 is deterministic; no timestamps or randomness enter the fingerprint.

## Testing

- **Primitive unit tests** (temp git repo fixture): same tree → same hash (deterministic, stable across repeated calls); hash changes when a tracked file's content changes; changes when a file is staged/committed; outside a git repo → stable sentinel, no throw.
- **End-to-end freshness test:** `verify` a fixture repo → report carries a fingerprint line → `resolveCurrentVerificationEvidence` reports `fresh`; edit a tracked source file → reports `stale` with the fingerprint-mismatch reason (the exact bug fixed); revert → `fresh` again.
- **Legacy fallback test:** a report with no fingerprint line → freshness uses the mtime rule (behavior unchanged).
- **Surface flow test:** `check-gates` (the `verification` gate) / `guard` reflect `stale` after a post-verify tracked edit — proving the fix flows through the shared evidence source.

## Test Migration (flagged)

Existing tests that `verify` a fixture and then modify the tree before asserting `fresh` may now correctly see `stale`. Each such test is updated to reflect the new content-addressed semantics (the fix is the point), or its fixture is adjusted so the tree is unchanged between verify and assertion — never by weakening the assertion. The plan enumerates any that break.

## Rollback

Additive: new `verified-state.ts`, one recorded line in the report, one comparison branch in freshness (with mtime fallback preserved), plus tests. Revert by removing the module, the recorded line, and the comparison branch; freshness returns to pure mtime. No other behavior changes.
