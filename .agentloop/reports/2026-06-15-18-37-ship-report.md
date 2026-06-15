# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-18-37`
- Review readiness score: `92`/100
- Task: `Guard dogfood task sequencing` (`done`) - `.agentloop/tasks/archive/2026-06-15-guard-dogfood-task-sequencing.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-18-31-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-18-37-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `26 changed files is broad for one review.`
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
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `tests/autonomous-dogfood.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-18-32-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-18-36-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-15-18-36-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-18-31-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-18-32-ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-31-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-18-32-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-36-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-18-37-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-37-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-18-37-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-37-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-guard-dogfood-task-sequencing.md`

## Diff Stat

```text
.agentloop/dogfood-log.md                   | 36 +++++++++++++++++++++++++++++
 .agentloop/harness/autonomous-dogfooding.md |  4 +++-
 tests/autonomous-dogfood.test.ts            | 15 ++++++++++++
 3 files changed, 54 insertions(+), 1 deletion(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Guard dogfood task sequencing`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `27 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
