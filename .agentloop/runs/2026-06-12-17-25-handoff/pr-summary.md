# PR Summary

- Generated: 2026-06-12-17-25
- Task context: `Add verification progress output`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`
- M `src/cli/commands/verify.ts`
- M `src/core/verification.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/reports/2026-06-12-17-19-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-17-20-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-verification-progress-output.md`

## Change Areas
### Source
- M `src/cli/commands/verify.ts`
- M `src/core/verification.ts`

### Tests
- M `tests/verification.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-12-17-19-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-17-20-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-verification-progress-output.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`

## Diff Stats
```text
.agentloop/backlog.md        |   2 +-
 .agentloop/dogfood-log.md    |  18 ++++++
 CHANGELOG.md                 |   2 +-
 DECISIONS.md                 |   6 ++
 README.md                    |   2 +-
 docs/cli-reference.md        |   3 +
 docs/verification-reports.md |   3 +
 src/cli/commands/verify.ts   |  27 ++++++++-
 src/core/verification.ts     |  56 +++++++++++++++----
 tests/verification.test.ts   | 130 +++++++++++++++++++++++++++++++++++++++++++
 10 files changed, 235 insertions(+), 14 deletions(-)
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
