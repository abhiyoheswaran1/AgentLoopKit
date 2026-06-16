# PR Summary

- Generated: 2026-06-16-08-47
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
- ?? `.agentloop/reports/2026-06-16-08-46-verification-report.md`
- ?? `.agentloop/research/interview-cycle-116.md`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-preserve-existing-agent-instruction-files-2.md`
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
- ?? `.agentloop/reports/2026-06-16-08-46-verification-report.md`
- ?? `.agentloop/research/interview-cycle-116.md`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-preserve-existing-agent-instruction-files-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-preserve-existing-agent-instruction-files.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md             |  6 ++++
 .agentloop/dogfood-log.md         | 24 +++++++++++++++
 CHANGELOG.md                      |  1 +
 DECISIONS.md                      |  8 +++++
 README.md                         |  2 +-
 docs/cli-reference.md             |  4 +--
 src/cli/commands/install-agent.ts | 14 +++++++--
 src/core/agent-installation.ts    | 16 ++++++++--
 tests/agent-installation.test.ts  | 63 ++++++++++++++++++++++++++++++++++++++-
 9 files changed, 129 insertions(+), 9 deletions(-)
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
