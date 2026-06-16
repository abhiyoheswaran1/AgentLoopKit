# PR Summary

- Generated: 2026-06-16-07-10
- Task context: `Make review-context Markdown output line-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/core/review-context.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-07-05-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-07-05-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-07-10-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-07-10-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-07-04-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-05-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-07-09-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-10-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-review-context-markdown-output-line-safe.md`

## Change Areas
### Source
- M `src/core/review-context.ts`

### Tests
- M `tests/review-context.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-07-05-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-07-05-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-07-10-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-07-10-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-07-04-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-05-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-07-09-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-10-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-10-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-10-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-review-context-markdown-output-line-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md        |  6 +++
 .agentloop/dogfood-log.md    | 51 +++++++++++++++++++++++++
 CHANGELOG.md                 |  1 +
 docs/cli-reference.md        |  1 +
 src/core/review-context.ts   |  2 +-
 tests/review-context.test.ts | 89 ++++++++++++++++++++++++++++++++++++++++++++
 6 files changed, 149 insertions(+), 1 deletion(-)
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
