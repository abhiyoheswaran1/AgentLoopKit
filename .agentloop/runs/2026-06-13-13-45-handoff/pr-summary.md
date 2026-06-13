# PR Summary

- Generated: 2026-06-13-13-45
- Task context: `Add redacted release-check output`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/commands/release-check.ts`
- M `src/core/release-check.ts`
- M `tests/release-check.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-13-42-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-13-13-42-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-13-34-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-13-42-ship-report.md`
- ?? `.agentloop/reports/2026-06-13-13-44-ship-report-2.md`
- ?? `.agentloop/reports/2026-06-13-13-44-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-add-redacted-release-check-output.md`

## Change Areas
### Source
- M `src/cli/commands/release-check.ts`
- M `src/core/release-check.ts`

### Tests
- M `tests/release-check.test.ts`
- M `tests/release-smoke.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-13-42-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-13-13-42-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-13-34-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-13-42-ship-report.md`
- ?? `.agentloop/reports/2026-06-13-13-44-ship-report-2.md`
- ?? `.agentloop/reports/2026-06-13-13-44-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship-2/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-add-redacted-release-check-output.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`

### CI / Automation
- M `scripts/smoke-packed-release.mjs`

## Diff Stats
```text
.agentloop/dogfood-log.md         | 39 +++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                      |  1 +
 README.md                         |  2 +-
 docs/cli-reference.md             |  3 +++
 scripts/smoke-packed-release.mjs  |  1 +
 src/cli/commands/release-check.ts |  4 +++-
 src/core/release-check.ts         | 41 +++++++++++++++++++++++++++++++++++----
 tests/release-check.test.ts       | 41 ++++++++++++++++++++++++++++++++++++++-
 tests/release-smoke.test.ts       |  2 +-
 9 files changed, 126 insertions(+), 8 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
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
