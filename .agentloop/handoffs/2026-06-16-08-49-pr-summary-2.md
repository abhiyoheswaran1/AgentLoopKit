# PR Summary

- Generated: 2026-06-16-08-49
- Task context: `Preserve existing agent instruction files`
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
- M `src/cli/commands/install-agent.ts`
- M `src/core/agent-installation.ts`
- M `tests/agent-installation.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-08-47-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-08-49-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-08-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-47-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-48-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-49-ship-report.md`
- ?? `.agentloop/research/interview-cycle-116.md`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-preserve-existing-agent-instruction-files-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-preserve-existing-agent-instruction-files.md`

## Change Areas
### Source
- M `src/cli/commands/install-agent.ts`
- M `src/core/agent-installation.ts`

### Tests
- M `tests/agent-installation.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-08-47-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-08-49-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-08-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-47-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-48-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-49-ship-report.md`
- ?? `.agentloop/research/interview-cycle-116.md`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-08-49-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-preserve-existing-agent-instruction-files-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-preserve-existing-agent-instruction-files.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md             |  6 ++++
 .agentloop/dogfood-log.md         | 49 ++++++++++++++++++++++++++++++
 CHANGELOG.md                      |  1 +
 DECISIONS.md                      |  8 +++++
 README.md                         |  2 +-
 docs/cli-reference.md             |  4 +--
 src/cli/commands/install-agent.ts | 14 +++++++--
 src/core/agent-installation.ts    | 16 ++++++++--
 tests/agent-installation.test.ts  | 63 ++++++++++++++++++++++++++++++++++++++-
 9 files changed, 154 insertions(+), 9 deletions(-)
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
