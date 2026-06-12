# Release AgentLoopKit 0.28.1

## Summary

Publish and verify AgentLoopKit 0.28.1 with clean npm, GitHub release, CI, MCP registry, GHCR, and local evidence.

## Changed Files

### AgentLoop
- ?? `.agentloop/handoffs/2026-06-12-12-35-release-notes.md`
- ?? `.agentloop/reports/2026-06-12-12-35-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-12-39-verify/`
- ?? `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-1.md`

### Documentation
- M `CHANGELOG.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-12-41-ship-report.md`

## Acceptance Criteria

- package metadata is 0.28.1
- CHANGELOG.md documents the 0.28.1 changes
- release gate passes before tagging
- npm and GitHub release are verified after publish

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-12-35-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Publishing automation or registry propagation can lag after tag push.

## Rollback Notes

Deprecate or supersede the npm version with a corrected patch and update GitHub release notes if a packaging issue is discovered.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
