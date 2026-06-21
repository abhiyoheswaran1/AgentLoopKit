# PR Summary

- Generated: 2026-06-20-23-44
- Task context: `Warn when creating tasks over dirty non-evidence work`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/pr-summaries.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- AgentLoop evidence: `53` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/commands/create-task.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`

### Tests
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/pr-summaries.md`
- M `docs/task-contracts.md`

### AgentLoop Evidence
- AgentLoop evidence: `53` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/backlog.md           |  24 ++++
 CHANGELOG.md                    |   5 +-
 DECISIONS.md                    |  24 ++++
 docs/cli-reference.md           |  10 +-
 docs/html-reports.md            |   2 +
 docs/pr-summaries.md            |   2 +
 docs/task-contracts.md          |   2 +
 src/cli/commands/create-task.ts | 101 +++++++++++--
 src/core/git.ts                 |  19 +++
 src/core/html-report.ts         |   4 +-
 src/core/pr-summary.ts          |  10 +-
 src/core/ship.ts                |   9 +-
 src/core/task-contract.ts       |  80 ++++++++++-
 src/core/task-state.ts          |  62 +-------
 tests/create-task.test.ts       | 312 ++++++++++++++++++++++++++++++++++++++++
 tests/html-report.test.ts       |  28 ++++
 tests/pr-summary.test.ts        |  38 +++++
 tests/ship.test.ts              |  21 +++
 18 files changed, 665 insertions(+), 88 deletions(-)
.agentloop/research/interview-cycle-153.md | untracked
.agentloop/research/interview-cycle-154.md | untracked
.agentloop/research/interview-cycle-155.md | untracked
.agentloop/research/interview-cycle-156.md | untracked
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
