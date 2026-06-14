# PR Summary

- Generated: 2026-06-14-16-56
- Task context: `Improve roadmap adoption evidence`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/github-metadata.md`
- M `docs/policies.md`
- M `docs/policy-examples.md`
- M `src/core/github-metadata.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `tests/github-metadata.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/handoffs/2026-06-14-16-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-16-49-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-16-55-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-14-16-55-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-16-45-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-16-48-ship-report.md`
- ?? `.agentloop/reports/2026-06-14-16-49-ship-report.md`
- ?? `.agentloop/research/interview-cycle-110.md`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-14-improve-roadmap-adoption-evidence.md`

## Change Areas
### Source
- M `src/core/github-metadata.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`

### Tests
- M `tests/github-metadata.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-14-16-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-16-49-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-16-55-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-14-16-55-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-16-45-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-16-48-ship-report.md`
- ?? `.agentloop/reports/2026-06-14-16-49-ship-report.md`
- ?? `.agentloop/research/interview-cycle-110.md`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-16-49-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-55-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-14-improve-roadmap-adoption-evidence.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/github-metadata.md`
- M `docs/policies.md`
- M `docs/policy-examples.md`

## Diff Stats
```text
.agentloop/backlog.md          |  9 ++++
 .agentloop/dogfood-log.md      | 45 ++++++++++++++++++++
 CHANGELOG.md                   |  8 ++--
 DECISIONS.md                   |  8 ++++
 FINAL_HANDOFF.md               | 37 ++++++++++-------
 README.md                      |  2 +-
 ROADMAP.md                     |  7 +++-
 docs/cli-reference.md          | 12 ++++--
 docs/getting-started.md        |  1 +
 docs/github-metadata.md        | 18 ++++++++
 docs/policies.md               | 77 ++++++++++++++++++++++++++++++++++
 docs/policy-examples.md        | 51 +++++++++++++++++++++++
 src/core/github-metadata.ts    | 93 +++++++++++++++++++++++++++++++++++++++++-
 src/core/maintainer-check.ts   | 71 ++++++++++++++++++++++----------
 src/core/prepare-pr.ts         | 88 ++++++++++++++++++++++++++++++++++++---
 src/core/review-context.ts     | 27 +++++++++++-
 tests/github-metadata.test.ts  | 55 ++++++++++++++++++++++++-
 tests/maintainer-check.test.ts | 61 +++++++++++++++++++++++++--
 tests/prepare-pr.test.ts       | 92 +++++++++++++++++++++++++++++++++++++----
 tests/review-context.test.ts   | 43 ++++++++++++++++++-
 20 files changed, 739 insertions(+), 66 deletions(-)
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
