# Add post-verification task gates

## Summary

Task contracts can record post-verification gates separately from commands that agentloop verify should run.

## Changed Files

### Source
- M `src/cli/commands/create-task.ts`
- M `src/core/task-contract.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/create-task.test.ts`
- M `tests/task-contract.test.ts`
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- ?? `.agentloop/reports/2026-06-12-15-42-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-15-44-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-post-verification-task-gates.md`

### Documentation
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-15-52-ship-report.md`

## Acceptance Criteria

- create-task supports a repeatable post-verification command flag
- generated task Markdown renders a Post-Verification Gates section when those commands are provided
- agentloop verify --task-commands does not execute post-verification gates

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-15-42-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Adding another task field can confuse users if docs do not explain when to use it.

## Rollback Notes

Remove the post-verification option and section if it creates ambiguity.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
