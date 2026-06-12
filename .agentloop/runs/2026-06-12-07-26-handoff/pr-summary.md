# PR Summary

- Generated: 2026-06-12-07-26
- Task context: `Expose review context through MCP`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-artifact-inventory-through-mcp.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`
- M `src/core/mcp-tools.ts`
- M `tests/mcp-tools.test.ts`
- ?? `.agentloop/reports/2026-06-12-07-22-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-07-26-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-review-context-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-artifact-inventory-through-mcp.md`

## Change Areas
### Source
- M `src/core/mcp-tools.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-artifact-inventory-through-mcp.md`
- ?? `.agentloop/reports/2026-06-12-07-22-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-07-26-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-review-context-through-mcp.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-artifact-inventory-through-mcp.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`

## Diff Stats
```text
.agentloop/backlog.md                              | 391 +++++++++++----------
 ...-06-12-expose-artifact-inventory-through-mcp.md |  59 ----
 CHANGELOG.md                                       |   1 +
 FINAL_HANDOFF.md                                   |   3 +-
 ROADMAP.md                                         |   4 +-
 docs/cli-reference.md                              |   2 +-
 docs/mcp.md                                        |  38 +-
 src/core/mcp-tools.ts                              |  81 ++++-
 tests/mcp-tools.test.ts                            |  94 +++++
 9 files changed, 388 insertions(+), 285 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.

## Verification Performed
- Overall status: pass

## Verification Not Performed
- Check the verification report for skipped commands.

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

## Reviewer Checklist
- [ ] Acceptance criteria match the task contract.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.
