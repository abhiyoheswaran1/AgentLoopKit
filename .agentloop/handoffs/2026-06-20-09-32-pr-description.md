# Prepare AgentLoopKit 0.37.0 release

## Summary

`0.37.0` release metadata is prepared, verified, committed, tagged, pushed, published through the usual GitHub release workflow, and backed by local and public-channel proof. Deferred owner-only channels stay explicit and unclaimed unless their proof passes.

## Changed Files

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

### AgentLoop Evidence
- AgentLoop evidence: `3` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 100/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-20-09-32-ship-report.md`

## Acceptance Criteria

- `agentloop npm-status --agentloopkit --expect-current` is recorded before bumping from `0.36.2`.
- `package.json`, `server.json`, and `CHANGELOG.md` agree on `0.37.0`.
- `CHANGELOG.md` has no real entries left under `\#\# Unreleased`.
- `npm run release-flow` passes after release metadata is ready.
- ProjScan and AgentFlight evidence is recorded for the release session.
- Release commit and `v0.37.0` tag are pushed.
- Post-publish npm, GitHub Release, GHCR, and MCP Registry proof is recorded before availability is claimed.
- Marketplace state is reported honestly if it remains unavailable.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-20-09-23-verification-report.md`)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Version metadata drift can publish a package whose release notes do not match package contents.
- Trusted publishing and downstream GHCR/MCP workflows can lag the GitHub release.
- Marketplace publication still needs the owner-only GitHub release UI checkbox and may remain 404.

## Rollback Notes

Before publishing, revert the release metadata commit. After publishing, publish a corrective patch and document the superseded release if channel proof exposes a release-blocking issue.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
