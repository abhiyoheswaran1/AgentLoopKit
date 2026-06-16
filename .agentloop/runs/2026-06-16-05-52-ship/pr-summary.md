# PR Summary

- Generated: 2026-06-16-05-52
- Task context: `Make verify output Markdown-safe`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/verify.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-05-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-05-49-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-16-make-verify-output-markdown-safe.md`

## Change Areas
### Source
- M `src/cli/commands/verify.ts`

### Tests
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-05-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-05-49-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-16-make-verify-output-markdown-safe.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md      |  6 +++++
 .agentloop/dogfood-log.md  | 39 ++++++++++++++++++++++++++++++++
 CHANGELOG.md               |  1 +
 docs/cli-reference.md      |  2 ++
 src/cli/commands/verify.ts |  2 +-
 tests/verification.test.ts | 56 ++++++++++++++++++++++++++++++++++++++++++++++
 6 files changed, 105 insertions(+), 1 deletion(-)
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
