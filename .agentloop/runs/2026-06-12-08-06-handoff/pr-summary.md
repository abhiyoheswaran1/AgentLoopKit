# PR Summary

- Generated: 2026-06-12-08-06
- Task context: `Harden MCP run artifact path normalization`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `src/core/mcp-tools.ts`
- M `src/core/review-context.ts`
- M `tests/mcp-tools.test.ts`
- ?? `.agentloop/reports/2026-06-12-08-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-08-05-verify/`
- ?? `.agentloop/tasks/2026-06-12-harden-mcp-run-artifact-path-normalization.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-review-context-through-the-cli.md`
- ?? `src/core/display-path.ts`

## Change Areas
### Source
- M `src/core/mcp-tools.ts`
- M `src/core/review-context.ts`
- ?? `src/core/display-path.ts`

### Tests
- M `tests/mcp-tools.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- ?? `.agentloop/reports/2026-06-12-08-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-08-05-verify/`
- ?? `.agentloop/tasks/2026-06-12-harden-mcp-run-artifact-path-normalization.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-review-context-through-the-cli.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`

## Diff Stats
```text
.agentloop/backlog.md                              |  1 +
 ...-06-12-expose-review-context-through-the-cli.md | 59 ----------------------
 CHANGELOG.md                                       |  1 +
 FINAL_HANDOFF.md                                   |  1 +
 src/core/mcp-tools.ts                              |  4 +-
 src/core/review-context.ts                         | 21 ++------
 tests/mcp-tools.test.ts                            |  8 +++
 7 files changed, 18 insertions(+), 77 deletions(-)
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
