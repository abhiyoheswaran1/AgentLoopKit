# Evidence Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic local evidence map that explains agent-assisted diffs, surfaces it through `explain-diff`, reuses it in review outputs, and generates resume packs.

**Architecture:** Add a focused `src/core/evidence-map.ts` composition module over existing Git, task, verification, gates, run-ledger, change-area, and Markdown helpers. Add small CLI command wrappers for `explain-diff` and `resume-pack`, then integrate a compact summary into `review-context`, `ship`, and `prepare-pr` without changing release or publishing behavior.

**Tech Stack:** TypeScript, Commander, Vitest, existing AgentLoopKit core helpers, local Git metadata.

---

## File Map

- Create `src/core/evidence-map.ts`: core JSON model, path coverage rules, render helpers.
- Create `src/cli/commands/explain-diff.ts`: read-only CLI wrapper for human/JSON evidence map output.
- Create `src/cli/commands/resume-pack.ts`: read-only CLI wrapper for continuation briefs.
- Modify `src/cli/index.ts`: register the two commands.
- Modify `src/core/review-context.ts`: include compact evidence map in JSON and human output.
- Modify `src/core/ship.ts`: include compact evidence map in ship result and Markdown.
- Modify `src/core/prepare-pr.ts`: include compact evidence map in PR body.
- Modify docs: `README.md`, `docs/cli-reference.md`, `docs/status.md` or a new `docs/evidence-map.md`, `ROADMAP.md`, `DECISIONS.md`.
- Add tests: `tests/evidence-map.test.ts`, `tests/cli-explain-diff.test.ts`, `tests/resume-pack.test.ts`; extend `tests/review-context.test.ts`, `tests/ship.test.ts`, and `tests/prepare-pr.test.ts`.

## Phase 1: Core Evidence Map

- [ ] Write failing tests in `tests/evidence-map.test.ts`.
  - Covered behavior:
    - likely file prefixes cover matching changed files.
    - forbidden file matches are flagged.
    - AgentLoop evidence files do not count as unexplained implementation files.
    - stale or missing verification produces the right next action.
    - run-ledger changed-file evidence marks a path as covered by run evidence.
    - Markdown-like path values remain escaped in rendered human summaries.
- [ ] Run `npm test -- tests/evidence-map.test.ts` and confirm failure is due to missing module/API.
- [ ] Implement `src/core/evidence-map.ts`.
  - Export `buildEvidenceMap(options)`.
  - Export `renderEvidenceMapMarkdown(map)`.
  - Export `renderEvidenceMapCompactMarkdown(map)`.
  - Keep changed-file coverage path based.
  - Keep claims explicit: reviewability evidence, not code-quality proof.
- [ ] Run `npm test -- tests/evidence-map.test.ts`.
- [ ] Bug pass:
  - Check no changed-file contents are read.
  - Check no absolute local roots are emitted in normal path fields.
  - Check no path traversal logic is introduced.
  - Run `npm run typecheck`.

## Phase 2: Explain Diff CLI

- [ ] Write failing tests in `tests/cli-explain-diff.test.ts`.
  - Human output includes reviewability, counts, stale verification, unexplained examples, and next commands.
  - JSON output includes `summary`, `files`, `coverage`, `risk`, `nextActions`, and `claims`.
  - `--redact-paths` does not leak temp root paths.
- [ ] Run `npm test -- tests/cli-explain-diff.test.ts` and confirm failure due to missing command.
- [ ] Add `src/cli/commands/explain-diff.ts`.
- [ ] Register command in `src/cli/index.ts`.
- [ ] Run `npm test -- tests/cli-explain-diff.test.ts`.
- [ ] Bug pass:
  - Run `npx --no-install tsx src/cli/index.ts explain-diff --json --redact-paths`.
  - Run `npm run typecheck`.
  - Confirm the command is read-only with `git status --short`.

## Phase 3: Review Surface Reuse

- [ ] Extend `tests/review-context.test.ts` with evidence-map JSON and human summary expectations.
- [ ] Extend `tests/ship.test.ts` with ship Markdown and JSON evidence-map expectations.
- [ ] Extend `tests/prepare-pr.test.ts` with PR body evidence-map expectations.
- [ ] Run the three tests and confirm the new assertions fail.
- [ ] Wire compact evidence map into `src/core/review-context.ts`, `src/core/ship.ts`, and `src/core/prepare-pr.ts`.
- [ ] Keep readiness scoring unchanged.
- [ ] Run:
  - `npm test -- tests/review-context.test.ts`
  - `npm test -- tests/ship.test.ts`
  - `npm test -- tests/prepare-pr.test.ts`
- [ ] Bug pass:
  - Confirm PR/ship Markdown escapes dynamic values.
  - Confirm review-context safety still says read-only.
  - Run `npm run typecheck`.

## Phase 4: Resume Pack

- [ ] Write failing tests in `tests/resume-pack.test.ts`.
  - `resume-pack --for codex` includes active task, evidence summary, next actions, and no absolute temp root.
  - `resume-pack --for claude`, `cursor`, `generic`, and `human` are accepted.
  - Unsupported target returns a parseable JSON error.
  - JSON output includes target and evidence map.
- [ ] Run `npm test -- tests/resume-pack.test.ts` and confirm failure due to missing command.
- [ ] Add `src/cli/commands/resume-pack.ts`.
- [ ] Register command in `src/cli/index.ts`.
- [ ] Run `npm test -- tests/resume-pack.test.ts`.
- [ ] Bug pass:
  - Run every target once against this repo with `--redact-paths`.
  - Run `npm run typecheck`.

## Phase 5: Docs And Product Boundary

- [ ] Update `README.md` with a short "Explain The Diff" section.
- [ ] Update `docs/cli-reference.md`.
- [ ] Add `docs/evidence-map.md` or update `docs/status.md` with behavior and boundaries.
- [ ] Update `ROADMAP.md` shipped/near-term text without claiming release availability.
- [ ] Update `DECISIONS.md` with the local evidence-map decision.
- [ ] Run `npm run check:public-docs`.
- [ ] Run `npm run check:links`.

## Phase 6: Final Verification

- [ ] Run focused tests:
  - `npm test -- tests/evidence-map.test.ts`
  - `npm test -- tests/cli-explain-diff.test.ts`
  - `npm test -- tests/resume-pack.test.ts`
  - `npm test -- tests/review-context.test.ts tests/ship.test.ts tests/prepare-pr.test.ts`
- [ ] Run full verification:
  - `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm run check:public-docs`
  - `npm run check:links`
  - `git diff --check`
- [ ] Run dogfood/product proof:
  - `npx --no-install tsx src/cli/index.ts explain-diff --redact-paths`
  - `npx --no-install tsx src/cli/index.ts resume-pack --for codex --redact-paths`
  - `npx --no-install tsx src/cli/index.ts verify --task-commands --progress --write-run --redact-paths`
  - `npx --yes projscan doctor --format markdown`
  - `npx --yes agentflight doctor`
  - `npx --yes agentflight status`
  - `npm run dogfood:strict`
  - `npm run maintenance:check`
- [ ] Run review evidence:
  - `npx --no-install tsx src/cli/index.ts ship --redact-paths`
  - `npx --no-install tsx src/cli/index.ts prepare-pr --redact-paths`
  - `npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths`
  - `npx --yes agentflight snapshot --note "Evidence map feature ready for maintainer review"`
  - `npx --yes agentflight report`

## Self-Review

- Spec coverage: the plan covers core map, CLI command, review integration, resume packs, docs, security/performance boundaries, and final verification.
- Placeholder scan: no unfinished placeholder markers are present.
- Scope check: release prep, package versioning, publishing, hosted dashboards, and model calls remain out of scope.
