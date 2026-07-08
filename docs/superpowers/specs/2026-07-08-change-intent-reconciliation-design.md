# Change-Intent Reconciliation (B2) — Design

- Date: 2026-07-08
- Status: proposed (autonomous; audit reference). Theme B, Feature 2. Targets `1.1.0`; under `## Unreleased`.

## North-star / gap

Completes the change-side of audit gap **Back #2**, pairing with B1 (criteria proof). The evidence map already computes which changed files are `unexplained` / `forbiddenByTask` (not tied to the contract's intent), but the PR packet body only shows the *count* (`renderEvidenceMapCompactMarkdown`); the actual file list is a handle-expand away (`context show evidence-map:current`). A reviewer doing a single pass shouldn't have to expand a handle to see which changes aren't accounted for by intent.

## Desired Outcome

The `prepare-pr` packet body lists the changed files **not tied to intent** (unexplained or forbidden-by-task) with their one-line explanations, directly under the Evidence Map section — so the reviewer sees the change-side of the reconciliation next to B1's criteria-side, in one view, without expanding a handle.

## Non-Goals

- No LLM/network/telemetry. Pure render of already-computed `evidenceMap.files`.
- Markdown-only: `evidenceMap.files[]` is ALREADY in `prepare-pr --json`, so NO `--json`/contract change and NO snapshot update.
- Not the `summarize`/`handoff` surfaces (their `generatePrSummary` does not build an evidence map) — those would need evidence-map threading; deferred. B2 targets the `prepare-pr` packet, which already has the evidence map.
- Not B3 (scope precision).

## Architecture

- New `renderChangeIntentMarkdown(map: Pick<EvidenceMap, 'files'>): string` in `src/core/evidence-map.ts`: lists files where `unexplained || forbiddenByTask`, each as `- \`path\` (\`status\`): <explanation>` (reuse the existing per-file explanation), in contract/diff order. If none → a single positive line: `- All changed files are tied to task scope or recorded evidence.`
- In `prepare-pr.ts` `buildPrBody`, render it immediately after the compact Evidence Map line (extend the `## Evidence Map` section — no new top-level heading).

## Error Handling / Determinism

Pure function over `evidenceMap.files`; deterministic order; never throws.

## Testing

- **Renderer unit test:** files with `unexplained`/`forbiddenByTask` are listed with path+status+explanation; a map with none → the positive line; ordering is deterministic.
- **prepare-pr integration:** with an unexplained changed file, the packet body's Evidence Map section lists that file (not just the count); with everything covered, the positive line appears.
- **No contract change:** `contract:check` stays green with NO snapshot update (assert the change is markdown-only).

## Rollback

Additive markdown: a renderer + one placement in `buildPrBody`. Revert by removing both.
