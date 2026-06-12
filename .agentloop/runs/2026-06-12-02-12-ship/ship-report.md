# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-02-12`
- Review readiness score: `96`/100
- Task: `Report prepare-pr ship evidence source` (`review`) - `.agentloop/tasks/2026-06-12-report-prepare-pr-ship-evidence-source.md`
- Verification: `pass` - `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-02-03-verification-report.md`
- Handoff: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/handoffs/2026-06-12-02-12-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `16 changed files is reviewable but not small.`
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
- D `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-02-11-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-02-03-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-02-11-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-02-09-verify/`
- ?? `.agentloop/runs/2026-06-12-02-11-ship/`
- ?? `.agentloop/tasks/2026-06-12-report-prepare-pr-ship-evidence-source.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`

## Diff Stat

```text
.agentloop/backlog.md                              |  1 +
 .agentloop/dogfood-log.md                          | 18 +++++++
 ...in-run-ledger-entries-for-verify-and-handoff.md | 55 ----------------------
 CHANGELOG.md                                       |  1 +
 FINAL_HANDOFF.md                                   |  1 +
 docs/cli-reference.md                              |  2 +
 src/core/prepare-pr.ts                             | 54 +++++++++++++++------
 tests/prepare-pr.test.ts                           | 11 ++++-
 8 files changed, 72 insertions(+), 71 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Report prepare-pr ship evidence source`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `17 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
