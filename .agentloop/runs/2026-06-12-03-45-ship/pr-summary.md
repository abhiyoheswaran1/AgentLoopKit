# PR Summary

- Generated: 2026-06-12-03-45
- Task context: `Improve next action for review-ready tasks`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `src/core/status.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/reports/2026-06-12-03-38-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-03-45-verify/`
- ?? `.agentloop/tasks/2026-06-12-improve-next-action-for-review-ready-tasks.md`

## Change Areas
### Source
- M `src/core/status.ts`

### Tests
- M `tests/next.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-03-38-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-03-45-verify/`
- ?? `.agentloop/tasks/2026-06-12-improve-next-action-for-review-ready-tasks.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `docs/status.md`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 18 ++++++++++++++++++
 CHANGELOG.md              |  1 +
 FINAL_HANDOFF.md          |  1 +
 docs/cli-reference.md     |  2 +-
 docs/status.md            |  3 ++-
 src/core/status.ts        |  7 +++++++
 tests/next.test.ts        | 32 ++++++++++++++++++++++++++++++++
 tests/status.test.ts      | 40 ++++++++++++++++++++++++++++++++++++++++
 9 files changed, 103 insertions(+), 2 deletions(-)
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
