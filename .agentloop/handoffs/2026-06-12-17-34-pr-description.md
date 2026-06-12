# Guard roadmap release state

## Summary

Release smoke coverage fails when ROADMAP.md current-state release lines drift from package.json's current version.

## Changed Files

### Tests
- M `tests/release-smoke.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-17-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-17-31-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-17-32-verify/`
- ?? `.agentloop/runs/2026-06-12-17-34-handoff/`
- ?? `.agentloop/tasks/2026-06-12-guard-roadmap-release-state.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`

### CI / Automation
- M `scripts/smoke-packed-release.mjs`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-17-34-ship-report.md`

## Acceptance Criteria

- A helper rejects ROADMAP.md current-state lines that name an older current public release, npm latest, GHCR/MCP Registry version, or release tag.
- The helper accepts ROADMAP.md when those current-state lines match the expected package version.
- Current release-smoke tests run the guard against the real ROADMAP.md.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-17-31-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Overly broad matching could reject historical changelog-style content, so scope the guard to ROADMAP.md current-state wording.

## Rollback Notes

Remove the roadmap release-state helper and its tests; release smoke returns to the previous public-doc checks.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
