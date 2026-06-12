# PR Summary

- Generated: 2026-06-12-23-27
- Task context: `Add public release notes mode`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/release-notes.md`
- M `src/cli/commands/release-notes.ts`
- M `src/core/release-notes.ts`
- M `tests/release-notes.test.ts`
- ?? `.agentloop/reports/2026-06-12-23-23-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-23-25-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-public-release-notes-mode.md`

## Change Areas
### Source
- M `src/cli/commands/release-notes.ts`
- M `src/core/release-notes.ts`

### Tests
- M `tests/release-notes.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-23-23-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-23-25-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-public-release-notes-mode.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/release-notes.md`

## Diff Stats
```text
.agentloop/backlog.md             |  1 +
 .agentloop/dogfood-log.md         | 22 ++++++++++++++++++++++
 CHANGELOG.md                      |  2 +-
 docs/cli-reference.md             |  3 ++-
 docs/release-notes.md             |  3 +++
 src/cli/commands/release-notes.ts |  3 +++
 src/core/release-notes.ts         | 31 ++++++++++++++++++++++++++++++-
 tests/release-notes.test.ts       | 26 ++++++++++++++++++++++++++
 8 files changed, 88 insertions(+), 3 deletions(-)
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
