# PR Summary

- Generated: 2026-06-13-06-32
- Task context: `Treat ship runs as fresh handoff evidence`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `src/core/handoff-coverage.ts`
- M `tests/check-gates.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-06-32-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-06-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-06-32-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-06-29-verify/`
- ?? `.agentloop/runs/2026-06-13-06-32-handoff/`
- ?? `.agentloop/runs/2026-06-13-06-32-ship/`
- ?? `.agentloop/tasks/archive/2026-06-13-treat-ship-runs-as-fresh-handoff-evidence.md`

## Change Areas
### Source
- M `src/core/handoff-coverage.ts`

### Tests
- M `tests/check-gates.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-06-32-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-06-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-06-32-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-06-29-verify/`
- ?? `.agentloop/runs/2026-06-13-06-32-handoff/`
- ?? `.agentloop/runs/2026-06-13-06-32-ship/`
- ?? `.agentloop/tasks/archive/2026-06-13-treat-ship-runs-as-fresh-handoff-evidence.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md        |  1 +
 .agentloop/dogfood-log.md    | 19 +++++++++++-
 CHANGELOG.md                 |  1 +
 docs/check-gates.md          |  2 +-
 docs/cli-reference.md        |  2 +-
 src/core/handoff-coverage.ts | 15 +++++++---
 tests/check-gates.test.ts    | 69 ++++++++++++++++++++++++++++++++++++++++++++
 7 files changed, 102 insertions(+), 7 deletions(-)
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
