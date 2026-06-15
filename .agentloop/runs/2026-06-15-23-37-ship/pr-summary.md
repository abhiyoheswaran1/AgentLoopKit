# PR Summary

- Generated: 2026-06-15-23-37
- Task context: `Add targeted release-proof channel checks`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/release-proof.md`
- M `src/cli/commands/release-proof.ts`
- M `src/core/release-proof.ts`
- M `tests/release-proof.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-23-37-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-23-36-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-15-add-targeted-release-proof-channel-checks.md`

## Change Areas
### Source
- M `src/cli/commands/release-proof.ts`
- M `src/core/release-proof.ts`

### Tests
- M `tests/release-proof.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-23-37-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-23-36-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-15-add-targeted-release-proof-channel-checks.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/release-proof.md`

## Diff Stats
```text
.agentloop/backlog.md             |   1 +
 .agentloop/dogfood-log.md         |  41 +++++++++
 CHANGELOG.md                      |   4 +
 README.md                         |   2 +-
 docs/cli-reference.md             |   6 +-
 docs/release-proof.md             |   8 ++
 src/cli/commands/release-proof.ts |  97 +++++++++++++++++----
 src/core/release-proof.ts         | 176 ++++++++++++++++++++++++--------------
 tests/release-proof.test.ts       |  89 +++++++++++++++++++
 9 files changed, 339 insertions(+), 85 deletions(-)
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
