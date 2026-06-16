# PR Summary

- Generated: 2026-06-16-07-27
- Task context: `Prevent duplicate task contract overwrites`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-16-make-review-context-markdown-output-line-safe.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/core/task-contract.ts`
- M `tests/create-task.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-07-27-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-07-27-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-07-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-27-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-25-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-25-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-25-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-26-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-26-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-26-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-16-prevent-duplicate-task-contract-overwrites.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-review-context-markdown-output-line-safe.md`

## Change Areas
### Source
- M `src/core/task-contract.ts`

### Tests
- M `tests/create-task.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-16-make-review-context-markdown-output-line-safe.md`
- ?? `.agentloop/handoffs/2026-06-16-07-27-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-07-27-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-07-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-27-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-25-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-25-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-25-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-26-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-26-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-26-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-27-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-27-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-16-prevent-duplicate-task-contract-overwrites.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-review-context-markdown-output-line-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md                              |  6 ++
 .agentloop/dogfood-log.md                          | 45 +++++++++++++++
 ...ake-review-context-markdown-output-line-safe.md | 64 ----------------------
 CHANGELOG.md                                       |  1 +
 docs/cli-reference.md                              |  2 +
 src/core/task-contract.ts                          | 42 +++++++++++---
 tests/create-task.test.ts                          | 52 ++++++++++++++++++
 7 files changed, 141 insertions(+), 71 deletions(-)
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
