# Improve next action for review-ready tasks

## Summary

status and next guide agents to finish or archive the active review task before starting unrelated work.

## Changed Files

### Source
- M `src/core/status.ts`

### Tests
- M `tests/next.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-03-38-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-03-45-verify/`
- ?? `.agentloop/tasks/2026-06-12-improve-next-action-for-review-ready-tasks.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `docs/status.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-03-45-ship-report.md`

## Acceptance Criteria

- Clean repos with an active review task recommend finishing the task instead of create-task.
- Docs explain the review-ready next action.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-03-38-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changing next-action priority can affect scripts that rely on status recommendations.

## Rollback Notes

Restore the previous clean-tree next-action branch.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
