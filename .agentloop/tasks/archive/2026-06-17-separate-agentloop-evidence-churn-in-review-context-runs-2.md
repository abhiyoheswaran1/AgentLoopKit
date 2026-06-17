# Separate AgentLoop evidence churn in review-context runs

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
`agentloop review-context` is the compact snapshot agents use before acting, but its Recent Runs section still shows raw run changed-file counts.
In long dogfood sessions, those totals are dominated by generated AgentLoop/AgentFlight evidence and obscure the smaller non-evidence review surface.

## Desired Outcome
Human `agentloop review-context` output should display recent run changed-file counts with the same non-evidence versus AgentLoop evidence split used by run-ledger human output, while `review-context --json` remains unchanged.

## Constraints
- Keep `getReviewContext()` JSON shape unchanged.
- Keep the command read-only and local-only.
- Preserve Markdown-safe one-line human output for run ids, commands, statuses, scores, and counts.
- Do not hide, delete, archive, or mutate generated evidence files.
- Do not add dependencies, network calls, telemetry, version bumps, tags, releases, or publishing behavior.

## Non-Goals
- Do not change run-ledger schema or how runs are written.
- Do not change `runs`, `show-run`, `status`, `next`, `check-gates`, `ship`, or `artifacts`.
- Do not expose full changed-file lists in review-context Markdown.
- Do not resume deferred Marketplace, Scoop, WinGet, npm, release, or package-channel tasks.

## Assumptions
- `review-context --json` should remain a stable snapshot of existing summaries.
- Human `review-context` can read local run records for display only without mutating state.
- Full changed-file evidence remains available in run-ledger JSON and `changed-files.json`.

## Likely Files or Areas
- `src/cli/commands/review-context.ts`
- `src/core/review-context.ts`
- `src/core/runs.ts`
- `src/core/agentloop-evidence.ts`
- `tests/review-context.test.ts`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- Run ledger schema files beyond test fixtures
- `package.json` version metadata
- `CHANGELOG.md`
- `.github/workflows/` release or publishing workflows
- dependency lockfiles unless verification unexpectedly changes them
- Marketplace, Scoop, WinGet, npm, GHCR, MCP registry, and release files

## Acceptance Criteria
- Human `review-context` Recent Runs entries include split changed-file counts when local `changed-files.json` exists for those runs.
- Scored, status, and count-only run entries preserve their existing score/status/count information and add the split without multiline output.
- `review-context --json` output remains unchanged and does not gain split fields.
- Missing or unreadable changed-file evidence preserves the existing count-only fallback.
- Docs explain that human review context separates generated evidence churn in Recent Runs while JSON remains unchanged.

## Verification Commands
- `npm test -- tests/review-context.test.ts -t "separates AgentLoop evidence churn in recent runs for human output"`
- `npm test -- tests/review-context.test.ts`
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
- Review-context must remain a read-only snapshot; enrichment should not write or normalize run files.
- Human split wording must not imply generated evidence is ignored or removed.

## Rollback Notes
Revert the review-context human rendering, tests, and docs for this task. Existing run-ledger and review-context evidence files require no cleanup for rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
