# Prepare 0.28.4 patch release

## Summary

Publish a small 0.28.4 patch release with accurate changelog, package metadata, release evidence, npm package, and GitHub release notes.

## Changed Files

### AgentLoop
- ?? `.agentloop/handoffs/2026-06-12-20-42-release-notes.md`

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-20-42-ship-report.md`

## Acceptance Criteria

- package.json declares 0.28.4.
- CHANGELOG.md has a 0.28.4 section and no pending Unreleased entries.
- release-check passes for 0.28.4 before publishing.
- npm and GitHub releases expose 0.28.4 after publishing.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-20-35-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Release metadata can drift from package contents if changelog or tags are wrong.

## Rollback Notes

Use npm deprecate guidance only if the package is bad; otherwise follow up with a corrective patch release.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
