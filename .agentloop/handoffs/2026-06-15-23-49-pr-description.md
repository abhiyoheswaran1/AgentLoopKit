# Complete release-proof channel completions

## Summary

Bash, zsh, fish, and PowerShell completions suggest npm, github-release, ghcr, and mcp-registry for release-proof --only.

## Changed Files

### Source
- M `src/core/completions.ts`

### Tests
- M `tests/completion.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/reports/2026-06-15-23-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-48-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-48-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-48-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-15-complete-release-proof-channel-completions.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-15-23-49-ship-report.md`

## Acceptance Criteria

- Completion tests cover release-proof --only channel values.
- Generated completion scripts keep existing command and nested completion behavior.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-15-23-48-verification-report.md)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the completion renderer and completion test changes. Existing `agentloop release-proof --only <channel>` behavior remains available even without shell completion values.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
