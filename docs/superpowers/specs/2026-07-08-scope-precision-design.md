# Scope-Coverage Precision (B3) — Design

- Date: 2026-07-08
- Status: proposed (autonomous; audit reference). Theme B, Feature 3 (small). Targets `1.1.0`; under `## Unreleased`.

## North-star / gap

Closes audit gap **Mid H2**: a "Likely Files or Areas" entry like `src/core/` covers *any* changed file under that directory (directory-glob), so an unrelated edit smuggled into the same tree reads as "covered by task scope" with the same confidence as a file the contract named exactly. The reviewer can't tell the strong guarantee (this file was named) from the weak one (this file is merely under a named directory) without opening the diff.

## Desired Outcome

When a changed file is `coveredByTask`, its evidence-map explanation states whether it matched an **exact** likely-file entry (strong) or only a **directory** scope (weaker — the file itself was not named). The reviewer sees the weaker guarantee where it applies.

## Non-Goals

- No LLM/network/telemetry. Pure reclassification of the existing path match.
- Value-only: the `explanation` is already a string field in `evidenceMap.files[]` `--json`; changing its wording is NOT a shape change, so NO `--json`/contract change and NO snapshot update. No new field is added (keeping the public surface minimal — the precision lives in the human-readable explanation).
- Does not change `coveredByTask` (still true for both exact and directory matches — both ARE in scope; the distinction is confidence, surfaced in the explanation).

## Architecture

- `src/core/evidence-map.ts`: add `taskCoverageKind(filePath, patterns: PathPattern[]): 'exact' | 'directory' | undefined` — `exact` if the file equals a pattern value; else `directory` if it matches a directory pattern by prefix; else `undefined`.
- In `buildEvidenceMap`'s file loop, when `coveredByTask`, compute `coveredByTaskKind = taskCoverageKind(file.path, likelyPatterns)` and pass it to `explanationFor`.
- `explanationFor`'s `coveredByTask` branch returns:
  - `directory` → "Changed file is under a task likely-file *directory* scope — the file itself is not named."
  - otherwise → "Changed file matches an *exact* task likely-file entry."

## Error Handling / Determinism

Pure function; deterministic. `taskCoverageKind` mirrors `pathMatchesPattern`'s existing exact-vs-prefix logic, so it can never disagree with `coveredByTask`.

## Testing

- **`taskCoverageKind` unit tests:** an exact file entry → `exact`; a file under a directory entry → `directory`; a file equal to a directory entry → `exact`; no match → `undefined`.
- **Explanation:** a directory-covered file's evidence-map explanation names the directory (weaker) wording; an exact-covered file's explanation names the exact (stronger) wording.
- **No contract change:** `contract:check` green with NO snapshot update.

## Rollback

Value-only: a helper + a branch in `explanationFor`. Revert by restoring the single fixed explanation string.
