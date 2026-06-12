# Hydrate archived run task status

## Summary

Run ledger and status output resolve archived task evidence when available, so task title and status reflect the archived task contract while preserving historical run metadata when the file cannot be found.

## Changed Files

### Source
- M `src/core/runs.ts`

### Tests
- M `tests/runs.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-18-00-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-17-53-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-17-58-verify/`
- ?? `.agentloop/runs/2026-06-12-18-00-handoff/`
- ?? `.agentloop/tasks/2026-06-12-hydrate-archived-run-task-status.md`

### Documentation
- M `CHANGELOG.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-18-00-ship-report.md`

## Acceptance Criteria

- agentloop runs --json reports archived latest-run task status as done when the archived task file exists.
- agentloop status --json latestRun task metadata reflects archived task status when the latest run references an archived task.
- If the task file is missing, run ledger output still uses the stored run snapshot.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-17-53-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changing run summary hydration could affect JSON shape used by scripts.

## Rollback Notes

Revert the run/status hydration changes and keep stored run metadata as the source of truth.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
