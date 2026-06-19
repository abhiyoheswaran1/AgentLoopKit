# PR Summary

- Generated: 2026-06-19-23-55
- Task context: `Run real-repo usefulness trials`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `src/core/status.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/next.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/research/interview-cycle-123.md`
- ?? `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md`
- ?? `docs/superpowers/plans/2026-06-19-real-repo-usefulness-trials.md`
- ?? `docs/superpowers/plans/2026-06-19-status-routes-placeholder-active-tasks.md`
- AgentLoop evidence: `10` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/core/status.ts`

### Tests
- M `tests/mcp-tools.test.ts`
- M `tests/next.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/research/interview-cycle-123.md`
- ?? `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- ?? `docs/superpowers/plans/2026-06-19-real-repo-usefulness-trials.md`
- ?? `docs/superpowers/plans/2026-06-19-status-routes-placeholder-active-tasks.md`

### AgentLoop Evidence
- AgentLoop evidence: `10` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/backlog.md        |  6 ++++
 CHANGELOG.md                 |  2 +-
 DECISIONS.md                 |  6 ++++
 src/core/status.ts           | 28 ++++++++++++++--
 tests/mcp-tools.test.ts      |  4 +++
 tests/next.test.ts           | 76 ++++++++++++++++++++++++++++++++++++++++++++
 tests/review-context.test.ts |  1 +
 tests/status.test.ts         | 73 ++++++++++++++++++++++++++++++++++++++++++
 8 files changed, 192 insertions(+), 4 deletions(-)
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
