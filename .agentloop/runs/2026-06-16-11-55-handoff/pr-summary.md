# PR Summary

- Generated: 2026-06-16-11-55
- Task context: `Maintain near-term roadmap health`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/maintenance-guards.md`
- M `package.json`
- M `scripts/dogfood.mjs`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-11-52-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-11-52-pr-summary-2.md`
- ?? `.agentloop/reports/2026-06-16-11-51-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-11-52-ship-report-2.md`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-maintain-near-term-roadmap-health.md`
- ?? `scripts/maintenance-check.mjs`
- ?? `tests/maintenance-check-script.test.ts`

## Change Areas
### Tests
- M `tests/autonomous-dogfood.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `tests/maintenance-check-script.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-11-52-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-11-52-pr-summary-2.md`
- ?? `.agentloop/reports/2026-06-16-11-51-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-11-52-ship-report-2.md`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship-2/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-maintain-near-term-roadmap-health.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/maintenance-guards.md`

### CI / Automation
- M `scripts/dogfood.mjs`
- ?? `scripts/maintenance-check.mjs`

### Config / Package
- M `package.json`

## Diff Stats
```text
.agentloop/dogfood-log.md        | 28 ++++++++++++++++++++++++++++
 CHANGELOG.md                     |  3 ++-
 README.md                        |  8 ++++++++
 docs/maintenance-guards.md       |  6 +++++-
 package.json                     |  4 ++--
 scripts/dogfood.mjs              |  2 +-
 tests/autonomous-dogfood.test.ts | 33 +++++++++++++++++++++++++++++----
 tests/dogfood-script.test.ts     |  4 ++--
 tests/package-scripts.test.ts    | 13 +++++++++++++
 9 files changed, 90 insertions(+), 11 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
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
