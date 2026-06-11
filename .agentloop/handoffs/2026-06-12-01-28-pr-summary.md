# PR Summary

- Generated: 2026-06-12-01-28
- Task context: `Show latest run evidence in status`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`
- M `docs/status.md`
- M `scripts/smoke-cli.mjs`
- M `src/core/runs.ts`
- M `src/core/status.ts`
- M `tests/runs.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-01-28-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-01-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-01-28-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-01-27-verify/`
- ?? `.agentloop/runs/2026-06-12-01-28-ship/`
- ?? `.agentloop/tasks/2026-06-12-show-latest-run-evidence-in-status.md`

## Change Areas
### Source
- M `src/core/runs.ts`
- M `src/core/status.ts`

### Tests
- M `tests/runs.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-12-01-28-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-01-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-01-28-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-01-27-verify/`
- ?? `.agentloop/runs/2026-06-12-01-28-ship/`
- ?? `.agentloop/tasks/2026-06-12-show-latest-run-evidence-in-status.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`
- M `docs/status.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 30 ++++++++++++++++++++++
 CHANGELOG.md              |  1 +
 FINAL_HANDOFF.md          |  3 ++-
 README.md                 |  4 ++-
 docs/cli-reference.md     |  4 +--
 docs/mcp.md               |  2 +-
 docs/status.md            |  4 ++-
 scripts/smoke-cli.mjs     | 13 ++++++++++
 src/core/runs.ts          | 30 +++++++++++++++++++---
 src/core/status.ts        | 27 +++++++++++++++++++-
 tests/runs.test.ts        | 64 ++++++++++++++++++++++++++++++++++++++++++++++-
 tests/status.test.ts      | 57 +++++++++++++++++++++++++++++++++++++++++
 13 files changed, 228 insertions(+), 12 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
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
