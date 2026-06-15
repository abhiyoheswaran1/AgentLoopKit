# PR Summary

- Generated: 2026-06-15-18-05
- Task context: `Warn on placeholder task contracts`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-17-55-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-04-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-17-52-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-17-55-ship-report.md`
- ?? `.agentloop/reports/2026-06-15-18-04-ship-report.md`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-15-warn-on-placeholder-task-contracts.md`

## Change Areas
### Source
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`

### Tests
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-17-55-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-04-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-17-52-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-17-55-ship-report.md`
- ?? `.agentloop/reports/2026-06-15-18-04-ship-report.md`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-17-55-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-04-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-15-warn-on-placeholder-task-contracts.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

## Diff Stats
```text
.agentloop/dogfood-log.md |  46 +++++++++++++++++++
 CHANGELOG.md              |   1 +
 docs/cli-reference.md     |   2 +
 docs/status.md            |   4 +-
 docs/task-contracts.md    |   3 +-
 src/cli/commands/task.ts  |   3 ++
 src/core/task-state.ts    |  78 ++++++++++++++++++++++++++++++++
 tests/task-state.test.ts  | 111 ++++++++++++++++++++++++++++++++++++++++++++++
 8 files changed, 245 insertions(+), 3 deletions(-)
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
