# Add config verification command suggestions

## Summary

Task creators can explicitly copy configured repo verification commands into new task contracts without running them during creation.

## Changed Files

### Source
- M `src/cli/commands/create-task.ts`
- M `src/core/verification.ts`

### Tests
- M `tests/create-task.test.ts`
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-19-17-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-19-20-verify/`
- ?? `.agentloop/tasks/archive/2026-06-12-add-config-verification-command-suggestions.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-19-23-ship-report.md`

## Acceptance Criteria

- create-task exposes an explicit flag for including configured verification commands
- Configured commands are added to the Verification Commands section in deterministic order
- Explicit verification commands and configured commands are de-duplicated without being executed
- Exact duplicate configured and task commands are run once during verification
- JSON and human outputs remain compatible

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-19-17-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- A vague flag name could make users think commands were executed

## Rollback Notes

Revert the CLI flag, tests, and docs update.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
