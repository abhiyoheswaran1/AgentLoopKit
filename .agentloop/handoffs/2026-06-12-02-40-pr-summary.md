# PR Summary

- Generated: 2026-06-12-02-40
- Task context: `Group prepare-pr changed files by review area`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/reports/2026-06-12-02-33-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-02-39-verify/`
- ?? `.agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md`
- ?? `src/core/change-areas.ts`

## Change Areas
### Source
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- ?? `src/core/change-areas.ts`

### Tests
- M `tests/prepare-pr.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-02-33-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-02-39-verify/`
- ?? `.agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 20 ++++++++++
 CHANGELOG.md              |  1 +
 FINAL_HANDOFF.md          |  1 +
 README.md                 |  4 +-
 docs/cli-reference.md     |  2 +-
 src/core/pr-summary.ts    | 98 +----------------------------------------------
 src/core/prepare-pr.ts    |  9 +----
 tests/prepare-pr.test.ts  | 45 ++++++++++++++++++++++
 9 files changed, 75 insertions(+), 106 deletions(-)
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
