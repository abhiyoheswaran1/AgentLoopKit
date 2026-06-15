# PR Summary

- Generated: 2026-06-15-19-38
- Task context: `Guard self-dogfood instruction drift`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `tests/autonomous-dogfood.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-19-27-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-19-31-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-19-34-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-15-19-34-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-19-38-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-19-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-19-26-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-19-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-19-34-ship-report.md`
- ?? `.agentloop/reports/2026-06-15-19-37-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-25-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-25-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-25-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-27-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-27-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-27-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-30-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-30-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-30-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-19-37-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-37-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-37-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-guard-self-dogfood-instruction-drift.md`

## Change Areas
### Tests
- M `tests/autonomous-dogfood.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- ?? `.agentloop/handoffs/2026-06-15-19-27-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-19-31-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-19-34-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-15-19-34-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-19-38-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-19-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-19-26-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-19-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-19-34-ship-report.md`
- ?? `.agentloop/reports/2026-06-15-19-37-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-25-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-25-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-25-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-27-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-27-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-27-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-27-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-30-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-30-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-30-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-31-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-34-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-19-34-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-19-37-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-37-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-37-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-38-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-guard-self-dogfood-instruction-drift.md`

## Diff Stats
```text
.agentloop/backlog.md                       |  1 +
 .agentloop/dogfood-log.md                   | 30 +++++++++++++++++++++++++++++
 .agentloop/harness/autonomous-dogfooding.md |  2 ++
 tests/autonomous-dogfood.test.ts            |  8 ++++++++
 4 files changed, 41 insertions(+)
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
