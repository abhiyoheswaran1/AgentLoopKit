# Clarify status after archived evidence

## Summary

agentloop status gives a clearer next action when the working tree is dirty and the latest run references archived completed task evidence, instead of immediately pointing users to create-task.

## Changed Files

### Source
- M `src/core/status.ts`

### Tests
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-18-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-18-11-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-18-17-verify/`
- ?? `.agentloop/runs/2026-06-12-18-18-handoff/`
- ?? `.agentloop/tasks/2026-06-12-clarify-status-after-archived-evidence.md`

### Documentation
- M `CHANGELOG.md`

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-18-18-ship-report.md`

## Acceptance Criteria

- When no active/open task exists, the tree is dirty, and the latest run references an archived done task, status recommends refreshing handoff or reviewing the dirty evidence before starting a new task.
- When there is no task evidence and the tree is dirty, status still recommends creating a task contract.
- Brief, JSON, and Markdown status outputs use the same next action.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-18-11-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changing next-action order could affect automation that reads status --json.

## Rollback Notes

Revert status next-action logic and tests.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
