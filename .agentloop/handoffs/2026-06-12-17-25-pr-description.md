# Add verification progress output

## Summary

agentloop verify supports an opt-in progress mode that prints bounded start/finish lines for each verification command while preserving existing default and JSON behavior.

## Changed Files

### Source
- M `src/cli/commands/verify.ts`
- M `src/core/verification.ts`

### Tests
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-17-25-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-17-19-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-17-20-verify/`
- ?? `.agentloop/runs/2026-06-12-17-25-handoff/`
- ?? `.agentloop/tasks/2026-06-12-add-verification-progress-output.md`

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
- Ship report: `.agentloop/reports/2026-06-12-17-25-ship-report.md`

## Acceptance Criteria

- agentloop verify --progress prints one start line and one finish line for each executed command.
- agentloop verify without --progress keeps its existing human output shape.
- agentloop verify --json does not mix progress lines into stdout.
- Progress output includes pass/fail/timeout status and elapsed time, but not raw command output.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-17-19-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Progress output could break scripts if enabled implicitly, so it must remain opt-in.
- Command strings can be sensitive, so reuse existing redaction/formatting expectations and avoid environment output.

## Rollback Notes

Remove the --progress flag and progress reporter wiring; verification reports remain compatible.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
