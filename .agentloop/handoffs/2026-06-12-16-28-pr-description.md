# Fix prepare-pr archived task evidence

## Summary

prepare-pr reuses fresh ship evidence and renders PR title, acceptance criteria, risks, and rollback notes from archived latest-run task contracts.

## Changed Files

### Source
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-16-26-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-16-26-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-16-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-26-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-16-11-verify/`
- ?? `.agentloop/runs/2026-06-12-16-25-verify/`
- ?? `.agentloop/runs/2026-06-12-16-26-ship/`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-prepare-pr-archived-task-evidence.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-ship-archived-task-scoring.md`

### Documentation
- M `DECISIONS.md`

## Review Readiness

- Score: 95/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-16-28-ship-report.md`

## Acceptance Criteria

- prepare-pr resolves archived latest-run task contracts for PR copy.
- prepare-pr can reuse a fresh ship run after task archival without writing duplicate ship runs.
- Regression tests cover archived-task prepare-pr behavior.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-16-24-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Document how to revert or disable this change.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
