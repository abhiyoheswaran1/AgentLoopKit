# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-12-20`
- Review readiness score: `100`/100
- Task: `Escape ship readiness Markdown lists` (`in-progress`) - `.agentloop/tasks/2026-06-13-escape-ship-readiness-markdown-lists.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-12-15-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-12-20-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `100`/100 (weight `15`) - `9 changed file(s).`
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

- No warnings recorded.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `src/core/ship.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/reports/2026-06-13-12-15-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-12-17-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-12-17-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-12-17-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-escape-ship-readiness-markdown-lists.md`

## Diff Stat

```text
.agentloop/dogfood-log.md | 25 +++++++++++++++++++++++++
 CHANGELOG.md              |  1 +
 src/core/ship.ts          |  6 ++++--
 tests/ship.test.ts        | 32 ++++++++++++++++++++++++++++++++
 4 files changed, 62 insertions(+), 2 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Escape ship readiness Markdown lists`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `10 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
