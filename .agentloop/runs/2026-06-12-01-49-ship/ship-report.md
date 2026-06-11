# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-01-49`
- Review readiness score: `96`/100
- Task: `Reuse fresh ship run in prepare-pr` (`review`) - `.agentloop/tasks/2026-06-12-reuse-fresh-ship-run-in-prepare-pr.md`
- Verification: `pass` - `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-01-43-verification-report.md`
- Handoff: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/handoffs/2026-06-12-01-49-pr-summary.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `100`/100 (weight `15`) - `10 changed file(s).`
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

- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `src/core/prepare-pr.ts`
- M `tests/prepare-pr.test.ts`
- ?? `.agentloop/reports/2026-06-12-01-43-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-01-49-verify/`
- ?? `.agentloop/tasks/2026-06-12-reuse-fresh-ship-run-in-prepare-pr.md`

## Diff Stat

```text
.agentloop/backlog.md     |   1 +
 .agentloop/dogfood-log.md |  20 ++++++++
 CHANGELOG.md              |   1 +
 FINAL_HANDOFF.md          |   1 +
 docs/cli-reference.md     |   2 +
 src/core/prepare-pr.ts    | 120 ++++++++++++++++++++++++++++++++++++++++++----
 tests/prepare-pr.test.ts  |  17 +++++++
 7 files changed, 153 insertions(+), 9 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Reuse fresh ship run in prepare-pr`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`warn`] `Task hygiene`: ``Task folder has 1 hygiene diagnostic. Run `agentloop task doctor` for cleanup details.``
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `11 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
