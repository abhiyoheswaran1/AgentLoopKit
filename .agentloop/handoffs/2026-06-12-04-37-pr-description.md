# Add ship GitHub comment output

## Summary

agentloop ship --github-comment emits Markdown suitable for a PR comment while preserving JSON and existing ship behavior.

## Changed Files

### Source
- M `src/cli/commands/ship.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/reports/2026-06-12-04-30-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-36-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-ship-github-comment-output.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/github-actions.md`
- M `examples/end-to-end/README.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-04-37-ship-report.md`

## Acceptance Criteria

- agentloop ship --github-comment prints a PR-comment-style readiness report.
- agentloop ship --github-comment --json includes the comment Markdown without suppressing JSON.
- Existing ship JSON and human output remain compatible when the flag is not used.
- Docs and CLI reference explain that the CLI does not require or read GitHub tokens.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-04-30-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Comment Markdown can become too verbose for CI comments if it duplicates the full ship report.

## Rollback Notes

Remove the --github-comment flag and helper, then restore ship help and docs.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
