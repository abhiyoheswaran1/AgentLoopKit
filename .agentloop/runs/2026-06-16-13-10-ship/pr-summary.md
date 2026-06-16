# PR Summary

- Generated: 2026-06-16-13-10
- Task context: `Fix stale generated artifact ordering`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `src/core/artifacts.ts`
- M `tests/artifacts.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/reports/2026-06-16-13-03-verification-report.md`
- ?? `.agentloop/research/interview-cycle-118.md`
- ?? `.agentloop/runs/2026-06-16-13-10-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-10-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-10-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-fix-stale-generated-artifact-ordering.md`

## Change Areas
### Source
- M `src/core/artifacts.ts`

### Tests
- M `tests/artifacts.test.ts`
- M `tests/status.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/reports/2026-06-16-13-03-verification-report.md`
- ?? `.agentloop/research/interview-cycle-118.md`
- ?? `.agentloop/runs/2026-06-16-13-10-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-10-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-10-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-fix-stale-generated-artifact-ordering.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`

## Diff Stats
```text
.agentloop/backlog.md     |  6 +++++
 .agentloop/dogfood-log.md | 27 ++++++++++++++++++++++
 CHANGELOG.md              |  1 +
 DECISIONS.md              |  6 +++++
 docs/cli-reference.md     |  3 +++
 src/core/artifacts.ts     | 40 +++++++++++++++++++++++++-------
 tests/artifacts.test.ts   | 59 +++++++++++++++++++++++++++++++++++++++++++++++
 tests/status.test.ts      | 40 ++++++++++++++++++++++++++++++++
 8 files changed, 174 insertions(+), 8 deletions(-)
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
