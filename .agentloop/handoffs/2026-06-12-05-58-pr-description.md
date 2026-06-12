# Expose file intent through MCP

## Summary

MCP clients can ask which local AgentLoopKit runs touched or referenced a file and why, using the existing run ledger without command execution.

## Changed Files

### Source
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-run-details-through-mcp.md`
- ?? `.agentloop/reports/2026-06-12-05-54-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-05-58-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-file-intent-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-run-details-through-mcp.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-05-58-ship-report.md`

## Acceptance Criteria

- Read-only MCP tool agentloop_file_intent accepts a repo-relative file path and returns the same deterministic intent matches as agentloop intent.
- The MCP intent payload includes the normalized file path and matching run summaries with repo-relative AgentLoop artifact paths.
- The tool does not read the target file contents, execute commands, call APIs, or write files.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-05-54-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- MCP intent lookup must not turn arbitrary file paths into file reads or absolute path leaks.

## Rollback Notes

Document how to revert or disable this change.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
