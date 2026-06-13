# PR Summary

- Generated: 2026-06-13-07-06
- Task context: `Report post-ship gate state`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/core/check-gates.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/ship.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/reports/2026-06-13-06-58-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-07-02-verify/`
- ?? `.agentloop/tasks/2026-06-13-report-post-ship-gate-state.md`

## Change Areas
### Source
- M `src/core/check-gates.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-13-06-58-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-07-02-verify/`
- ?? `.agentloop/tasks/2026-06-13-report-post-ship-gate-state.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md        |  1 +
 .agentloop/dogfood-log.md    | 19 +++++++++++++++++++
 CHANGELOG.md                 |  1 +
 docs/cli-reference.md        |  2 ++
 src/core/check-gates.ts      | 10 ++++++++--
 src/core/handoff-coverage.ts | 25 ++++++++++++++++++++++++-
 src/core/ship.ts             | 29 +++++++++++++++++++++--------
 tests/ship.test.ts           | 11 +++++++++++
 8 files changed, 87 insertions(+), 11 deletions(-)
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
