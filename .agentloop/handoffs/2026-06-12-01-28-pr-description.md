# Show latest run evidence in status

## Summary

Agents and maintainers can see the latest local run evidence from agentloop status without remembering to run agentloop runs first.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`
- M `docs/status.md`
- M `scripts/smoke-cli.mjs`
- M `src/core/runs.ts`
- M `src/core/status.ts`
- M `tests/runs.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-01-28-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-01-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-01-28-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-01-27-verify/`
- ?? `.agentloop/runs/2026-06-12-01-28-ship/`
- ?? `.agentloop/tasks/2026-06-12-show-latest-run-evidence-in-status.md`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-01-28-ship-report.md`

## Acceptance Criteria

- agentloop status --json includes latestRun when run records exist.
- agentloop status human output shows the latest run command, score or status, and path.
- agentloop status --brief includes concise latest-run evidence.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-01-20-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changes status JSON and human output for repos with run ledger evidence.

## Rollback Notes

Remove latestRun from status output and revert docs/tests.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
