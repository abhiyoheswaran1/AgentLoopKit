# PR Summary

- Generated: 2026-06-15-18-57
- Task context: `Add repeatable dogfood start helper`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `package.json`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-18-53-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-56-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-57-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-18-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-52-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-add-repeatable-dogfood-start-helper.md`
- ?? `scripts/dogfood-start.mjs`
- ?? `tests/dogfood-start-script.test.ts`

## Change Areas
### Tests
- M `tests/autonomous-dogfood.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `tests/dogfood-start-script.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- ?? `.agentloop/handoffs/2026-06-15-18-53-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-56-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-57-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-18-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-52-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-52-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-52-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-53-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-56-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-57-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-add-repeatable-dogfood-start-helper.md`

### CI / Automation
- ?? `scripts/dogfood-start.mjs`

### Config / Package
- M `package.json`

## Diff Stats
```text
.agentloop/dogfood-log.md                   | 34 +++++++++++++++++++++++++++++
 .agentloop/harness/autonomous-dogfooding.md |  7 +++---
 package.json                                |  3 ++-
 tests/autonomous-dogfood.test.ts            | 11 ++--------
 tests/package-scripts.test.ts               | 12 ++++++++++
 5 files changed, 53 insertions(+), 14 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Check tests cover the changed behavior.
- Review CI or automation changes for permissions and secret handling.
- Review package and config changes for install, build, and publish impact.
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
