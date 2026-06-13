# PR Summary

- Generated: 2026-06-13-11-03
- Task context: `Accept redacted output flag on review context`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/review-context.ts`
- M `src/core/review-context.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-10-58-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-11-03-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-10-57-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-10-58-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-13-accept-redacted-output-flag-on-review-context.md`

## Change Areas
### Source
- M `src/cli/commands/review-context.ts`
- M `src/core/review-context.ts`

### Tests
- M `tests/review-context.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-10-58-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-11-03-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-10-57-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-10-58-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-10-58-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-03-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-13-accept-redacted-output-flag-on-review-context.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/dogfood-log.md          | 28 ++++++++++++++++++++++++++++
 CHANGELOG.md                       |  1 +
 README.md                          |  2 +-
 docs/cli-reference.md              |  1 +
 src/cli/commands/review-context.ts |  9 +++++++--
 src/core/review-context.ts         | 14 +++++++++++---
 tests/review-context.test.ts       | 26 +++++++++++++++++++++++++-
 7 files changed, 74 insertions(+), 7 deletions(-)
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
