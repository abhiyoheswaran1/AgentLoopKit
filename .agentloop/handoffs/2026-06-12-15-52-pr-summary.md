# PR Summary

- Generated: 2026-06-12-15-52
- Task context: `Add post-verification task gates`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/task-contract.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/tasks/README.md`
- M `tests/create-task.test.ts`
- M `tests/task-contract.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/reports/2026-06-12-15-42-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-15-44-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-post-verification-task-gates.md`

## Change Areas
### Source
- M `src/cli/commands/create-task.ts`
- M `src/core/task-contract.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/create-task.test.ts`
- M `tests/task-contract.test.ts`
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- ?? `.agentloop/reports/2026-06-12-15-42-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-15-44-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-post-verification-task-gates.md`

### Documentation
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`

## Diff Stats
```text
.agentloop/backlog.md             |  2 +-
 .agentloop/dogfood-log.md         | 25 ++++++++++++++++++++++++
 .agentloop/harness/commands.md    |  2 ++
 DECISIONS.md                      |  6 ++++++
 docs/cli-reference.md             | 11 +++++++++--
 docs/verification-reports.md      |  2 ++
 src/cli/commands/create-task.ts   | 15 ++++++++++++++
 src/core/task-contract.ts         |  7 +++++++
 src/templates/harness/commands.md |  2 +-
 src/templates/tasks/README.md     |  5 ++++-
 tests/create-task.test.ts         |  8 ++++++++
 tests/task-contract.test.ts       |  3 +++
 tests/verification.test.ts        | 41 +++++++++++++++++++++++++++++++++++++++
 13 files changed, 124 insertions(+), 5 deletions(-)
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
