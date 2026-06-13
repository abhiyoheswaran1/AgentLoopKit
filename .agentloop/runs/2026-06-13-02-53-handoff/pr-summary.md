# PR Summary

- Generated: 2026-06-13-02-53
- Task context: `Consolidate task lifecycle next-step copy`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `src/cli/commands/task.ts`
- ?? `.agentloop/reports/2026-06-13-02-50-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-02-52-verify/`
- ?? `.agentloop/tasks/archive/2026-06-13-consolidate-task-lifecycle-next-step-copy.md`

## Change Areas
### Source
- M `src/cli/commands/task.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-13-02-50-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-02-52-verify/`
- ?? `.agentloop/tasks/archive/2026-06-13-consolidate-task-lifecycle-next-step-copy.md`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 23 +++++++++++++++++++++++
 src/cli/commands/task.ts  | 16 +++++++++-------
 3 files changed, 33 insertions(+), 7 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
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
