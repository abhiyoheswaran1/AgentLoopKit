# Align AgentFlight placeholder recovery guidance

## Summary

Fresh init and installed agent instructions teach bounded AgentFlight placeholder recovery that matches task doctor and dogfood guidance without deleting placeholder evidence or mutating custom task contracts.

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
- AgentLoop evidence: `113` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-21-01-14-ship-report.md`

## Acceptance Criteria

- Fresh init root guidance mentions status plus task doctor for direct AgentFlight placeholder recovery.
- Fresh init root guidance mentions clearing placeholder active state before setting or creating a real task.
- Installed/generated agent templates preserve AgentFlight placeholders as evidence instead of implying deletion or broad cleanup.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-21-01-11-verification-report.md`)



## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Stale generated instructions can cause agents to treat AgentFlight placeholder files as active work or delete evidence.

## Rollback Notes

Revert the template, harness, docs record, and init/agent-installation test changes; runtime behavior remains unchanged.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
