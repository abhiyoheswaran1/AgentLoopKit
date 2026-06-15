# Add targeted release-proof channel checks

## Summary

agentloop release-proof can check one selected channel with --only while preserving the default all-channel proof flow.

## Changed Files

### Source
- M `src/cli/commands/release-proof.ts`
- M `src/core/release-proof.ts`

### Tests
- M `tests/release-proof.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-23-37-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-23-36-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-15-add-targeted-release-proof-channel-checks.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/release-proof.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-15-23-37-ship-report.md`

## Acceptance Criteria

- release-proof --only npm checks npm proof plus the local git tag and does not require GitHub Release, GHCR, or MCP proof.
- release-proof --only github-release, --only ghcr, and --only mcp-registry select their matching channel names deterministically.
- Invalid --only values fail before live metadata checks.
- Default release-proof behavior remains unchanged.
- No package version change, release, publish, tag, upload, token read, env-file read, or package metadata mutation is added.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-15-23-36-verification-report.md)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert `src/core/release-proof.ts`, `src/cli/commands/release-proof.ts`, `tests/release-proof.test.ts`, `docs/release-proof.md`, `docs/cli-reference.md`, `README.md`, and `CHANGELOG.md`. The default `agentloop release-proof` behavior should return to checking all channels together.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
