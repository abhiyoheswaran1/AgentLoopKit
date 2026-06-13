# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-13-44`
- Review readiness score: `92`/100
- Task: `Add redacted release-check output` (`done`) - `.agentloop/tasks/archive/2026-06-13-add-redacted-release-check-output.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-13-34-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-13-44-pr-summary-3.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `40 changed files is broad for one review.`
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
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/commands/release-check.ts`
- M `src/core/release-check.ts`
- M `tests/release-check.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-13-42-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-13-13-42-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-13-13-44-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-13-34-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-13-42-ship-report.md`
- ?? `.agentloop/reports/2026-06-13-13-44-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-42-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-13-42-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-13-44-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-add-redacted-release-check-output.md`

## Diff Stat

```text
.agentloop/dogfood-log.md         | 39 +++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                      |  1 +
 README.md                         |  2 +-
 docs/cli-reference.md             |  3 +++
 scripts/smoke-packed-release.mjs  |  1 +
 src/cli/commands/release-check.ts |  4 +++-
 src/core/release-check.ts         | 41 +++++++++++++++++++++++++++++++++++----
 tests/release-check.test.ts       | 41 ++++++++++++++++++++++++++++++++++++++-
 tests/release-smoke.test.ts       |  2 +-
 9 files changed, 126 insertions(+), 8 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add redacted release-check output`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `41 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
