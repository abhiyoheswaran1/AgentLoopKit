# Content-Addressed Run-Ledger Coverage — Design

- Date: 2026-07-08
- Status: proposed (autonomous execution under standing "continue all the way" directive; audit is the approved design reference)
- Theme A, Feature 2 of the reviewer-trust north-star program. Targets `1.1.0`; lands under `## Unreleased`.

## North-star this serves

*A reviewer can trust an agent's work from local evidence alone, without taking anything on faith.* Closes audit gap **M2**: run-ledger coverage is path-presence-based, so a file reads as "explained by recent run evidence" even if its content changed after that run.

## Problem Statement

A run records `.agentloop/runs/<id>/changed-files.json` as a `GitFileStatus[]` (`{ status, path }` only — no content). `readRecentRunCoverage` (`evidence-map.ts:258`) builds a `Set` of run paths; `findRunCoverage` (`evidence-map.ts:288`) marks a changed file `coveredByRun` purely because its path appears in a recent run for the current task. `coveredByRun` then makes the file NOT `unexplained` (`evidence-map.ts:437`). So a reviewer sees a file as covered by run evidence even though its current content differs from what the run actually exercised.

## Desired Outcome

Run coverage is content-addressed: each changed file's content hash is recorded at run time, and a file counts as `coveredByRun` only if its current content hash matches the recorded one. Deterministic, local. Legacy runs (no recorded hash) fall back to path-presence (non-breaking).

## Non-Goals

- No LLM/network/telemetry. Hashing is local `git hash-object`.
- Not verification freshness (A1, done) or handoff coverage (A3, next). This is run-ledger coverage only.
- No change to what a run records beyond adding a per-file `hash`, and no change to run identity/lifecycle.

## Architecture

### Content-hash helper (reuse A1's home — `src/core/verified-state.ts`)

```
computeFileContentHash({ cwd, filePath }): Promise<string | undefined>
```

Returns the git blob hash via `git hash-object -- <filePath>` (deterministic, git-native, same normalization git uses), or `undefined` when the file cannot be hashed (deleted/missing/git failure). Never throws (`execa` `reject:false`).

### Record (runs.ts)

The three run-record functions call `sanitizeChangedFiles`. Add an async `changedFilesWithHashes(cwd, changedFiles)` that, for each changed file, computes `computeFileContentHash` on the REAL path (before path-sanitizing) and records `{ status, path: safePath, hash }` — omitting `hash` for files that cannot be hashed (e.g. deleted). The recorded type becomes `RunChangedFile = { status: string; path: string; hash?: string }`. `readRunChangedFiles` returns `RunChangedFile[]` (the optional `hash` is simply absent for legacy runs).

### Compare (evidence-map.ts)

- `readRecentRunCoverage` builds, per run, a `Map<pathNorm, hash | undefined>` instead of a `Set<pathNorm>`.
- In `buildEvidenceMap`'s file loop, for a changed file whose path matches a run entry that HAS a recorded hash, compute the file's CURRENT `computeFileContentHash` and compare. **Content hashing is lazy** — only computed when a path-match with a recorded hash exists, bounding the cost.
- `findRunCoverage` returns covered iff: path matches AND (no recorded hash → legacy path-presence) OR (recorded hash present AND current hash equals it). A recorded-hash mismatch → NOT covered by that run.
- The `coveredByRun` explanation stays for the covered case; a file that path-matched but content-mismatched is simply not covered by run (falls to its other evidence, else `unexplained`).

## Behavior

- Legacy run entries (no `hash`) → path-presence coverage, unchanged.
- Current file unhashable (deleted/missing) → path-presence fallback (safe; don't spuriously drop coverage on a compute failure).
- Deterministic; git blob hashes, no timestamps.

## Error Handling

All hashing is `execa` `reject:false`; any failure yields `undefined` → path-presence fallback. Never throws into the evidence pipeline.

## Testing

- **Helper unit tests:** `computeFileContentHash` returns a stable git blob hash for a tracked file; changes when content changes; `undefined` for a missing file; never throws.
- **Record test:** a recorded run's `changed-files.json` entries carry a `hash` for existing changed files.
- **Coverage e2e (the fix):** record a run covering `src/x.ts`; with x unchanged → `coveredByRun` true; edit `src/x.ts` after the run → `coveredByRun` false (content mismatch) and the file becomes `unexplained` (assuming no other evidence). Revert → covered again.
- **Legacy test:** a run whose `changed-files.json` entries have no `hash` → path-presence coverage (unchanged behavior).
- **Surface flow:** `explain-diff` / `guard` reflect the file as unexplained after a post-run content change (propagation through the shared evidence map).

## Test Migration (flagged)

Existing tests that record a run then mutate the covered file before asserting `coveredByRun`/explained may now correctly report not-covered. Update to the new content-addressed semantics or keep the file unchanged between run and assertion — never by weakening an assertion.

## Contract Note

`changed-files.json` is an internal run artifact; adding an optional `hash` field is additive. If `contract:check` locks any run `--json` shape that surfaces changed-file entries, the added optional field is expected and the snapshot is regenerated (additive), not a breaking change.

## Rollback

Additive: new helper, an optional recorded field, a compare branch (with path-presence fallback preserved), plus tests. Revert by dropping the helper call in record and the hash comparison in coverage; run coverage returns to path-presence.
