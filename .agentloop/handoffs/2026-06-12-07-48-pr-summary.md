# PR Summary

- Generated: 2026-06-12-07-48
- Task context: `Expose review context through the CLI`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-review-context-through-mcp.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- M `tests/cli-docs-drift.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-07-47-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-07-43-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-07-47-handoff/`
- ?? `.agentloop/runs/2026-06-12-07-47-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-review-context-through-mcp.md`
- ?? `src/cli/commands/review-context.ts`
- ?? `src/core/review-context.ts`
- ?? `tests/review-context.test.ts`

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- ?? `src/cli/commands/review-context.ts`
- ?? `src/core/review-context.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- ?? `tests/review-context.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-expose-review-context-through-mcp.md`
- ?? `.agentloop/handoffs/2026-06-12-07-47-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-07-43-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-07-47-handoff/`
- ?? `.agentloop/runs/2026-06-12-07-47-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-review-context-through-mcp.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Diff Stats
```text
.agentloop/backlog.md                              |  1 +
 ...2026-06-12-expose-review-context-through-mcp.md | 72 ----------------------
 CHANGELOG.md                                       |  1 +
 FINAL_HANDOFF.md                                   |  2 +
 README.md                                          | 62 ++++++++++---------
 ROADMAP.md                                         |  3 +-
 docs/cli-reference.md                              | 11 ++++
 scripts/smoke-cli.mjs                              | 38 +++++++++++-
 src/cli/index.ts                                   |  2 +
 src/core/completions.ts                            |  1 +
 src/core/mcp-tools.ts                              | 56 +----------------
 tests/cli-docs-drift.test.ts                       |  1 +
 12 files changed, 89 insertions(+), 161 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
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
