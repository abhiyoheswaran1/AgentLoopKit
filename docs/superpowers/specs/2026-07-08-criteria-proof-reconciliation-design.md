# Criteria-Proof Reconciliation (B1) — Design

- Date: 2026-07-08
- Status: proposed (autonomous execution under "go ahead systematically"; audit reference)
- Theme B, Feature 1 of the reviewer-trust north-star program. Targets `1.1.0`; under `## Unreleased`.

## North-star this serves

Closes the highest-value part of audit gap **Back #2**: the review packet hands the reviewer the acceptance criteria AND a passing verification, but never cross-references them — the reviewer must reconstruct which criterion is actually backed by which passing command. Today `prepare-pr` even ships a *manual checkbox* "Acceptance criteria match the task contract" (`pr-summary.ts:132`) — faith, not evidence.

## The deterministic framing (constraint)

AgentLoopKit is LLM-free, so we cannot judge whether a diff semantically satisfies "redirect works." B1 does NOT do that. It does **evidence-based reconciliation**: for each acceptance criterion, is it **linked to a verification command that passed**? A criterion is honestly labeled *proven* (linked command passed), *failing* (linked command failed), *not-run* (linked command absent / no report), or *unlinked* (no local proof — reviewer must judge). No overclaiming.

## Linking convention

A criterion line may end with an optional tag `(verified by: <keys>)` where `<keys>` is a comma-separated list of verification-command keys (the keys the verification report records: `test`, `lint`, `typecheck`, `build`, or a custom command key). Case-insensitive. Example:

```
## Acceptance Criteria
- Auth redirect returns users to checkout (verified by: test)
- Lint and types are clean (verified by: lint, typecheck)
- Copy reads clearly to a human
```

The first two are linkable; the third is `unlinked` (honest — no automated proof). Low friction (optional tag); criteria without it degrade gracefully to `unlinked`, which is itself useful signal ("these have no local proof").

## Non-Goals

- No LLM/network/telemetry. Pure deterministic parsing of the contract + the verification report markdown.
- No semantic diff-vs-prose judgment.
- B1 surfaces reconciliation in the `prepare-pr` packet only. `ship` / `review-context` surfacing and the harden tie-in (flag unlinked criteria) are deferred (B2/later).
- Does not change what `verify` records or the report format.

## Architecture

### New module `src/core/criteria-coverage.ts`

- `parseVerificationCommandResults(reportMarkdown: string): Map<string, 'pass' | 'fail'>` — parses the report's `### <key>: <command>` blocks and their `- Status: pass|fail` lines into a key→status map. Missing/empty report → empty map.
- `type CriterionCoverage = { text: string; linkedKeys: string[]; status: 'proven' | 'failing' | 'not-run' | 'unlinked' }`
- `type CriteriaCoverage = { criteria: CriterionCoverage[]; summary: { total: number; proven: number; failing: number; notRun: number; unlinked: number } }`
- `reconcileCriteriaCoverage(taskMarkdown: string | undefined, verificationMarkdown: string | undefined): CriteriaCoverage`:
  - Parse acceptance-criteria lines via `extractMarkdownSectionLines(taskMarkdown, 'Acceptance Criteria')`, dropping the template placeholder.
  - For each: extract a trailing `(verified by: …)` tag → `linkedKeys` (trimmed, lowercased); strip the tag from the displayed `text`.
  - Status: no tag → `unlinked`; else look up each linked key in the report map — any linked key absent → `not-run`; any linked key `fail` → `failing`; all linked keys `pass` → `proven`.
- `renderCriteriaCoverageMarkdown(coverage: CriteriaCoverage): string` — a `## Criteria Coverage` section: a one-line summary (`N criteria — X proven, Y failing, Z not-run, W unlinked`) then a bullet per criterion with its status and linked command keys. Deterministic ordering (contract order).

### Integration — `pr-summary.ts` `generatePrSummary`

`generatePrSummary` already receives `taskMarkdown` and `verificationMarkdown`. Compute `reconcileCriteriaCoverage(taskMarkdown, verificationMarkdown)` once, render its section into the summary markdown (near the acceptance-criteria/reviewer-checklist area — replacing the faith-based checkbox line with the evidence block, or directly above it), and include `criteriaCoverage` in the returned result object so `prepare-pr --json` exposes it.

**Contract note:** adding `criteriaCoverage` to the `prepare-pr --json` shape is a DELIBERATE additive change (it is the feature's output, wanted by reviewers/automation). The locked `prepare-pr` json-shape snapshot is updated intentionally and noted in the changelog — unlike an internal detail leak, this is a public, documented addition.

## Error Handling / Determinism

Pure string parsing; missing task or report → empty/degraded coverage (all `unlinked`/`not-run`), never throws. Deterministic (no timestamps/randomness).

## Testing

- **Reconcile unit tests:** proven (linked key passed), failing (linked key failed), not-run (linked key absent or no report), unlinked (no tag); multi-key link (all must pass); tag stripped from displayed text; placeholder criterion ignored.
- **Report parser unit tests:** parses `### key` + `- Status:` blocks into the map; empty report → empty map.
- **pr-summary integration:** the `## Criteria Coverage` block appears with the right per-criterion statuses; `prepare-pr --json` includes `criteriaCoverage` with the summary counts.
- **Contract-lock:** the `prepare-pr` json-shape snapshot is regenerated (deliberate additive), and `contract:check` is green; the diff to the snapshot is ONLY the added `criteriaCoverage` shape.

## Rollback

Additive: a new module, one integration in `generatePrSummary`, a deliberate snapshot update. Revert by removing the module + integration and restoring the snapshot; the packet returns to the manual checkbox.
