# PR Summary

- Generated: 2026-06-12-19-23
- Task context: `Add config verification command suggestions`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/verification.ts`
- M `tests/create-task.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/reports/2026-06-12-19-17-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-19-20-verify/`
- ?? `.agentloop/tasks/archive/2026-06-12-add-config-verification-command-suggestions.md`

## Change Areas
### Source
- M `src/cli/commands/create-task.ts`
- M `src/core/verification.ts`

### Tests
- M `tests/create-task.test.ts`
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-19-17-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-19-20-verify/`
- ?? `.agentloop/tasks/archive/2026-06-12-add-config-verification-command-suggestions.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`

## Diff Stats
```text
.agentloop/backlog.md           |  1 +
 .agentloop/dogfood-log.md       | 29 +++++++++++++++++++
 CHANGELOG.md                    |  2 ++
 README.md                       |  4 ++-
 docs/cli-reference.md           |  5 ++++
 docs/task-contracts.md          |  3 ++
 src/cli/commands/create-task.ts | 37 +++++++++++++++++++++++-
 src/core/verification.ts        | 14 ++++++++-
 tests/create-task.test.ts       | 58 +++++++++++++++++++++++++++++++++++++
 tests/verification.test.ts      | 63 +++++++++++++++++++++++++++++++++++++++++
 10 files changed, 213 insertions(+), 3 deletions(-)
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
