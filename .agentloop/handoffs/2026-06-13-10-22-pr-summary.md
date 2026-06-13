# PR Summary

- Generated: 2026-06-13-10-22
- Task context: `Clean stale root handoff release copy`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `scripts/smoke-packed-release.mjs`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-10-21-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-10-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-10-21-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-10-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-20-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-clean-stale-root-handoff-release-copy.md`

## Change Areas
### Tests
- M `tests/release-smoke.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-10-21-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-10-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-10-21-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-10-20-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-20-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-20-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-10-21-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-clean-stale-root-handoff-release-copy.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`

### CI / Automation
- M `scripts/smoke-packed-release.mjs`

## Diff Stats
```text
.agentloop/backlog.md            |  1 +
 .agentloop/dogfood-log.md        | 29 +++++++++++++++
 CHANGELOG.md                     |  1 +
 FINAL_HANDOFF.md                 |  8 ++---
 scripts/smoke-packed-release.mjs | 71 ++++++++++++++++++++++++++++++++++++
 tests/release-smoke.test.ts      | 78 ++++++++++++++++++++++++++++++++++++++++
 6 files changed, 184 insertions(+), 4 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
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
