# PR Summary

- Generated: 2026-06-13-10-02
- Task context: `Require task context for task command verification`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`
- M `src/cli/commands/verify.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-09-59-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-09-56-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-09-59-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-require-task-context-for-task-command-verification.md`

## Change Areas
### Source
- M `src/cli/commands/verify.ts`

### Tests
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-09-59-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-09-56-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-09-59-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-require-task-context-for-task-command-verification.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`

## Diff Stats
```text
.agentloop/backlog.md        |   1 +
 .agentloop/dogfood-log.md    |  25 +++++++
 CHANGELOG.md                 |   1 +
 README.md                    |   4 +-
 docs/cli-reference.md        |   3 +-
 docs/verification-reports.md |   3 +-
 src/cli/commands/verify.ts   |  65 ++++++++++++----
 tests/verification.test.ts   | 175 ++++++++++++++++++++++++++++++++++++++++++-
 8 files changed, 255 insertions(+), 22 deletions(-)
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
