# Expose gate status through MCP

## Summary

Expose the existing local review gate report through a read-only MCP tool so agents can see task, verification, handoff, harness, policy, and git gates before review.

## Changed Files

### Source
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-policy-status-through-mcp.md`
- ?? `.agentloop/reports/2026-06-12-06-47-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-06-51-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-gate-status-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-policy-status-through-mcp.md`

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
- Ship report: `.agentloop/reports/2026-06-12-06-51-ship-report.md`

## Acceptance Criteria

- agentloop_check_gates appears in the MCP tool list with optional strict input.
- Calling agentloop_check_gates returns the same deterministic gate status shape used by agentloop check-gates --json.
- The MCP tool supports strict mode without changing default behavior.
- MCP docs describe the gate tool and keep the server safety boundary explicit.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-06-47-verification-report.md)

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
