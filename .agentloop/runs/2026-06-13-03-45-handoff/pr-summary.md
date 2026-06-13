# PR Summary

- Generated: 2026-06-13-03-45
- Task context: `Calm check-gates next action for clean passing evidence`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `src/core/check-gates.ts`
- M `tests/check-gates.test.ts`
- ?? `.agentloop/reports/2026-06-13-03-41-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-03-44-verify/`
- ?? `.agentloop/tasks/archive/2026-06-13-calm-check-gates-next-action-for-clean-passing-evidence.md`

## Change Areas
### Source
- M `src/core/check-gates.ts`

### Tests
- M `tests/check-gates.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-13-03-41-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-03-44-verify/`
- ?? `.agentloop/tasks/archive/2026-06-13-calm-check-gates-next-action-for-clean-passing-evidence.md`

### Documentation
- M `CHANGELOG.md`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 25 ++++++++++++++++++
 CHANGELOG.md              |  1 +
 src/core/check-gates.ts   | 15 ++++++++---
 tests/check-gates.test.ts | 67 +++++++++++++++++++++++++++++------------------
 5 files changed, 80 insertions(+), 29 deletions(-)
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
