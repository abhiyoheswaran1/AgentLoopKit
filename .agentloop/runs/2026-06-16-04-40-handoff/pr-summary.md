# PR Summary

- Generated: 2026-06-16-04-40
- Task context: `Make upgrade-harness output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- M `src/cli/commands/upgrade-harness.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-04-38-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-04-38-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-04-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-04-38-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-38-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-38-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-38-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-upgrade-harness-output-markdown-safe.md`

## Change Areas
### Source
- M `src/cli/commands/upgrade-harness.ts`

### Tests
- M `tests/upgrade-harness.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-04-38-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-04-38-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-04-36-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-04-38-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-38-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-04-38-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-38-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-38-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-38-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-upgrade-harness-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`

## Diff Stats
```text
.agentloop/backlog.md               |  1 +
 .agentloop/dogfood-log.md           | 37 +++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                        |  1 +
 docs/cli-reference.md               |  2 ++
 docs/template-migrations.md         |  2 ++
 docs/upgrading-existing-repos.md    |  2 ++
 src/cli/commands/upgrade-harness.ts |  2 +-
 tests/upgrade-harness.test.ts       | 21 +++++++++++++++++++++
 8 files changed, 67 insertions(+), 1 deletion(-)
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
