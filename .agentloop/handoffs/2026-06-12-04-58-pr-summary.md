# PR Summary

- Generated: 2026-06-12-04-58
- Task context: `Use repo-relative paths in PR-facing Markdown`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/ship.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/reports/2026-06-12-04-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-57-verify/`
- ?? `.agentloop/tasks/2026-06-12-use-repo-relative-paths-in-pr-facing-markdown.md`

## Change Areas
### Source
- M `src/cli/commands/ship.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- ?? `.agentloop/reports/2026-06-12-04-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-57-verify/`
- ?? `.agentloop/tasks/2026-06-12-use-repo-relative-paths-in-pr-facing-markdown.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md    |  1 +
 CHANGELOG.md             |  1 +
 FINAL_HANDOFF.md         |  1 +
 docs/cli-reference.md    |  2 ++
 src/cli/commands/ship.ts |  6 ++++--
 src/core/prepare-pr.ts   | 27 ++++++++++++++++-----------
 src/core/ship.ts         | 26 +++++++++++++++++---------
 tests/prepare-pr.test.ts |  5 +++++
 tests/ship.test.ts       |  8 +++++++-
 9 files changed, 54 insertions(+), 23 deletions(-)
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
