# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-07-10`
- Review readiness score: `87`/100
- Task: `Make review-context Markdown output line-safe` (`review`) - `.agentloop/tasks/2026-06-16-make-review-context-markdown-output-line-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-07-09-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-07-10-pr-summary-2.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `28 changed files is broad for one review.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `70`/100 (weight `15`) - `Review gates passed with warnings.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Reviewer handoff exists.

## Warnings

- Large change set; consider splitting before review.
- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/core/review-context.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-07-05-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-07-05-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-07-04-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-05-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-07-09-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-05-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-05-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-09-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-review-context-markdown-output-line-safe.md`

## Diff Stat

```text
.agentloop/backlog.md        |  6 +++
 .agentloop/dogfood-log.md    | 51 +++++++++++++++++++++++++
 CHANGELOG.md                 |  1 +
 docs/cli-reference.md        |  1 +
 src/core/review-context.ts   |  2 +-
 tests/review-context.test.ts | 89 ++++++++++++++++++++++++++++++++++++++++++++
 6 files changed, 149 insertions(+), 1 deletion(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make review-context Markdown output line-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `34 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
