# PR Summary

- Generated: 2026-06-16-01-23
- Task context: `Make artifacts output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `src/core/artifacts.ts`
- M `tests/artifacts.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-01-23-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-01-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-01-23-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-01-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-01-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-01-20-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-artifacts-output-markdown-safe.md`

## Change Areas
### Source
- M `src/core/artifacts.ts`

### Tests
- M `tests/artifacts.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-01-23-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-01-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-01-23-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-01-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-01-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-01-20-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-01-23-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-artifacts-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`

## Diff Stats
```text
.agentloop/backlog.md     |   6 ++
 .agentloop/dogfood-log.md |  40 +++++++++++
 CHANGELOG.md              |   1 +
 docs/cli-reference.md     |   1 +
 docs/getting-started.md   |   1 +
 src/core/artifacts.ts     |  14 ++--
 tests/artifacts.test.ts   | 179 ++++++++++++++++++++++++++++++++++++++++++----
 7 files changed, 219 insertions(+), 23 deletions(-)
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
