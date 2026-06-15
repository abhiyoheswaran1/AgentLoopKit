# PR Summary

- Generated: 2026-06-15-20-21
- Task context: `Preview stale AgentLoop evidence`
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
- ?? `.agentloop/reports/2026-06-15-20-19-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-20-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-20-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-20-20-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-preview-stale-agentloop-evidence.md`

## Change Areas
### Source
- M `src/cli/commands/artifacts.ts`
- M `src/core/artifacts.ts`

### Tests
- M `tests/artifacts.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-15-20-19-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-20-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-20-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-20-20-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-preview-stale-agentloop-evidence.md`

### Documentation
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`

## Diff Stats
```text
.agentloop/backlog.md         |   7 ++
 .agentloop/dogfood-log.md     |  33 ++++++
 README.md                     |   1 +
 docs/cli-reference.md         |   6 +-
 docs/getting-started.md       |   2 +
 src/cli/commands/artifacts.ts |  44 +++++++-
 src/core/artifacts.ts         | 237 ++++++++++++++++++++++++++++++++++++++++++
 tests/artifacts.test.ts       | 186 +++++++++++++++++++++++++++++++++
 8 files changed, 511 insertions(+), 5 deletions(-)
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
