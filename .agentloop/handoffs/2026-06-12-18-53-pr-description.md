# Smoke test bounded run output

## Summary

The built CLI smoke flow covers runs --latest and runs --limit <count> --json against a generated smoke repo with run ledger entries.

## Changed Files

### Source
- M `src/cli/commands/runs.ts`

### Tests
- M `tests/distribution-artifacts.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-18-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-18-46-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-18-50-verify/`
- ?? `.agentloop/runs/2026-06-12-18-52-handoff/`
- ?? `.agentloop/tasks/2026-06-12-smoke-test-bounded-run-output.md`

### Documentation
- M `CHANGELOG.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-18-53-ship-report.md`

## Acceptance Criteria

- scripts/smoke-cli.mjs runs the built CLI with runs --latest.
- scripts/smoke-cli.mjs runs the built CLI with runs --limit 2 --json and checks the result count.
- Distribution artifact tests assert the smoke script covers the new flags.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-18-46-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Smoke script changes can slow CI or become flaky if they depend on timestamps too tightly.

## Rollback Notes

Revert the smoke script and distribution-artifact assertions.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
