# Use repo-relative paths in PR-facing Markdown

## Summary

Ship comments, ship reports, and prepare-pr Markdown render AgentLoop artifact paths relative to the repo while JSON output keeps existing script-friendly path fields.

## Changed Files

### Source
- M `src/cli/commands/ship.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/reports/2026-06-12-04-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-57-verify/`
- ?? `.agentloop/tasks/2026-06-12-use-repo-relative-paths-in-pr-facing-markdown.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-04-58-ship-report.md`

## Acceptance Criteria

- agentloop ship --github-comment does not include the repo root or an absolute artifact path.
- agentloop ship report Markdown uses repo-relative verification, handoff, and ship paths.
- agentloop prepare-pr body and GitHub comment use repo-relative artifact paths.
- JSON output retains existing path fields for scripts.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-04-51-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changing display paths must not break scripts that consume JSON output.

## Rollback Notes

Restore previous Markdown path rendering while keeping the tests that document the privacy issue.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
