# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-13-19`
- Review readiness score: `92`/100
- Task: `Add redacted maintainer-check output` (`done`) - `.agentloop/tasks/archive/2026-06-13-add-redacted-maintainer-check-output.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-13-15-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-13-19-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `37 changed files is broad for one review.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `100`/100 (weight `15`) - `Review gates passed.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Review gates pass.
- Reviewer handoff exists.

## Warnings

- Large change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `scripts/dogfood.mjs`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/commands/maintainer-check.ts`
- M `src/core/maintainer-check.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-13-08-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-13-13-08-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-12-56-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-13-05-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-13-08-ship-report.md`
- ?? `.agentloop/reports/2026-06-13-13-15-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-12-56-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-12-56-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-12-56-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-13-06-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-06-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-06-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-13-08-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-08-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-08-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-08-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-08-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-08-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-08-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-08-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-08-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-13-08-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-19-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-19-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-19-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-add-redacted-maintainer-check-output.md`

## Diff Stat

```text
.agentloop/dogfood-log.md            | 44 ++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                         |  1 +
 README.md                            |  2 +-
 docs/cli-reference.md                |  3 +++
 scripts/dogfood.mjs                  |  6 ++++-
 scripts/smoke-packed-release.mjs     |  1 +
 src/cli/commands/maintainer-check.ts |  9 ++++++--
 src/core/maintainer-check.ts         | 33 +++++++++++++++++++++++----
 tests/dogfood-script.test.ts         |  8 +++++++
 tests/maintainer-check.test.ts       | 25 +++++++++++++++++++-
 tests/release-smoke.test.ts          |  2 +-
 11 files changed, 123 insertions(+), 11 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add redacted maintainer-check output`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `38 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
