# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-20-49`
- Review readiness score: `96`/100
- Task: `Limit stale evidence preview output` (`done`) - `.agentloop/tasks/archive/2026-06-15-limit-stale-evidence-preview-output.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-20-44-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-20-49-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `17 changed files is reviewable but not small.`
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
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `src/cli/commands/artifacts.ts`
- M `src/core/artifacts.ts`
- M `tests/artifacts.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-20-49-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-20-44-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-20-46-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-20-46-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-20-46-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-20-49-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-20-49-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-20-49-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-20-49-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-15-limit-stale-evidence-preview-output.md`

## Diff Stat

```text
.agentloop/backlog.md         |  1 +
 .agentloop/dogfood-log.md     | 38 +++++++++++++++++++
 docs/cli-reference.md         |  3 +-
 docs/getting-started.md       |  3 +-
 src/cli/commands/artifacts.ts | 53 +++++++++++++++++++++-----
 src/core/artifacts.ts         | 25 ++++++++++++-
 tests/artifacts.test.ts       | 87 ++++++++++++++++++++++++++++++++++++++++++-
 7 files changed, 197 insertions(+), 13 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Limit stale evidence preview output`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `18 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
