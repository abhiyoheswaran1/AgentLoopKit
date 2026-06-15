# PR Summary

- Generated: 2026-06-15-18-36
- Task context: `Guard dogfood task sequencing`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `tests/autonomous-dogfood.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-18-32-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-36-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-18-31-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-18-32-ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-guard-dogfood-task-sequencing.md`

## Change Areas
### Tests
- M `tests/autonomous-dogfood.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- ?? `.agentloop/handoffs/2026-06-15-18-32-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-36-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-18-31-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-18-32-ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-guard-dogfood-task-sequencing.md`

## Diff Stats
```text
.agentloop/dogfood-log.md                   | 36 +++++++++++++++++++++++++++++
 .agentloop/harness/autonomous-dogfooding.md |  4 +++-
 tests/autonomous-dogfood.test.ts            | 15 ++++++++++++
 3 files changed, 54 insertions(+), 1 deletion(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Check tests cover the changed behavior.
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
