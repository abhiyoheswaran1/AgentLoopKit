# Content-Addressed Handoff Coverage — Design

- Date: 2026-07-08
- Status: proposed (autonomous execution; audit is the approved design reference)
- Theme A, Feature 3 of the reviewer-trust north-star program. Targets `1.1.0`; under `## Unreleased`.

## North-star this serves

Closes audit gap **M3**: handoff coverage is path-membership-based, so a file the latest handoff run "covered" still reads as covered even after it was edited — letting the `handoff-summary` gate report `pass` for a handoff whose prose may no longer match the file's current diff.

## Problem Statement

`dirtyCoveredByLatestHandoffRun` (`src/core/handoff-coverage.ts:117-122`) returns whether every current changed file is covered by the latest handoff run. Its final branch (`coveredPaths.has(normalizeGitStatusPath(changedFile.path))`) is pure path membership. The run's changed-files now carry a per-file content hash (added in A2), but this check ignores it — so an edited-after-the-handoff file (path unchanged, status still `M`) stays "covered."

## Desired Outcome

A changed file counts as covered by the latest handoff run's *changed-files* only if its current content hash matches the hash the run recorded. Coverage that comes from AgentLoopKit evidence artifacts or handoff-prose-parsed paths (which carry no recorded content hash) stays path-based. Legacy runs (no recorded hash) fall back to path-presence. Deterministic, local.

## Non-Goals

- No LLM/network/telemetry. Reuses `computeFileContentHash` (git hash-object) from A2.
- Not verification freshness (A1) or run coverage (A2). Handoff coverage only.
- Does not content-check evidence-artifact / handoff-prose coverage (those have no recorded hash and are AgentLoopKit-owned evidence, not the reviewed diff).

## Architecture

Single function, `dirtyCoveredByLatestHandoffRun` in `src/core/handoff-coverage.ts`:

- Build the covered-run changed-files array exactly as today: `const runChangedFiles = latestRunChangedFiles ?? latestRunRecord?.changedFiles ?? [];`. From it build `runChangedHashByPath: Map<pathNorm, string | undefined>` (each entry's optional `hash`, treating the array as `RunChangedFile[]`). `coveredPaths` (which merges run paths + evidence-artifact paths + handoff-prose paths) is unchanged.
- Convert the final `changedFiles.every(sync)` to an async evaluation (`Promise.all(changedFiles.map(async …))` then `.every(Boolean)`). Per changed file, covered iff:
  1. it's a review-evidence-run artifact, or an agentloop artifact directory, or an evidence-group match (the existing three early-return branches — path-based, unchanged), OR
  2. its path is in `coveredPaths` AND the content check passes: `recordedHash = runChangedHashByPath.get(norm)`; if `recordedHash === undefined` → covered (path-presence: artifact/prose/legacy run), else covered iff `computeFileContentHash(...) === recordedHash`.
- **Bounded hashing:** `computeFileContentHash` is called only when a path has a recorded hash.
- **Safe direction:** a recorded-hash path whose current content mismatches or is unhashable → not covered → `dirtyCoveredByLatestHandoffRun` returns `false` → the `handoff-summary` gate (check-gates) / status guidance flags the handoff as not covering the current dirty files. Fail toward "not covered."

Callers (`status.ts`, `check-gates.ts`, `maintainer-check.ts`) are unchanged: `status` passes `undefined` (function reads the RunRecord, which has hashes); `check-gates` passes a projected run's changed-files (entries without a hash simply fall back to path-presence — non-breaking).

## Error Handling

`computeFileContentHash` is `execa reject:false` (undefined on failure); `readRun` already `.catch(() => undefined)`. Never throws into the coverage path.

## Testing

- **Drop-on-edit (the fix):** a handoff run covers `src/x.ts` (with a recorded hash); with x unchanged → `dirtyCoveredByLatestHandoffRun` true; edit `src/x.ts` after the handoff run → returns false. Revert → true again.
- **Legacy:** a run whose changed-files have no `hash` → path-presence coverage unchanged.
- **Artifact/prose coverage unaffected:** an AgentLoopKit evidence file or a handoff-prose-parsed path stays covered by path (no spurious content check).
- **Surface flow:** the `handoff-summary` gate in `check-gates` flips to warn/not-covered after a post-handoff content change to a covered file.

## Test Migration (flagged)

Existing tests that create a handoff run then mutate a covered file before asserting coverage may now correctly report not-covered — update to content-addressed semantics or keep the file unchanged; never weaken.

## Rollback

Additive: one function's coverage check gains a content gate (with path-presence fallback) plus tests. Revert by restoring the path-only `.every`.
