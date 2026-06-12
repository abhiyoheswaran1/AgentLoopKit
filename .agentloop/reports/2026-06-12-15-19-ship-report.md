# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-15-19`
- Review readiness score: `96`/100
- Task: `Add release metadata sync prepublish guard` (`in-progress`) - `.agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-15-18-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-15-19-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `14 changed files is reviewable but not small.`
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
- M `DECISIONS.md`
- M `scripts/prepublish-check.mjs`
- M `tests/prepublish-check.test.ts`
- ?? `.agentloop/reports/2026-06-12-15-13-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-15-14-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-15-16-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-15-18-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-15-13-verify/`
- ?? `.agentloop/runs/2026-06-12-15-14-verify/`
- ?? `.agentloop/runs/2026-06-12-15-16-verify/`
- ?? `.agentloop/runs/2026-06-12-15-19-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md`

## Diff Stat

```text
.agentloop/backlog.md          |  3 +-
 .agentloop/dogfood-log.md      | 25 +++++++++++++
 DECISIONS.md                   |  6 +++
 scripts/prepublish-check.mjs   | 53 ++++++++++++++++++++++++--
 tests/prepublish-check.test.ts | 85 ++++++++++++++++++++++++++++++++++++++++++
 5 files changed, 168 insertions(+), 4 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add release metadata sync prepublish guard`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `15 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
