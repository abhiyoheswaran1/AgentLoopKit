# Add opt-in run ledger entries for verify and handoff

## Summary

Verification and handoff flows can write repo-local run ledger records when explicitly requested.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `examples/end-to-end/README.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/commands/runs.ts`
- M `src/cli/commands/summarize.ts`
- M `src/cli/commands/verify.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/runs.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/runs.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-00-30-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-12-00-39-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-00-39-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-00-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-00-39-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-00-45-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-00-29-verify/`
- ?? `.agentloop/runs/2026-06-12-00-30-handoff/`
- ?? `.agentloop/runs/2026-06-12-00-39-ship-2/`
- ?? `.agentloop/runs/2026-06-12-00-39-ship/`
- ?? `.agentloop/runs/2026-06-12-00-51-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-00-51-ship-report.md`

## Acceptance Criteria

- agentloop verify --write-run --json writes a verify run under .agentloop/runs.
- agentloop handoff --write-run --json writes a handoff run under .agentloop/runs.
- agentloop intent can explain file references from verify and handoff run records.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-00-45-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Touches CLI JSON shape when --write-run is used and run ledger metadata types.

## Rollback Notes

Remove the --write-run flags and revert run ledger type changes.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
