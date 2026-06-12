# PR Summary

- Generated: 2026-06-12-13-51
- Task context: `Accept archived task evidence in gates`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/task.ts`
- M `src/core/check-gates.ts`
- M `src/core/task-state.ts`
- M `tests/check-gates.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-13-33-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-13-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-13-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-33-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-13-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-31-verify/`
- ?? `.agentloop/runs/2026-06-12-13-33-ship/`
- ?? `.agentloop/runs/2026-06-12-13-48-verify/`
- ?? `.agentloop/runs/2026-06-12-13-51-verify/`
- ?? `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-bulk-task-archive-mode.md`
- ?? `tests/task-archive.test.ts`

## Change Areas
### Source
- M `src/cli/commands/task.ts`
- M `src/core/check-gates.ts`
- M `src/core/task-state.ts`

### Tests
- M `tests/check-gates.test.ts`
- ?? `tests/task-archive.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/handoffs/2026-06-12-13-33-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-13-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-13-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-33-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-13-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-31-verify/`
- ?? `.agentloop/runs/2026-06-12-13-33-ship/`
- ?? `.agentloop/runs/2026-06-12-13-48-verify/`
- ?? `.agentloop/runs/2026-06-12-13-51-verify/`
- ?? `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-bulk-task-archive-mode.md`

### Documentation
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

## Diff Stats
```text
.agentloop/backlog.md          |   6 +++
 .agentloop/dogfood-log.md      |  55 ++++++++++++++++++++
 .agentloop/harness/commands.md |   1 +
 AGENTLOOP.md                   |   2 +-
 AGENTS.md                      |   1 +
 README.md                      |   7 +++
 docs/check-gates.md            |   2 +
 docs/cli-reference.md          |   4 +-
 docs/status.md                 |   4 +-
 docs/task-contracts.md         |   4 +-
 src/cli/commands/task.ts       | 113 +++++++++++++++++++++++++++++++++++++++--
 src/core/check-gates.ts        |  53 ++++++++++++++++---
 src/core/task-state.ts         |  76 +++++++++++++++++++++++++++
 tests/check-gates.test.ts      |  56 +++++++++++++++++++-
 14 files changed, 368 insertions(+), 16 deletions(-)
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
