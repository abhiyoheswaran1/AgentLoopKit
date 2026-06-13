# PR Summary

- Generated: 2026-06-13-07-39
- Task context: `Warn maintainers about stale handoff evidence`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/core/maintainer-check.ts`
- M `tests/maintainer-check.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-07-31-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-07-32-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-07-39-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-07-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-07-32-ship-report.md`
- ?? `.agentloop/reports/2026-06-13-07-34-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-07-39-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-07-30-verify/`
- ?? `.agentloop/runs/2026-06-13-07-31-handoff/`
- ?? `.agentloop/runs/2026-06-13-07-32-ship/`
- ?? `.agentloop/runs/2026-06-13-07-38-verify/`
- ?? `.agentloop/runs/2026-06-13-07-39-handoff-2/`
- ?? `.agentloop/runs/2026-06-13-07-39-handoff/`
- ?? `.agentloop/runs/2026-06-13-07-39-ship/`
- ?? `.agentloop/tasks/archive/2026-06-13-warn-maintainers-about-stale-handoff-evidence.md`

## Change Areas
### Source
- M `src/core/maintainer-check.ts`

### Tests
- M `tests/maintainer-check.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-07-31-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-07-32-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-07-39-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-07-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-07-32-ship-report.md`
- ?? `.agentloop/reports/2026-06-13-07-34-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-07-39-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-07-30-verify/`
- ?? `.agentloop/runs/2026-06-13-07-31-handoff/`
- ?? `.agentloop/runs/2026-06-13-07-32-ship/`
- ?? `.agentloop/runs/2026-06-13-07-38-verify/`
- ?? `.agentloop/runs/2026-06-13-07-39-handoff-2/`
- ?? `.agentloop/runs/2026-06-13-07-39-handoff/`
- ?? `.agentloop/runs/2026-06-13-07-39-ship/`
- ?? `.agentloop/tasks/archive/2026-06-13-warn-maintainers-about-stale-handoff-evidence.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md          |   6 +++
 .agentloop/dogfood-log.md      |  27 +++++++++++
 CHANGELOG.md                   |   1 +
 docs/cli-reference.md          |   2 +
 src/core/maintainer-check.ts   |  32 ++++++++++---
 tests/maintainer-check.test.ts | 106 +++++++++++++++++++++++++++++++++++++++++
 6 files changed, 168 insertions(+), 6 deletions(-)
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
