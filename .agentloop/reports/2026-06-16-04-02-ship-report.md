# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-04-02`
- Review readiness score: `92`/100
- Task: `Make create-task output Markdown-safe` (`done`) - `.agentloop/tasks/archive/2026-06-16-make-create-task-output-markdown-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-04-00-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-04-02-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `33 changed files is broad for one review.`
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

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/create-task.ts`
- M `tests/create-task.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-03-59-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-03-59-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-04-02-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-03-56-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-03-59-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-04-00-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-03-58-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-03-58-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-03-58-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-03-59-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-03-59-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-03-59-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-03-59-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-03-59-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-03-59-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-03-59-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-03-59-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-03-59-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-03-59-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-02-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-02-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-02-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-02-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-02-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-02-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-02-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-create-task-output-markdown-safe.md`

## Diff Stat

```text
.agentloop/backlog.md           |  40 ++++++++-------
 .agentloop/dogfood-log.md       |  44 ++++++++++++++++
 CHANGELOG.md                    |   1 +
 docs/cli-reference.md           |   2 +
 src/cli/commands/create-task.ts |   2 +-
 tests/create-task.test.ts       | 109 ++++++++++++++++++++++++++++++++++++----
 6 files changed, 170 insertions(+), 28 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make create-task output Markdown-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `34 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
