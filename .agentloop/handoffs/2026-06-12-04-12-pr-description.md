# Add active task done shortcut

## Summary

Agents can mark the active task done with a short deterministic command while existing task status behavior remains available.

## Changed Files

### Source
- M `src/cli/commands/task.ts`
- M `src/core/completions.ts`
- M `src/core/status.ts`
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
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/completion.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/reports/2026-06-12-04-04-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-11-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-active-task-done-shortcut.md`

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

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-04-12-ship-report.md`

## Acceptance Criteria

- agentloop task done marks the active task done when no path is supplied.
- agentloop task done <path> marks an explicit task done.
- status and next can recommend the short command for clean review tasks.
- Docs describe the shortcut and keep archive as a separate action.

## Verification Evidence

- Overall status: pass (/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-04-04-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- A shortcut command can obscure which file changed if output is not explicit.

## Rollback Notes

Remove the task done subcommand and restore status/next to the path-based task status recommendation.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
