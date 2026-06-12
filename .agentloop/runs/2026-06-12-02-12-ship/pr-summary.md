# PR Summary

- Generated: 2026-06-12-02-12
- Task context: `Report prepare-pr ship evidence source`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-02-03-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-02-11-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-02-09-verify/`
- ?? `.agentloop/runs/2026-06-12-02-11-ship/`
- ?? `.agentloop/tasks/2026-06-12-report-prepare-pr-ship-evidence-source.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`

## Change Areas
### Source
- M `src/core/prepare-pr.ts`

### Tests
- M `tests/prepare-pr.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- D `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-02-03-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-02-11-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-02-09-verify/`
- ?? `.agentloop/runs/2026-06-12-02-11-ship/`
- ?? `.agentloop/tasks/2026-06-12-report-prepare-pr-ship-evidence-source.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md                              |  1 +
 .agentloop/dogfood-log.md                          | 18 +++++++
 ...in-run-ledger-entries-for-verify-and-handoff.md | 55 ----------------------
 CHANGELOG.md                                       |  1 +
 FINAL_HANDOFF.md                                   |  1 +
 docs/cli-reference.md                              |  2 +
 src/core/prepare-pr.ts                             | 54 +++++++++++++++------
 tests/prepare-pr.test.ts                           | 11 ++++-
 8 files changed, 72 insertions(+), 71 deletions(-)
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
