# Reuse fresh ship run in prepare-pr

## Summary

prepare-pr reuses current fresh ship evidence when possible, keeping the run ledger cleaner without weakening review-readiness output.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/reports/2026-06-12-01-43-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-01-49-verify/`
- ?? `.agentloop/tasks/2026-06-12-reuse-fresh-ship-run-in-prepare-pr.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-01-49-ship-report.md`

## Acceptance Criteria

- prepare-pr --write does not create a duplicate ship run when the latest ship run already matches the active task, current verification report, and ship report.
- prepare-pr still creates or refreshes ship evidence when no usable ship report exists.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-01-43-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changes prepare-pr evidence reuse and run-ledger behavior.

## Rollback Notes

Revert prepare-pr reuse logic and restore always-refresh behavior.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
