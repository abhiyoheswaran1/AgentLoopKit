# Expose policy status through MCP

## Summary

Expose policy template status through a read-only MCP tool so agents can check policy drift before changing repo rules.

## Changed Files

### Source
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-12-expose-maintainer-check-through-mcp.md`
- ?? `.agentloop/reports/2026-06-12-06-28-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-06-31-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-policy-status-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-maintainer-check-through-mcp.md`

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
- Ship report: `.agentloop/reports/2026-06-12-06-34-ship-report.md`

## Acceptance Criteria

- agentloop_policy_status appears in the MCP tool list with an empty input schema.
- Calling agentloop_policy_status returns the same deterministic policy status shape used by agentloop policy status --json.
- The MCP tool remains read-only and safe against policy root traversal.
- MCP docs describe the policy status tool and its intended use.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-06-28-verification-report.md)

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
