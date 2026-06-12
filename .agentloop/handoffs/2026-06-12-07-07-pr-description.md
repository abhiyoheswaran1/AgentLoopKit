# Expose artifact inventory through MCP

## Summary

Expose the existing read-only artifact inventory through MCP so agents can discover local task, verification, handoff, report, badge, CI summary, and release-note evidence without directory scraping.

## Changed Files

### Source
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-gate-status-through-mcp.md`
- ?? `.agentloop/reports/2026-06-12-07-03-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-07-07-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-artifact-inventory-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-gate-status-through-mcp.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`

## Review Readiness

- Score: 95/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-12-07-07-ship-report.md`

## Acceptance Criteria

- agentloop_artifacts appears in the MCP tool list with optional type and latest inputs.
- Calling agentloop_artifacts returns the same deterministic JSON shape as agentloop artifacts --json.
- The tool supports type and latest filtering and validates unsupported types.
- MCP docs describe the artifacts tool and preserve the read-only safety boundary.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-07-03-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Document how to revert or disable this change.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
