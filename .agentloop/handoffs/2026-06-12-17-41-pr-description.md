# Smoke test verify progress flag

## Summary

Built CLI smoke coverage exercises verify --progress and confirms progress lines are bounded and raw child output stays out of stdout.

## Changed Files

### Tests
- M `tests/distribution-artifacts.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-17-41-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-17-39-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-17-40-verify/`
- ?? `.agentloop/runs/2026-06-12-17-41-handoff/`
- ?? `.agentloop/tasks/2026-06-12-smoke-test-verify-progress-flag.md`

### Documentation
- M `CHANGELOG.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-17-41-ship-report.md`

## Acceptance Criteria

- scripts/smoke-cli.mjs runs a built CLI verify --progress command.
- The smoke assertion checks start and finish progress lines.
- The smoke assertion checks child command output is not streamed into progress stdout.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-17-39-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- The smoke flow must stay stable across Ubuntu, macOS, and Windows.

## Rollback Notes

Remove the verify --progress smoke step and assertions.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
