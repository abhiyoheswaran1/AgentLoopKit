# Clarify task clear for ignored active pointers

## Summary

task clear reports when it clears a persisted active-task pointer even if that pointer is ignored by normal active-task selection, while preserving no-op output when no pointer exists.

## Changed Files

### Source
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/task.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/agent-installation.test.ts`
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/next.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/tasks/README.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- ?? `.agentloop/research/interview-cycle-157.md`
- ?? `.agentloop/research/interview-cycle-158.md`
- ?? `.agentloop/research/interview-cycle-159.md`
- ?? `.agentloop/research/interview-cycle-160.md`

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
- AgentLoop evidence: `125` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-21-01-46-ship-report.md`

## Acceptance Criteria

- When state points at an ignored AgentFlight placeholder, task clear removes the pointer and reports that it cleared active task state.
- When no state file exists, task clear still reports the existing no-active-task no-op.
- JSON task clear output distinguishes cleared versus no-op state without reading or deleting task files.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-21-01-38-verification-report.md`)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Task-clear messaging affects agent recovery from stale or placeholder state.

## Rollback Notes

Revert the task clear output/test changes; existing state-file behavior remains the fallback.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
