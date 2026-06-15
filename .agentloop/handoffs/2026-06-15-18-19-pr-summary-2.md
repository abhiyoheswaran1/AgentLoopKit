# PR Summary

- Generated: 2026-06-15-18-19
- Task context: `Fix CLI smoke placeholder contract regression`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `scripts/smoke-cli.mjs`
- ?? `.agentloop/handoffs/2026-06-15-18-16-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-19-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-18-15-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-18-16-ship-report.md`
- ?? `.agentloop/reports/2026-06-15-18-19-ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-15-fix-cli-smoke-placeholder-contract-regression.md`

## Change Areas
### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-15-18-16-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-19-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-18-15-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-18-16-ship-report.md`
- ?? `.agentloop/reports/2026-06-15-18-19-ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-16-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-19-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-15-fix-cli-smoke-placeholder-contract-regression.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Diff Stats
```text
.agentloop/dogfood-log.md | 35 +++++++++++++++++++++++++++++++++++
 scripts/smoke-cli.mjs     |  2 ++
 2 files changed, 37 insertions(+)
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
