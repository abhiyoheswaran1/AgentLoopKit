# PR Summary

- Generated: 2026-06-13-05-56
- Task context: `Warn on stale handoff gate evidence`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `src/core/check-gates.ts`
- M `tests/check-gates.test.ts`
- M `tests/ci-summary.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/reports/2026-06-13-05-44-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-05-54-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-05-46-verify/`
- ?? `.agentloop/runs/2026-06-13-05-56-verify/`
- ?? `.agentloop/tasks/2026-06-13-warn-on-stale-handoff-gate-evidence.md`

## Change Areas
### Source
- M `src/core/check-gates.ts`

### Tests
- M `tests/check-gates.test.ts`
- M `tests/ci-summary.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/review-context.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-13-05-44-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-05-54-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-05-46-verify/`
- ?? `.agentloop/runs/2026-06-13-05-56-verify/`
- ?? `.agentloop/tasks/2026-06-13-warn-on-stale-handoff-gate-evidence.md`

### Documentation
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md        |  1 +
 .agentloop/dogfood-log.md    | 18 ++++++++++++++++++
 CHANGELOG.md                 |  1 +
 docs/check-gates.md          |  1 +
 docs/cli-reference.md        |  2 ++
 src/core/check-gates.ts      | 25 +++++++++++++++----------
 tests/check-gates.test.ts    | 40 ++++++++++++++++++++++++++++++++++++++--
 tests/ci-summary.test.ts     | 11 ++++++++++-
 tests/mcp-tools.test.ts      | 15 ++++++++++++---
 tests/review-context.test.ts | 13 +++++++++++--
 10 files changed, 109 insertions(+), 18 deletions(-)
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
