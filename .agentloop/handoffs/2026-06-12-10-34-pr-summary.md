# PR Summary

- Generated: 2026-06-12-10-34
- Task context: `Redact acceptance-layer git roots`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/release-status.md`
- M `src/cli/commands/prepare-pr.ts`
- M `src/cli/commands/ship.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-10-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-10-29-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-10-34-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-10-33-verify/`
- ?? `.agentloop/runs/2026-06-12-10-34-ship/`
- ?? `.agentloop/tasks/2026-06-12-redact-acceptance-layer-git-roots.md`

## Change Areas
### Source
- M `src/cli/commands/prepare-pr.ts`
- M `src/cli/commands/ship.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/handoffs/2026-06-12-10-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-10-29-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-10-34-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-10-33-verify/`
- ?? `.agentloop/runs/2026-06-12-10-34-ship/`
- ?? `.agentloop/tasks/2026-06-12-redact-acceptance-layer-git-roots.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/release-status.md`

## Diff Stats
```text
.agentloop/backlog.md          |  2 +-
 CHANGELOG.md                   |  1 +
 FINAL_HANDOFF.md               |  6 ++++--
 README.md                      |  2 +-
 ROADMAP.md                     |  2 +-
 docs/cli-reference.md          |  3 +++
 docs/release-status.md         |  1 +
 src/cli/commands/prepare-pr.ts |  2 ++
 src/cli/commands/ship.ts       |  2 ++
 src/core/prepare-pr.ts         |  3 +++
 src/core/ship.ts               |  2 ++
 tests/prepare-pr.test.ts       | 20 +++++++++++++++++++-
 tests/ship.test.ts             | 38 +++++++++++++++++++++++++++++++++++++-
 13 files changed, 77 insertions(+), 7 deletions(-)
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
