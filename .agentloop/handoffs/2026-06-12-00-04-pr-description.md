# Build local acceptance layer commands

## Summary

Add agentloop ship, review readiness scoring, prepare-pr output, GitHub-comment Markdown mode, a local run ledger, intent lookup, and maintainer-check where feasible. Keep everything deterministic, local-first, npm-ready, and non-destructive.

## Changed Files

- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/github-actions.md`
- M `examples/end-to-end/README.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `tests/cli-docs-drift.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-00-04-pr-summary.md`
- ?? `.agentloop/reports/2026-06-11-23-57-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-00-04-ship-report.md`
- ?? `.agentloop/runs/`
- ?? `.agentloop/tasks/2026-06-11-build-local-acceptance-layer-commands.md`
- ?? `src/cli/commands/maintainer-check.ts`
- ?? `src/cli/commands/prepare-pr.ts`
- ?? `src/cli/commands/runs.ts`
- ?? `src/cli/commands/ship.ts`
- ?? `src/core/maintainer-check.ts`
- ?? `src/core/prepare-pr.ts`
- ?? `src/core/readiness-score.ts`
- ?? `src/core/runs.ts`
- ?? `src/core/ship.ts`
- ?? `tests/maintainer-check.test.ts`
- ?? `tests/prepare-pr.test.ts`
- ?? `tests/readiness-score.test.ts`
- ?? `tests/runs.test.ts`
- ?? `tests/ship.test.ts`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-00-04-ship-report.md`

## Acceptance Criteria

- agentloop ship produces a deterministic review-readiness report with total score, dimensions, strengths, warnings, blockers, and next actions.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-11-23-57-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- This can sprawl into project management. Keep the core flow local, deterministic, evidence-based, and review-focused.

## Rollback Notes

Revert the new command modules, tests, docs, and ledger templates while keeping earlier AgentLoopKit primitives intact.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
