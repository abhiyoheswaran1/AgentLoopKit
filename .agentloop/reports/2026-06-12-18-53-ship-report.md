# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-18-53`
- Review readiness score: `96`/100
- Task: `Smoke test bounded run output` (`in-progress`) - `.agentloop/tasks/2026-06-12-smoke-test-bounded-run-output.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-18-46-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-18-53-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `11 changed files is reviewable but not small.`
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
- M `scripts/smoke-cli.mjs`
- M `src/cli/commands/runs.ts`
- M `tests/distribution-artifacts.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-18-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-18-46-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-18-50-verify/`
- ?? `.agentloop/runs/2026-06-12-18-52-handoff/`
- ?? `.agentloop/tasks/2026-06-12-smoke-test-bounded-run-output.md`

## Diff Stat

```text
.agentloop/backlog.md                |  1 +
 .agentloop/dogfood-log.md            | 23 +++++++++++++++++++++++
 CHANGELOG.md                         |  1 +
 scripts/smoke-cli.mjs                | 17 +++++++++++++++++
 src/cli/commands/runs.ts             | 21 +++++++++------------
 tests/distribution-artifacts.test.ts |  3 +++
 6 files changed, 54 insertions(+), 12 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Smoke test bounded run output`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `12 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
