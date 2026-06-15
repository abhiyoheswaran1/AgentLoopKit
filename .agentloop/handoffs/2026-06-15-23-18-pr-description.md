# Bound imported GitHub metadata fields

## Summary

Imported GitHub metadata remains optional/read-only while normalizing untrusted string fields to bounded, deterministic lengths before storing or rendering them.

## Changed Files

### Source
- M `src/core/github-metadata.ts`

### Tests
- M `tests/github-metadata.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-23-17-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-23-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-23-15-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-23-17-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-16-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-16-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-16-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-17-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-17-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-23-17-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-17-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-23-17-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-17-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-17-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-18-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-18-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-23-18-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-18-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-15-bound-imported-github-metadata-fields.md`

### Documentation
- M `docs/github-metadata.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-15-23-18-ship-report.md`

## Acceptance Criteria

- Issue and PR titles, states, URLs, authors, labels, and PR branch names are length-bounded during import and context reads.
- Label arrays are capped to a reviewable count.
- Existing normal GitHub metadata output is unchanged for short values.
- No GitHub API call, token read, env-file read, comment posting, ship scoring change, release, publish, tag, or package version change is added.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-15-23-17-verification-report.md)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert `src/core/github-metadata.ts`, `tests/github-metadata.test.ts`, and `docs/github-metadata.md` to restore the previous import behavior. Existing `.agentloop/github/context.json` files remain local artifacts; users can re-import metadata after rollback if needed.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
