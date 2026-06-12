# Group prepare-pr changed files by review area

## Summary

prepare-pr PR bodies group changed files by area using the same deterministic classification style as PR summaries.

## Changed Files

### Source
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- ?? `src/core/change-areas.ts`

### Tests
- M `tests/prepare-pr.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-02-33-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-02-39-verify/`
- ?? `.agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-02-40-ship-report.md`

## Acceptance Criteria

- prepare-pr PR body groups changed files by review area.
- Grouped output is Markdown-safe for file paths.
- Existing changedFiles JSON remains available.
- Tests cover at least source, test, docs, and AgentLoop evidence groups.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-02-33-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- PR body formatting changes can affect copy-paste workflows.

## Rollback Notes

Revert the change-area renderer and return prepare-pr to the flat changed-file list.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
