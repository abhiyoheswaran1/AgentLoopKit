# PR Summary

- Generated: 2026-06-13-11-31
- Task context: `Use redacted review context in dogfood gate`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `scripts/dogfood.mjs`
- M `tests/dogfood-script.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-11-27-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-11-31-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-11-26-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-11-27-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-11-26-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-26-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-26-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-13-use-redacted-review-context-in-dogfood-gate.md`

## Change Areas
### Tests
- M `tests/dogfood-script.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-13-11-27-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-11-31-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-11-26-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-11-27-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-11-26-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-26-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-26-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-11-27-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-11-31-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-13-use-redacted-review-context-in-dogfood-gate.md`

### Documentation
- M `CHANGELOG.md`

### CI / Automation
- M `scripts/dogfood.mjs`

## Diff Stats
```text
.agentloop/dogfood-log.md    | 27 +++++++++++++++++++++++++++
 CHANGELOG.md                 |  1 +
 scripts/dogfood.mjs          |  2 +-
 tests/dogfood-script.test.ts |  8 ++++++++
 4 files changed, 37 insertions(+), 1 deletion(-)
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
