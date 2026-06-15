# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-19-13`
- Review readiness score: `92`/100
- Task: `Make dogfood start source-first` (`done`) - `.agentloop/tasks/archive/2026-06-15-make-dogfood-start-source-first.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-19-09-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-19-13-pr-summary-4.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `28 changed files is broad for one review.`
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
- M `scripts/dogfood-start.mjs`
- M `tests/dogfood-start-script.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-19-11-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-19-13-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-15-19-13-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-15-19-13-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-19-09-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-10-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-10-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-10-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-19-11-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-11-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-11-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-11-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-19-13-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-make-dogfood-start-source-first.md`

## Diff Stat

```text
.agentloop/dogfood-log.md          | 36 ++++++++++++++++++++++++++++++++++++
 scripts/dogfood-start.mjs          | 10 ++++++----
 tests/dogfood-start-script.test.ts | 22 ++++++++++++++++++----
 3 files changed, 60 insertions(+), 8 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make dogfood start source-first`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `29 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
