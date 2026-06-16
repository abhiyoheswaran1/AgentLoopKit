# Run post-verification gates explicitly from verify

## Summary

Users can opt in to running task post-verification gates after the verification report is written, while default verify behavior remains unchanged and safe.

## Changed Files

### Source

- M `src/cli/commands/verify.ts`
- M `src/core/verification.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/tasks/README.md`

### Tests

- M `tests/verification.test.ts`

### AgentLoop

- M `.agentloop/backlog.md`
- M `AGENTLOOP.md`
- ?? `.agentloop/handoffs/2026-06-16-12-22-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-23-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-12-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-12-22-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-12-22-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-12-23-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-12-24-verification-report.md`
- ?? `.agentloop/research/interview-cycle-117.md`
- ?? `.agentloop/runs/2026-06-16-12-21-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-21-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-21-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-12-23-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-23-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-23-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-run-post-verification-gates-explicitly-from-verify.md`

### Documentation

- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-16-12-24-ship-report.md`

## Acceptance Criteria

- verify does not run post-verification gates by default
- an explicit verify flag runs task post-verification gates after the report is written
- post-verification gate results are visible in human and JSON output
- a failing post-verification gate fails the verify command when the flag is used
- docs explain the sequencing and safety boundary

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-16-12-24-verification-report.md`)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the `verify` option, post-verification gate parsing/execution path, related tests, and documentation changes. Existing task contracts with `Post-Verification Gates` remain valid because the section already existed before this change.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
