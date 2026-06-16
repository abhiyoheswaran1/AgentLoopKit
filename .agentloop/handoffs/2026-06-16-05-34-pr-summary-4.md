# PR Summary

- Generated: 2026-06-16-05-34
- Task context: `Make summarize output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/summarize.ts`
- M `tests/handoff.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-05-33-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-05-34-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-05-34-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-05-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-05-31-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-05-34-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-33-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-33-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-33-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-summarize-output-markdown-safe.md`

## Change Areas
### Source
- M `src/cli/commands/summarize.ts`

### Tests
- M `tests/handoff.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-05-33-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-05-34-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-05-34-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-05-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-05-31-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-05-34-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-33-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-33-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-33-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-33-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-34-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-05-34-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-summarize-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md         |  6 ++++++
 .agentloop/dogfood-log.md     | 44 +++++++++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                  |  1 +
 docs/cli-reference.md         |  2 ++
 src/cli/commands/summarize.ts |  2 +-
 tests/handoff.test.ts         | 31 ++++++++++++++++++++++++++++++
 6 files changed, 85 insertions(+), 1 deletion(-)
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
