# Add release metadata sync prepublish guard

## Summary

Prepublish metadata checks fail fast when server.json package metadata drifts from package.json.

## Changed Files

### Tests
- M `tests/prepublish-check.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-15-13-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-15-14-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-15-16-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-15-18-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-15-13-verify/`
- ?? `.agentloop/runs/2026-06-12-15-14-verify/`
- ?? `.agentloop/runs/2026-06-12-15-16-verify/`
- ?? `.agentloop/runs/2026-06-12-15-19-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md`

### Documentation
- M `DECISIONS.md`

### CI / Automation
- M `scripts/prepublish-check.mjs`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-15-19-ship-report.md`

## Acceptance Criteria

- prepublish check fails when server.json top-level version differs from package.json
- prepublish check fails when server.json package version differs from package.json
- error output names the mismatched file and expected version

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-15-18-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Release metadata checks can block publishing if they are too broad or brittle.

## Rollback Notes

Revert the prepublish-check validation and tests if it blocks valid release metadata.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
