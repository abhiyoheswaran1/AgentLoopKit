# PR Summary

- Generated: 2026-06-13-04-18
- Task context: `Flag post-verification gate mismatches in task doctor`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `docs/getting-started.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`
- M `tests/task-state.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-04-17-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-04-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-04-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-04-17-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-04-10-verify/`
- ?? `.agentloop/runs/2026-06-13-04-17-handoff/`
- ?? `.agentloop/runs/2026-06-13-04-17-ship/`
- ?? `.agentloop/runs/2026-06-13-04-18-handoff-2/`
- ?? `.agentloop/runs/2026-06-13-04-18-handoff/`
- ?? `.agentloop/tasks/archive/2026-06-13-flag-post-verification-gate-mismatches-in-task-doctor.md`
- ?? `src/core/post-verification-gates.ts`

## Change Areas
### Source
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`
- ?? `src/core/post-verification-gates.ts`

### Tests
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/handoffs/2026-06-13-04-17-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-04-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-04-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-04-17-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-04-10-verify/`
- ?? `.agentloop/runs/2026-06-13-04-17-handoff/`
- ?? `.agentloop/runs/2026-06-13-04-17-ship/`
- ?? `.agentloop/runs/2026-06-13-04-18-handoff-2/`
- ?? `.agentloop/runs/2026-06-13-04-18-handoff/`
- ?? `.agentloop/tasks/archive/2026-06-13-flag-post-verification-gate-mismatches-in-task-doctor.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/getting-started.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

## Diff Stats
```text
.agentloop/backlog.md                            |  1 +
 .agentloop/dogfood-log.md                        | 27 +++++++++++
 .agentloop/harness/commands.md                   |  2 +-
 AGENTLOOP.md                                     |  2 +-
 AGENTS.md                                        |  2 +-
 CHANGELOG.md                                     |  1 +
 docs/getting-started.md                          |  2 +-
 docs/status.md                                   |  4 +-
 docs/task-contracts.md                           |  3 +-
 src/cli/commands/create-task.ts                  | 13 +-----
 src/cli/commands/task.ts                         |  3 ++
 src/core/task-state.ts                           | 39 ++++++++++++++++
 src/templates/harness/commands.md                |  2 +-
 src/templates/root/AGENTLOOP.md                  |  2 +-
 src/templates/root/AGENTS.md                     |  2 +-
 src/templates/root/agentloop-directory-readme.md |  2 +-
 src/templates/tasks/README.md                    |  2 +-
 tests/task-state.test.ts                         | 59 ++++++++++++++++++++++++
 18 files changed, 145 insertions(+), 23 deletions(-)
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
