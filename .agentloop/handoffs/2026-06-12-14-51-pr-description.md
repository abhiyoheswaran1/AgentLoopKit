# Prepare 0.28.2 patch release

## Summary

Publish a small 0.28.2 patch release with verified package metadata, changelog, release docs, GitHub release, npm proof, and follow-on channel checks.

## Changed Files

### Source
- M `src/cli/commands/verify.ts`

### Tests
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-14-24-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-14-24-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-14-16-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-14-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-14-24-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-14-31-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-14-41-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-14-42-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-14-19-verify/`
- ?? `.agentloop/runs/2026-06-12-14-22-verify/`
- ?? `.agentloop/runs/2026-06-12-14-24-ship/`
- ?? `.agentloop/runs/2026-06-12-14-31-verify/`
- ?? `.agentloop/runs/2026-06-12-14-40-verify/`
- ?? `.agentloop/runs/2026-06-12-14-41-verify/`
- ?? `.agentloop/runs/2026-06-12-14-50-verify/`
- ?? `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-task-only-verification-shortcut.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/verification-reports.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-14-51-ship-report.md`

## Acceptance Criteria

- package.json version is 0.28.2 and lockfile metadata has no stale package version entry
- CHANGELOG.md has a 0.28.2 section and no real unreleased entries
- release-status, npm publishing docs, and final handoff mention the current 0.28.2 release
- release gate, packed smoke, published smoke, ProjScan, and dogfood evidence pass
- GitHub release v0.28.2 is created after push

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-14-42-verification-report.md)

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
