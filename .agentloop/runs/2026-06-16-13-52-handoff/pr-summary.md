# PR Summary

- Generated: 2026-06-16-13-52
- Task context: `Clarify release proof when HEAD is after tag`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/release-proof.md`
- M `src/core/release-proof.ts`
- M `tests/release-proof.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-13-45-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-13-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-13-49-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-13-37-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-13-49-ship-report.md`
- ?? `.agentloop/research/interview-cycle-119.md`
- ?? `.agentloop/runs/2026-06-16-13-42-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-42-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-42-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-clarify-release-proof-when-head-is-after-tag.md`

## Change Areas
### Source
- M `src/core/release-proof.ts`

### Tests
- M `tests/release-proof.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-16-13-45-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-13-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-13-49-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-13-37-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-13-49-ship-report.md`
- ?? `.agentloop/research/interview-cycle-119.md`
- ?? `.agentloop/runs/2026-06-16-13-42-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-42-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-42-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-45-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-13-49-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-clarify-release-proof-when-head-is-after-tag.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/release-proof.md`

## Diff Stats
```text
.agentloop/backlog.md       |  6 ++++++
 .agentloop/dogfood-log.md   | 37 +++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                |  1 +
 DECISIONS.md                |  6 ++++++
 docs/cli-reference.md       |  2 +-
 docs/release-proof.md       |  4 ++++
 src/core/release-proof.ts   | 28 ++++++++++++++++++++++++++--
 tests/release-proof.test.ts | 31 ++++++++++++++++++++++++++++---
 8 files changed, 109 insertions(+), 6 deletions(-)
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
