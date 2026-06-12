# PR Summary

- Generated: 2026-06-12-16-56
- Task context: `Release AgentLoopKit 0.28.3`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `package.json`
- M `server.json`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-16-28-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-16-28-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-12-16-56-release-notes.md`
- ?? `.agentloop/reports/2026-06-12-16-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-28-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-16-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-16-11-verify/`
- ?? `.agentloop/runs/2026-06-12-16-25-verify/`
- ?? `.agentloop/runs/2026-06-12-16-28-ship/`
- ?? `.agentloop/runs/2026-06-12-16-54-verify/`
- ?? `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-3.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-prepare-pr-archived-task-evidence.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-ship-archived-task-scoring.md`

## Change Areas
### Source
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-16-28-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-16-28-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-12-16-56-release-notes.md`
- ?? `.agentloop/reports/2026-06-12-16-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-28-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-16-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-16-11-verify/`
- ?? `.agentloop/runs/2026-06-12-16-25-verify/`
- ?? `.agentloop/runs/2026-06-12-16-28-ship/`
- ?? `.agentloop/runs/2026-06-12-16-54-verify/`
- ?? `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-3.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-prepare-pr-archived-task-evidence.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-ship-archived-task-scoring.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

## Diff Stats
```text
.agentloop/backlog.md     |  3 +-
 .agentloop/dogfood-log.md | 51 ++++++++++++++++++++++++
 CHANGELOG.md              |  5 +++
 DECISIONS.md              | 12 ++++++
 package.json              |  2 +-
 server.json               |  4 +-
 src/core/prepare-pr.ts    |  6 +--
 src/core/ship.ts          |  4 +-
 tests/prepare-pr.test.ts  | 43 +++++++++++++++++++-
 tests/ship.test.ts        | 99 ++++++++++++++++++++++++++++++++++++-----------
 10 files changed, 197 insertions(+), 32 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review package and config changes for install, build, and publish impact.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.
- Review uncategorized files for ownership and scope.

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
