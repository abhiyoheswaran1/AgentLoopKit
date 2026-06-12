# Make release-check publish guidance safer

## Summary

Release-check should keep its local-only behavior but route maintainers through npm-status before any publish step so post-release runs do not give unsafe direct publish guidance.

## Changed Files

### Source
- M `src/core/release-check.ts`

### Tests
- M `tests/release-check.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-21-13-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-21-14-verify/`
- ?? `.agentloop/tasks/archive/2026-06-12-make-release-check-publish-guidance-safer.md`

### Documentation
- M `CHANGELOG.md`

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-21-21-ship-report.md`

## Acceptance Criteria

- release-check next action does not directly tell users to run npm publish without an npm-status check.
- strict release-check still passes when local release evidence is complete.
- tests cover the safer next action.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-21-13-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Release guidance is maintainer-facing and bad copy can cause duplicate publish attempts.

## Rollback Notes

Revert the release-check next-action copy and tests.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
