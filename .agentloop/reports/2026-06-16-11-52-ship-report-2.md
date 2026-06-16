# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-11-52`
- Review readiness score: `92`/100
- Task: `Maintain near-term roadmap health` (`in-progress`) - `.agentloop/tasks/2026-06-16-maintain-near-term-roadmap-health.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-11-51-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-11-52-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `67 changed files is broad for one review.`
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

- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/maintenance-guards.md`
- M `package.json`
- M `scripts/dogfood.mjs`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-11-40-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-11-40-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-11-41-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-11-49-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-11-49-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-11-49-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-11-52-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-11-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-11-39-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-11-40-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-11-41-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-11-47-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-11-49-ship-report-2.md`
- ?? `.agentloop/reports/2026-06-16-11-49-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-11-51-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-11-52-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-11-40-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-40-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-40-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-40-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-11-41-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship-2/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-11-49-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-11-49-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-49-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-49-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-11-52-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-11-52-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-11-52-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-11-52-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-16-maintain-near-term-roadmap-health.md`
- ?? `scripts/maintenance-check.mjs`
- ?? `tests/maintenance-check-script.test.ts`

## Diff Stat

```text
.agentloop/dogfood-log.md        | 28 ++++++++++++++++++++++++++++
 CHANGELOG.md                     |  3 ++-
 README.md                        |  8 ++++++++
 docs/maintenance-guards.md       |  6 +++++-
 package.json                     |  4 ++--
 scripts/dogfood.mjs              |  2 +-
 tests/autonomous-dogfood.test.ts | 33 +++++++++++++++++++++++++++++----
 tests/dogfood-script.test.ts     |  4 ++--
 tests/package-scripts.test.ts    | 13 +++++++++++++
 9 files changed, 90 insertions(+), 11 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Maintain near-term roadmap health`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `68 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
