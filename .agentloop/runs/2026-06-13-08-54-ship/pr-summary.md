# PR Summary

- Generated: 2026-06-13-08-54
- Task context: `Report nested untracked files precisely`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `src/core/git.ts`
- M `src/core/status.ts`
- M `tests/git.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/reports/2026-06-13-08-45-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-report-nested-untracked-files-precisely.md`

## Change Areas
### Source
- M `src/core/git.ts`
- M `src/core/status.ts`

### Tests
- M `tests/git.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-13-08-45-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-report-nested-untracked-files-precisely.md`

### Documentation
- M `CHANGELOG.md`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 38 ++++++++++++++++++++++++++++++++++++++
 CHANGELOG.md              |  2 ++
 src/core/git.ts           |  5 ++++-
 src/core/status.ts        |  2 +-
 tests/git.test.ts         | 25 ++++++++++++++++++++++++-
 tests/next.test.ts        |  2 +-
 tests/status.test.ts      |  8 ++++++--
 8 files changed, 77 insertions(+), 6 deletions(-)
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
