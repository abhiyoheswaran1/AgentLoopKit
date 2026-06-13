# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-10-58`
- Review readiness score: `95`/100
- Task: `Accept redacted output flag on review context` (`review`) - `.agentloop/tasks/2026-06-13-accept-redacted-output-flag-on-review-context.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-10-57-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-10-58-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `90`/100 (weight `15`) - `90/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `12 changed files is reviewable but not small.`
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

- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/review-context.ts`
- M `src/core/review-context.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/reports/2026-06-13-10-57-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-10-57-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-accept-redacted-output-flag-on-review-context.md`

## Diff Stat

```text
.agentloop/dogfood-log.md          | 28 ++++++++++++++++++++++++++++
 CHANGELOG.md                       |  1 +
 README.md                          |  2 +-
 docs/cli-reference.md              |  1 +
 src/cli/commands/review-context.ts |  9 +++++++--
 src/core/review-context.ts         | 14 +++++++++++---
 tests/review-context.test.ts       | 26 +++++++++++++++++++++++++-
 7 files changed, 74 insertions(+), 7 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Accept redacted output flag on review context`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `13 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
