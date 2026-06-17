# PR Summary

- Generated: 2026-06-16-19-11
- Task context: `Decouple maintenance check from strict release proof`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- D `.agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md`
- M `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- M `AGENTLOOP.md`
- M `README.md`
- M `docs/maintenance-guards.md`
- M `docs/status.md`
- M `docs/upgrading-existing-repos.md`
- M `scripts/maintenance-check.mjs`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/check-gates.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-18-51-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-52-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-59-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-01-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-08-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-18-50-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-18-59-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-07-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md`
- ?? `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md`
- ?? `docs/superpowers/plans/2026-06-16-decouple-maintenance-check-release-proof.md`

## Change Areas
### Source
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/check-gates.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`

### Tests
- M `tests/autonomous-dogfood.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- D `.agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md`
- M `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- M `AGENTLOOP.md`
- ?? `.agentloop/handoffs/2026-06-16-18-51-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-52-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-18-59-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-01-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-19-08-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-18-50-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-18-59-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-19-07-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-52-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-18-59-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-01-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-19-08-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md`
- ?? `.agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md`

### Documentation
- M `README.md`
- M `docs/maintenance-guards.md`
- M `docs/status.md`
- M `docs/upgrading-existing-repos.md`
- ?? `docs/superpowers/plans/2026-06-16-decouple-maintenance-check-release-proof.md`

### CI / Automation
- M `scripts/maintenance-check.mjs`

## Diff Stats
```text
...026-06-16-prevent-stale-agentloop-task-state.md |  78 -----
 ...2026-06-16-publish-github-marketplace-action.md |   2 +-
 AGENTLOOP.md                                       |   2 +
 README.md                                          |   4 +-
 docs/maintenance-guards.md                         |   6 +-
 docs/status.md                                     |  11 +-
 docs/upgrading-existing-repos.md                   |  15 +
 scripts/maintenance-check.mjs                      |   6 +-
 src/cli/commands/next.ts                           |  11 +-
 src/cli/commands/task.ts                           |   3 +
 src/core/check-gates.ts                            |  19 +-
 src/core/status.ts                                 |  58 +++-
 src/core/task-state.ts                             | 232 +++++++++++++-
 src/templates/root/AGENTLOOP.md                    |   2 +
 tests/autonomous-dogfood.test.ts                   |   4 +-
 tests/maintenance-check-script.test.ts             |   6 +-
 tests/next.test.ts                                 |  38 +++
 tests/status.test.ts                               |  38 +++
 tests/task-state.test.ts                           | 339 +++++++++++++++++++++
 19 files changed, 773 insertions(+), 101 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
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
