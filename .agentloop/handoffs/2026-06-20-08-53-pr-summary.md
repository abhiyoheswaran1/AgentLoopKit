# PR Summary

- Generated: 2026-06-20-08-53
- Task context: `Make doctor pre-init safe for copy-paste trials`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/real-repo-trials.md`
- M `src/cli/commands/doctor.ts`
- M `src/core/doctor.ts`
- M `tests/doctor.test.ts`
- ?? `.agentloop/research/interview-cycle-124.md`
- ?? `docs/superpowers/plans/2026-06-20-doctor-advisory-mode.md`
- ?? `docs/superpowers/specs/2026-06-20-doctor-advisory-mode-design.md`
- AgentLoop evidence: `18` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/commands/doctor.ts`
- M `src/core/doctor.ts`

### Tests
- M `tests/doctor.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/research/interview-cycle-124.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/real-repo-trials.md`
- ?? `docs/superpowers/plans/2026-06-20-doctor-advisory-mode.md`
- ?? `docs/superpowers/specs/2026-06-20-doctor-advisory-mode-design.md`

### AgentLoop Evidence
- AgentLoop evidence: `18` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/backlog.md      |  6 ++++++
 CHANGELOG.md               |  1 +
 DECISIONS.md               |  6 ++++++
 README.md                  | 10 +++++++++-
 docs/cli-reference.md      |  3 +++
 docs/real-repo-trials.md   |  4 +++-
 src/cli/commands/doctor.ts | 37 +++++++++++++++++++++-------------
 src/core/doctor.ts         |  5 +++++
 tests/doctor.test.ts       | 50 ++++++++++++++++++++++++++++++++++++++++++++++
 9 files changed, 106 insertions(+), 16 deletions(-)
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
