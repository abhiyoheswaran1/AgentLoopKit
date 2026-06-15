# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-21-18`
- Review readiness score: `92`/100
- Task: `Bound stale preview markdown by default` (`done`) - `.agentloop/tasks/archive/2026-06-15-bound-stale-preview-markdown-by-default.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-21-15-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-21-18-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `27 changed files is broad for one review.`
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
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `src/cli/commands/artifacts.ts`
- M `src/core/artifacts.ts`
- M `tests/artifacts.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-21-12-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-21-17-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-21-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-21-15-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-10-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-12-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-17-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-21-17-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-bound-stale-preview-markdown-by-default.md`

## Diff Stat

```text
.agentloop/backlog.md         |  1 +
 .agentloop/dogfood-log.md     | 37 +++++++++++++++++++++++++++++
 README.md                     |  2 +-
 docs/cli-reference.md         |  2 +-
 docs/getting-started.md       |  2 +-
 src/cli/commands/artifacts.ts |  4 +++-
 src/core/artifacts.ts         |  1 +
 tests/artifacts.test.ts       | 54 ++++++++++++++++++++++++++++++++++++++++++-
 8 files changed, 98 insertions(+), 5 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Bound stale preview markdown by default`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `28 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
