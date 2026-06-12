# Clean stale 0.28.0 harness release guidance

## Summary

Repo-local harness guidance says not to release unless the maintainer explicitly asks, without naming a stale planned version.

## Changed Files

### Tests
- M `tests/release-smoke.test.ts`

### AgentLoop
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/reports/2026-06-12-11-54-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-12-01-verify/`
- ?? `.agentloop/tasks/2026-06-12-clean-stale-0-28-0-harness-release-guidance.md`

### Documentation
- ?? `docs/logo/`

### CI / Automation
- M `scripts/smoke-packed-release.mjs`

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-12-01-ship-report.md`

## Acceptance Criteria

- AGENTS.md no longer mentions a planned 0.28.0 batch
- AGENTLOOP.md no longer mentions development after 0.27.0 or planned 0.28.0
- A regression test rejects stale planned-release batch wording in repo harness files

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-11-54-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Repo-local agent guidance affects future autonomous sessions

## Rollback Notes

Revert the harness copy and release-smoke helper changes

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
