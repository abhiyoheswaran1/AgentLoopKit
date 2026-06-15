# PR Summary

- Generated: 2026-06-15-21-18
- Task context: `Bound stale preview markdown by default`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `src/cli/commands/artifacts.ts`
- M `src/core/artifacts.ts`
- M `tests/artifacts.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-21-12-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-21-17-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-21-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-21-15-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-bound-stale-preview-markdown-by-default.md`

## Change Areas
### Source
- M `src/cli/commands/artifacts.ts`
- M `src/core/artifacts.ts`

### Tests
- M `tests/artifacts.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-21-12-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-21-17-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-21-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-21-15-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-bound-stale-preview-markdown-by-default.md`

### Documentation
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`

## Diff Stats
```text
.agentloop/backlog.md         |  1 +
 .agentloop/dogfood-log.md     | 37 +++++++++++++++++++++++++++++
 README.md                     |  2 +-
 docs/cli-reference.md         |  2 +-
 docs/getting-started.md       |  2 +-
 src/cli/commands/artifacts.ts |  4 +++-
 src/core/artifacts.ts         |  1 +
 tests/artifacts.test.ts       | 54 ++++++++++++++++++++++++++++++++++++++++++-
 8 files changed, 98 insertions(+), 5 deletions(-)
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
