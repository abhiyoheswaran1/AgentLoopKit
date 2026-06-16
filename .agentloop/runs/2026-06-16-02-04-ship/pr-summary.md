# PR Summary

- Generated: 2026-06-16-02-04
- Task context: `Make release-notes output Markdown-safe`
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
- ?? `.agentloop/reports/2026-06-16-02-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-02-02-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-02-02-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-02-02-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-release-notes-output-markdown-safe.md`

## Change Areas
### Source
- M `src/cli/commands/release-notes.ts`
- M `src/core/release-notes.ts`

### Tests
- M `tests/release-notes.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-16-02-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-02-02-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-02-02-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-02-02-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-release-notes-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/release-notes.md`

## Diff Stats
```text
.agentloop/backlog.md             |  6 ++++++
 .agentloop/dogfood-log.md         | 28 ++++++++++++++++++++++++++
 CHANGELOG.md                      |  1 +
 docs/cli-reference.md             |  2 ++
 docs/release-notes.md             |  4 +++-
 src/cli/commands/release-notes.ts |  2 +-
 src/core/release-notes.ts         |  2 +-
 tests/release-notes.test.ts       | 42 ++++++++++++++++++++++++++++++++++++---
 8 files changed, 81 insertions(+), 6 deletions(-)
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
