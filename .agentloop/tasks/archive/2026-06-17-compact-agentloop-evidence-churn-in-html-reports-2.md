# Compact AgentLoop evidence churn in HTML reports

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Long autonomous AgentLoopKit sessions generate many local evidence files under `.agentloop/` and `.agentflight/`.
Human Markdown surfaces now compact that evidence churn, but `agentloop report` still renders every changed file as a flat HTML table row.
That makes the browser-readable evidence report noisy and harder for reviewers to scan.

## Desired Outcome
The HTML report should preserve ordinary changed-file rows while grouping AgentLoop/AgentFlight evidence churn into compact summary rows, matching the reviewability boundary used by ship, handoff, prepare-pr, status, next, and check-gates.

## Constraints
- Keep the report static, deterministic, local-only, and HTML-escaped.
- Preserve metadata changed-file counts and source evidence links.
- Do not hide ordinary non-evidence changed files.
- Do not delete, archive, or mutate generated evidence files.
- Do not add dependencies, network calls, telemetry, version bumps, tags, releases, or publishing behavior.

## Non-Goals
- Do not change JSON output for `agentloop report`.
- Do not change `ship`, `handoff`, `prepare-pr`, `status`, `next`, or `check-gates`.
- Do not add cleanup or retention policy.
- Do not resume deferred Marketplace, Scoop, WinGet, npm, release, or package-channel tasks.

## Assumptions
- `src/core/agentloop-evidence.ts` is the shared classifier for generated AgentLoop/AgentFlight evidence paths.
- HTML report users still need to know evidence churn exists, but they do not need hundreds of table rows for generated reports, handoffs, runs, task archives, or AgentFlight proof files.
- Full file inventory remains available through Git, JSON-capable commands, and run-ledger evidence; this task only changes the human HTML rendering.

## Likely Files or Areas
- `src/core/html-report.ts`
- `src/core/agentloop-evidence.ts`
- `tests/html-report.test.ts`
- `docs/html-reports.md`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- `package.json` version metadata
- `CHANGELOG.md`
- `.github/workflows/` release or publishing workflows
- dependency lockfiles unless verification unexpectedly changes them
- Marketplace, Scoop, WinGet, npm, GHCR, MCP registry, and release files

## Acceptance Criteria
- HTML reports keep ordinary changed-file table rows visible.
- Generated AgentLoop/AgentFlight evidence paths are grouped by evidence directory with counts instead of one row per file.
- The HTML output includes a visible note that full paths remain available outside the compact human report.
- All rendered path/status values remain HTML-escaped.
- Report metadata still reports the full changed-file count.
- Docs explain that HTML report changed-file rendering compacts generated AgentLoop evidence churn only.

## Verification Commands
- `npm test -- tests/html-report.test.ts -t "compacts AgentLoop evidence churn in changed files"`
- `npm test -- tests/html-report.test.ts`
- `npm run typecheck`
- `npm run check:public-docs`

## Post-Verification Gates
- `npx --yes agentflight status`
- `npx --yes agentflight doctor`
- `npx --yes projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.
- HTML report rendering must keep escaping behavior intact to avoid turning paths into executable markup.
- Compaction must not make non-evidence source, test, config, docs, or automation files disappear from the human report.

## Rollback Notes
Revert the HTML rendering, test, and docs changes for this task. Existing generated HTML reports and evidence files require no cleanup for rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
