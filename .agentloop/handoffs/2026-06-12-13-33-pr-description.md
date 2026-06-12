# Add bulk task archive mode

## Summary

Allow maintainers to archive multiple terminal task contracts by status with an explicit dry-run path before moving files.

## Changed Files

### Source
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`

### Tests
- ?? `tests/task-archive.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/reports/2026-06-12-13-30-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-31-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-bulk-task-archive-mode.md`

### Documentation
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-13-33-ship-report.md`

## Acceptance Criteria

- agentloop task archive supports --status <status>
- bulk archive mode supports --dry-run
- bulk archive mode refuses ambiguous use without a status or explicit path
- tests cover dry-run, moved tasks, and invalid statuses

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-13-30-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Bulk file moves can surprise maintainers if dry-run output is unclear.

## Rollback Notes

Remove the bulk archive options and keep the existing single-task archive command.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
