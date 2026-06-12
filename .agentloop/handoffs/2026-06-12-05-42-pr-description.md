# Expose run details through MCP

## Summary

MCP clients can read one local run ledger entry by id with repo-relative artifact paths and no write or command execution capability.

## Changed Files

### Source
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-ship-evidence-through-mcp.md`
- ?? `.agentloop/handoffs/2026-06-12-05-42-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-05-42-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-05-38-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-05-42-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-05-42-ship/`
- ?? `.agentloop/runs/2026-06-12-05-42-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-run-details-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-ship-evidence-through-mcp.md`

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
- Ship report: `.agentloop/reports/2026-06-12-05-42-ship-report.md`

## Acceptance Criteria

- Read-only MCP tool agentloop_show_run accepts a run id and returns the same local run record shape as the CLI show-run command.
- MCP show-run payload renders AgentLoop artifact paths repo-relative and never leaks the absolute workspace path.
- Unsafe or missing run ids return the existing run-ledger error path without reading outside .agentloop/runs.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-05-38-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- MCP payloads can accidentally expose absolute local paths or read through unsafe run ids.

## Rollback Notes

Document how to revert or disable this change.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
