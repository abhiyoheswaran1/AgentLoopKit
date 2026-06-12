# Add run ledger limit controls

## Summary

agentloop runs supports --limit <n> and --latest so users can inspect recent evidence without piping or parsing the full ledger.

## Changed Files

### Source
- M `src/cli/commands/runs.ts`

### Tests
- M `tests/runs.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-18-33-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-18-26-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-18-31-verify/`
- ?? `.agentloop/runs/2026-06-12-18-33-handoff/`
- ?? `.agentloop/tasks/2026-06-12-add-run-ledger-limit-controls.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-18-33-ship-report.md`

## Acceptance Criteria

- agentloop runs --latest shows only the newest run.
- agentloop runs --limit 2 shows only two newest runs in JSON and human output.
- Invalid limits fail with a clear message and do not read or write run metadata.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-18-26-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changing CLI output options could affect scripts that invoke runs --json.

## Rollback Notes

Revert runs command option parsing and docs/tests.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
