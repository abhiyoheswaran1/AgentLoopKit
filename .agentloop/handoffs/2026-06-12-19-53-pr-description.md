# Report skipped duplicate verification commands

## Summary

Verification reports and JSON output explain duplicate command skips so agents can account for task commands that do not appear as separate command results.

## Changed Files

### Source
- M `src/core/verification.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/release-check.test.ts`
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-19-43-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-19-49-verify/`
- ?? `.agentloop/tasks/archive/2026-06-12-report-skipped-duplicate-verification-commands.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/verification-reports.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-19-53-ship-report.md`

## Acceptance Criteria

- JSON verification results list skipped duplicate commands with original and duplicate keys
- Markdown reports include a concise Duplicate Commands section when duplicates are skipped
- Task command found counts remain accurate
- Duplicate commands still execute only once

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-19-43-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Exposing duplicate details could confuse users if wording implies commands failed

## Rollback Notes

Revert duplicate-skip reporting fields, docs, and tests.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
