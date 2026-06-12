# Report prepare-pr ship evidence source

## Summary

prepare-pr JSON output reports whether ship evidence was reused or refreshed and identifies the run when available.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-02-03-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-02-11-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-02-09-verify/`
- ?? `.agentloop/runs/2026-06-12-02-11-ship/`
- ?? `.agentloop/tasks/2026-06-12-report-prepare-pr-ship-evidence-source.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-02-12-ship-report.md`

## Acceptance Criteria

- prepare-pr --json includes shipEvidence.source with reused or refreshed.
- prepare-pr --json includes shipEvidence.runId when ship run evidence exists.
- prepare-pr human output remains concise and unchanged unless needed.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-02-03-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changes prepare-pr JSON shape by adding fields.

## Rollback Notes

Remove shipEvidence from prepare-pr JSON output.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
