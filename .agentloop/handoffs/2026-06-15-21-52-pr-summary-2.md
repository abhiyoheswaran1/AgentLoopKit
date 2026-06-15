# PR Summary

- Generated: 2026-06-15-21-52
- Task context: `Filter ship report artifacts`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `src/core/artifacts.ts`
- M `tests/artifacts.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-21-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-21-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-21-43-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-21-50-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-45-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-45-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-45-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-52-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-filter-ship-report-artifacts.md`

## Change Areas
### Source
- M `src/core/artifacts.ts`

### Tests
- M `tests/artifacts.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-21-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-21-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-21-43-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-21-50-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-45-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-45-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-45-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-52-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-52-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-filter-ship-report-artifacts.md`

### Documentation
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`

## Diff Stats
```text
.agentloop/backlog.md     |   1 +
 .agentloop/dogfood-log.md |  44 ++++++++++++++
 README.md                 |   2 +-
 docs/cli-reference.md     |   4 +-
 docs/getting-started.md   |   3 +-
 src/core/artifacts.ts     |  35 +++++++++++-
 tests/artifacts.test.ts   | 142 ++++++++++++++++++++++++++++++++++++++++++++++
 7 files changed, 226 insertions(+), 5 deletions(-)
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
