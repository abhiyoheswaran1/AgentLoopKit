# PR Summary

- Generated: 2026-06-16-01-07
- Task context: `Make status and next output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `src/cli/commands/next.ts`
- M `src/core/markdown-format.ts`
- M `src/core/status.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/reports/2026-06-16-01-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-status-and-next-output-markdown-safe.md`

## Change Areas
### Source
- M `src/cli/commands/next.ts`
- M `src/core/markdown-format.ts`
- M `src/core/status.ts`

### Tests
- M `tests/next.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-16-01-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-status-and-next-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/status.md`

## Diff Stats
```text
.agentloop/backlog.md       |   6 ++
 .agentloop/dogfood-log.md   |  42 ++++++++++
 CHANGELOG.md                |   1 +
 docs/cli-reference.md       |   1 +
 docs/status.md              |   1 +
 src/cli/commands/next.ts    |  12 +--
 src/core/markdown-format.ts |   4 +
 src/core/status.ts          |  38 ++++-----
 tests/next.test.ts          |  54 ++++++++++++-
 tests/status.test.ts        | 189 +++++++++++++++++++++++++++++---------------
 10 files changed, 257 insertions(+), 91 deletions(-)
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
