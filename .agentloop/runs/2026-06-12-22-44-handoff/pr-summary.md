# PR Summary

- Generated: 2026-06-12-22-44
- Task context: `Require current release notes in release-check`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/core/release-check.ts`
- M `tests/release-check.test.ts`
- ?? `.agentloop/reports/2026-06-12-22-41-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-22-42-verify/`
- ?? `.agentloop/tasks/2026-06-12-require-current-release-notes-in-release-check.md`

## Change Areas
### Source
- M `src/core/release-check.ts`

### Tests
- M `tests/release-check.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-22-41-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-22-42-verify/`
- ?? `.agentloop/tasks/2026-06-12-require-current-release-notes-in-release-check.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md       |  1 +
 .agentloop/dogfood-log.md   | 23 +++++++++++++++++++
 CHANGELOG.md                |  2 +-
 docs/cli-reference.md       |  2 +-
 src/core/release-check.ts   | 23 +++++++++++++++++--
 tests/release-check.test.ts | 54 +++++++++++++++++++++++++++++++++++++++++++--
 6 files changed, 99 insertions(+), 6 deletions(-)
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
