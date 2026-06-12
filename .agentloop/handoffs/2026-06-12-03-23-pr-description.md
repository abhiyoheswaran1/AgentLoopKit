# Activate newly created task contracts

## Summary

create-task makes the newly created contract the active task so the main loop continues from the task the user just created.

## Changed Files

### Source
- M `src/cli/commands/create-task.ts`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/create-task.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-03-16-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-03-23-verify/`
- ?? `.agentloop/tasks/2026-06-12-activate-newly-created-task-contracts.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-03-23-ship-report.md`

## Acceptance Criteria

- create-task --json returns the created task and activeTask metadata.
- After create-task, task current reports the new task even when an older active task existed.
- Human create-task output names the created task and active task state.
- Docs explain that create-task activates the new task and task set can switch tasks.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-03-16-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Changing create-task output and JSON shape can affect scripts that parse strict output.

## Rollback Notes

Remove automatic setActiveTask call from create-task and restore the previous output shape.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
