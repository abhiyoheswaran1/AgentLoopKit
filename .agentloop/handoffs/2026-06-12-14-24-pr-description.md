# Add task-only verification shortcut

## Summary

Maintainers and agents can run reviewed task contract verification commands without also running configured repo commands by using one explicit shortcut.

## Changed Files

### Source
- M `src/cli/commands/verify.ts`

### Tests
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-14-16-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-14-20-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-14-19-verify/`
- ?? `.agentloop/runs/2026-06-12-14-22-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-task-only-verification-shortcut.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-14-24-ship-report.md`

## Acceptance Criteria

- agentloop verify --task <path> --task-commands --only-task-commands runs only task commands and records configured commands as not run.
- agentloop verify --only-task-commands without --task-commands returns a clear JSON error and runs nothing.
- agentloop verify --only-task-commands without --task returns a clear JSON error and runs nothing.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-14-20-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Verification command selection affects CI and maintainer trust.

## Rollback Notes

Remove the --only-task-commands option and keep the existing --no-* flags.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
