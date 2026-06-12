# Prepare 0.28.2 patch release

## Summary

Publish a small 0.28.2 patch release with verified package metadata, changelog, release docs, GitHub release, npm proof, and follow-on channel checks.

## Changed Files

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-15-07-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-15-06-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-15-07-verify/`

### Documentation
- M `FINAL_HANDOFF.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-15-07-ship-report.md`

## Acceptance Criteria

- package.json version is 0.28.2 and lockfile metadata has no stale package version entry
- CHANGELOG.md has a 0.28.2 section and no real unreleased entries
- release-status, npm publishing docs, and final handoff mention the current 0.28.2 release
- release gate, packed smoke, published smoke, ProjScan, and dogfood evidence pass
- GitHub release v0.28.2 is created after push

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-15-06-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Release metadata drift can confuse npm and GitHub users.

## Rollback Notes

Delete the v0.28.2 GitHub release/tag only if publish workflow fails before npm publishes; otherwise follow forward with a patch release.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
