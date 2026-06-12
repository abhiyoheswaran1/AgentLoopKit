# Accept archived task evidence in gates

## Summary

check-gates and dogfood strict can accept recent run task evidence when no active task remains.

## Changed Files

### Source
- M `src/cli/commands/task.ts`
- M `src/core/check-gates.ts`
- M `src/core/task-state.ts`

### Tests
- M `tests/check-gates.test.ts`
- ?? `tests/task-archive.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/handoffs/2026-06-12-13-33-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-13-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-13-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-33-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-13-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-31-verify/`
- ?? `.agentloop/runs/2026-06-12-13-33-ship/`
- ?? `.agentloop/runs/2026-06-12-13-48-verify/`
- ?? `.agentloop/runs/2026-06-12-13-51-verify/`
- ?? `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-bulk-task-archive-mode.md`

### Documentation
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-13-51-ship-report.md`

## Acceptance Criteria

- check-gates passes when the latest run references an archived task and verification evidence exists.
- check-gates still fails when no active, open, or run task evidence exists.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-13-48-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Gate behavior affects release and CI confidence.

## Rollback Notes

Revert the archived run task fallback and keep active task requirement.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
