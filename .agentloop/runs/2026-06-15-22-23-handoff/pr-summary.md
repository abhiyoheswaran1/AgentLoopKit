# PR Summary

- Generated: 2026-06-15-22-23
- Task context: `Smoke ship report artifact filters`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `scripts/smoke-cli.mjs`
- ?? `.agentloop/handoffs/2026-06-15-22-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-22-12-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-22-20-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-16-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-16-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-16-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-22-23-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-23-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-23-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-15-smoke-ship-report-artifact-filters.md`

## Change Areas
### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-22-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-22-12-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-22-20-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-16-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-16-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-16-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-18-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-22-23-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-23-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-23-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-15-smoke-ship-report-artifact-filters.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 33 +++++++++++++++++++++++
 scripts/smoke-cli.mjs     | 68 ++++++++++++++++++++++++++++++++++++++++++++++-
 3 files changed, 101 insertions(+), 1 deletion(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
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
