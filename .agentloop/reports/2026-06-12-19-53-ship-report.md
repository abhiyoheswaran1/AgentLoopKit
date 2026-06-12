# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-19-53`
- Review readiness score: `96`/100
- Task: `Report skipped duplicate verification commands` (`done`) - `.agentloop/tasks/archive/2026-06-12-report-skipped-duplicate-verification-commands.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-19-43-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-19-53-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `11 changed files is reviewable but not small.`
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

- Medium-sized change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/verification-reports.md`
- M `src/core/verification.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/release-check.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/reports/2026-06-12-19-43-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-19-49-verify/`
- ?? `.agentloop/tasks/archive/2026-06-12-report-skipped-duplicate-verification-commands.md`

## Diff Stat

```text
.agentloop/backlog.md        |   1 +
 .agentloop/dogfood-log.md    |  27 ++++++++++
 CHANGELOG.md                 |   1 +
 docs/verification-reports.md |   2 +
 src/core/verification.ts     |  49 +++++++++++++++--
 tests/prepare-pr.test.ts     |  91 ++++++++++++++++---------------
 tests/release-check.test.ts  | 125 ++++++++++++++++++++++---------------------
 tests/verification.test.ts   |  11 ++++
 8 files changed, 200 insertions(+), 107 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Report skipped duplicate verification commands`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `12 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
