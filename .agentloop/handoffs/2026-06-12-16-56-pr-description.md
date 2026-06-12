# Release AgentLoopKit 0.28.3

## Summary

Version 0.28.3 is tagged, published through GitHub release automation, and verified on npm with published-package smoke checks.

## Changed Files

### Source
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-16-28-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-16-28-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-12-16-56-release-notes.md`
- ?? `.agentloop/reports/2026-06-12-16-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-28-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-16-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-16-11-verify/`
- ?? `.agentloop/runs/2026-06-12-16-25-verify/`
- ?? `.agentloop/runs/2026-06-12-16-28-ship/`
- ?? `.agentloop/runs/2026-06-12-16-54-verify/`
- ?? `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-3.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-prepare-pr-archived-task-evidence.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-ship-archived-task-scoring.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

## Review Readiness

- Score: 95/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-16-56-ship-report.md`

## Acceptance Criteria

- package.json, server.json, CHANGELOG.md, and release docs name 0.28.3 consistently.
- Local release gate passes before commit and tag.
- GitHub release v0.28.3 is created with release notes and tarball.
- npm latest reports 0.28.3 after trusted publishing.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-16-48-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Document how to revert or disable this change.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
