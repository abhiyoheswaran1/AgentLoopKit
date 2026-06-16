# PR Summary

- Generated: 2026-06-16-12-30
- Task context: `Run post-verification gates explicitly from verify`
- Verification status: Overall status: pass

## Summary

This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `AGENTLOOP.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`
- M `src/cli/commands/verify.ts`
- M `src/core/verification.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/tasks/README.md`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-12-24-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-12-24-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-25-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-26-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-28-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-29-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-12-24-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-12-24-verification-report.md`
- ?? `.agentloop/research/interview-cycle-117.md`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-16-run-post-verification-gates-explicitly-from-verify.md`

## Change Areas

### Source

- M `src/cli/commands/verify.ts`
- M `src/core/verification.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/tasks/README.md`

### Tests

- M `tests/verification.test.ts`

### AgentLoop

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `AGENTLOOP.md`
- ?? `.agentloop/handoffs/2026-06-16-12-24-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-12-24-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-25-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-26-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-28-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-29-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-12-24-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-12-24-verification-report.md`
- ?? `.agentloop/research/interview-cycle-117.md`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-12-24-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-26-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-28-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-29-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-16-run-post-verification-gates-explicitly-from-verify.md`

### Documentation

- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`

## Diff Stats

```text
.agentloop/backlog.md             |   6 ++
 .agentloop/dogfood-log.md         |  56 ++++++++++++
 AGENTLOOP.md                      |   2 +-
 CHANGELOG.md                      |   1 +
 DECISIONS.md                      |   2 +
 README.md                         |   1 +
 docs/cli-reference.md             |   9 +-
 docs/task-contracts.md            |   2 +-
 docs/verification-reports.md      |   8 +-
 src/cli/commands/verify.ts        |  29 +++++-
 src/core/verification.ts          | 180 +++++++++++++++++++++++++++++++-----
 src/templates/harness/commands.md |   2 +-
 src/templates/root/AGENTLOOP.md   |   2 +-
 src/templates/tasks/README.md     |   2 +-
 tests/verification.test.ts        | 188 ++++++++++++++++++++++++++++++++++++++
 15 files changed, 453 insertions(+), 37 deletions(-)
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
