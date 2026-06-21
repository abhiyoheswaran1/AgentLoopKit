# Align generated task guidance with create-task warnings

## Summary

Generated task guidance tells agents that create-task may warn about pre-existing dirty non-AgentLoop files and review-critical placeholder sections, while keeping those warnings advisory and non-mutating.

## Changed Files

### Source
- M `src/cli/commands/create-task.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/next.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/tasks/README.md`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- ?? `.agentloop/research/interview-cycle-157.md`
- ?? `.agentloop/research/interview-cycle-158.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/pr-summaries.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

### AgentLoop Evidence
- AgentLoop evidence: `102` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-21-00-54-ship-report.md`

## Acceptance Criteria

- Fresh init writes .agentloop/tasks/README.md with dirty-work and placeholder-section create-task guidance.
- Existing task-contract docs remain consistent with generated task guidance.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-21-00-50-verification-report.md`)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Docs/template copy can drift from implemented warnings and confuse fresh installs.

## Rollback Notes

Revert the template and init-test changes; no runtime state or data migration is involved.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
