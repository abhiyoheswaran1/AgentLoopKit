# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-07-39`
- Review readiness score: `96`/100
- Task: `Warn maintainers about stale handoff evidence` (`done`) - `.agentloop/tasks/archive/2026-06-13-warn-maintainers-about-stale-handoff-evidence.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-07-34-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-07-39-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `21 changed files is reviewable but not small.`
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
- M `docs/cli-reference.md`
- M `src/core/maintainer-check.ts`
- M `tests/maintainer-check.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-07-31-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-07-32-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-13-07-39-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-07-25-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-07-32-ship-report.md`
- ?? `.agentloop/reports/2026-06-13-07-34-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-07-39-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-07-30-verify/`
- ?? `.agentloop/runs/2026-06-13-07-31-handoff/`
- ?? `.agentloop/runs/2026-06-13-07-32-ship/`
- ?? `.agentloop/runs/2026-06-13-07-38-verify/`
- ?? `.agentloop/runs/2026-06-13-07-39-handoff-2/`
- ?? `.agentloop/runs/2026-06-13-07-39-handoff/`
- ?? `.agentloop/runs/2026-06-13-07-39-ship/`
- ?? `.agentloop/tasks/archive/2026-06-13-warn-maintainers-about-stale-handoff-evidence.md`

## Diff Stat

```text
.agentloop/backlog.md          |   6 +++
 .agentloop/dogfood-log.md      |  27 +++++++++++
 CHANGELOG.md                   |   1 +
 docs/cli-reference.md          |   2 +
 src/core/maintainer-check.ts   |  32 ++++++++++---
 tests/maintainer-check.test.ts | 106 +++++++++++++++++++++++++++++++++++++++++
 6 files changed, 168 insertions(+), 6 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Warn maintainers about stale handoff evidence`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `21 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
