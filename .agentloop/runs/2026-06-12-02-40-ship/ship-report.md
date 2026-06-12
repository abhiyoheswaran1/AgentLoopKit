# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-02-40`
- Review readiness score: `96`/100
- Task: `Group prepare-pr changed files by review area` (`review`) - `.agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md`
- Verification: `pass` - `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-02-33-verification-report.md`
- Handoff: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/handoffs/2026-06-12-02-40-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `13 changed files is reviewable but not small.`
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
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/reports/2026-06-12-02-33-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-02-39-verify/`
- ?? `.agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md`
- ?? `src/core/change-areas.ts`

## Diff Stat

```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 20 ++++++++++
 CHANGELOG.md              |  1 +
 FINAL_HANDOFF.md          |  1 +
 README.md                 |  4 +-
 docs/cli-reference.md     |  2 +-
 src/core/pr-summary.ts    | 98 +----------------------------------------------
 src/core/prepare-pr.ts    |  9 +----
 tests/prepare-pr.test.ts  | 45 ++++++++++++++++++++++
 9 files changed, 75 insertions(+), 106 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Group prepare-pr changed files by review area`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `14 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
