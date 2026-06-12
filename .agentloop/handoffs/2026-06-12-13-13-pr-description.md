# Add published package smoke helper

## Summary

Provide a repeatable maintainer smoke script that verifies a published AgentLoopKit version from clean temp directories.

## Changed Files

### Tests
- ?? `tests/published-smoke-script.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-12-58-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-03-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-08-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-02-verify/`
- ?? `.agentloop/runs/2026-06-12-13-07-verify/`
- ?? `.agentloop/runs/2026-06-12-13-12-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-published-package-smoke-helper.md`

### Documentation
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`

### CI / Automation
- ?? `scripts/smoke-published-package.mjs`

### Config / Package
- M `package.json`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-13-13-ship-report.md`

## Acceptance Criteria

- package.json exposes a smoke:published script
- the helper verifies npm view, npx version, npx init dry-run, and installed bin aliases from temporary directories
- the helper strips token-like environment variables and does not publish, tag, or call GitHub APIs
- Vitest covers the helper plan and safety behavior

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-13-08-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Network or npm registry propagation issues can make this post-release smoke fail for reasons outside the local repo.

## Rollback Notes

Remove the helper script, package script, tests, and docs if the approach creates release friction.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
