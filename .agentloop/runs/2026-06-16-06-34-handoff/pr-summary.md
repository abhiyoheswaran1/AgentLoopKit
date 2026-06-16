# PR Summary

- Generated: 2026-06-16-06-34
- Task context: `Make schemastore output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/schemastore.ts`
- M `tests/schemastore.test.ts`
- ?? `.agentloop/reports/2026-06-16-06-34-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-06-34-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-06-34-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-06-34-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-schemastore-output-markdown-safe.md`

## Change Areas
### Source
- M `src/cli/commands/schemastore.ts`

### Tests
- M `tests/schemastore.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-16-06-34-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-06-34-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-06-34-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-06-34-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-schemastore-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md           |  6 ++++++
 .agentloop/dogfood-log.md       | 44 +++++++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                    |  1 +
 docs/cli-reference.md           |  2 ++
 src/cli/commands/schemastore.ts |  2 +-
 tests/schemastore.test.ts       | 38 ++++++++++++++++++++++++++++++++++-
 6 files changed, 91 insertions(+), 2 deletions(-)
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
