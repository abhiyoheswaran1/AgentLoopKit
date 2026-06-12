# Expose maintainer check through MCP

## Summary

MCP clients can inspect local maintainer reviewability signals for AI-assisted work without command execution, writes, API calls, or token handling.

## Changed Files

### Source
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-file-intent-through-mcp.md`
- ?? `.agentloop/reports/2026-06-12-06-10-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-06-13-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-maintainer-check-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-file-intent-through-mcp.md`

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
- Ship report: `.agentloop/reports/2026-06-12-06-13-ship-report.md`

## Acceptance Criteria

- Read-only MCP tool agentloop_maintainer_check returns the same deterministic maintainer-check payload used by the CLI.
- The MCP maintainer-check payload remains local-only and does not post comments, call GitHub, or read environment files.
- The tool is documented in MCP docs and covered by MCP tool tests.

## Verification Evidence

- Overall status: pass (.agentloop/reports/2026-06-12-06-10-verification-report.md)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Maintainer-check may expose local paths in structured output; avoid adding new path exposure beyond existing CLI JSON semantics unless already normalized.

## Rollback Notes

Document how to revert or disable this change.

## What Was Not Verified

- Check the verification report for skipped commands or untested areas.
