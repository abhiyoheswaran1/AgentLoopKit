# Expose ship evidence through MCP

## Summary

MCP clients can inspect local review-readiness evidence through read-only tools for the latest ship report and recent run ledger entries.

## Changed Files

### Source
- M `src/core/artifacts.ts`
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`

### Tests
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/reports/2026-06-12-05-11-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-05-17-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-ship-evidence-through-mcp.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/mcp.md`

## Review Readiness

- Score: 96/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-05-17-ship-report.md`

## Acceptance Criteria

- MCP lists an agentloop_latest_ship_report tool.
- MCP lists an agentloop_list_runs tool with a bounded limit argument.
- agentloop_latest_ship_report reads only the latest local ship report metadata and Markdown content.
- agentloop_list_runs returns recent run metadata without reading env files or executing commands.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-05-11-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- MCP tool additions must not weaken the read-only safety boundary.

## Rollback Notes

Remove the two MCP tools and restore docs/tests to the previous MCP tool list.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
