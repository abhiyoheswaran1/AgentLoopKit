# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-06-02`
- Review readiness score: `92`/100
- Task: `Warn on stale handoff gate evidence` (`in-progress`) - `.agentloop/tasks/2026-06-13-warn-on-stale-handoff-gate-evidence.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-05-54-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-06-02-pr-summary.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `17 changed files is reviewable but not small.`
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

- Medium-sized change set; check scope carefully.
- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `src/core/check-gates.ts`
- M `tests/check-gates.test.ts`
- M `tests/ci-summary.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-05-56-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-05-44-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-05-54-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-05-46-verify/`
- ?? `.agentloop/runs/2026-06-13-05-56-handoff/`
- ?? `.agentloop/runs/2026-06-13-05-56-verify/`
- ?? `.agentloop/tasks/2026-06-13-warn-on-stale-handoff-gate-evidence.md`

## Diff Stat

```text
.agentloop/backlog.md        |  1 +
 .agentloop/dogfood-log.md    | 27 +++++++++++++++++++++++++++
 CHANGELOG.md                 |  1 +
 docs/check-gates.md          |  1 +
 docs/cli-reference.md        |  2 ++
 src/core/check-gates.ts      | 25 +++++++++++++++----------
 tests/check-gates.test.ts    | 40 ++++++++++++++++++++++++++++++++++++++--
 tests/ci-summary.test.ts     | 11 ++++++++++-
 tests/mcp-tools.test.ts      | 15 ++++++++++++---
 tests/review-context.test.ts | 13 +++++++++++--
 10 files changed, 118 insertions(+), 18 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Warn on stale handoff gate evidence`
- [`pass`] `Verification report`: `Overall status: pass`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `18 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
