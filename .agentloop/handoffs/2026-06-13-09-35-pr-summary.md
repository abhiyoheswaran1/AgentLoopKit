# PR Summary

- Generated: 2026-06-13-09-35
- Task context: `Avoid same-minute evidence artifact overwrites`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `src/core/artifacts.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`
- M `tests/handoff.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/reports/2026-06-13-09-26-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-09-35-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-35-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-35-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-avoid-same-minute-evidence-artifact-overwrites.md`

## Change Areas
### Source
- M `src/core/artifacts.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`

### Tests
- M `tests/handoff.test.ts`
- M `tests/ship.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-13-09-26-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-09-35-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-35-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-35-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-avoid-same-minute-evidence-artifact-overwrites.md`

### Documentation
- M `CHANGELOG.md`

## Diff Stats
```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 38 ++++++++++++++++++++++++++++++++++++++
 CHANGELOG.md              |  1 +
 src/core/artifacts.ts     | 41 ++++++++++++++++++++++++++++++++++++-----
 src/core/pr-summary.ts    |  4 ++--
 src/core/ship.ts          |  5 +++--
 tests/handoff.test.ts     | 26 ++++++++++++++++++++++++++
 tests/ship.test.ts        | 25 +++++++++++++++++++++++++
 8 files changed, 132 insertions(+), 9 deletions(-)
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
