# PR Summary

- Generated: 2026-06-13-04-37
- Task context: `Broaden post-verification gate detection`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`
- M `src/core/post-verification-gates.ts`
- M `src/templates/tasks/README.md`
- M `tests/create-task.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-04-37-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-04-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-04-37-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-04-32-verify/`
- ?? `.agentloop/runs/2026-06-13-04-37-handoff-2/`
- ?? `.agentloop/runs/2026-06-13-04-37-handoff/`
- ?? `.agentloop/runs/2026-06-13-04-37-ship/`
- ?? `.agentloop/tasks/archive/2026-06-13-broaden-post-verification-gate-detection.md`

## Change Areas
### Source
- M `src/core/post-verification-gates.ts`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/create-task.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-04-37-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-04-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-04-37-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-04-32-verify/`
- ?? `.agentloop/runs/2026-06-13-04-37-handoff-2/`
- ?? `.agentloop/runs/2026-06-13-04-37-handoff/`
- ?? `.agentloop/runs/2026-06-13-04-37-ship/`
- ?? `.agentloop/tasks/archive/2026-06-13-broaden-post-verification-gate-detection.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`

## Diff Stats
```text
.agentloop/backlog.md               |  1 +
 .agentloop/dogfood-log.md           | 19 +++++++++++++++++++
 CHANGELOG.md                        |  1 +
 docs/cli-reference.md               |  2 +-
 docs/task-contracts.md              |  2 +-
 docs/verification-reports.md        |  2 +-
 src/core/post-verification-gates.ts | 20 ++++++++++++++++++++
 src/templates/tasks/README.md       |  2 +-
 tests/create-task.test.ts           | 20 ++++++++++++++++----
 tests/task-state.test.ts            |  8 ++++++++
 10 files changed, 69 insertions(+), 8 deletions(-)
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
